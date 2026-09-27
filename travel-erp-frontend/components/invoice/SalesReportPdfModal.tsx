import React, { useEffect, useState } from 'react'
import { BlobProvider, Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { Download, Printer, X } from 'lucide-react'
import { SalesReportRow } from '../../types'

export type SalesReportTotals = {
  ticketReissue: number
  admaVoidCharge: number
  visaAppFee: number
  hotelBooking: number
  ticket: number
  totalSales: number
  cash: number
  bankBrac: number
  bankPubali: number
  bankDbbl: number
  totalReceived: number
  dueAmount: number
  ticketCount: number
}

const money = (value: number) =>
  `BDT ${value.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const date = (value?: string) => (value ? new Date(value).toLocaleDateString('en-GB') : '-')

function SalesReportPdfDocument({
  rows,
  totals,
  title,
}: {
  rows: SalesReportRow[]
  totals: SalesReportTotals
  title: string
}) {
  return (
    <Document title={title} author="Travel ERP">
      <Page size="A4" orientation="landscape" style={styles.page} wrap>
        <View style={styles.header} fixed>
          <View>
            <Text style={styles.company}>WELCARE TRIP</Text>
            <Text style={styles.subtitle}>Sales report generated from invoice and payment records</Text>
          </View>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>Generated {new Date().toLocaleDateString('en-GB')}</Text>
          </View>
        </View>

        <View style={styles.summary} wrap={false}>
          <Text>Total sales: {money(totals.totalSales)}</Text>
          <Text>Total received: {money(totals.totalReceived)}</Text>
          <Text>Total due: {money(totals.dueAmount)}</Text>
          <Text>Tickets: {totals.ticketCount}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.row, styles.tableHeader]} wrap={false}>
            {[
              'Date',
              'Invoice',
              'Type',
              'Tickets',
              'MR No',
              'Reference',
              'Reissue',
              'ADMA/Void',
              'Visa',
              'Hotel',
              'Ticket',
              'Sales',
              'Received',
              'Cash',
              'Brac',
              'Pubali',
              'DBBL',
              'Due',
            ].map((label) => (
              <Text key={label} style={[styles.cell, styles.small]}>
                {label}
              </Text>
            ))}
          </View>
          {rows.map((row) => (
            <View key={row.id} style={styles.row} wrap={false}>
              <Text style={[styles.cell, styles.small]}>{date(row.date)}</Text>
              <Text style={[styles.cell, styles.small]}>{row.invoiceNo}</Text>
              <Text style={[styles.cell, styles.small]}>{row.ticketType || '-'}</Text>
              <Text style={[styles.cell, styles.small]}>{row.ticketCount}</Text>
              <Text style={[styles.cell, styles.small]}>{row.mrNo || '-'}</Text>
              <Text style={[styles.cell, styles.small]}>{row.salesRef || '-'}</Text>
              <Text style={[styles.cell, styles.amount]}>{money(row.ticketReissue)}</Text>
              <Text style={[styles.cell, styles.amount]}>{money(row.admaVoidCharge)}</Text>
              <Text style={[styles.cell, styles.amount]}>{money(row.visaAppFee)}</Text>
              <Text style={[styles.cell, styles.amount]}>{money(row.hotelBooking)}</Text>
              <Text style={[styles.cell, styles.amount]}>{money(row.ticket)}</Text>
              <Text style={[styles.cell, styles.amount]}>{money(row.totalSales)}</Text>
              <Text style={[styles.cell, styles.small]}>{date(row.receivedDate)}</Text>
              <Text style={[styles.cell, styles.amount]}>{money(row.cash)}</Text>
              <Text style={[styles.cell, styles.amount]}>{money(row.bankBrac)}</Text>
              <Text style={[styles.cell, styles.amount]}>{money(row.bankPubali)}</Text>
              <Text style={[styles.cell, styles.amount]}>{money(row.bankDbbl)}</Text>
              <Text style={[styles.cell, styles.amount]}>{money(row.dueAmount)}</Text>
            </View>
          ))}
          <View style={[styles.row, styles.totalRow]} wrap={false}>
            <Text style={[styles.cell, styles.small]}>GRAND TOTAL</Text>
            <Text style={styles.cell}>-</Text>
            <Text style={styles.cell}>-</Text>
            <Text style={[styles.cell, styles.small]}>{totals.ticketCount}</Text>
            <Text style={styles.cell}>-</Text>
            <Text style={styles.cell}>-</Text>
            <Text style={[styles.cell, styles.amount]}>{money(totals.ticketReissue)}</Text>
            <Text style={[styles.cell, styles.amount]}>{money(totals.admaVoidCharge)}</Text>
            <Text style={[styles.cell, styles.amount]}>{money(totals.visaAppFee)}</Text>
            <Text style={[styles.cell, styles.amount]}>{money(totals.hotelBooking)}</Text>
            <Text style={[styles.cell, styles.amount]}>{money(totals.ticket)}</Text>
            <Text style={[styles.cell, styles.amount]}>{money(totals.totalSales)}</Text>
            <Text style={styles.cell}>-</Text>
            <Text style={[styles.cell, styles.amount]}>{money(totals.cash)}</Text>
            <Text style={[styles.cell, styles.amount]}>{money(totals.bankBrac)}</Text>
            <Text style={[styles.cell, styles.amount]}>{money(totals.bankPubali)}</Text>
            <Text style={[styles.cell, styles.amount]}>{money(totals.bankDbbl)}</Text>
            <Text style={[styles.cell, styles.amount]}>{money(totals.dueAmount)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default function SalesReportPdfModal({
  rows,
  totals,
  title,
  onClose,
}: {
  rows: SalesReportRow[]
  totals: SalesReportTotals
  title: string
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Sales report PDF"
    >
      <BlobProvider document={<SalesReportPdfDocument rows={rows} totals={totals} title={title} />}>
        {({ blob, loading, error }) => (
          <div className="flex h-[min(92vh,900px)] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
              <div>
                <h3 className="font-bold text-slate-800">{title}</h3>
                <p className="text-xs text-slate-500">PDF report preview, print, and download</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!blob || loading || Boolean(error)}
                  onClick={() => blob && printBlob(blob)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-50"
                >
                  <Printer className="h-4 w-4" /> Print
                </button>
                <button
                  type="button"
                  disabled={!blob || loading || Boolean(error)}
                  onClick={() => blob && downloadBlob(blob, title)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                >
                  <Download className="h-4 w-4" /> Download
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                  title="Close preview"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <PdfPreview blob={blob} loading={loading} error={error} />
          </div>
        )}
      </BlobProvider>
    </div>
  )
}

function printBlob(blob: Blob) {
  const url = URL.createObjectURL(blob)
  const printWindow = window.open(url, '_blank')
  if (printWindow) printWindow.onload = () => printWindow.print()
}

function downloadBlob(blob: Blob, title: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${title.replace(/[^a-z0-9]+/gi, '_').toLowerCase()}.pdf`
  link.click()
  URL.revokeObjectURL(url)
}

function PdfPreview({ blob, loading, error }: { blob: Blob | null; loading: boolean; error: Error | null }) {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    if (!blob) {
      setUrl(null)
      return
    }
    const nextUrl = URL.createObjectURL(blob)
    setUrl(nextUrl)
    return () => URL.revokeObjectURL(nextUrl)
  }, [blob])
  if (loading)
    return (
      <div className="flex flex-1 items-center justify-center text-sm font-semibold text-slate-500">
        Preparing PDF preview...
      </div>
    )
  if (error || !url)
    return (
      <div className="flex flex-1 items-center justify-center text-sm font-semibold text-rose-600">
        Unable to generate this PDF.
      </div>
    )
  return <iframe title="Sales report PDF preview" src={url} className="min-h-0 flex-1 border-0" />
}

const styles = {
  page: { padding: 24, fontSize: 7, color: '#1e293b', fontFamily: 'Helvetica' },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    borderBottom: '2 solid #0f766e',
    paddingBottom: 10,
    marginBottom: 10,
  },
  company: { fontSize: 16, fontWeight: 700 as const, color: '#0f766e' },
  title: { fontSize: 12, fontWeight: 700 as const, textAlign: 'right' as const },
  subtitle: { fontSize: 7, color: '#64748b', marginTop: 3 },
  summary: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    backgroundColor: '#f1f5f9',
    padding: 7,
    marginBottom: 10,
  },
  table: { border: '1 solid #cbd5e1' },
  row: { flexDirection: 'row' as const, borderBottom: '1 solid #e2e8f0', minHeight: 22, alignItems: 'center' as const },
  tableHeader: { backgroundColor: '#0b2e2d', color: '#ffffff', fontWeight: 700 as const },
  totalRow: { backgroundColor: '#d1fae5', fontWeight: 700 as const },
  cell: { width: '5.55%', padding: 3 },
  small: { fontSize: 6 },
  amount: { fontSize: 5.5, textAlign: 'right' as const },
}

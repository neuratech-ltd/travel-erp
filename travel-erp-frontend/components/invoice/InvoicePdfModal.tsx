import React, { useEffect, useState } from 'react'
import { BlobProvider } from '@react-pdf/renderer'
import { Download, Printer, X } from 'lucide-react'
import { Invoice } from '../../types'
import InvoicePdfDocument from './InvoicePdfDocument'

export default function InvoicePdfModal({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const document = <InvoicePdfDocument invoice={invoice} />

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Invoice ${invoice.invoiceNo} PDF`}
    >
      <BlobProvider document={document}>
        {({ blob, loading, error }) => (
          <div className="flex h-[min(92vh,900px)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
              <div>
                <h3 className="font-bold text-slate-800">Invoice {invoice.invoiceNo}</h3>
                <p className="text-xs text-slate-500">Preview, download, or print the invoice</p>
              </div>
              <div className="flex items-center gap-2">
                <PdfActions blob={blob} loading={loading} error={error} invoiceNo={invoice.invoiceNo} />
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
            <div className="min-h-0 flex-1">
              <PdfPreview blob={blob} loading={loading} error={error} />
            </div>
          </div>
        )}
      </BlobProvider>
    </div>
  )
}

function PdfActions({
  blob,
  loading,
  error,
  invoiceNo,
}: {
  blob: Blob | null
  loading: boolean
  error: Error | null
  invoiceNo: string
}) {
  const disabled = loading || !blob || Boolean(error)

  const openForPrint = () => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const printWindow = window.open(url, '_blank')
    if (printWindow)
      printWindow.onload = () => {
        printWindow.print()
        URL.revokeObjectURL(url)
      }
  }

  const download = () => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `invoice-${invoiceNo}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={openForPrint}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-50"
        title="Print invoice"
      >
        <Printer className="h-4 w-4" />
        {loading ? 'Preparing...' : 'Print'}
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={download}
        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
        title="Download invoice PDF"
      >
        <Download className="h-4 w-4" />
        Download
      </button>
      {error && <span className="text-xs font-semibold text-rose-600">Unable to generate PDF</span>}
    </>
  )
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
      <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-500">
        Preparing PDF preview...
      </div>
    )
  if (error || !url)
    return (
      <div className="flex h-full items-center justify-center text-sm font-semibold text-rose-600">
        Unable to generate this PDF.
      </div>
    )
  return <iframe title="Invoice PDF preview" src={url} className="h-full w-full border-0" />
}

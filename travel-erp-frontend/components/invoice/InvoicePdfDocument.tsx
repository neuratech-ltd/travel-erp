import React from 'react'
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import logo from '../../assets/logo/Fabicon.png'
import { Invoice, Passenger } from '../../types'

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 9, color: '#1e293b', fontFamily: 'Helvetica' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '2 solid #0f766e',
    paddingBottom: 14,
    marginBottom: 14,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { width: 48, height: 48 },
  companyName: { fontSize: 17, fontWeight: 700, color: '#0f766e' },
  companySub: { fontSize: 8, color: '#64748b', marginTop: 3 },
  invoiceTitle: { fontSize: 17, fontWeight: 700, color: '#0f172a', textAlign: 'right' },
  invoiceMeta: { fontSize: 9, color: '#475569', textAlign: 'right', marginTop: 4 },
  section: { marginBottom: 14 },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: '#0f766e',
    textTransform: 'uppercase',
    borderBottom: '1 solid #cbd5e1',
    paddingBottom: 4,
    marginBottom: 7,
  },
  metaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metaItem: { width: '31%' },
  label: { fontSize: 7, color: '#64748b', textTransform: 'uppercase', marginBottom: 2 },
  value: { fontSize: 9, fontWeight: 700 },
  table: { border: '1 solid #cbd5e1' },
  tableRow: { flexDirection: 'row', borderBottom: '1 solid #e2e8f0', minHeight: 24, alignItems: 'center' },
  tableHeader: { backgroundColor: '#f1f5f9', fontWeight: 700, color: '#334155' },
  cell: { padding: 5 },
  pax: { width: '19%' },
  passport: { width: '13%' },
  ticket: { width: '15%' },
  route: { width: '17%' },
  date: { width: '12%' },
  fare: { width: '12%', textAlign: 'right' },
  profit: { width: '12%', textAlign: 'right' },
  small: { fontSize: 7 },
  totalBox: { marginLeft: 'auto', width: '46%', border: '1 solid #cbd5e1' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 6, borderBottom: '1 solid #e2e8f0' },
  grandTotal: { backgroundColor: '#0f766e', color: '#ffffff', fontSize: 11, fontWeight: 700 },
  notes: { color: '#475569', fontSize: 8, marginTop: 5 },
  signatures: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 42 },
  signature: { width: '28%', borderTop: '1 solid #64748b', paddingTop: 5, textAlign: 'center', color: '#475569' },
})

const money = (value?: number) =>
  `BDT ${(value ?? 0).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const date = (value?: string) => (value ? new Date(value).toLocaleDateString('en-GB') : '-')
const display = (value?: string | number) => (value === undefined || value === '' ? '-' : String(value))

const PassengerRow = ({ passenger }: { passenger: Passenger }) => (
  <View style={styles.tableRow} wrap={false}>
    <Text style={[styles.cell, styles.pax, styles.small]}>
      {display(passenger.paxName)}
      {passenger.paxType ? ` (${passenger.paxType})` : ''}
    </Text>
    <Text style={[styles.cell, styles.passport, styles.small]}>{display(passenger.passportNo)}</Text>
    <Text style={[styles.cell, styles.ticket, styles.small]}>
      {display(passenger.ticketNo)}
      {passenger.pnr ? ` / ${passenger.pnr}` : ''}
    </Text>
    <Text style={[styles.cell, styles.route, styles.small]}>{display(passenger.route)}</Text>
    <Text style={[styles.cell, styles.date, styles.small]}>{date(passenger.journeyDate)}</Text>
    <Text style={[styles.cell, styles.fare, styles.small]}>{money(passenger.clientPrice)}</Text>
    <Text style={[styles.cell, styles.profit, styles.small]}>{money(passenger.profit)}</Text>
  </View>
)

export default function InvoicePdfDocument({ invoice }: { invoice: Invoice }) {
  const passengers = invoice.passengers ?? []
  const revenue = invoice.totalClientPrice ?? invoice.billing?.netTotal ?? 0
  const paid = invoice.payments?.reduce((sum, payment) => sum + payment.amount, 0) ?? 0
  const due = Math.max(revenue - paid, 0)

  return (
    <Document title={`Invoice ${invoice.invoiceNo}`} author="Travel ERP">
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header} fixed>
          <View style={styles.brand}>
            <Image src={logo} style={styles.logo} />
            <View>
              <Text style={styles.companyName}>TRAVEL ERP</Text>
              <Text style={styles.companySub}>Travel management and ticketing services</Text>
            </View>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceMeta}>#{invoice.invoiceNo}</Text>
            <Text style={styles.invoiceMeta}>{date(invoice.issueDate)}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invoice Information</Text>
          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Text style={styles.label}>Client name</Text>
              <Text style={styles.value}>{display(invoice.client?.name || 'Walk-In Customer')}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{display(invoice.client?.phone)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{display(invoice.client?.email)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>{display(invoice.client?.address)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.label}>Booking type</Text>
              <Text style={styles.value}>{invoice.type}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.label}>Reference by</Text>
              <Text style={styles.value}>{display(invoice.reference?.name)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.label}>Airline / vendor</Text>
              <Text style={styles.value}>
                {display(invoice.airline || invoice.vendor?.name || invoice.ticketInfo?.airline)}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.label}>Payment status</Text>
              <Text style={styles.value}>{invoice.status}</Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Passenger and Ticket Details</Text>
          {passengers.length > 0 ? (
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]} wrap={false}>
                <Text style={[styles.cell, styles.pax, styles.small]}>Passenger</Text>
                <Text style={[styles.cell, styles.passport, styles.small]}>Passport</Text>
                <Text style={[styles.cell, styles.ticket, styles.small]}>Ticket / PNR</Text>
                <Text style={[styles.cell, styles.route, styles.small]}>Route</Text>
                <Text style={[styles.cell, styles.date, styles.small]}>Journey</Text>
                <Text style={[styles.cell, styles.fare, styles.small]}>Amount</Text>
                <Text style={[styles.cell, styles.profit, styles.small]}>Profit</Text>
              </View>
              {passengers.map((passenger, index) => (
                <PassengerRow key={`${passenger.paxName}-${index}`} passenger={passenger} />
              ))}
            </View>
          ) : (
            <Text style={styles.notes}>Passenger details were not provided for this invoice.</Text>
          )}
          {invoice.ticketInfo && (
            <Text style={styles.notes}>
              Ticket reference: {display(invoice.ticketInfo.ticketNo)} · PNR: {display(invoice.ticketInfo.pnr)} · Route:{' '}
              {display(invoice.ticketInfo.route)}
            </Text>
          )}
          {invoice.accommodation?.hotelName && (
            <Text style={styles.notes}>
              Accommodation: {invoice.accommodation.hotelName} · {display(invoice.accommodation.roomType)} ·{' '}
              {date(invoice.accommodation.checkIn)} to {date(invoice.accommodation.checkOut)}
            </Text>
          )}
          {invoice.visaInfo?.visaNo && (
            <Text style={styles.notes}>
              Visa: {display(invoice.visaInfo.country)} · Reference {invoice.visaInfo.visaNo}
            </Text>
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calculation Summary</Text>
          <View style={styles.totalBox}>
            <View style={styles.totalRow}>
              <Text>Base fare</Text>
              <Text>{money(invoice.totalBaseFare)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Taxes / commission</Text>
              <Text>{money(invoice.totalTaxesCommission)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>AIT tax</Text>
              <Text>{money(invoice.totalAitTax)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Discount</Text>
              <Text>- {money(invoice.totalDiscount)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Extra fee</Text>
              <Text>{money(invoice.totalExtraFee)}</Text>
            </View>
            <View style={[styles.totalRow, styles.grandTotal]}>
              <Text>Total amount</Text>
              <Text>{money(revenue)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Total received</Text>
              <Text>{money(paid)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Due amount</Text>
              <Text>{money(due)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Total profit</Text>
              <Text>{money(invoice.totalProfit ?? invoice.billing?.totalProfit)}</Text>
            </View>
          </View>
        </View>
        {invoice.payments && invoice.payments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Receipts</Text>
            {invoice.payments.map((payment) => (
              <Text key={payment.id} style={styles.notes}>
                {date(payment.receivedDate)} · {payment.method}
                {payment.bankChannel ? ` (${payment.bankChannel})` : ''} · {money(payment.amount)}
                {payment.remarks ? ` · ${payment.remarks}` : ''}
              </Text>
            ))}
          </View>
        )}
        <View style={styles.signatures} wrap={false}>
          <Text style={styles.signature}>
            Prepared by{invoice.reference?.name ? `\n${invoice.reference.name}` : ''}
          </Text>
          <Text style={styles.signature}>Client acknowledgement</Text>
          <Text style={styles.signature}>Authorized by</Text>
        </View>
        <Text style={styles.notes}>This invoice is computer generated and does not require a signature.</Text>
      </Page>
    </Document>
  )
}

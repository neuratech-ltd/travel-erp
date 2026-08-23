import { InvoiceType, PaymentMethod } from '@prisma/client'
import { prisma } from '../../lib/prisma'

export interface GeneratedSalesReportRow {
  id: string
  date: string
  invoiceNo: string
  ticketType: string
  ticketCount: number
  mrNo: string
  salesRef: string
  ticketReissue: number
  admaVoidCharge: number
  visaAppFee: number
  hotelBooking: number
  ticket: number
  totalSales: number
  receivedDate: string
  cash: number
  bankBrac: number
  bankPubali: number
  bankDbbl: number
  totalReceived: number
  dueAmount: number
}

const toMoney = (value?: number | null) => Number((value ?? 0).toFixed(2))

const getTicketTypeLabel = (type: InvoiceType) => {
  if (type === InvoiceType.AIR_TICKET) {
    return 'Int:'
  }

  if (type === InvoiceType.NON_COMMISSION) {
    return 'Domestic'
  }

  if (type === InvoiceType.REISSUE) {
    return 'Reissue'
  }

  if (type === InvoiceType.HOTEL) {
    return 'Hotel'
  }

  if (type === InvoiceType.VISA) {
    return 'Visa'
  }

  return 'Tour Package'
}

const normalizeBankChannel = (value?: string | null) => (value ?? '').trim().toUpperCase()

const getAllReports = async () => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        employee: true,
        payments: true,
      },
      orderBy: {
        salesDate: 'desc',
      },
    })

    const rows: GeneratedSalesReportRow[] = invoices.map((invoice) => {
      const clientPrice = toMoney(invoice.clientPrice)

      const ticketReissue = invoice.type === InvoiceType.REISSUE ? clientPrice : 0
      const admaVoidCharge = invoice.type === InvoiceType.REISSUE ? toMoney(invoice.extraFee) : 0
      const visaAppFee = invoice.type === InvoiceType.VISA ? clientPrice : 0
      const hotelBooking = invoice.type === InvoiceType.HOTEL ? clientPrice : 0
      const ticket =
        invoice.type === InvoiceType.AIR_TICKET ||
        invoice.type === InvoiceType.NON_COMMISSION ||
        invoice.type === InvoiceType.TOUR_PACKAGE
          ? clientPrice
          : 0

      const totalSales = toMoney(ticketReissue + admaVoidCharge + visaAppFee + hotelBooking + ticket)

      const cash = toMoney(
        invoice.payments
          .filter((payment) => payment.method === PaymentMethod.CASH)
          .reduce((sum, payment) => sum + payment.amount, 0),
      )

      const bankBrac = toMoney(
        invoice.payments
          .filter(
            (payment) =>
              payment.method === PaymentMethod.BANK && normalizeBankChannel(payment.bankChannel).includes('BRAC'),
          )
          .reduce((sum, payment) => sum + payment.amount, 0),
      )

      const bankPubali = toMoney(
        invoice.payments
          .filter(
            (payment) =>
              payment.method === PaymentMethod.BANK && normalizeBankChannel(payment.bankChannel).includes('PUBALI'),
          )
          .reduce((sum, payment) => sum + payment.amount, 0),
      )

      const bankDbbl = toMoney(
        invoice.payments
          .filter(
            (payment) =>
              payment.method === PaymentMethod.BANK && normalizeBankChannel(payment.bankChannel).includes('DBBL'),
          )
          .reduce((sum, payment) => sum + payment.amount, 0),
      )

      const totalReceived = toMoney(cash + bankBrac + bankPubali + bankDbbl)
      const dueAmount = toMoney(totalSales - totalReceived)

      const latestPayment = [...invoice.payments].sort(
        (a, b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime(),
      )[0]

      return {
        id: invoice.id,
        date: invoice.salesDate.toISOString(),
        invoiceNo: invoice.invoiceNo,
        ticketType: getTicketTypeLabel(invoice.type),
        ticketCount: invoice.billing?.billingQty ?? 1,
        mrNo: latestPayment?.remarks ?? '',
        salesRef: invoice.employee?.name ?? '',
        ticketReissue,
        admaVoidCharge,
        visaAppFee,
        hotelBooking,
        ticket,
        totalSales,
        receivedDate: latestPayment?.receivedDate?.toISOString() ?? '',
        cash,
        bankBrac,
        bankPubali,
        bankDbbl,
        totalReceived,
        dueAmount,
      }
    })

    return rows
  } catch (error) {
    console.error('Error generating sales reports:', error)
    throw error
  }
}

const getReportById = async (id: string) => {
  const allReports = await getAllReports()
  return allReports.find((report) => report.id === id) ?? null
}

export { getAllReports, getReportById }

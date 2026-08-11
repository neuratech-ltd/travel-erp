export type InvoiceType = 'AIR_TICKET' | 'NON_COMMISSION' | 'REISSUE' | 'TOUR_PACKAGE' | 'HOTEL' | 'VISA'

export type InvoiceStatus = 'PAID' | 'UNPAID' | 'PARTIAL'

export interface InvoiceContact {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
}

export interface Invoice {
  id: string

  invoiceNo: string

  type: InvoiceType
  status: InvoiceStatus

  salesDate: string
  dueDate?: string

  createdAt?: string
  updatedAt?: string

  // Relations
  clientId: string
  client?: InvoiceContact

  employeeId: string
  employee?: InvoiceContact

  agentId?: string
  agent?: InvoiceContact

  vendorId?: string
  vendor?: {
    id: string
    name: string
    email?: string
  }

  // -----------------------------
  // Flat Ticket Information
  // -----------------------------

  ticketNo?: string

  paxName?: string

  paxType?: string

  passportNo?: string

  contactNo?: string

  email?: string

  airline?: string

  route?: string

  pnr?: string

  journeyDate?: string

  returnDate?: string

  class?: string

  segment?: string

  // -----------------------------
  // Financial Information
  // -----------------------------

  grossFare?: number

  baseFare?: number

  commissionPct?: number

  commission?: number

  tax?: number

  purchasePrice?: number

  clientPrice?: number

  netCommission?: number

  profit?: number

  vat?: number

  extraFee?: number

  discount?: number

  // -----------------------------
  // Tour Package Composite Types
  // -----------------------------

  passportInfo?: PassportInfo

  ticketInfo?: TicketInfo

  accommodation?: Accommodation

  transport?: Transport

  visaInfo?: VisaInfo

  medicalInfo?: MedicalInfo

  billing?: Billing

  payments?: Payment[]
}

export interface PassportInfo {
  passportNo?: string
  paxName?: string
  paxType?: string
  nationalId?: string
  contactNo?: string
  email?: string

  dob?: string

  dateOfIssue?: string

  dateOfExpiry?: string
}

export interface TicketInfo {
  ticketNo?: string

  pnr?: string

  route?: string

  journeyDate?: string

  returnDate?: string

  airline?: string

  salePrice?: number

  costPrice?: number

  profit?: number

  vendor?: string
}

export interface Accommodation {
  hotelName?: string

  hotelLocation?: string

  roomType?: string

  checkIn?: string

  checkOut?: string

  nights?: number

  salePrice?: number

  costPrice?: number

  profit?: number

  vendor?: string
}

export interface Transport {
  transportType?: string

  referenceNo?: string

  description?: string

  fromDate?: string

  toDate?: string

  pickupTime?: string

  dropoffTime?: string

  salePrice?: number

  costPrice?: number

  profit?: number

  vendor?: string
}

export interface VisaInfo {
  visaCategory?: string

  country?: string

  visaType?: string

  visaDeliveryDate?: string

  visaNo?: string

  salePrice?: number

  costPrice?: number

  profit?: number
}

export interface MedicalInfo {
  hospitalName?: string

  doctorName?: string

  appointmentDate?: string

  treatmentCategory?: string

  companionName?: string

  ambulanceRequired?: boolean

  treatmentCost?: number

  salePrice?: number

  costPrice?: number

  profit?: number
}

export interface Billing {
  unitPrice?: number

  costPrice?: number

  billingQty?: number

  discount?: number

  extraFee?: number

  totalCost?: number

  totalProfit?: number

  subTotal?: number

  netTotal?: number

  agentCommission?: number
}

export interface Payment {
  id: string

  amount: number

  method: 'CASH' | 'BANK'

  bankChannel?: string

  receivedDate: string

  remarks?: string
}

export interface ReportStats {
  daily: ReportValues
  monthly: ReportValues
  yearly: ReportValues
}

export interface ReportValues {
  sales: number
  collections: number
  discount: number
  purchased: number
  serviceCharge: number
  payment: number
  profit: number
}

export interface SalesReportRow {
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

export interface Employee {
  id: string
  name: string
  designation: string
  email: string
  phone: string
  department: string
  joiningDate: string
  status: 'Active' | 'Inactive'
}

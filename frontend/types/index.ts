export interface Invoice {
  id: string;
  invoiceNo: string;
  clientName: string;
  salesBy: string;
  salesDate: string;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Partial';
  type: 'Air Ticket' | 'Non Commission' | 'Reissue' | 'Tour Package' | 'Hotel' | 'Visa';
  
  // Ticket details (optional)
  ticketNo?: string;
  paxName?: string;
  paxType?: string;
  passportNo?: string;
  contactNo?: string;
  email?: string;
  airline?: string;
  route?: string;
  pnr?: string;
  journeyDate?: string;
  returnDate?: string;
  class?: string;
  segment?: string;
  
  // Financial details
  grossFare?: number;
  baseFare?: number;
  commissionPct?: number;
  commission?: number;
  tax?: number;
  purchasePrice?: number;
  clientPrice?: number;
  netCommission?: number;
  profit?: number;
  vat?: number;
  extraFee?: number;
  discount?: number;

  // Nested structures for Tour Packages (optional properties)
  passportInfo?: {
    passportNo?: string;
    paxName?: string;
    paxType?: string;
    nationalId?: string;
    contactNo?: string;
    email?: string;
    dob?: string;
    dateOfIssue?: string;
    dateOfExpiry?: string;
  };
  ticketInfo?: {
    ticketNo?: string;
    pnr?: string;
    route?: string;
    journeyDate?: string;
    returnDate?: string;
    airline?: string;
    salePrice?: number;
    costPrice?: number;
    profit?: number;
    vendor?: string;
  };
  accommodation?: {
    hotelName?: string;
    hotelLocation?: string;
    roomType?: string;
    checkIn?: string;
    checkOut?: string;
    nights?: number;
    salePrice?: number;
    costPrice?: number;
    profit?: number;
    vendor?: string;
  };
  transport?: {
    transportType?: string;
    referenceNo?: string;
    description?: string;
    fromDate?: string;
    toDate?: string;
    pickupTime?: string;
    dropoffTime?: string;
    salePrice?: number;
    costPrice?: number;
    profit?: number;
    vendor?: string;
  };
  visaInfo?: {
    visaCategory?: string;
    country?: string;
    visaType?: string;
    visaDeliveryDate?: string;
    visaNo?: string;
    salePrice?: number;
    costPrice?: number;
    profit?: number;
  };
  medicalInfo?: {
    hospitalName?: string;
    doctorName?: string;
    appointmentDate?: string;
    treatmentCategory?: string;
    companionName?: string;
    ambulanceRequired?: boolean;
    treatmentCost?: number;
    salePrice?: number;
    costPrice?: number;
    profit?: number;
  };
  billing?: {
    unitPrice?: number;
    costPrice?: number;
    billingQty?: number;
    discount?: number;
    extraFee?: number;
    totalCost?: number;
    totalProfit?: number;
    subTotal?: number;
    netTotal?: number;
    agentCommission?: number;
  };
}

export interface ReportStats {
  daily: ReportValues;
  monthly: ReportValues;
  yearly: ReportValues;
}

export interface ReportValues {
  sales: number;
  collections: number;
  discount: number;
  purchased: number;
  serviceCharge: number;
  payment: number;
  profit: number;
}

export interface SalesReportRow {
  id: string;
  date: string;
  invoiceNo: string;
  ticketType: string;
  ticketCount: number;
  mrNo: string;
  salesRef: string;
  ticketReissue: number;
  admaVoidCharge: number;
  visaAppFee: number;
  hotelBooking: number;
  ticket: number;
  totalSales: number;
  receivedDate: string;
  cash: number;
  bankBrac: number;
  bankPubali: number;
  bankDbbl: number;
  totalReceived: number;
  dueAmount: number;
}

export interface Employee {
  id: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  department: string;
  joiningDate: string;
  status: 'Active' | 'Inactive';
}

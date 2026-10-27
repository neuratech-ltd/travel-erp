export interface IurRecord {
  type: string;
  raw: string;
}

export interface ParsedIur {
  records: IurRecord[];
  passengerRecords: IurRecord[];
  ticketRecords: IurRecord[];
  itineraryRecords: IurRecord[];
  fareRecords: IurRecord[];
  contactRecords: IurRecord[];
  extracted: IurExtractedData;
}

export interface IurExtractedData {
  invoice: {
    ticketNo: string | null;
    pnr: string | null;
    route: string | null;
    class: string | null;
    baseFare: number | null;
    taxesCommission: number | null;
    aitTax: number | null;
    clientPrice: number | null;
    commission: number | null;
    calculatedCommission: number | null;
    purchaseCost: number | null;
    netCommission: number | null;
    discount: number | null;
    extraFee: number | null;
    profit: number | null;
    passengerName: string | null;
    passengerType: string | null;
    passportNo: string | null;
    contactNo: string | null;
    passengerEmail: string | null;
    dateOfBirth: string | null;
    passportIssueDate: string | null;
    passportExpiryDate: string | null;
    journeyDate: string | null;
    returnDate: string | null;
    travelSegment: string | null;
    ticketingRemarks: string | null;
  };
  passenger: {
    name: string | null;
  };
  ticket: {
    number: string | null;
    currency: string | null;
    baseAmount: number | null;
    airline: string | null;
  };
  itinerary: Array<{
    recordType: string;
    date: string | null;
    origin: string | null;
    destination: string | null;
    airline: string | null;
    flightNumber: string | null;
    bookingClass: string | null;
    departureTime: string | null;
    arrivalTime: string | null;
  }>;
  fare: {
    currency: string | null;
    total: number | null;
    raw: string | null;
  };
  contacts: Array<{
    type: string;
    value: string;
  }>;
  bookingReference: string | null;
}

export interface ImportIurInput {
  fileName: string;
  sourceDevice: string;
  content: string;
}

export interface IurDirectoryScanResult {
  directory: string;
  discovered: number;
  imported: number;
  duplicates: number;
  errors: Array<{
    fileName: string;
    message: string;
  }>;
}

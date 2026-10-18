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

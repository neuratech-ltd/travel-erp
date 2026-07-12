import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

// Initialize Environment Variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini SDK lazily to prevent crashes if key is missing,
// but check it and handle gracefully when an API call is made.
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not defined. Please add it in your Secrets.');
    }
    aiClient = new GoogleGenAI({ apiKey: apiKey });
  }
  return aiClient;
}

// In-Memory Database
interface SalesReportRow {
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

let salesReportRows: SalesReportRow[] = [
  {
    id: "1",
    date: "02.05.26",
    invoiceNo: "560",
    ticketType: "Int:",
    ticketCount: 1,
    mrNo: "315",
    salesRef: "Ekramul",
    ticketReissue: 15400.0,
    admaVoidCharge: 0,
    visaAppFee: 0,
    hotelBooking: 0,
    ticket: 0,
    totalSales: 15400.0,
    receivedDate: "03.05.26",
    cash: 0,
    bankBrac: 0,
    bankPubali: 15400.0,
    bankDbbl: 0,
    totalReceived: 15400.0,
    dueAmount: 0
  },
  {
    id: "2",
    date: "02.05.26",
    invoiceNo: "561",
    ticketType: "Domestic",
    ticketCount: 1,
    mrNo: "346",
    salesRef: "Ekramul",
    ticketReissue: 0,
    admaVoidCharge: 0,
    visaAppFee: 0,
    hotelBooking: 0,
    ticket: 5103.0,
    totalSales: 5103.0,
    receivedDate: "13.05.26",
    cash: 0,
    bankBrac: 5103.0,
    bankPubali: 0,
    bankDbbl: 0,
    totalReceived: 5103.0,
    dueAmount: 0
  },
  {
    id: "3",
    date: "02.05.26",
    invoiceNo: "562",
    ticketType: "Int:",
    ticketCount: 2,
    mrNo: "331/251/252/285",
    salesRef: "Farhadul Amin",
    ticketReissue: 0,
    admaVoidCharge: 0,
    visaAppFee: 0,
    hotelBooking: 0,
    ticket: 901188.0,
    totalSales: 901188.0,
    receivedDate: "12.05.26 / 18.05.26 / 20.05.26",
    cash: 254273.0,
    bankBrac: 646915.0,
    bankPubali: 0,
    bankDbbl: 0,
    totalReceived: 901188.0,
    dueAmount: 0
  },
  {
    id: "4",
    date: "02.05.26",
    invoiceNo: "563",
    ticketType: "Int:",
    ticketCount: 1,
    mrNo: "286",
    salesRef: "Farhadul Amin",
    ticketReissue: 0,
    admaVoidCharge: 0,
    visaAppFee: 0,
    hotelBooking: 0,
    ticket: 187162.0,
    totalSales: 187162.0,
    receivedDate: "",
    cash: 187162.0,
    bankBrac: 0,
    bankPubali: 0,
    bankDbbl: 0,
    totalReceived: 187162.0,
    dueAmount: 0
  },
  {
    id: "5",
    date: "02.05.26",
    invoiceNo: "564",
    ticketType: "Domestic",
    ticketCount: 2,
    mrNo: "425",
    salesRef: "Ekramul",
    ticketReissue: 0,
    admaVoidCharge: 0,
    visaAppFee: 0,
    hotelBooking: 0,
    ticket: 12200.0,
    totalSales: 12200.0,
    receivedDate: "18.05.26",
    cash: 12200.0,
    bankBrac: 0,
    bankPubali: 0,
    bankDbbl: 0,
    totalReceived: 12200.0,
    dueAmount: 0
  },
  {
    id: "6",
    date: "03.05.26",
    invoiceNo: "565",
    ticketType: "Domestic",
    ticketCount: 1,
    mrNo: "347",
    salesRef: "Ekramul",
    ticketReissue: 0,
    admaVoidCharge: 0,
    visaAppFee: 0,
    hotelBooking: 0,
    ticket: 5113.0,
    totalSales: 5113.0,
    receivedDate: "",
    cash: 0,
    bankBrac: 5113.0,
    bankPubali: 0,
    bankDbbl: 0,
    totalReceived: 5113.0,
    dueAmount: 0
  },
  {
    id: "7",
    date: "03.05.26",
    invoiceNo: "566",
    ticketType: "Domestic",
    ticketCount: 4,
    mrNo: "348",
    salesRef: "Ekramul",
    ticketReissue: 0,
    admaVoidCharge: 0,
    visaAppFee: 0,
    hotelBooking: 0,
    ticket: 20452.0,
    totalSales: 20452.0,
    receivedDate: "13.05.26",
    cash: 0,
    bankBrac: 20452.0,
    bankPubali: 0,
    bankDbbl: 0,
    totalReceived: 20452.0,
    dueAmount: 0
  },
  {
    id: "8",
    date: "03.05.26",
    invoiceNo: "567",
    ticketType: "Domestic",
    ticketCount: 4,
    mrNo: "349",
    salesRef: "Ekramul",
    ticketReissue: 0,
    admaVoidCharge: 0,
    visaAppFee: 0,
    hotelBooking: 0,
    ticket: 20452.0,
    totalSales: 20452.0,
    receivedDate: "13.05.26",
    cash: 0,
    bankBrac: 20452.0,
    bankPubali: 0,
    bankDbbl: 0,
    totalReceived: 20452.0,
    dueAmount: 0
  },
  {
    id: "9",
    date: "03.05.26",
    invoiceNo: "568",
    ticketType: "Domestic",
    ticketCount: 2,
    mrNo: "350",
    salesRef: "Ekramul",
    ticketReissue: 0,
    admaVoidCharge: 0,
    visaAppFee: 0,
    hotelBooking: 0,
    ticket: 10226.0,
    totalSales: 10226.0,
    receivedDate: "13.05.26",
    cash: 0,
    bankBrac: 10226.0,
    bankPubali: 0,
    bankDbbl: 0,
    totalReceived: 10226.0,
    dueAmount: 0
  },
  {
    id: "10",
    date: "03.05.26",
    invoiceNo: "569",
    ticketType: "Int:",
    ticketCount: 1,
    mrNo: "287",
    salesRef: "Farhadul Amin",
    ticketReissue: 0,
    admaVoidCharge: 0,
    visaAppFee: 0,
    hotelBooking: 0,
    ticket: 52651.0,
    totalSales: 52651.0,
    receivedDate: "",
    cash: 52651.0,
    bankBrac: 0,
    bankPubali: 0,
    bankDbbl: 0,
    totalReceived: 52651.0,
    dueAmount: 0
  },
  {
    id: "11",
    date: "03.05.26",
    invoiceNo: "570",
    ticketType: "Int:",
    ticketCount: 1,
    mrNo: "288",
    salesRef: "Farhadul Amin",
    ticketReissue: 0,
    admaVoidCharge: 0,
    visaAppFee: 0,
    hotelBooking: 0,
    ticket: 74650.0,
    totalSales: 74650.0,
    receivedDate: "",
    cash: 74650.0,
    bankBrac: 0,
    bankPubali: 0,
    bankDbbl: 0,
    totalReceived: 74650.0,
    dueAmount: 0
  },
  {
    id: "12",
    date: "03.05.26",
    invoiceNo: "571",
    ticketType: "Domestic",
    ticketCount: 3,
    mrNo: "351",
    salesRef: "Ekramul",
    ticketReissue: 0,
    admaVoidCharge: 0,
    visaAppFee: 0,
    hotelBooking: 0,
    ticket: 16737.0,
    totalSales: 16737.0,
    receivedDate: "13.05.26",
    cash: 0,
    bankBrac: 16737.0,
    bankPubali: 0,
    bankDbbl: 0,
    totalReceived: 16737.0,
    dueAmount: 0
  },
  {
    id: "13",
    date: "03.05.26",
    invoiceNo: "572",
    ticketType: "Domestic",
    ticketCount: 2,
    mrNo: "352",
    salesRef: "Ekramul",
    ticketReissue: 0,
    admaVoidCharge: 0,
    visaAppFee: 0,
    hotelBooking: 0,
    ticket: 11158.0,
    totalSales: 11158.0,
    receivedDate: "13.05.26",
    cash: 0,
    bankBrac: 11158.0,
    bankPubali: 0,
    bankDbbl: 0,
    totalReceived: 11158.0,
    dueAmount: 0
  },
  {
    id: "14",
    date: "03.05.26",
    invoiceNo: "573",
    ticketType: "Domestic",
    ticketCount: 3,
    mrNo: "353",
    salesRef: "Ekramul",
    ticketReissue: 0,
    admaVoidCharge: 0,
    visaAppFee: 0,
    hotelBooking: 0,
    ticket: 18138.0,
    totalSales: 18138.0,
    receivedDate: "13.05.26",
    cash: 0,
    bankBrac: 18138.0,
    bankPubali: 0,
    bankDbbl: 0,
    totalReceived: 18138.0,
    dueAmount: 0
  },
  {
    id: "15",
    date: "03.05.26",
    invoiceNo: "574",
    ticketType: "Domestic",
    ticketCount: 4,
    mrNo: "354",
    salesRef: "Ekramul",
    ticketReissue: 0,
    admaVoidCharge: 0,
    visaAppFee: 0,
    hotelBooking: 0,
    ticket: 20452.0,
    totalSales: 20452.0,
    receivedDate: "13.05.26",
    cash: 0,
    bankBrac: 20452.0,
    bankPubali: 0,
    bankDbbl: 0,
    totalReceived: 20452.0,
    dueAmount: 0
  },
  {
    id: "16",
    date: "03.05.26",
    invoiceNo: "575",
    ticketType: "Domestic",
    ticketCount: 3,
    mrNo: "355",
    salesRef: "Ekramul",
    ticketReissue: 0,
    admaVoidCharge: 0,
    visaAppFee: 0,
    hotelBooking: 0,
    ticket: 16737.0,
    totalSales: 16737.0,
    receivedDate: "13.05.26",
    cash: 0,
    bankBrac: 16737.0,
    bankPubali: 0,
    bankDbbl: 0,
    totalReceived: 16737.0,
    dueAmount: 0
  },
  {
    id: "17",
    date: "03.05.26",
    invoiceNo: "576",
    ticketType: "Domestic",
    ticketCount: 2,
    mrNo: "356",
    salesRef: "Ekramul",
    ticketReissue: 0,
    admaVoidCharge: 0,
    visaAppFee: 0,
    hotelBooking: 0,
    ticket: 11158.0,
    totalSales: 11158.0,
    receivedDate: "13.05.26",
    cash: 0,
    bankBrac: 11158.0,
    bankPubali: 0,
    bankDbbl: 0,
    totalReceived: 11158.0,
    dueAmount: 0
  },
  {
    id: "18",
    date: "03.05.26",
    invoiceNo: "577",
    ticketType: "Domestic",
    ticketCount: 2,
    mrNo: "357",
    salesRef: "Ekramul",
    ticketReissue: 0,
    admaVoidCharge: 0,
    visaAppFee: 0,
    hotelBooking: 0,
    ticket: 12092.0,
    totalSales: 12092.0,
    receivedDate: "13.05.26",
    cash: 0,
    bankBrac: 12092.0,
    bankPubali: 0,
    bankDbbl: 0,
    totalReceived: 12092.0,
    dueAmount: 0
  },
  {
    id: "19",
    date: "03.05.26",
    invoiceNo: "578",
    ticketType: "Int:",
    ticketCount: 2,
    mrNo: "358",
    salesRef: "Ekramul",
    ticketReissue: 0,
    admaVoidCharge: 0,
    visaAppFee: 0,
    hotelBooking: 0,
    ticket: 151034.0,
    totalSales: 151034.0,
    receivedDate: "13.05.26",
    cash: 0,
    bankBrac: 151034.0,
    bankPubali: 0,
    bankDbbl: 0,
    totalReceived: 151034.0,
    dueAmount: 0
  },
  {
    id: "20",
    date: "04.05.26",
    invoiceNo: "579",
    ticketType: "Int:",
    ticketCount: 2,
    mrNo: "317",
    salesRef: "Ekramul",
    ticketReissue: 0,
    admaVoidCharge: 0,
    visaAppFee: 0,
    hotelBooking: 0,
    ticket: 128000.0,
    totalSales: 128000.0,
    receivedDate: "05.05.26",
    cash: 0,
    bankBrac: 128000.0,
    bankPubali: 0,
    bankDbbl: 0,
    totalReceived: 128000.0,
    dueAmount: 0
  },
  {
    id: "21",
    date: "04.05.26",
    invoiceNo: "580",
    ticketType: "Int:",
    ticketCount: 1,
    mrNo: "",
    salesRef: "Farhadul Amin",
    ticketReissue: 0,
    admaVoidCharge: 0,
    visaAppFee: 0,
    hotelBooking: 0,
    ticket: 67000.0,
    totalSales: 67000.0,
    receivedDate: "",
    cash: 0,
    bankBrac: 0,
    bankPubali: 0,
    bankDbbl: 0,
    totalReceived: 0,
    dueAmount: 67000.0
  },
  {
    id: "22",
    date: "04.05.26",
    invoiceNo: "581",
    ticketType: "Int:",
    ticketCount: 1,
    mrNo: "318/319",
    salesRef: "Ekramul",
    ticketReissue: 0,
    admaVoidCharge: 0,
    visaAppFee: 0,
    hotelBooking: 0,
    ticket: 9000.0,
    totalSales: 9000.0,
    receivedDate: "05.05.26 / 07.05.26",
    cash: 0,
    bankBrac: 9000.0,
    bankPubali: 0,
    bankDbbl: 0,
    totalReceived: 9000.0,
    dueAmount: 0
  }
];

// In-Memory Database
interface Invoice {
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

  // Nested structures for Tour Packages
  passportInfo?: any;
  ticketInfo?: any;
  accommodation?: any;
  transport?: any;
  food?: any;
  visaInfo?: any;
  billing?: any;
  receipt?: any;
  medicalInfo?: any;
}

// Initial realistic seed data matching the screenshots!
let invoices: Invoice[] = [
  {
    id: '1',
    invoiceNo: 'AIT-0020',
    clientName: 'Journey Season Ltd',
    salesBy: 'Select Employee',
    salesDate: '2026-07-07',
    dueDate: '2026-07-21',
    status: 'Paid',
    type: 'Air Ticket',
    ticketNo: '997-384950284',
    paxName: 'John Doe',
    paxType: 'Adult',
    passportNo: 'A04859382',
    contactNo: '+8801958-398341',
    email: 'john.doe@gmail.com',
    airline: 'Emirates',
    route: 'DAC-DXB-LHR',
    pnr: 'EKXYZ8',
    journeyDate: '2026-07-15',
    returnDate: '2026-08-10',
    class: 'Economy',
    segment: 'DAC-DXB',
    grossFare: 8000,
    baseFare: 6500,
    commissionPct: 7,
    commission: 455,
    tax: 1500,
    purchasePrice: 10000,
    clientPrice: 12000,
    netCommission: 455,
    profit: 2000
  },
  {
    id: '2',
    invoiceNo: 'ANC-0006',
    clientName: 'Skyline Travels',
    salesBy: 'Admin Employee',
    salesDate: '2026-07-07',
    dueDate: '2026-07-15',
    status: 'Partial',
    type: 'Non Commission',
    ticketNo: '124-948503847',
    paxName: 'Jane Smith',
    paxType: 'Adult',
    contactNo: '+8801958-398308',
    email: 'jane.smith@skyline.com',
    airline: 'Qatar Airways',
    route: 'DAC-DOH-JFK',
    grossFare: 12000,
    purchasePrice: 15000,
    clientPrice: 18500,
    profit: 3500
  },
  {
    id: '3',
    invoiceNo: 'ARI-0001',
    clientName: 'Globe Trotter Agency',
    salesBy: 'Sales Exec',
    salesDate: '2026-07-06',
    dueDate: '2026-07-20',
    status: 'Unpaid',
    type: 'Reissue',
    ticketNo: '074-123456789',
    paxName: 'Robert Johnson',
    airline: 'Turkish Airlines',
    route: 'DAC-IST-CDG',
    purchasePrice: 5000,
    clientPrice: 6500,
    profit: 1500
  },
  {
    id: '4',
    invoiceNo: 'WCT-0024',
    clientName: 'Welcare Medical Patients',
    salesBy: 'Direct Sales',
    salesDate: '2026-07-07',
    dueDate: '2026-07-25',
    status: 'Paid',
    type: 'Tour Package',
    passportInfo: {
      passportNo: 'B08593859',
      paxName: 'Haji Mohammad Selim',
      paxType: 'Adult',
      nationalId: '1982483958',
      contactNo: '+8801711-234567',
      email: 'm.selim@welcaregroupbd.com',
      dob: '1982-05-12',
      dateOfIssue: '2022-01-10',
      dateOfExpiry: '2032-01-10'
    },
    ticketInfo: {
      ticketNo: '098-938593849',
      pnr: 'SQXYZ9',
      route: 'DAC-SIN-DAC',
      journeyDate: '2026-08-01',
      returnDate: '2026-08-07',
      airline: 'Singapore Airlines',
      salePrice: 4800,
      costPrice: 4100,
      profit: 700,
      vendor: 'Singapore Airlines Direct'
    },
    accommodation: {
      hotelName: 'Royal Plaza on Scotts',
      hotelLocation: 'Singapore (Orchard)',
      roomType: 'Deluxe Suite',
      checkIn: '2026-08-01',
      checkOut: '2026-08-07',
      nights: 6,
      salePrice: 13200,
      costPrice: 11000,
      profit: 2200,
      vendor: 'Miki Travel Agent'
    },
    transport: {
      transportType: 'Airport Ambulance & Private Car',
      referenceNo: 'MED-SG-0485',
      description: 'Medical Escort and Wheelchair Chauffeur transfers',
      fromDate: '2026-08-01',
      toDate: '2026-08-07',
      pickupTime: '10:00',
      dropoffTime: '11:00',
      salePrice: 1800,
      costPrice: 1400,
      profit: 400,
      vendor: 'Singapore Medical Transport'
    },
    visaInfo: {
      visaCategory: 'MEDICAL',
      country: 'Singapore',
      visaType: 'Medical Visa Single Entry',
      visaDeliveryDate: '2026-07-15',
      visaNo: 'VISA-SG-39485',
      salePrice: 1500,
      costPrice: 1000,
      profit: 500
    },
    medicalInfo: {
      hospitalName: 'Mount Elizabeth Hospital',
      doctorName: 'Dr. Tan Seng Kiat (Cardiology)',
      appointmentDate: '2026-08-03T10:00:00.000Z',
      treatmentCategory: 'Cardiology',
      companionName: 'Mrs. Selim Begum (Medical Attendant)',
      ambulanceRequired: true,
      treatmentCost: 12000,
      salePrice: 14500,
      costPrice: 12500,
      profit: 2000
    },
    billing: {
      unitPrice: 35800,
      costPrice: 30000,
      billingQty: 1,
      discount: 300,
      extraFee: 150,
      totalCost: 30000,
      totalProfit: 5800,
      subTotal: 35850,
      netTotal: 35550,
      agentCommission: 1500
    }
  }
];

// Helper to calculate reports based on in-memory invoices
function getReportStats() {
  const stats = {
    daily: { sales: 0, collections: 0, discount: 0, purchased: 0, serviceCharge: 0, payment: 0, profit: 0 },
    monthly: { sales: 0, collections: 0, discount: 0, purchased: 0, serviceCharge: 0, payment: 0, profit: 0 },
    yearly: { sales: 0, collections: 0, discount: 0, purchased: 0, serviceCharge: 0, payment: 0, profit: 0 },
  };

  const todayStr = '2026-07-07'; // Match screenshots' baseline date
  const thisMonthStr = '2026-07';
  const thisYearStr = '2026';

  invoices.forEach((inv) => {
    const clientPrice = inv.clientPrice || (inv.billing?.netTotal) || 0;
    const costPrice = inv.purchasePrice || (inv.billing?.totalCost) || 0;
    const profit = inv.profit || (inv.billing?.totalProfit) || 0;
    const discount = inv.discount || (inv.billing?.discount) || 0;
    const serviceCharge = inv.extraFee || (inv.billing?.extraFee) || 0;
    
    // collection is based on payment status
    let collection = 0;
    if (inv.status === 'Paid') collection = clientPrice;
    else if (inv.status === 'Partial') collection = clientPrice * 0.6; // realistic mock

    // Accumulate Daily
    if (inv.salesDate === todayStr) {
      stats.daily.sales += clientPrice;
      stats.daily.collections += collection;
      stats.daily.discount += discount;
      stats.daily.purchased += costPrice;
      stats.daily.serviceCharge += serviceCharge;
      stats.daily.payment += collection; // simplified
      stats.daily.profit += profit;
    }

    // Accumulate Monthly
    if (inv.salesDate.startsWith(thisMonthStr)) {
      stats.monthly.sales += clientPrice;
      stats.monthly.collections += collection;
      stats.monthly.discount += discount;
      stats.monthly.purchased += costPrice;
      stats.monthly.serviceCharge += serviceCharge;
      stats.monthly.payment += collection;
      stats.monthly.profit += profit;
    }

    // Accumulate Yearly
    if (inv.salesDate.startsWith(thisYearStr)) {
      stats.yearly.sales += clientPrice;
      stats.yearly.collections += collection;
      stats.yearly.discount += discount;
      stats.yearly.purchased += costPrice;
      stats.yearly.serviceCharge += serviceCharge;
      stats.yearly.payment += collection;
      stats.yearly.profit += profit;
    }
  });

  return stats;
}

// REST Endpoints
// 1. Get Invoices list
app.get('/api/invoices', (req, res) => {
  res.json({ success: true, data: invoices });
});

// 2. Add custom Invoice
app.post('/api/invoices', (req, res) => {
  try {
    const newInvoice: Invoice = {
      id: String(invoices.length + 1),
      invoiceNo: req.body.invoiceNo || `INV-2026-000${invoices.length + 1}`,
      clientName: req.body.clientName || 'Walk-In Customer',
      salesBy: req.body.salesBy || 'Select Employee',
      salesDate: req.body.salesDate || '2026-07-07',
      dueDate: req.body.dueDate || '2026-07-21',
      status: req.body.status || 'Unpaid',
      type: req.body.type || 'Air Ticket',
      ...req.body
    };

    // Calculate profit dynamically if not provided
    if (!newInvoice.profit) {
      const clientPrice = newInvoice.clientPrice || 0;
      const purchasePrice = newInvoice.purchasePrice || 0;
      newInvoice.profit = Math.max(0, clientPrice - purchasePrice);
    }

    invoices.unshift(newInvoice); // Place newest at front
    res.status(201).json({ success: true, data: newInvoice });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 3. Get Report Stats
app.get('/api/reports/stats', (req, res) => {
  res.json({ success: true, data: getReportStats() });
});

// 4. Update Invoice Status
app.patch('/api/invoices/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const inv = invoices.find(i => i.id === id);
  if (inv) {
    inv.status = status;
    res.json({ success: true, data: inv });
  } else {
    res.status(404).json({ success: false, message: 'Invoice not found' });
  }
});

// 5. Delete Invoice
app.delete('/api/invoices/:id', (req, res) => {
  const { id } = req.params;
  const initialLen = invoices.length;
  invoices = invoices.filter(i => i.id !== id);
  if (invoices.length < initialLen) {
    res.json({ success: true, message: 'Invoice deleted successfully' });
  } else {
    res.status(404).json({ success: false, message: 'Invoice not found' });
  }
});

// 5.5. Sales Report Spreadsheet Endpoints
app.get('/api/sales-reports', (req, res) => {
  res.json({ success: true, data: salesReportRows });
});

app.post('/api/sales-reports', (req, res) => {
  try {
    const rowData = req.body;
    
    // Auto-calculate totals on backend to enforce data integrity
    const ticketReissue = Number(rowData.ticketReissue || 0);
    const admaVoidCharge = Number(rowData.admaVoidCharge || 0);
    const visaAppFee = Number(rowData.visaAppFee || 0);
    const hotelBooking = Number(rowData.hotelBooking || 0);
    const ticket = Number(rowData.ticket || 0);
    
    const totalSales = ticketReissue + admaVoidCharge + visaAppFee + hotelBooking + ticket;
    
    const cash = Number(rowData.cash || 0);
    const bankBrac = Number(rowData.bankBrac || 0);
    const bankPubali = Number(rowData.bankPubali || 0);
    const bankDbbl = Number(rowData.bankDbbl || 0);
    
    const totalReceived = cash + bankBrac + bankPubali + bankDbbl;
    const dueAmount = totalSales - totalReceived;
    
    const newRow: SalesReportRow = {
      id: String(salesReportRows.length + 1000 + Math.floor(Math.random() * 9000)),
      date: rowData.date || new Date().toLocaleDateString('en-GB'), // DD.MM.YY style
      invoiceNo: rowData.invoiceNo || String(salesReportRows.length + 560),
      ticketType: rowData.ticketType || 'Int:',
      ticketCount: Number(rowData.ticketCount || 1),
      mrNo: rowData.mrNo || '',
      salesRef: rowData.salesRef || 'Ekramul',
      ticketReissue,
      admaVoidCharge,
      visaAppFee,
      hotelBooking,
      ticket,
      totalSales,
      receivedDate: rowData.receivedDate || '',
      cash,
      bankBrac,
      bankPubali,
      bankDbbl,
      totalReceived,
      dueAmount
    };
    
    salesReportRows.push(newRow);
    res.status(201).json({ success: true, data: newRow });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.put('/api/sales-reports/:id', (req, res) => {
  try {
    const { id } = req.params;
    const index = salesReportRows.findIndex(r => r.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Row not found' });
    }
    
    const rowData = req.body;
    
    const ticketReissue = Number(rowData.ticketReissue || 0);
    const admaVoidCharge = Number(rowData.admaVoidCharge || 0);
    const visaAppFee = Number(rowData.visaAppFee || 0);
    const hotelBooking = Number(rowData.hotelBooking || 0);
    const ticket = Number(rowData.ticket || 0);
    
    const totalSales = ticketReissue + admaVoidCharge + visaAppFee + hotelBooking + ticket;
    
    const cash = Number(rowData.cash || 0);
    const bankBrac = Number(rowData.bankBrac || 0);
    const bankPubali = Number(rowData.bankPubali || 0);
    const bankDbbl = Number(rowData.bankDbbl || 0);
    
    const totalReceived = cash + bankBrac + bankPubali + bankDbbl;
    const dueAmount = totalSales - totalReceived;
    
    salesReportRows[index] = {
      ...salesReportRows[index],
      date: rowData.date || salesReportRows[index].date,
      invoiceNo: rowData.invoiceNo || salesReportRows[index].invoiceNo,
      ticketType: rowData.ticketType || salesReportRows[index].ticketType,
      ticketCount: Number(rowData.ticketCount || salesReportRows[index].ticketCount),
      mrNo: rowData.mrNo || salesReportRows[index].mrNo,
      salesRef: rowData.salesRef || salesReportRows[index].salesRef,
      ticketReissue,
      admaVoidCharge,
      visaAppFee,
      hotelBooking,
      ticket,
      totalSales,
      receivedDate: rowData.receivedDate || salesReportRows[index].receivedDate,
      cash,
      bankBrac,
      bankPubali,
      bankDbbl,
      totalReceived,
      dueAmount
    };
    
    res.json({ success: true, data: salesReportRows[index] });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.delete('/api/sales-reports/:id', (req, res) => {
  const { id } = req.params;
  const initialLen = salesReportRows.length;
  salesReportRows = salesReportRows.filter(r => r.id !== id);
  if (salesReportRows.length < initialLen) {
    res.json({ success: true, message: 'Sales Report row deleted successfully' });
  } else {
    res.status(404).json({ success: false, message: 'Row not found' });
  }
});

// 5.6. Employee Management Endpoints
interface Employee {
  id: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  department: string;
  joiningDate: string;
  status: 'Active' | 'Inactive';
}

let employees: Employee[] = [
  { id: '1', name: 'Admin Employee', designation: 'ERP Administrator', email: 'admin@welcaretrip.com', phone: '+8801711111111', department: 'Administration', joiningDate: '2025-01-01', status: 'Active' },
  { id: '2', name: 'Sales Exec', designation: 'Senior Sales Executive', email: 'sales@welcaretrip.com', phone: '+8801722222222', department: 'Sales & Marketing', joiningDate: '2025-03-15', status: 'Active' },
  { id: '3', name: 'Ekramul', designation: 'Travel Consultant', email: 'ekramul@welcaretrip.com', phone: '+8801733333333', department: 'Reservations', joiningDate: '2025-06-01', status: 'Active' },
  { id: '4', name: 'Direct Sales', designation: 'Sales Representative', email: 'direct@welcaretrip.com', phone: '+8801744444444', department: 'Sales', joiningDate: '2026-02-10', status: 'Active' }
];

app.get('/api/employees', (req, res) => {
  res.json({ success: true, data: employees });
});

app.post('/api/employees', (req, res) => {
  try {
    const data = req.body;
    if (!data.name) {
      return res.status(400).json({ success: false, message: 'Employee Name is required' });
    }
    const newEmployee: Employee = {
      id: String(employees.length + 101 + Math.floor(Math.random() * 900)),
      name: data.name,
      designation: data.designation || 'Consultant',
      email: data.email || '',
      phone: data.phone || '',
      department: data.department || 'Sales',
      joiningDate: data.joiningDate || new Date().toISOString().split('T')[0],
      status: data.status || 'Active'
    };
    employees.push(newEmployee);
    res.status(201).json({ success: true, data: newEmployee });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/employees/:id', (req, res) => {
  try {
    const { id } = req.params;
    const index = employees.findIndex(emp => emp.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    const data = req.body;
    employees[index] = {
      ...employees[index],
      name: data.name || employees[index].name,
      designation: data.designation || employees[index].designation,
      email: data.email || employees[index].email,
      phone: data.phone || employees[index].phone,
      department: data.department || employees[index].department,
      joiningDate: data.joiningDate || employees[index].joiningDate,
      status: data.status || employees[index].status
    };
    res.json({ success: true, data: employees[index] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const initialLen = employees.length;
  employees = employees.filter(emp => emp.id !== id);
  if (employees.length < initialLen) {
    res.json({ success: true, message: 'Employee deleted successfully' });
  } else {
    res.status(404).json({ success: false, message: 'Employee not found' });
  }
});

// 6. Gemini AI Helper & Travel Consultant
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, contextType } = req.body;
    const ai = getAi();

    let systemInstruction = `You are a brilliant, elite AI Travel & Medical Tourism ERP assistant for Welcare Trip (welcaretrip.com). You help travel consultants design tour packages, coordinate with global hospital partners (like Mount Elizabeth, Bumrungrad, Apollo, Fortis), book flights and hotel stays, process medical & tourist visas, and manage financials.
    Today is July 10, 2026.
    
    If the agent asks to auto-fill a booking form or create dummy ticket details, you should respond with a friendly message AND output a JSON block inside markdown fence labeled with \`\`\`json containing estimated details to fill the form.
    For example, if they request a tour package or medical travel invoice:
    {
      "ticketNo": "124-938405829",
      "airline": "Singapore Airlines",
      "paxName": "Haji Mohammad Selim",
      "pnr": "SQXYZ9",
      "route": "DAC-SIN-DAC",
      "journeyDate": "2026-08-01",
      "returnDate": "2026-08-07",
      "class": "Business",
      "grossFare": 12000,
      "baseFare": 10500,
      "tax": 1500,
      "commissionPct": 7,
      "purchasePrice": 25000,
      "clientPrice": 29000,
      "profit": 4000,
      "medicalInfo": {
        "hospitalName": "Mount Elizabeth Hospital",
        "doctorName": "Dr. Tan Seng Kiat (Cardiology)",
        "appointmentDate": "2026-08-03T10:00:00.000Z",
        "treatmentCategory": "Cardiology",
        "companionName": "Mrs. Selim Begum",
        "ambulanceRequired": true,
        "treatmentCost": 12000,
        "salePrice": 14500,
        "costPrice": 12500,
        "profit": 2000
      }
    }`;

    if (contextType === 'autoFill') {
      systemInstruction += `\nCRITICAL: The user wants to auto-fill a form. You MUST return a JSON block that fits this model. Ensure values are realistic travel agency entries.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: systemInstruction
      }
    });

    res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

async function startServer() {
  // Vite middleware for dev or static server for production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    // SPA fallback
    app.get('*', (req, res, next) => {
      // Avoid intercepting API routes
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Start Server
  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Travel ERP Backend] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();

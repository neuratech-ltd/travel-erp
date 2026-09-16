import { prisma } from "../../lib/prisma.js";
import { InvoiceStatus, InvoiceType } from "@prisma/client";
import { generateInvoiceNo } from "./invoice-number.js";
import { assertValidPnr, assertPnrsUnique } from "./invoice.validators.js";

type DateLike = string | Date | null | undefined;
type NumericLike = string | number | null | undefined;

interface InvoiceContactInput {
  id?: string;
  name?: string;
  email?: string;
}

// ---------------------------------------------------------------
// SHARED BASE INPUTS
// ---------------------------------------------------------------
interface BaseInvoiceInputs {
  clientId?: string;
  client?: InvoiceContactInput | string;
  clientName?: string;
  clientEmail?: string;
  referenceId?: string;
  reference?: InvoiceContactInput | string;
  referenceEmail?: string;
  issueDate: DateLike;
  status?: InvoiceStatus | "PAID" | "UNPAID" | "PARTIAL";
}

// ---------------------------------------------------------------
// PASSENGER INPUT (shared shape for Air Ticket / Non-Commission / Reissue)
// ---------------------------------------------------------------
interface PassengerInput {
  paxName: string;
  paxType?: string;
  passportNo?: string;
  contactNo?: string;
  email?: string;
  dob?: DateLike;
  passportIssueDate?: DateLike;
  passportExpiryDate?: DateLike;

  ticketNo?: string;
  pnr: string;
  route?: string;
  class?: string;
  segment?: string;
  journeyDate?: DateLike;
  returnDate?: DateLike;
  ticketingRemarks?: string;

  baseFare: NumericLike;
  taxesCommission?: NumericLike;
  aitTax?: NumericLike;
  commissionPct?: NumericLike;
  clientPrice: NumericLike;
  discount?: NumericLike;
  extraFee?: NumericLike;
}

interface AirTicketInputs extends BaseInvoiceInputs {
  airline: string;
  passengers: PassengerInput[];
}

interface NonCommissionInputs extends BaseInvoiceInputs {
  airline?: string;
  passengers: PassengerInput[];
}

interface ReissueInputs extends BaseInvoiceInputs {
  airline?: string;
  passengers: PassengerInput[];
  penalties?: NumericLike;
  fareDifference?: NumericLike;
  taxDifference?: NumericLike;
}

interface HotelVisaInputs extends BaseInvoiceInputs {
  bookingType: "Hotel" | "Visa";
  hotelName?: string;
  roomType?: string;
  nights?: NumericLike;
  hotelCost?: NumericLike;
  hotelSale?: NumericLike;
  visaCountry?: string;
  visaNo?: string;
  visaCost?: NumericLike;
  visaSale?: NumericLike;
  route?: string;
  paxName?: string;
  clientPrice?: NumericLike;
  purchasePrice?: NumericLike;
  profit?: NumericLike;
  extraFee?: NumericLike;
  discount?: NumericLike;
}

interface TourPackageInputs extends BaseInvoiceInputs {
  passportInfo?: {
    passportNo?: string;
    paxName?: string;
    paxType?: string;
    nationalId?: string;
    contactNo?: string;
    email?: string;
    dob?: DateLike;
    dateOfIssue?: DateLike;
    dateOfExpiry?: DateLike;
  };
  ticketInfo?: {
    ticketNo?: string;
    pnr?: string;
    route?: string;
    journeyDate?: DateLike;
    returnDate?: DateLike;
    airline?: string;
    salePrice?: NumericLike;
    costPrice?: NumericLike;
    profit?: NumericLike;
    vendor?: string;
  };
  accommodation?: {
    hotelName?: string;
    hotelLocation?: string;
    roomType?: string;
    checkIn?: DateLike;
    checkOut?: DateLike;
    nights?: NumericLike;
    salePrice?: NumericLike;
    costPrice?: NumericLike;
    profit?: NumericLike;
    vendor?: string;
  };
  transport?: {
    transportType?: string;
    referenceNo?: string;
    description?: string;
    fromDate?: DateLike;
    toDate?: DateLike;
    pickupTime?: string;
    dropoffTime?: string;
    salePrice?: NumericLike;
    costPrice?: NumericLike;
    profit?: NumericLike;
    vendor?: string;
  };
  visaInfo?: {
    visaCategory?: string;
    country?: string;
    visaType?: string;
    visaDeliveryDate?: DateLike;
    visaNo?: string;
    salePrice?: NumericLike;
    costPrice?: NumericLike;
    profit?: NumericLike;
  };
  medicalInfo?: {
    hospitalName?: string;
    doctorName?: string;
    appointmentDate?: DateLike;
    treatmentCategory?: string;
    companionName?: string;
    ambulanceRequired?: boolean;
    treatmentCost?: NumericLike;
    salePrice?: NumericLike;
    costPrice?: NumericLike;
    profit?: NumericLike;
  };
  billing?: {
    unitPrice?: NumericLike;
    costPrice?: NumericLike;
    billingQty?: NumericLike;
    discount?: NumericLike;
    extraFee?: NumericLike;
    totalCost?: NumericLike;
    totalProfit?: NumericLike;
    subTotal?: NumericLike;
    netTotal?: NumericLike;
    agentCommission?: NumericLike;
  };
}

// ---------------------------------------------------------------
// PRIMITIVE HELPERS
// ---------------------------------------------------------------
const toNumber = (value: NumericLike, fallback = 0) => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toDate = (value: DateLike) => {
  if (!value) {
    return undefined;
  }

  const dateValue = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(dateValue.getTime())) {
    throw new Error(`Invalid date value: ${String(value)}`);
  }

  return dateValue;
};

const toStatus = (status?: BaseInvoiceInputs["status"]) => {
  if (!status) {
    return InvoiceStatus.UNPAID;
  }

  if (status === "PAID") return InvoiceStatus.PAID;
  if (status === "UNPAID") return InvoiceStatus.UNPAID;
  if (status === "PARTIAL") return InvoiceStatus.PARTIAL;

  return status;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "record";

const normalizeContactInput = (
  value?: InvoiceContactInput | string,
  email?: string,
) => {
  if (!value) {
    return undefined;
  }

  if (typeof value === "string") {
    return { name: value, email };
  }

  return value;
};

// ---------------------------------------------------------------
// RESOLVE / CREATE REFERENCE DATA (Agent removed entirely)
// ---------------------------------------------------------------
const resolveOrCreateClient = async (client?: InvoiceContactInput) => {
  if (client?.id) {
    return client.id;
  }

  if (!client?.name) {
    throw new Error("Client name or client id is required");
  }

  const existingClient = await prisma.client.findFirst({
    where: { name: client.name },
  });

  if (existingClient) {
    return existingClient.id;
  }

  const createdClient = await prisma.client.create({
    data: {
      name: client.name,
      email:
        client.email ??
        `${slugify(client.name)}-${Date.now()}@travel-erp.local`,
    },
  });

  return createdClient.id;
};

const resolveOrCreateEmployee = async (employee?: InvoiceContactInput) => {
  if (employee?.id) {
    return employee.id;
  }

  if (!employee?.name) {
    throw new Error("Reference employee name or id is required");
  }

  const existingEmployee = await prisma.employee.findFirst({
    where: { name: employee.name },
  });

  if (existingEmployee) {
    return existingEmployee.id;
  }

  const createdEmployee = await prisma.employee.create({
    data: {
      name: employee.name,
      email:
        employee.email ??
        `${slugify(employee.name)}-${Date.now()}@travel-erp.local`,
    },
  });

  return createdEmployee.id;
};

const resolveOrCreateVendor = async (vendorName?: string) => {
  if (!vendorName) {
    return undefined;
  }

  const existingVendor = await prisma.vendor.findFirst({
    where: { name: vendorName },
  });

  if (existingVendor) {
    return existingVendor.id;
  }

  const createdVendor = await prisma.vendor.create({
    data: {
      name: vendorName,
      email: `${slugify(vendorName)}-${Date.now()}@travel-erp.local`,
    },
  });

  return createdVendor.id;
};

// ---------------------------------------------------------------
// CORE INVOICE DATA (invoiceNo auto-generated, no dueDate, issueDate)
// ---------------------------------------------------------------
const buildCoreInvoiceData = async (
  data: BaseInvoiceInputs,
  invoiceType: InvoiceType,
) => {
  const clientRef = normalizeContactInput(
    data.client ?? data.clientName,
    data.clientEmail,
  );
  const referenceRef = normalizeContactInput(
    data.reference,
    data.referenceEmail,
  );

  const clientId = data.clientId ?? (await resolveOrCreateClient(clientRef));
  const referenceId =
    data.referenceId ?? (await resolveOrCreateEmployee(referenceRef));

  const invoiceNo = await generateInvoiceNo(invoiceType);

  return {
    invoiceNo,
    type: invoiceType,
    status: toStatus(data.status),
    issueDate: toDate(data.issueDate) ?? new Date(),
    clientId,
    referenceId,
  };
};

// ---------------------------------------------------------------
// PASSENGER RECORD BUILDER + ROLLUPS
// ---------------------------------------------------------------
const buildPassengerRecord = (p: PassengerInput) => {
  assertValidPnr(p.pnr);

  const baseFare = toNumber(p.baseFare);
  const taxesCommission = toNumber(p.taxesCommission);
  const aitTax = toNumber(p.aitTax);
  const commissionPct = toNumber(p.commissionPct);
  const clientPrice = toNumber(p.clientPrice);
  const discount = toNumber(p.discount);
  const extraFee = toNumber(p.extraFee);

  const calculatedCommission = Number(
    ((baseFare * commissionPct) / 100).toFixed(2),
  );
  const purchaseCost = Number(
    (baseFare + taxesCommission + aitTax - calculatedCommission).toFixed(2),
  );
  const netCommission = Number((calculatedCommission - extraFee).toFixed(2));
  const profit = Number(
    (clientPrice - purchaseCost - discount + extraFee).toFixed(2),
  );

  return {
    paxName: p.paxName,
    paxType: p.paxType,
    passportNo: p.passportNo,
    contactNo: p.contactNo,
    email: p.email,
    dob: toDate(p.dob),
    passportIssueDate: toDate(p.passportIssueDate),
    passportExpiryDate: toDate(p.passportExpiryDate),
    ticketNo: p.ticketNo,
    pnr: p.pnr,
    route: p.route,
    class: p.class,
    segment: p.segment,
    journeyDate: toDate(p.journeyDate),
    returnDate: toDate(p.returnDate),
    ticketingRemarks: p.ticketingRemarks,
    baseFare,
    taxesCommission,
    aitTax,
    commissionPct,
    calculatedCommission,
    purchaseCost,
    netCommission,
    clientPrice,
    discount,
    extraFee,
    profit,
  };
};

type PassengerRecord = ReturnType<typeof buildPassengerRecord>;

const sumPassengerRollups = (passengers: PassengerRecord[]) =>
  passengers.reduce(
    (acc, p) => ({
      totalBaseFare: acc.totalBaseFare + (p.baseFare ?? 0),
      totalTaxesCommission: acc.totalTaxesCommission + (p.taxesCommission ?? 0),
      totalAitTax: acc.totalAitTax + (p.aitTax ?? 0),
      totalCommission: acc.totalCommission + (p.calculatedCommission ?? 0),
      totalPurchaseCost: acc.totalPurchaseCost + (p.purchaseCost ?? 0),
      totalClientPrice: acc.totalClientPrice + (p.clientPrice ?? 0),
      totalDiscount: acc.totalDiscount + (p.discount ?? 0),
      totalExtraFee: acc.totalExtraFee + (p.extraFee ?? 0),
      totalProfit: acc.totalProfit + (p.profit ?? 0),
    }),
    {
      totalBaseFare: 0,
      totalTaxesCommission: 0,
      totalAitTax: 0,
      totalCommission: 0,
      totalPurchaseCost: 0,
      totalClientPrice: 0,
      totalDiscount: 0,
      totalExtraFee: 0,
      totalProfit: 0,
    },
  );

// ---------------------------------------------------------------
// CREATE: AIR TICKET
// ---------------------------------------------------------------
export async function createAirTicketInvoice(data: AirTicketInputs) {
  if (!data.passengers?.length) {
    throw new Error("At least one passenger is required");
  }

  const vendorId = await resolveOrCreateVendor(data.airline);
  const baseData = await buildCoreInvoiceData(data, InvoiceType.AIR_TICKET);

  await assertPnrsUnique(data.passengers.map((p) => p.pnr));
  const passengers = data.passengers.map(buildPassengerRecord);
  const totals = sumPassengerRollups(passengers);

  return prisma.invoice.create({
    data: {
      ...baseData,
      vendorId,
      airline: data.airline,
      passengers,
      ...totals,
    },
  });
}

// ---------------------------------------------------------------
// CREATE: NON-COMMISSION
// ---------------------------------------------------------------
export async function createNonCommissionInvoice(data: NonCommissionInputs) {
  if (!data.passengers?.length) {
    throw new Error("At least one passenger is required");
  }

  const vendorId = data.airline
    ? await resolveOrCreateVendor(data.airline)
    : undefined;
  const baseData = await buildCoreInvoiceData(data, InvoiceType.NON_COMMISSION);

  await assertPnrsUnique(data.passengers.map((p) => p.pnr));
  const passengers = data.passengers.map(buildPassengerRecord);
  const totals = sumPassengerRollups(passengers);

  return prisma.invoice.create({
    data: {
      ...baseData,
      vendorId,
      airline: data.airline,
      passengers,
      ...totals,
    },
  });
}

// ---------------------------------------------------------------
// CREATE: REISSUE
// ---------------------------------------------------------------
export async function createReissueInvoice(data: ReissueInputs) {
  if (!data.passengers?.length) {
    throw new Error("At least one passenger is required");
  }

  const vendorId = data.airline
    ? await resolveOrCreateVendor(data.airline)
    : undefined;
  const baseData = await buildCoreInvoiceData(data, InvoiceType.REISSUE);

  await assertPnrsUnique(data.passengers.map((p) => p.pnr));
  const passengers = data.passengers.map(buildPassengerRecord);
  const totals = sumPassengerRollups(passengers);

  return prisma.invoice.create({
    data: {
      ...baseData,
      vendorId,
      airline: data.airline,
      passengers,
      ...totals,
    },
  });
}

// ---------------------------------------------------------------
// CREATE: HOTEL / VISA (unchanged shape, renames applied)
// ---------------------------------------------------------------
export async function createHotelVisaInvoice(data: HotelVisaInputs) {
  const baseData = await buildCoreInvoiceData(
    data,
    data.bookingType === "Hotel" ? InvoiceType.HOTEL : InvoiceType.VISA,
  );

  const purchasePriceValue = toNumber(
    data.purchasePrice ??
      (data.bookingType === "Hotel"
        ? toNumber(data.hotelCost) * Math.max(1, toNumber(data.nights, 1))
        : toNumber(data.visaCost)),
  );

  const clientPriceValue = toNumber(
    data.clientPrice ??
      (data.bookingType === "Hotel"
        ? toNumber(data.hotelSale) * Math.max(1, toNumber(data.nights, 1))
        : toNumber(data.visaSale)),
  );

  const profitValue = toNumber(
    data.profit ??
      clientPriceValue -
        purchasePriceValue +
        toNumber(data.extraFee) -
        toNumber(data.discount),
  );

  return prisma.invoice.create({
    data: {
      ...baseData,
      passengers: data.paxName
        ? [
            {
              paxName: data.paxName,
              clientPrice: clientPriceValue,
              purchaseCost: purchasePriceValue,
              profit: profitValue,
              extraFee: toNumber(data.extraFee),
              discount: toNumber(data.discount),
              pnr: undefined,
              route:
                data.bookingType === "Hotel"
                  ? data.hotelName
                  : (data.route ??
                    (data.visaCountry
                      ? `Visa: ${data.visaCountry}`
                      : undefined)),
              segment:
                data.bookingType === "Hotel" ? data.roomType : data.visaNo,
            },
          ]
        : undefined,
      totalPurchaseCost: purchasePriceValue,
      totalClientPrice: clientPriceValue,
      totalProfit: profitValue,
      totalExtraFee: toNumber(data.extraFee),
      totalDiscount: toNumber(data.discount),
    },
  });
}

// ---------------------------------------------------------------
// CREATE: TOUR PACKAGE (unchanged embedded structure, renames applied)
// ---------------------------------------------------------------
export async function createTourPackageInvoice(data: TourPackageInputs) {
  const baseData = await buildCoreInvoiceData(data, InvoiceType.TOUR_PACKAGE);

  const passportInfo = data.passportInfo
    ? {
        passportNo: data.passportInfo.passportNo,
        paxName: data.passportInfo.paxName,
        paxType: data.passportInfo.paxType,
        nationalId: data.passportInfo.nationalId,
        contactNo: data.passportInfo.contactNo,
        email: data.passportInfo.email,
        dob: toDate(data.passportInfo.dob),
        dateOfIssue: toDate(data.passportInfo.dateOfIssue),
        dateOfExpiry: toDate(data.passportInfo.dateOfExpiry),
      }
    : undefined;

  const ticketInfo = data.ticketInfo
    ? {
        ticketNo: data.ticketInfo.ticketNo,
        pnr: data.ticketInfo.pnr,
        route: data.ticketInfo.route,
        journeyDate: toDate(data.ticketInfo.journeyDate),
        returnDate: toDate(data.ticketInfo.returnDate),
        airline: data.ticketInfo.airline,
        salePrice: toNumber(data.ticketInfo.salePrice),
        costPrice: toNumber(data.ticketInfo.costPrice),
        profit: toNumber(data.ticketInfo.profit),
        vendor: data.ticketInfo.vendor,
      }
    : undefined;

  const accommodation = data.accommodation
    ? {
        hotelName: data.accommodation.hotelName,
        hotelLocation: data.accommodation.hotelLocation,
        roomType: data.accommodation.roomType,
        checkIn: toDate(data.accommodation.checkIn),
        checkOut: toDate(data.accommodation.checkOut),
        nights:
          data.accommodation.nights === undefined
            ? undefined
            : toNumber(data.accommodation.nights),
        salePrice: toNumber(data.accommodation.salePrice),
        costPrice: toNumber(data.accommodation.costPrice),
        profit: toNumber(data.accommodation.profit),
        vendor: data.accommodation.vendor,
      }
    : undefined;

  const transport = data.transport
    ? {
        transportType: data.transport.transportType,
        referenceNo: data.transport.referenceNo,
        description: data.transport.description,
        fromDate: toDate(data.transport.fromDate),
        toDate: toDate(data.transport.toDate),
        pickupTime: data.transport.pickupTime,
        dropoffTime: data.transport.dropoffTime,
        salePrice: toNumber(data.transport.salePrice),
        costPrice: toNumber(data.transport.costPrice),
        profit: toNumber(data.transport.profit),
        vendor: data.transport.vendor,
      }
    : undefined;

  const visaInfo = data.visaInfo
    ? {
        visaCategory: data.visaInfo.visaCategory,
        country: data.visaInfo.country,
        visaType: data.visaInfo.visaType,
        visaDeliveryDate: toDate(data.visaInfo.visaDeliveryDate),
        visaNo: data.visaInfo.visaNo,
        salePrice: toNumber(data.visaInfo.salePrice),
        costPrice: toNumber(data.visaInfo.costPrice),
        profit: toNumber(data.visaInfo.profit),
      }
    : undefined;

  const medicalInfo = data.medicalInfo
    ? {
        hospitalName: data.medicalInfo.hospitalName,
        doctorName: data.medicalInfo.doctorName,
        appointmentDate: toDate(data.medicalInfo.appointmentDate),
        treatmentCategory: data.medicalInfo.treatmentCategory,
        companionName: data.medicalInfo.companionName,
        ambulanceRequired: data.medicalInfo.ambulanceRequired,
        treatmentCost: toNumber(data.medicalInfo.treatmentCost),
        salePrice: toNumber(data.medicalInfo.salePrice),
        costPrice: toNumber(data.medicalInfo.costPrice),
        profit: toNumber(data.medicalInfo.profit),
      }
    : undefined;

  const billing = data.billing
    ? {
        unitPrice: toNumber(data.billing.unitPrice),
        costPrice: toNumber(data.billing.costPrice),
        billingQty:
          data.billing.billingQty === undefined
            ? undefined
            : Math.trunc(toNumber(data.billing.billingQty, 1)),
        discount: toNumber(data.billing.discount),
        extraFee: toNumber(data.billing.extraFee),
        totalCost: toNumber(data.billing.totalCost),
        totalProfit: toNumber(data.billing.totalProfit),
        subTotal: toNumber(data.billing.subTotal),
        netTotal: toNumber(data.billing.netTotal),
        agentCommission: toNumber(data.billing.agentCommission),
      }
    : undefined;

  const purchasePrice = billing?.totalCost ?? billing?.costPrice;
  const clientPrice = billing?.netTotal ?? billing?.subTotal;
  const profit =
    billing?.totalProfit ??
    (clientPrice !== undefined && purchasePrice !== undefined
      ? clientPrice - purchasePrice
      : undefined);

  return prisma.invoice.create({
    data: {
      ...baseData,
      airline: ticketInfo?.airline,
      passportInfo,
      ticketInfo,
      accommodation,
      transport,
      visaInfo,
      medicalInfo,
      billing,
      totalPurchaseCost:
        purchasePrice === undefined ? 0 : toNumber(purchasePrice),
      totalClientPrice: clientPrice === undefined ? 0 : toNumber(clientPrice),
      totalProfit: profit === undefined ? 0 : toNumber(profit),
      totalDiscount: billing?.discount ?? 0,
      totalExtraFee: billing?.extraFee ?? 0,
    },
  });
}

// ---------------------------------------------------------------
// READ
// ---------------------------------------------------------------
export const getAllInvoices = async () => {
  return prisma.invoice.findMany({
    include: {
      client: true,
      reference: true,
      vendor: true,
      payments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

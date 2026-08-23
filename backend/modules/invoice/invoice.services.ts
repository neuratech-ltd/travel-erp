import { prisma } from "../../lib/prisma.js";
import { InvoiceStatus, InvoiceType } from "@prisma/client";

type DateLike = string | Date | null | undefined;
type NumericLike = string | number | null | undefined;

interface InvoiceContactInput {
  id?: string;
  name?: string;
  email?: string;
}

interface BaseInvoiceInputs {
  clientId?: string;
  client?: InvoiceContactInput | string;
  clientName?: string;
  clientEmail?: string;
  employeeId?: string;
  employee?: InvoiceContactInput | string;
  salesBy?: InvoiceContactInput | string;
  salesByEmail?: string;
  agentId?: string;
  agent?: InvoiceContactInput | string;
  agentEmail?: string;
  invoiceNumber: string;
  salesDate: DateLike;
  dueDate?: DateLike;
  status?: InvoiceStatus | "PAID" | "UNPAID" | "PARTIAL";
}

interface AirTicketInputs extends BaseInvoiceInputs {
  ticketNumber: string;
  baseFare: NumericLike;
  taxesCommission: NumericLike;
  clientPrice: NumericLike;
  commission: NumericLike;
  calculatedCommission: NumericLike;
  purchaseCost: NumericLike;
  netCommission: NumericLike;
  discount: NumericLike;
  serviceCharge: NumericLike;
  calculatedProfit: NumericLike;
  airline: string;
  route: string;
  pnr: string;
  class: string;
  passengerName: string;
  passengerType: string;
  passportNumber: string;
  contactNumber: string;
  passengerEmail: string;
  dateOfBirth: DateLike;
  passportIssueDate: DateLike;
  passportExpiryDate: DateLike;
  journeyDate: DateLike;
  returnDate: DateLike;
  travelSegmnets: string;
  ticketingRemarks: string;
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

interface NonCommissionInputs extends BaseInvoiceInputs {
  ticketNumber: string;
  grossFare: NumericLike;
  purchasePrice: NumericLike;
  clientPrice: NumericLike;
  extraFee?: NumericLike;
  discount?: NumericLike;
  paxName?: string;
  route?: string;
  pnr?: string;
  airline?: string;
  journeyDate?: DateLike;
  returnDate?: DateLike;
  passportNo?: string;
  contactNo?: string;
  email?: string;
}

interface ReissueInputs extends BaseInvoiceInputs {
  ticketNumber: string;
  penalties: NumericLike;
  fareDifference: NumericLike;
  taxDifference: NumericLike;
  extraFee?: NumericLike;
  discount?: NumericLike;
  airline?: string;
  route?: string;
  pnr?: string;
  paxName?: string;
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

  if (status === "PAID") {
    return InvoiceStatus.PAID;
  }

  if (status === "UNPAID") {
    return InvoiceStatus.UNPAID;
  }

  if (status === "PARTIAL") {
    return InvoiceStatus.PARTIAL;
  }

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

const resolveOrCreateClient = async (client?: InvoiceContactInput) => {
  if (client?.id) {
    return client.id;
  }

  if (!client?.name) {
    throw new Error("Client name or client id is required");
  }

  const existingClient = await prisma.client.findFirst({
    where: {
      name: client.name,
    },
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
    throw new Error("Sales by employee name or employee id is required");
  }

  const existingEmployee = await prisma.employee.findFirst({
    where: {
      name: employee.name,
    },
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

const resolveOrCreateAgent = async (agent?: InvoiceContactInput) => {
  if (!agent?.id && !agent?.name) {
    return undefined;
  }

  if (agent.id) {
    return agent.id;
  }

  const existingAgent = await prisma.agent.findFirst({
    where: {
      name: agent.name,
    },
  });

  if (existingAgent) {
    return existingAgent.id;
  }

  const createdAgent = await prisma.agent.create({
    data: {
      name: agent.name as string,
      email:
        agent.email ??
        `${slugify(agent.name as string)}-${Date.now()}@travel-erp.local`,
    },
  });

  return createdAgent.id;
};

const resolveOrCreateVendor = async (vendorName?: string) => {
  if (!vendorName) {
    return undefined;
  }

  const existingVendor = await prisma.vendor.findFirst({
    where: {
      name: vendorName,
    },
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

const buildCoreInvoiceData = async (
  data: BaseInvoiceInputs,
  invoiceType: InvoiceType,
) => {
  const clientRef = normalizeContactInput(
    data.client ?? data.clientName,
    data.clientEmail,
  );
  const employeeRef = normalizeContactInput(
    data.employee ?? data.salesBy,
    data.salesByEmail,
  );
  const agentRef = normalizeContactInput(data.agent, data.agentEmail);

  const clientId = data.clientId ?? (await resolveOrCreateClient(clientRef));
  const employeeId =
    data.employeeId ?? (await resolveOrCreateEmployee(employeeRef));
  const agentId = data.agentId ?? (await resolveOrCreateAgent(agentRef));

  return {
    invoiceNo: data.invoiceNumber.trim(),
    type: invoiceType,
    status: toStatus(data.status),
    salesDate: toDate(data.salesDate) ?? new Date(),
    dueDate: toDate(data.dueDate),
    clientId,
    employeeId,
    agentId,
  };
};

export async function createAirTicketInvoice(data: AirTicketInputs) {
  const vendorId = await resolveOrCreateVendor(data.airline);
  const baseData = await buildCoreInvoiceData(data, InvoiceType.AIR_TICKET);
  const grossFare = toNumber(data.clientPrice);
  const baseFare = toNumber(data.baseFare);
  const commissionPct = toNumber(data.commission);
  const commissionAmount = toNumber(data.calculatedCommission);
  const tax = toNumber(data.taxesCommission);
  const purchasePrice = toNumber(data.purchaseCost);
  const clientPrice = toNumber(data.clientPrice);
  const netCommission = toNumber(data.netCommission);
  const profit = toNumber(data.calculatedProfit);
  const discount = toNumber(data.discount);
  const extraFee = toNumber(data.serviceCharge);

  return prisma.invoice.create({
    data: {
      ...baseData,
      vendorId,
      ticketNo: data.ticketNumber,
      paxName: data.passengerName,
      paxType: data.passengerType,
      passportNo: data.passportNumber,
      contactNo: data.contactNumber,
      email: data.passengerEmail,
      airline: data.airline,
      route: data.route,
      pnr: data.pnr,
      class: data.class,
      journeyDate: toDate(data.journeyDate),
      returnDate: toDate(data.returnDate),
      segment: data.travelSegmnets,
      grossFare,
      baseFare,
      commissionPct,
      commission: commissionAmount,
      tax,
      purchasePrice,
      clientPrice,
      netCommission,
      profit,
      discount,
      extraFee,
    },
  });
}

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
      paxName: data.paxName,
      route:
        data.bookingType === "Hotel"
          ? data.hotelName
          : (data.route ??
            (data.visaCountry ? `Visa: ${data.visaCountry}` : undefined)),
      purchasePrice: purchasePriceValue,
      clientPrice: clientPriceValue,
      profit: profitValue,
      extraFee: toNumber(data.extraFee),
      discount: toNumber(data.discount),
      // Preserve useful booking details in the free-text fields.
      segment: data.bookingType === "Hotel" ? data.roomType : data.visaNo,
      ticketNo: data.bookingType === "Visa" ? data.visaNo : undefined,
      grossFare: clientPriceValue,
      baseFare: purchasePriceValue,
    },
  });
}

export async function createNonCommissionInvoice(data: NonCommissionInputs) {
  const vendorId = data.airline
    ? await resolveOrCreateVendor(data.airline)
    : undefined;
  const baseData = await buildCoreInvoiceData(data, InvoiceType.NON_COMMISSION);
  const profit =
    toNumber(data.clientPrice) -
    toNumber(data.purchasePrice) +
    toNumber(data.extraFee) -
    toNumber(data.discount);

  return prisma.invoice.create({
    data: {
      ...baseData,
      vendorId,
      ticketNo: data.ticketNumber,
      paxName: data.paxName,
      passportNo: data.passportNo,
      contactNo: data.contactNo,
      email: data.email,
      airline: data.airline,
      route: data.route,
      pnr: data.pnr,
      journeyDate: toDate(data.journeyDate),
      returnDate: toDate(data.returnDate),
      grossFare: toNumber(data.grossFare),
      purchasePrice: toNumber(data.purchasePrice),
      clientPrice: toNumber(data.clientPrice),
      profit: toNumber(profit),
      extraFee: toNumber(data.extraFee),
      discount: toNumber(data.discount),
    },
  });
}

export async function createReissueInvoice(data: ReissueInputs) {
  const vendorId = data.airline
    ? await resolveOrCreateVendor(data.airline)
    : undefined;
  const baseData = await buildCoreInvoiceData(data, InvoiceType.REISSUE);
  const purchasePrice =
    toNumber(data.penalties) +
    toNumber(data.fareDifference) +
    toNumber(data.taxDifference);
  const clientPrice =
    purchasePrice + toNumber(data.extraFee) - toNumber(data.discount);
  const profit = clientPrice - purchasePrice;

  return prisma.invoice.create({
    data: {
      ...baseData,
      vendorId,
      ticketNo: data.ticketNumber,
      paxName: data.paxName,
      airline: data.airline,
      route: data.route,
      pnr: data.pnr,
      purchasePrice,
      clientPrice,
      profit,
      extraFee: toNumber(data.extraFee),
      discount: toNumber(data.discount),
    },
  });
}

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

  const ticketNo = data.ticketInfo?.ticketNo ?? ticketInfo?.ticketNo;
  const paxName = data.passportInfo?.paxName ?? passportInfo?.paxName;
  const route = data.ticketInfo?.route ?? ticketInfo?.route;
  const airline = data.ticketInfo?.airline ?? ticketInfo?.airline;
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
      passportInfo,
      ticketInfo,
      accommodation,
      transport,
      visaInfo,
      medicalInfo,
      billing,
      ticketNo,
      paxName,
      paxType: passportInfo?.paxType,
      passportNo: passportInfo?.passportNo,
      contactNo: passportInfo?.contactNo,
      email: passportInfo?.email,
      route,
      airline,
      journeyDate: ticketInfo?.journeyDate,
      returnDate: ticketInfo?.returnDate,
      purchasePrice:
        purchasePrice === undefined ? undefined : toNumber(purchasePrice),
      clientPrice:
        clientPrice === undefined ? undefined : toNumber(clientPrice),
      profit: profit === undefined ? undefined : toNumber(profit),
      discount: billing?.discount,
      extraFee: billing?.extraFee,
      netCommission: billing?.agentCommission,
    },
  });
}

export const getAllInvoices = async () => {
  return prisma.invoice.findMany({
    include: {
      client: true,
      employee: true,
      agent: true,
      vendor: true,
      payments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

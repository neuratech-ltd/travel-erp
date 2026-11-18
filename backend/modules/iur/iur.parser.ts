import type { IurRecord, ParsedIur } from "./iur.types.js";

// Recognizes record identifiers such as:
// M101, M201, M301, M501, M6ADT, M902
const RECORD_PATTERN = /^(M\d{3}|M\d[A-Z]{3})/;

export function parseIur(content: string): ParsedIur {
  const lines = content.split(/\r\n|\n|\r/);

  const records: IurRecord[] = lines.flatMap((line) => {
    const match = line.match(RECORD_PATTERN);

    if (!match) {
      return [];
    }

    return [
      {
        type: match[1],
        raw: line,
      },
    ];
  });

  const passengerRecord = records.find((record) => record.type === "M101");
  const ticketRecord = records.find((record) => record.type === "M201");
  const fareRecord = records.find((record) => record.type.startsWith("M6"));

  return {
    records,

    passengerRecords: records.filter((record) => record.type === "M101"),

    ticketRecords: records.filter((record) => record.type === "M201"),

    itineraryRecords: records.filter((record) =>
      /^M30[1-9]$/.test(record.type),
    ),

    fareRecords: records.filter((record) => record.type.startsWith("M6")),

    contactRecords: records.filter(
      (record) => record.type === "M902" || record.type === "M903",
    ),
    extracted: {
      invoice: extractInvoiceFields(content, records),
      passenger: {
        name: passengerRecord
          ? passengerRecord.raw.slice("M101".length).trim().replace(/\s{2,}.*/, "")
          : null,
      },
      ticket: extractTicket(ticketRecord, records),
      itinerary: records
        .filter((record) => /^M30[1-9]$/.test(record.type))
        .map(extractItinerary),
      fare: extractFare(fareRecord),
      contacts: records
        .filter((record) => record.type === "M902" || record.type === "M903")
        .map((record) => ({
          type: record.type,
          value: record.raw.slice(record.type.length).trim(),
        })),
      bookingReference: extractBookingReference(records, content),
    },
  };
}

function extractInvoiceFields(content: string, records: IurRecord[]) {
  const itinerary = records
    .filter((record) => /^M30[1-9]$/.test(record.type))
    .map(extractItinerary);
  const firstItinerary = itinerary[0];
  const ticket = extractTicket(records.find((record) => record.type === "M201"), records);
  const fare = extractFare(records.find((record) => record.type.startsWith("M6")));
  const passengerName = extractPassengerName(records);
  const contact = extractContact(records);
  const passport = extractPassport(records);
  const email = extractEmail(records);
  const pnr = extractBookingReference(records, content);
  const route = itinerary.length
    ? itinerary
        .map((item) => `${item.origin ?? ""}-${item.destination ?? ""}`)
        .join(" / ")
        .replace(/^-|-$/g, "")
    : null;

  return {
    ticketNo: ticket.number,
    pnr,
    route: route || extractLabeledValue(content, ["route", "sector"]),
    class: firstItinerary?.bookingClass ?? null,
    baseFare: ticket.baseAmount ?? fare.total,
    taxesCommission: extractTicketTaxes(records.find((record) => record.type === "M201")),
    aitTax: extractLabeledNumber(content, ["ait tax"]),
    clientPrice: extractLabeledNumber(content, ["client price", "total client price"]),
    commission: extractLabeledNumber(content, ["commission"]),
    calculatedCommission: extractLabeledNumber(content, ["calculated commission"]),
    purchaseCost: extractLabeledNumber(content, ["purchase cost"]),
    netCommission: extractLabeledNumber(content, ["net commission"]),
    discount: extractLabeledNumber(content, ["discount given", "discount"]),
    extraFee: extractLabeledNumber(content, ["extra fee", "service charge"]),
    profit: extractLabeledNumber(content, ["profit"]),
    passengerName,
    passengerType: records.find((record) => /^M6[A-Z]{3}$/.test(record.type))?.type.slice(2) ?? null,
    passportNo: passport?.number ?? extractLabeledValue(content, ["passport no", "passport number"]),
    contactNo: contact ?? extractLabeledValue(content, ["contact no", "contact", "mobile"]),
    passengerEmail: email ?? extractLabeledValue(content, ["passenger email", "email"]),
    dateOfBirth: passport?.dateOfBirth ?? extractLabeledValue(content, ["date of birth", "dob"]),
    passportIssueDate: passport?.issueDate ?? extractLabeledValue(content, ["passport issue date"]),
    passportExpiryDate: passport?.expiryDate ?? extractLabeledValue(content, ["passport expiry date"]),
    journeyDate: firstItinerary?.date ?? extractLabeledValue(content, ["journey date"]),
    returnDate: extractLabeledValue(content, ["return date"]),
    travelSegment: route,
    ticketingRemarks: extractLabeledValue(content, ["ticketing remarks", "remarks"]),
  };
}

function extractContact(records: IurRecord[]) {
  const record = records.find((item) => /CTCM/.test(item.raw));
  return record?.raw.match(/CTCM\s+\w+\s+HK1\/([^/\s]+)/)?.[1] ?? null;
}

function extractEmail(records: IurRecord[]) {
  const record = records.find((item) => /CTCE/.test(item.raw));
  const value = record?.raw.match(/CTCE\s+\w+\s+HK1\/([^\s]+)/)?.[1];
  return value?.replace(/\/{2,}/g, "@").replace(/\//g, "@") ?? null;
}

function extractPassport(records: IurRecord[]) {
  const record = records.find((item) => /DOCS/.test(item.raw));
  const match = record?.raw.match(
    /DOCS\s+\w+\s+HK1\/P\/\w+\/([^/]+)\/\w+\/(\d{2}[A-Z]{3}\d{2}|\d{2}[A-Z]{3}\d{4}|\d{2}[A-Z]{2}\d{4})\/[MF]\//,
  );

  if (!match) {
    return null;
  }

  const dateParts = record?.raw.match(/\/(\d{2}[A-Z]{3}\d{2,4})\/[MF]\//);
  const expiryParts = record?.raw.match(/\/[MF]\/([^/]+)\//);

  return {
    number: match[1],
    dateOfBirth: match[2],
    issueDate: null,
    expiryDate: expiryParts?.[1] ?? null,
  };
}

function extractTicketTaxes(record: IurRecord | undefined) {
  if (!record) {
    return null;
  }

  const ticketAmount = record.raw.match(/\b(?:USD|BDT)\s*[\d.]+\s+/);
  const remainder = ticketAmount
    ? record.raw.slice((ticketAmount.index ?? 0) + ticketAmount[0].length)
    : record.raw;
  const taxMatches = remainder
    .split(/\bBDT\b/i, 1)[0]
    .match(/\b\d+(?:\.\d+)?[A-Z]{2,3}\b/g) ?? [];
  const values = taxMatches
    .map((value) => Number(value.match(/^\d+(?:\.\d+)?/)?.[0]))
    .filter((value) => Number.isFinite(value));

  return values.length ? values.reduce((total, value) => total + value, 0) : null;
}

function extractPassengerName(records: IurRecord[]) {
  const record = records.find((item) => item.type === "M101");
  return record
    ? record.raw.slice("M101".length).trim().replace(/\s{2,}.*/, "")
    : null;
}

function extractLabeledValue(content: string, labels: string[]) {
  const labelPattern = labels.map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const match = content.match(new RegExp(`(?:${labelPattern})\\s*(?:No\\.?|#)?\\s*[:=-]\\s*([^\\r\\n]+)`, "i"));
  return match?.[1]?.trim() || null;
}

function extractLabeledNumber(content: string, labels: string[]) {
  const value = extractLabeledValue(content, labels);
  if (!value) {
    return null;
  }

  const match = value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function extractTicket(record: IurRecord | undefined, records: IurRecord[] = []) {
  if (!record) {
    return {
      number: null,
      currency: null,
      baseAmount: null,
      airline: null,
    };
  }

  const ticketMatch =
    records
      .filter((item) => /^M9\d{2}$/.test(item.type))
      .map((item) => item.raw.match(/TKNE[^/]*\/(\d{10,})[A-Z]\d+/)?.[1])
      .find(Boolean) ??
    record.raw.match(/^M201[A-Z]{3}(\d{10,})X?/)?.[1];
  const bdtAmounts = [...record.raw.matchAll(/\bBDT\s+([\d.]+)/g)];
  const amountMatch = bdtAmounts.length
    ? { 1: "BDT", 2: bdtAmounts[bdtAmounts.length - 1][1] }
    : record.raw.match(/\b(USD|BDT)\s+([\d.]+)/);
  const airlineMatch = record.raw.match(/\b([A-Z]{2})\s+N\s+3RSL/);
  const itineraryAirline = records
    .find((item) => /^M30[1-9]$/.test(item.type))
    ?.raw.match(/\b([A-Z]{2})\s+\d+[A-Z]\s+\d{4}\s+\d{4}/)?.[1];

  return {
    number: ticketMatch ?? null,
    currency: amountMatch?.[1] ?? null,
    baseAmount: amountMatch ? Number(amountMatch[2]) : null,
    airline: airlineMatch?.[1] ?? itineraryAirline ?? null,
  };
}

function extractItinerary(record: IurRecord) {
  const value = record.raw;
  const routeMatch = value.match(
    /\s\d[A-Z]{2}(\d{2}[A-Z]{3})AIRN([A-Z]{3})([A-Z ]+?)\s+([A-Z]{3})([A-Z ]+?)\s+([A-Z]{2})\s+(\d+)([A-Z])\s+(\d{4})\s+(\d{4})/,
  );

  return {
    recordType: record.type,
    date: routeMatch?.[1] ?? null,
    origin: routeMatch?.[2]?.trim() ?? value.match(/AIRN([A-Z]{3})/)?.[1] ?? null,
    destination: routeMatch?.[4]?.trim() ?? value.match(/AIRN[A-Z]{3}[A-Z ]+\s+([A-Z]{3})/)?.[1] ?? null,
    airline: routeMatch?.[6] ?? value.match(/\s([A-Z]{2})\s+\d+[A-Z]\s+\d{4}\s+\d{4}/)?.[1] ?? null,
    flightNumber: routeMatch ? `${routeMatch[6]} ${routeMatch[7]}` : null,
    bookingClass: routeMatch?.[8] ?? null,
    departureTime: routeMatch?.[9] ?? null,
    arrivalTime: routeMatch?.[10] ?? null,
  };
}

function extractFare(record: IurRecord | undefined) {
  if (!record) {
    return { currency: null, total: null, raw: null };
  }

  const amountMatch = record.raw.match(/NUC([\d.]+)/);
  return {
    currency: amountMatch ? "NUC" : null,
    total: amountMatch ? Number(amountMatch[1]) : null,
    raw: record.raw,
  };
}

function extractBookingReference(records: IurRecord[], content: string) {
  const headerReference = content
    .split(/\r\n|\n|\r/)
    .map((line) => line.match(/\b([A-Z0-9]{6})\b\s+611111/))
    .find(Boolean)?.[1];

  if (headerReference) {
    return headerReference;
  }

  const record = records.find((item) => item.type === "M501");
  const recordReference = record?.raw.match(/M501\d+\s+[A-Z]{2}#?([A-Z0-9]{6})(?:\/|$)/)?.[1];

  if (recordReference) {
    return recordReference;
  }

  const labeledReference = extractLabeledValue(
    content,
    ["pnr", "booking reference", "booking ref", "record locator"],
  );

  return labeledReference?.match(/\b[A-Z0-9]{6}\b/i)?.[0]?.toUpperCase() ?? null;
}

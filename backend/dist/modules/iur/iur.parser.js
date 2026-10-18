// Recognizes record identifiers such as:
// M101, M201, M301, M501, M6ADT, M902
const RECORD_PATTERN = /^(M\d{3}|M\d[A-Z]{3})/;
export function parseIur(content) {
    const lines = content.split(/\r\n|\n|\r/);
    const records = lines.flatMap((line) => {
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
        itineraryRecords: records.filter((record) => /^M30[1-9]$/.test(record.type)),
        fareRecords: records.filter((record) => record.type.startsWith("M6")),
        contactRecords: records.filter((record) => record.type === "M902" || record.type === "M903"),
        extracted: {
            passenger: {
                name: passengerRecord
                    ? passengerRecord.raw.slice("M101".length).trim().replace(/\s{2,}.*/, "")
                    : null,
            },
            ticket: extractTicket(ticketRecord),
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
            bookingReference: extractBookingReference(records),
        },
    };
}
function extractTicket(record) {
    if (!record) {
        return {
            number: null,
            currency: null,
            baseAmount: null,
            airline: null,
        };
    }
    const ticketMatch = record.raw.match(/^M201[A-Z]{3}(\d{10,})X/);
    const amountMatch = record.raw.match(/\b(USD|BDT)\s+([\d.]+)/);
    const airlineMatch = record.raw.match(/\b([A-Z]{2})\s+N\s+3RSL/);
    return {
        number: ticketMatch?.[1] ?? null,
        currency: amountMatch?.[1] ?? null,
        baseAmount: amountMatch ? Number(amountMatch[2]) : null,
        airline: airlineMatch?.[1] ?? null,
    };
}
function extractItinerary(record) {
    const value = record.raw;
    const routeMatch = value.match(/\s\d[A-Z]{2}(\d{2}[A-Z]{3})AIRN([A-Z]{3})([A-Z ]+?)\s+([A-Z]{3})([A-Z ]+?)\s+([A-Z]{2})\s+(\d+)([A-Z])\s+(\d{4})\s+(\d{4})/);
    return {
        recordType: record.type,
        date: routeMatch?.[1] ?? null,
        origin: routeMatch?.[2]?.trim() ?? null,
        destination: routeMatch?.[4]?.trim() ?? null,
        airline: routeMatch?.[6] ?? null,
        flightNumber: routeMatch ? `${routeMatch[6]} ${routeMatch[7]}` : null,
        bookingClass: routeMatch?.[8] ?? null,
        departureTime: routeMatch?.[9] ?? null,
        arrivalTime: routeMatch?.[10] ?? null,
    };
}
function extractFare(record) {
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
function extractBookingReference(records) {
    const record = records.find((item) => item.type === "M501");
    return record?.raw.match(/M501\d+\s+[A-Z]{2}#?([A-Z0-9]+)/)?.[1] ?? null;
}

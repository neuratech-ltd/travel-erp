// invoice.validators.ts
import { prisma } from "../../lib/prisma.js";

export const assertValidPnr = (pnr: string) => {
  if (!pnr || !pnr.trim()) {
    throw new Error("PNR is required");
  }
};

export const assertPnrsUnique = async (pnrs: string[]) => {
  const seen = new Set<string>();
  for (const pnr of pnrs) {
    if (seen.has(pnr)) {
      throw new Error(`Duplicate PNR "${pnr}" within this invoice`);
    }
    seen.add(pnr);
  }

  const existing = await prisma.invoice.findFirst({
    where: { passengers: { some: { pnr: { in: pnrs } } } },
    select: { invoiceNo: true, passengers: { select: { pnr: true } } },
  });

  if (existing) {
    const clash = existing.passengers.find(
      (passenger) => passenger.pnr && pnrs.includes(passenger.pnr),
    );
    throw new Error(
      `PNR "${clash?.pnr}" is already used on invoice ${existing.invoiceNo}`,
    );
  }
};

export const assertTicketNumbersUnique = async (ticketNumbers: string[]) => {
  const normalized = ticketNumbers
    .map((ticketNo) => ticketNo.trim())
    .filter(Boolean);
  const seen = new Set<string>();

  for (const ticketNo of normalized) {
    if (seen.has(ticketNo)) {
      throw new Error(
        `Duplicate ticket number "${ticketNo}" within this invoice`,
      );
    }
    seen.add(ticketNo);
  }

  if (!normalized.length) return;

  const existing = await prisma.invoice.findFirst({
    where: { passengers: { some: { ticketNo: { in: normalized } } } },
    select: { invoiceNo: true, passengers: { select: { ticketNo: true } } },
  });

  if (existing) {
    const clash = existing.passengers.find(
      (passenger) =>
        passenger.ticketNo && normalized.includes(passenger.ticketNo),
    );
    throw new Error(
      `Ticket number "${clash?.ticketNo}" is already used on invoice ${existing.invoiceNo}`,
    );
  }
};

// invoice.validators.ts
import { prisma } from "../../lib/prisma.js";

const PNR_REGEX = /^\d{6}$/;

export const assertValidPnr = (pnr: string) => {
  if (!PNR_REGEX.test(pnr)) {
    throw new Error(`Invalid PNR "${pnr}": must be exactly 6 digits`);
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
    const clash = existing.passengers.find((p) => pnrs.includes(p.pnr));
    throw new Error(
      `PNR "${clash?.pnr}" is already used on invoice ${existing.invoiceNo}`,
    );
  }
};

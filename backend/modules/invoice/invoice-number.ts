import { prisma } from "../../lib/prisma.js";
import { InvoiceType } from "@prisma/client";

const typePrefix: Record<InvoiceType, string> = {
  AIR_TICKET: "AT",
  NON_COMMISSION: "NC",
  REISSUE: "RI",
  TOUR_PACKAGE: "TP",
  HOTEL: "HT",
  VISA: "VS",
};

export async function generateInvoiceNo(type: InvoiceType): Promise<string> {
  const year = new Date().getFullYear();
  const counterId = `${type}-${year}`;

  const counter = await prisma.counter.upsert({
    where: { id: counterId },
    create: { id: counterId, value: 1 },
    update: { value: { increment: 1 } },
  });

  const sequence = String(counter.value).padStart(5, "0");
  return `${typePrefix[type]}-${year}-${sequence}`;
}

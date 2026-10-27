import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { Prisma } from "@prisma/client";

import { prisma } from "../../lib/prisma.js";
import { parseIur } from "./iur.parser.js";
import type { ImportIurInput } from "./iur.types.js";
import type { IurDirectoryScanResult } from "./iur.types.js";

const DEFAULT_IUR_DIRECTORY = "C:\\IUR";
let activeScan: Promise<IurDirectoryScanResult> | null = null;
const IUR_CONFIGURATION_ID = "iur";

export async function importIurFile(input: ImportIurInput) {
  const content = input.content;

  const fileHash = createHash("sha256").update(content, "utf8").digest("hex");

  const parsed = parseIur(content);

  try {
    const result = await prisma.iurImport.create({
      data: {
        fileHash,
        fileName: input.fileName,
        sourceDevice: input.sourceDevice,
        fileSize: Buffer.byteLength(content, "utf8"),
        rawContent: content,
        parsedData: JSON.parse(JSON.stringify(parsed)),
        extractedData: JSON.parse(JSON.stringify(parsed.extracted)),
        status: parsed.records.length ? "NEEDS_REVIEW" : "ERROR",
        errorMessage: parsed.records.length
          ? null
          : "No recognized IUR records found",
        processedAt: new Date(),
      },
      select: {
        id: true,
        fileName: true,
        sourceDevice: true,
        fileSize: true,
        status: true,
        receivedAt: true,
      },
    });

    return {
      duplicate: false,
      import: result,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const updated = await prisma.iurImport.update({
        where: { fileHash },
        data: {
          parsedData: JSON.parse(JSON.stringify(parsed)),
          extractedData: JSON.parse(JSON.stringify(parsed.extracted)),
          processedAt: new Date(),
        },
        select: {
          id: true,
          fileName: true,
          status: true,
          receivedAt: true,
        },
      });

      const existing = await prisma.iurImport.findUnique({
        where: { fileHash },
        select: {
          id: true,
          fileName: true,
          status: true,
          receivedAt: true,
        },
      });

      return {
        duplicate: true,
        import: updated ?? existing,
      };
    }

    throw error;
  }
}

export function getIurDirectory() {
  return process.env.IUR_DIRECTORY?.trim() || DEFAULT_IUR_DIRECTORY;
}

export async function getConfiguredIurDirectory() {
  const configuration = await prisma.iurConfiguration.findUnique({
    where: { id: IUR_CONFIGURATION_ID },
    select: { directory: true },
  });

  return configuration?.directory || getIurDirectory();
}

export async function setConfiguredIurDirectory(directory: string) {
  return prisma.iurConfiguration.upsert({
    where: { id: IUR_CONFIGURATION_ID },
    create: { id: IUR_CONFIGURATION_ID, directory },
    update: { directory },
    select: { directory: true, updatedAt: true },
  });
}

export async function getIurSuggestions() {
  const imports = await prisma.iurImport.findMany({
    orderBy: { receivedAt: "desc" },
    take: 10,
    select: { extractedData: true },
  });

  const suggestions: Record<string, string[]> = {};
  const fields = [
    "passengerName",
    "passengerType",
    "passportNo",
    "contactNo",
    "passengerEmail",
    "dateOfBirth",
    "passportIssueDate",
    "passportExpiryDate",
    "ticketNo",
    "pnr",
    "route",
    "class",
    "journeyDate",
    "returnDate",
    "travelSegment",
    "ticketingRemarks",
    "baseFare",
    "taxesCommission",
    "aitTax",
    "clientPrice",
    "commission",
    "calculatedCommission",
    "purchaseCost",
    "netCommission",
    "discount",
    "extraFee",
    "profit",
    "airline",
  ];

  for (const field of fields) {
    const values = imports
      .map((item) => {
        const extracted = asRecord(item.extractedData);
        const invoice = asRecord(extracted?.invoice);
        if (field === "airline") {
          const ticket = asRecord(extracted?.ticket);
          return ticket?.airline;
        }

        return invoice?.[field];
      })
      .filter((value): value is string | number => typeof value === "string" || typeof value === "number")
      .map((value) => String(value).trim())
      .filter(Boolean);

    suggestions[field] = [...new Set(values)].slice(0, 10);
  }

  return suggestions;
}

export async function findIurImportByTicketNumber(ticketNumber: string) {
  const imports = await prisma.iurImport.findMany({
    orderBy: { receivedAt: "desc" },
    select: {
      id: true,
      fileName: true,
      sourceDevice: true,
      fileSize: true,
      status: true,
      parsedData: true,
      extractedData: true,
      errorMessage: true,
      invoiceId: true,
      receivedAt: true,
      processedAt: true,
    },
  });

  const normalizedTicketNumber = ticketNumber.replace(/[\s-]/g, "").toUpperCase();
  return imports.find((item) => {
    const extracted = asRecord(item.extractedData);
    const invoice = asRecord(extracted?.invoice);
    const ticket = asRecord(extracted?.ticket);
    const extractedTicket = invoice?.ticketNo ?? ticket?.number;

    return typeof extractedTicket === "string" &&
      extractedTicket.replace(/[\s-]/g, "").toUpperCase() === normalizedTicketNumber;
  }) ?? null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export function scanIurDirectory() {
  if (activeScan) {
    return activeScan;
  }

  activeScan = scanIurDirectoryInternal().finally(() => {
    activeScan = null;
  });

  return activeScan;
}

async function scanIurDirectoryInternal(): Promise<IurDirectoryScanResult> {
  const directory = await getConfiguredIurDirectory();
  const entries = await readdir(directory, { withFileTypes: true });
  const textFiles = entries.filter(
    (entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === ".txt",
  );

  const result: IurDirectoryScanResult = {
    directory,
    discovered: textFiles.length,
    imported: 0,
    duplicates: 0,
    errors: [],
  };

  for (const entry of textFiles) {
    const filePath = path.join(directory, entry.name);

    try {
      const fileStats = await stat(filePath);
      if (!fileStats.isFile()) {
        continue;
      }

      const content = await readFile(filePath, "utf8");
      const importResult = await importIurFile({
        fileName: entry.name,
        sourceDevice: directory,
        content,
      });

      if (importResult.duplicate) {
        result.duplicates += 1;
      } else {
        result.imported += 1;
      }
    } catch (error) {
      result.errors.push({
        fileName: entry.name,
        message: error instanceof Error ? error.message : "Unable to read file",
      });
    }
  }

  return result;
}

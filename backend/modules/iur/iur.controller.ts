import type { Request, Response, NextFunction } from "express";

import { prisma } from "../../lib/prisma.js";
import {
  getConfiguredIurDirectory,
  getIurSuggestions,
  findIurImportByTicketNumber,
  getIurDirectory,
  importIurFile,
  scanIurDirectory,
  setConfiguredIurDirectory,
} from "./iur.service.js";
import path from "node:path";

export async function importIurController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { fileName, sourceDevice, content } = req.body ?? {};

    if (
      typeof fileName !== "string" ||
      typeof sourceDevice !== "string" ||
      typeof content !== "string" ||
      !fileName.trim() ||
      !sourceDevice.trim() ||
      !content.trim()
    ) {
      return res.status(400).json({
        message: "fileName, sourceDevice and content are required",
      });
    }

    if (
      fileName.length > 255 ||
      sourceDevice.length > 100 ||
      content.length > 2_000_000
    ) {
      return res.status(413).json({
        message: "Input exceeds the allowed size",
      });
    }

    if (
      fileName.includes("/") ||
      fileName.includes("\\") ||
      !fileName.toLowerCase().endsWith(".txt")
    ) {
      return res.status(400).json({
        message: "A TXT filename without a path is required",
      });
    }

    const result = await importIurFile({
      fileName: fileName.trim(),
      sourceDevice: sourceDevice.trim(),
      content,
    });

    return res.status(result.duplicate ? 200 : 201).json({
      message: result.duplicate
        ? "This file has already been imported"
        : "IUR file imported",
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function listIurImportsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const scan = await scanIurDirectory();
    const page = Math.max(
      1,
      Number.parseInt(String(req.query.page ?? "1"), 10) || 1,
    );

    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(String(req.query.limit ?? "20"), 10) || 20),
    );

    const [items, total] = await Promise.all([
      prisma.iurImport.findMany({
        skip: (page - 1) * limit,
        take: limit,
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
      }),
      prisma.iurImport.count(),
    ]);

    return res.json({
      scan,
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return res.status(503).json({
        message: `IUR directory does not exist: ${getIurDirectory()}`,
        directory: getIurDirectory(),
      });
    }
    next(error);
  }
}

export async function scanIurDirectoryController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    return res.json(await scanIurDirectory());
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return res.status(503).json({
        message: `IUR directory does not exist: ${getIurDirectory()}`,
        directory: getIurDirectory(),
      });
    }

    next(error);
  }
}

export async function getIurConfigurationController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const directory = await getConfiguredIurDirectory();
    const configured = await prisma.iurConfiguration.findUnique({
      where: { id: "iur" },
      select: { id: true },
    });

    return res.json({ directory, configured: Boolean(configured) });
  } catch (error) {
    next(error);
  }
}

export async function saveIurConfigurationController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const directory = req.body?.directory;

    if (
      typeof directory !== "string" ||
      !directory.trim() ||
      !path.isAbsolute(directory.trim())
    ) {
      return res.status(400).json({
        message: "An absolute IUR folder path is required",
      });
    }

    const saved = await setConfiguredIurDirectory(directory.trim());
    const scan = await scanIurDirectory();

    return res.json({ ...saved, scan });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return res.status(400).json({
        message: "The selected IUR folder does not exist",
      });
    }
    next(error);
  }
}

export async function getIurImportController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const item = await prisma.iurImport.findUnique({
      where: { id: req.params.id },
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

    if (!item) {
      return res.status(404).json({
        message: "IUR import not found",
      });
    }

    return res.json(item);
  } catch (error) {
    next(error);
  }
}

export async function getIurImportByTicketController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const ticketNumber = req.params.ticketNumber?.trim();
    if (!ticketNumber) {
      return res.status(400).json({ message: "Ticket number is required" });
    }

    const item = await findIurImportByTicketNumber(ticketNumber);
    if (!item) {
      return res.status(404).json({ message: "No imported IUR matches this ticket number" });
    }

    return res.json(item);
  } catch (error) {
    next(error);
  }
}

export async function getIurSuggestionsController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    return res.json({ suggestions: await getIurSuggestions() });
  } catch (error) {
    next(error);
  }
}

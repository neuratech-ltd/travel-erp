import { Request, Response } from 'express'
import {
  createAirTicketInvoice,
  createHotelVisaInvoice,
  createNonCommissionInvoice,
  createReissueInvoice,
  createTourPackageInvoice,
  getAllInvoices,
} from './invoice.services.js'

const sendCreateResponse = async (res: Response, handler: () => Promise<any>) => {
  try {
    const invoice = await handler()
    return res.status(201).json({ success: true, data: invoice })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create invoice'
    const statusCode =
      message.toLowerCase().includes('required') || message.toLowerCase().includes('invalid') ? 400 : 500

    console.error('Error creating invoice:', error)
    return res.status(statusCode).json({ success: false, message })
  }
}

export const createAirTicketInvoiceController = async (req: Request, res: Response) => {
  return sendCreateResponse(res, () => createAirTicketInvoice(req.body))
}

export const createHotelVisaInvoiceController = async (req: Request, res: Response) => {
  return sendCreateResponse(res, () => createHotelVisaInvoice(req.body))
}

export const createNonCommissionInvoiceController = async (req: Request, res: Response) => {
  return sendCreateResponse(res, () => createNonCommissionInvoice(req.body))
}

export const createReissueInvoiceController = async (req: Request, res: Response) => {
  return sendCreateResponse(res, () => createReissueInvoice(req.body))
}

export const createTourPackageInvoiceController = async (req: Request, res: Response) => {
  return sendCreateResponse(res, () => createTourPackageInvoice(req.body))
}

export const getAllInvoicesController = async (req: Request, res: Response) => {
  try {
    const invoices = await getAllInvoices()
    return res.status(200).json({ success: true, data: invoices })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return res.status(500).json({ success: false, message: 'Failed to fetch invoices' })
  }
}

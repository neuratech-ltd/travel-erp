import { Request, Response } from 'express'
import { getAllReports, getReportById } from './salesReport.services.js'

const getSalesReport = async (req: Request, res: Response) => {
  try {
    const reports = await getAllReports()
    return res.status(200).json({ success: true, data: reports })
  } catch (error) {
    console.error('Error in getSalesReport controller:', error)
    return res.status(500).json({ success: false, message: 'Failed to fetch sales reports' })
  }
}

const getReportByIdController = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const report = await getReportById(id)
    if (report) {
      return res.status(200).json({ success: true, data: report })
    } else {
      return res.status(404).json({ success: false, message: 'Report not found' })
    }
  } catch (error) {
    console.error('Error in getReportById controller:', error)
    return res.status(500).json({ success: false, message: 'Failed to fetch report' })
  }
}

export { getSalesReport, getReportByIdController }

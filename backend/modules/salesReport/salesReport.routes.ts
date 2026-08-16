import express from 'express'
import * as salesReportController from './salesReport.controller.js'

const router: express.Router = express.Router()

router.get('/', salesReportController.getSalesReport)
router.get('/:id', salesReportController.getReportByIdController)

export default router

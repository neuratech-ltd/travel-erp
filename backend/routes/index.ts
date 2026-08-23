import express from 'express'
import clientRoute from '../modules/client/client.routes.js'
import aiRoute from '../modules/ai/ai.routes.js'
import employeeRoute from '../modules/employee/employee.routes.js'
import invoiceRoute from '../modules/invoice/invoice.routes.js'
import salesReportRoute from '../modules/salesReport/salesReport.routes.js'
import paymentRoute from '../modules/payment/payment.routes.js'

const router: express.Router = express.Router()

router.use('/clients', clientRoute)
router.use('/ai', aiRoute)
router.use('/employees', employeeRoute)
router.use('/invoices', invoiceRoute)
router.use('/sales-reports', salesReportRoute)
router.use('/payments', paymentRoute)

export default router

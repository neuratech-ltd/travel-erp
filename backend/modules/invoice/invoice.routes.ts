import express from 'express'
import * as invoiceController from './invoice.controller.js'

const router: express.Router = express.Router()

router.post('/air-ticket', invoiceController.createAirTicketInvoiceController)
router.post('/hotel-visa', invoiceController.createHotelVisaInvoiceController)
router.post('/non-commission', invoiceController.createNonCommissionInvoiceController)
router.post('/reissue', invoiceController.createReissueInvoiceController)
router.post('/tour-package', invoiceController.createTourPackageInvoiceController)
router.get('/', invoiceController.getAllInvoicesController)

export default router

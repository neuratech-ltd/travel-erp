import express from 'express'
import * as paymentController from './payment.controller.js'

const router: express.Router = express.Router()

router.get('/', paymentController.getPayments)
router.post('/', paymentController.createPaymentController)
router.get('/:id', paymentController.getPaymentByIdController)

export default router

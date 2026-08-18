import { getAllPayments, getPaymentById, createPayment, Payment } from './payment.services'

const getPayments = async (req: any, res: any) => {
  try {
    const payments = await getAllPayments()
    res.status(200).json({ success: true, data: payments })
  } catch (error) {
    console.error('Error in getPayments controller:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch payments' })
  }
}

const getPaymentByIdController = async (req: any, res: any) => {
  const { id } = req.params
  try {
    const payment = await getPaymentById(id)
    if (payment) {
      res.status(200).json({ success: true, data: payment })
    } else {
      res.status(404).json({ success: false, message: 'Payment not found' })
    }
  } catch (error) {
    console.error('Error in getPaymentById controller:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch payment' })
  }
}

const createPaymentController = async (req: any, res: any) => {
  const paymentData: Payment = req.body
  try {
    const newPayment = await createPayment(paymentData)
    res.status(201).json({ success: true, data: newPayment })
  } catch (error) {
    console.error('Error in createPaymentController:', error)
    res.status(500).json({ success: false, message: 'Failed to create payment' })
  }
}

export { getPayments, getPaymentByIdController, createPaymentController }

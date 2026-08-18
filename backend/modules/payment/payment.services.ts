import { prisma } from '../../lib/prisma'

enum PaymentMethod {
  CASH = 'CASH',
  BANK = 'BANK',
}

export interface Payment {
  id: string
  amount: number
  ammount: number
  method: PaymentMethod
  bankChannel?: string
  receivedDate: string
  remarks?: string
  createdAt: Date
  updatedAt: Date
  invoiceId: string
}

const getAllPayments = async () => {
  try {
    const payments = await prisma.payment.findMany()
    console.log('Fetched payments:', payments) // Log the fetched payments for debugging
    return payments
  } catch (error) {
    console.error('Error fetching payments:', error)
    throw error
  }
}

const getPaymentById = async (id: string) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id },
    })
    return payment
  } catch (error) {
    console.error('Error fetching payment:', error)
    throw error
  }
}

const createPayment = async (paymentData: Payment) => {
  try {
    const newPayment = await prisma.payment.create({
      data: paymentData,
    })
    return newPayment
  } catch (error) {
    console.error('Error creating payment:', error)
    throw error
  }
}

export { getAllPayments, getPaymentById, createPayment }

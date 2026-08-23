import { prisma } from "../../lib/prisma.js";
import { InvoiceStatus, PaymentMethod } from "@prisma/client";

export interface CreatePaymentInput {
  amount: number;
  method: PaymentMethod;
  bankChannel?: string;
  receivedDate: string | Date;
  remarks?: string;
}

const getInvoiceTotal = (invoice: {
  clientPrice: number | null;
  billing: { netTotal: number | null } | null;
}) => invoice.clientPrice ?? invoice.billing?.netTotal ?? 0;

const getInvoiceStatus = (total: number, received: number) => {
  if (received <= 0) return InvoiceStatus.UNPAID;
  if (received < total) return InvoiceStatus.PARTIAL;
  return InvoiceStatus.PAID;
};

const getAllPayments = async () => {
  try {
    return prisma.payment.findMany({
      include: {
        invoice: {
          select: {
            id: true,
            invoiceNo: true,
            client: { select: { name: true } },
          },
        },
      },
      orderBy: { receivedDate: "desc" },
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

const getPaymentById = async (id: string) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id },
    });
    return payment;
  } catch (error) {
    console.error("Error fetching payment:", error);
    throw error;
  }
};

const createPayment = async (
  invoiceId: string,
  paymentData: CreatePaymentInput,
) => {
  try {
    const amount = Number(paymentData.amount);
    if (!Number.isFinite(amount) || amount <= 0)
      throw new Error("Payment amount must be greater than zero");
    if (!Object.values(PaymentMethod).includes(paymentData.method))
      throw new Error("Invalid payment method");
    if (
      paymentData.method === PaymentMethod.BANK &&
      !paymentData.bankChannel?.trim()
    ) {
      throw new Error("Bank channel is required for bank payments");
    }

    const receivedDate = new Date(paymentData.receivedDate);
    if (Number.isNaN(receivedDate.getTime()))
      throw new Error("Invalid payment date");

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { payments: true },
    });
    if (!invoice) throw new Error("Invoice not found");

    const total = getInvoiceTotal(invoice);
    const received = invoice.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0,
    );
    if (received + amount > total)
      throw new Error("Payment cannot exceed the invoice balance");

    return prisma.$transaction(async (transaction) => {
      const newPayment = await transaction.payment.create({
        data: {
          invoiceId,
          amount,
          method: paymentData.method,
          bankChannel:
            paymentData.method === PaymentMethod.BANK
              ? paymentData.bankChannel?.trim()
              : null,
          receivedDate,
          remarks: paymentData.remarks?.trim() || null,
        },
      });

      await transaction.invoice.update({
        where: { id: invoiceId },
        data: { status: getInvoiceStatus(total, received + amount) },
      });

      return newPayment;
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

export { getAllPayments, getPaymentById, createPayment };

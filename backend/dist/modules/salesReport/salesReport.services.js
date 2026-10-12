import { InvoiceType, PaymentMethod } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
const toMoney = (value) => Number((value ?? 0).toFixed(2));
const getTicketTypeLabel = (type) => {
    if (type === InvoiceType.AIR_TICKET) {
        return "Air Ticket";
    }
    if (type === InvoiceType.NON_COMMISSION) {
        return "Non-Commission";
    }
    if (type === InvoiceType.REISSUE) {
        return "Reissue";
    }
    if (type === InvoiceType.HOTEL) {
        return "Hotel";
    }
    if (type === InvoiceType.VISA) {
        return "Visa";
    }
    return "Tour Package";
};
const getTicketCount = (invoice) => {
    if (invoice.type === InvoiceType.AIR_TICKET ||
        invoice.type === InvoiceType.NON_COMMISSION ||
        invoice.type === InvoiceType.REISSUE) {
        return invoice.passengers.length || 1;
    }
    return invoice.billing?.billingQty ?? 1;
};
const normalizeBankChannel = (value) => (value ?? "").trim().toUpperCase();
const getAllReports = async () => {
    try {
        const invoices = await prisma.invoice.findMany({
            include: {
                reference: true,
                payments: true,
            },
            orderBy: {
                issueDate: "desc",
            },
        });
        const rows = invoices.map((invoice) => {
            const clientPrice = toMoney(invoice.totalClientPrice);
            const ticketReissue = invoice.type === InvoiceType.REISSUE ? clientPrice : 0;
            const admaVoidCharge = invoice.type === InvoiceType.REISSUE
                ? toMoney(invoice.totalExtraFee)
                : 0;
            const visaAppFee = invoice.type === InvoiceType.VISA ? clientPrice : 0;
            const hotelBooking = invoice.type === InvoiceType.HOTEL ? clientPrice : 0;
            const ticket = invoice.type === InvoiceType.AIR_TICKET ||
                invoice.type === InvoiceType.NON_COMMISSION ||
                invoice.type === InvoiceType.TOUR_PACKAGE
                ? clientPrice
                : 0;
            const totalSales = toMoney(ticketReissue + admaVoidCharge + visaAppFee + hotelBooking + ticket);
            const cash = toMoney(invoice.payments
                .filter((payment) => payment.method === PaymentMethod.CASH)
                .reduce((sum, payment) => sum + payment.amount, 0));
            const bankBrac = toMoney(invoice.payments
                .filter((payment) => payment.method === PaymentMethod.BANK &&
                normalizeBankChannel(payment.bankChannel).includes("BRAC"))
                .reduce((sum, payment) => sum + payment.amount, 0));
            const bankPubali = toMoney(invoice.payments
                .filter((payment) => payment.method === PaymentMethod.BANK &&
                normalizeBankChannel(payment.bankChannel).includes("PUBALI"))
                .reduce((sum, payment) => sum + payment.amount, 0));
            const bankDbbl = toMoney(invoice.payments
                .filter((payment) => payment.method === PaymentMethod.BANK &&
                normalizeBankChannel(payment.bankChannel).includes("DBBL"))
                .reduce((sum, payment) => sum + payment.amount, 0));
            const totalReceived = toMoney(cash + bankBrac + bankPubali + bankDbbl);
            const dueAmount = toMoney(totalSales - totalReceived);
            const latestPayment = [...invoice.payments].sort((a, b) => new Date(b.receivedDate).getTime() -
                new Date(a.receivedDate).getTime())[0];
            return {
                id: invoice.id,
                date: invoice.issueDate.toISOString(),
                invoiceNo: invoice.invoiceNo,
                ticketType: getTicketTypeLabel(invoice.type),
                ticketCount: getTicketCount(invoice),
                mrNo: latestPayment?.remarks ?? "",
                salesRef: invoice.reference?.name ?? "",
                ticketReissue,
                admaVoidCharge,
                visaAppFee,
                hotelBooking,
                ticket,
                totalSales,
                receivedDate: latestPayment?.receivedDate?.toISOString() ?? "",
                cash,
                bankBrac,
                bankPubali,
                bankDbbl,
                totalReceived,
                dueAmount,
            };
        });
        return rows;
    }
    catch (error) {
        console.error("Error generating sales reports:", error);
        throw error;
    }
};
const getReportById = async (id) => {
    const allReports = await getAllReports();
    return allReports.find((report) => report.id === id) ?? null;
};
export { getAllReports, getReportById };

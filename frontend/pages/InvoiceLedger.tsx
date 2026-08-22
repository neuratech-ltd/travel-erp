import React, { useState, useEffect } from 'react'
import { Search, Trash2, DollarSign, TrendingUp, Layers, ChevronDown, ChevronUp } from 'lucide-react'
import { Invoice } from '../types'
import ExpandedDetails from '../components/invoice/ExpandedDetails'

export default function InvoiceLedger() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null)
  const [fetchInvoices, setFetchInvoices] = useState<Invoice[]>([])
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'BANK'>('CASH')
  const [bankChannel, setBankChannel] = useState('')
  const [receivedDate, setReceivedDate] = useState(new Date().toISOString().slice(0, 10))
  const [paymentRemarks, setPaymentRemarks] = useState('')
  const [paymentError, setPaymentError] = useState('')
  const [isSavingPayment, setIsSavingPayment] = useState(false)

  const loadInvoices = async () => {
    try {
      const res = await fetch('/api/invoices')

      console.log('Invoice response status:', res.status)

      const json = await res.json()

      console.log('Invoice API DATA:', json)

      setFetchInvoices(Array.isArray(json) ? json : (json.data ?? json.invoices ?? []))
    } catch (e) {
      console.error('Failed to fetch invoices', e)
    }
  }

  const openPaymentForm = (invoice: Invoice) => {
    setPaymentInvoice(invoice)
    setPaymentAmount('')
    setPaymentMethod('CASH')
    setBankChannel('')
    setReceivedDate(new Date().toISOString().slice(0, 10))
    setPaymentRemarks('')
    setPaymentError('')
  }

  const savePayment = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!paymentInvoice) return
    setIsSavingPayment(true)
    setPaymentError('')
    try {
      const response = await fetch(`/api/payments/invoice/${paymentInvoice.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(paymentAmount),
          method: paymentMethod,
          bankChannel: paymentMethod === 'BANK' ? bankChannel : undefined,
          receivedDate,
          remarks: paymentRemarks,
        }),
      })
      const responseText = await response.text()
      let result: { message?: string } = {}
      try {
        result = JSON.parse(responseText)
      } catch {
        throw new Error(
          response.ok
            ? 'Payment API returned an invalid response. Restart the backend server and try again.'
            : `Payment API is unavailable (${response.status}). Restart the backend server and try again.`,
        )
      }
      if (!response.ok) throw new Error(result.message || 'Unable to record payment')
      setPaymentInvoice(null)
      await loadInvoices()
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Unable to record payment')
    } finally {
      setIsSavingPayment(false)
    }
  }
  useEffect(() => {
    loadInvoices()
  }, [])

  console.log('Fetched Invoices:', fetchInvoices)

  const getTypeBadgeStyles = (type: string) => {
    switch (type) {
      case 'AIR_TICKET':
        return 'bg-blue-50 text-blue-600 border border-blue-100'
      case 'NON_COMMISSION':
        return 'bg-indigo-50 text-indigo-600 border border-indigo-100'
      case 'REISSUE':
        return 'bg-purple-50 text-purple-600 border border-purple-100'
      case 'TOUR_PACKAGE':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100'
      case 'HOTEL':
        return 'bg-amber-50 text-amber-600 border border-amber-100'
      case 'VISA':
        return 'bg-pink-50 text-pink-600 border border-pink-100'
      default:
        return 'bg-slate-50 text-slate-600'
    }
  }

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100'
      case 'PARTIAL':
        return 'bg-amber-50 text-amber-700 border border-amber-100'
      case 'UNPAID':
        return 'bg-rose-50 text-rose-700 border border-rose-100'
      default:
        return 'bg-slate-50 text-slate-600'
    }
  }

  return (
    <div id="invoice-ledger-container" className="flex-1 p-8 bg-slate-50 overflow-y-auto space-y-6">
      <div id="ledger-filters" className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-500" />
              FINANCIAL TRANSACTION LEDGER
            </h2>
            <p className="text-2xs text-slate-400 font-medium">
              Browse, search, audit, or delete logged travel transactions
            </p>
          </div>
          {/* Quick Stats overview */}
          <div className="flex gap-4 text-xs font-semibold text-slate-600">
            <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-slate-400" />
              Sales Total: <strong className="text-slate-800">৳ 000</strong>
            </div>
            <div className="bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1.5 text-emerald-700">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Profit Margin: <strong>৳ 000</strong>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Search by Invoice, Client, Pax, Route..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 text-slate-700 outline-none"
            >
              <option value="All">All Booking Types</option>
              <option value="Air Ticket">Air Ticket</option>
              <option value="Non Commission">Non Commission</option>
              <option value="Reissue">Reissue</option>
              <option value="Tour Package">Tour Package</option>
              <option value="Hotel">Hotel</option>
              <option value="Visa">Visa</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 text-slate-700 outline-none"
            >
              <option value="All">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>

          <div className="flex items-center">
            {(searchQuery || typeFilter !== 'All' || statusFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setTypeFilter('All')
                  setStatusFilter('All')
                }}
                className="text-2xs text-rose-500 hover:text-rose-700 font-bold transition-colors cursor-pointer"
              >
                Clear All Filter Constraints
              </button>
            )}
          </div>
        </div>
      </div>

      <div id="ledger-grid" className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-3xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Invoice No</th>
                <th className="py-4 px-4">Client Name</th>
                <th className="py-4 px-4">Booking Type</th>
                <th className="py-4 px-4">Passenger Name</th>
                <th className="py-4 px-4">Route / Sector / Booking</th>
                <th className="py-4 px-4 text-right">Revenue</th>
                <th className="py-4 px-4 text-right">Profit</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-2xs text-slate-700">
              {fetchInvoices.map((inv: Invoice) => {
                const revenue = inv.clientPrice || inv.billing?.netTotal || 0
                const profitVal = inv.profit || inv.billing?.totalProfit || 0
                const paidAmount = inv.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0
                const dueAmount = Math.max(revenue - paidAmount, 0)
                const displayRoute = inv.route || inv.ticketInfo?.route || 'Local Tour'
                const displayPax = inv.paxName || inv.passportInfo?.paxName || 'Walk-In Customer'
                const isExpanded = expandedInvoiceId === inv.id

                return (
                  <React.Fragment key={inv.id}>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-6 font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <button
                          onClick={() => setExpandedInvoiceId(isExpanded ? null : inv.id)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </button>
                        <span>{inv.invoiceNo}</span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-700 max-w-xs truncate">
                        {inv.client?.name || 'Walk-In Customer'}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-3xs ${getTypeBadgeStyles(inv.type)}`}
                        >
                          {inv.type}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-600">{displayPax}</td>

                      <td className="py-3.5 px-4 font-semibold text-slate-500 font-mono tracking-tight">
                        {displayRoute}
                      </td>

                      <td className="py-3.5 px-4 text-right font-bold text-slate-800">৳{revenue.toLocaleString()}</td>

                      <td className="py-3.5 px-4 text-right text-emerald-600 font-bold">
                        ৳{profitVal.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-center relative">
                        <select
                          value={inv.status}
                          className={`text-3xs font-bold py-1 px-2.5 rounded-full outline-none cursor-pointer transition-colors ${getStatusBadgeStyles(inv.status)}`}
                        >
                          <option value="PAID">Paid</option>
                          <option value="PARTIAL">Partial</option>
                          <option value="UNPAID">Unpaid</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openPaymentForm(inv)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title={`Record payment; due ৳${dueAmount.toLocaleString()}`}
                          >
                            <DollarSign className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  `Are you sure you want to delete invoice ${inv.invoiceNo}? This is non-reversible and will adjust the reports.`,
                                )
                              ) {
                              }
                            }}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Voucher"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {isExpanded && <ExpandedDetails inv={inv} />}
                  </React.Fragment>
                )
              })}

              {/* {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 font-medium">
                    {isLoading ? 'Fetching database logs...' : 'No invoices matched current query filter parameters.'}
                  </td>
                </tr>
              )} */}
            </tbody>
          </table>
        </div>
      </div>

      {paymentInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <form onSubmit={savePayment} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Record Payment</h3>
              <p className="text-xs text-slate-500">Invoice {paymentInvoice.invoiceNo}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <label className="space-y-1 font-semibold text-slate-600">
                Amount
                <input
                  required
                  min="0.01"
                  step="0.01"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2"
                />
              </label>
              <label className="space-y-1 font-semibold text-slate-600">
                Received date
                <input
                  required
                  type="date"
                  value={receivedDate}
                  onChange={(e) => setReceivedDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2"
                />
              </label>
              <label className="space-y-1 font-semibold text-slate-600">
                Method
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as 'CASH' | 'BANK')}
                  className="w-full rounded-lg border border-slate-200 p-2"
                >
                  <option value="CASH">Cash</option>
                  <option value="BANK">Bank</option>
                </select>
              </label>
              {paymentMethod === 'BANK' && (
                <label className="space-y-1 font-semibold text-slate-600">
                  Bank channel
                  <input
                    required
                    value={bankChannel}
                    onChange={(e) => setBankChannel(e.target.value)}
                    placeholder="BRAC / PUBALI / DBBL"
                    className="w-full rounded-lg border border-slate-200 p-2"
                  />
                </label>
              )}
            </div>
            <label className="block space-y-1 text-xs font-semibold text-slate-600">
              Remarks
              <textarea
                value={paymentRemarks}
                onChange={(e) => setPaymentRemarks(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2"
                rows={2}
              />
            </label>
            {paymentError && <p className="text-xs font-semibold text-rose-600">{paymentError}</p>}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPaymentInvoice(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                disabled={isSavingPayment}
                type="submit"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                {isSavingPayment ? 'Saving...' : 'Save payment'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

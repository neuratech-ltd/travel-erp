import React, { useEffect, useMemo, useState } from 'react'

import { User, Calendar, DollarSign } from 'lucide-react'
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '../ui/combobox'
import SuccessPopup from '../common/SuccessPopup'
import { api } from '../../lib/api'

interface NonCommissionFormProps {
  employeesList: { id: number; name: string }[]
  clientsList: { id: number; name: string }[]
  invoiceNo?: string
  salesDate?: string
  dueDate?: string
  ticketNo?: string
  grossFare?: number
  purchasePrice?: number
  totalClientPrice?: number
  aitTax?: number
  extraFee?: number
  discount?: number
  paxName?: string
  route?: string
  clientPnr?: string
  airline?: string
  journeyDate?: string
  returnDate?: string
  passengerEmail?: string
}

const NonCommissionForm = ({ employeesList, clientsList }: NonCommissionFormProps) => {
  const [grossFare, setGrossFare] = useState(0)
  const [purchasePrice, setPurchasePrice] = useState(0)
  const [totalClientPrice, setTotalClientPrice] = useState(0)
  const [aitTax, setAitTax] = useState(0)
  const [extraFee, setExtraFee] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [successDetail, setSuccessDetail] = useState('')

  const toStringValue = (value: FormDataEntryValue | null) => {
    if (value === null) {
      return ''
    }
    return String(value).trim()
  }

  const calculatedProfit = useMemo(
    () => Number((totalClientPrice - purchasePrice + extraFee - discount).toFixed(2)),
    [discount, extraFee, purchasePrice, totalClientPrice],
  )

  const calculatedGrossMargin = useMemo(
    () => Number((totalClientPrice - grossFare).toFixed(2)),
    [grossFare, totalClientPrice],
  )

  useEffect(() => {
    if (!successOpen) {
      return
    }

    const timeout = window.setTimeout(() => setSuccessOpen(false), 2500)
    return () => window.clearTimeout(timeout)
  }, [successOpen])

  const createInvoice = async (invoiceData: any) => {
    const { data } = await api.post('/invoices/non-commission', invoiceData)
    if (!data.success) {
      throw new Error(data.message || 'Failed to create invoice')
    }

    return data
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    const invoiceData = {
      clientName: toStringValue(formData.get('clientName')),
      salesBy: toStringValue(formData.get('salesBy')),
      invoiceNumber: toStringValue(formData.get('invoiceNo')),
      salesDate: toStringValue(formData.get('salesDate')),
      dueDate: toStringValue(formData.get('dueDate')),
      ticketNumber: toStringValue(formData.get('ticketNo')),
      grossFare,
      purchasePrice,
      clientPrice: totalClientPrice,
      extraFee,
      discount,
      paxName: toStringValue(formData.get('paxName')),
      route: toStringValue(formData.get('route')),
      pnr: toStringValue(formData.get('clientPnr')),
      airline: toStringValue(formData.get('airline')),
      journeyDate: toStringValue(formData.get('journeyDate')),
      returnDate: toStringValue(formData.get('returnDate')),
      email: toStringValue(formData.get('passengerEmail')),
    }

    try {
      const result = await createInvoice(invoiceData)
      setSuccessDetail(
        `Invoice ${result.data?.invoiceNo || invoiceData.invoiceNumber} saved with ৳${calculatedProfit.toFixed(2)} profit.`,
      )
      setSuccessOpen(true)
      e.currentTarget.reset()
      setGrossFare(0)
      setPurchasePrice(0)
      setTotalClientPrice(0)
      setAitTax(0)
      setExtraFee(0)
      setDiscount(0)
    } catch (error) {
      console.error('Error creating invoice:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SuccessPopup
        open={successOpen}
        title="Non-commission invoice saved"
        message="The non-commission invoice was created successfully."
        detail={successDetail}
        onClose={() => setSuccessOpen(false)}
      />

      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
        <div>
          <label className="block text-slate-500 font-bold mb-1">Search Client *</label>
          <Combobox items={clientsList}>
            <ComboboxInput name="clientName" placeholder="Select a client" />
            <ComboboxContent>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item.id} value={item.name}>
                    {item.name}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
        <div>
          <label className="block text-slate-500 font-bold mb-1">Sales By</label>
          <select
            // value={salesBy}
            // onChange={(e) => setSalesBy(e.target.value)}
            name="salesBy"
            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
          >
            <option value="Select Employee">Select Employee</option>
            {employeesList.map((emp) => (
              <option key={emp.id} value={emp.name}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-slate-500 font-bold mb-1">Invoice No *</label>
          <input
            type="text"
            name="invoiceNo"
            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 font-semibold outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-slate-500 font-bold mb-1">Sales Date</label>
          <input
            type="date"
            name="salesDate"
            // value={salesDate}
            // onChange={(e) => setSalesDate(e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 font-bold mb-1">Due Date</label>
          <input
            type="date"
            name="dueDate"
            // value={dueDate}
            // onChange={(e) => setDueDate(e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
          />
        </div>
      </div>

      {/* Pricing & Ticket details */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 space-y-4">
        <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-100 pb-2">
          Ticket Details & Markup Calculations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-500 font-bold mb-1">Ticket No *</label>
            <input
              type="text"
              name="ticketNo"
              // value={ticketNo}
              // onChange={(e) => setTicketNo(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Gross Fare (Sale)</label>
            <input
              type="number"
              name="grossFare"
              onChange={(e) => setGrossFare(Number(e.target.value) || 0)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Purchase Price (Net Rate) *</label>
            <input
              type="number"
              name="purchasePrice"
              onChange={(e) => setPurchasePrice(Number(e.target.value) || 0)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Total Client Price *</label>
            <input
              type="number"
              name="totalClientPrice"
              onChange={(e) => setTotalClientPrice(Number(e.target.value) || 0)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-slate-500 font-bold mb-1">AIT Tax</label>
            <input
              type="number"
              name="aitTax"
              onChange={(e) => setAitTax(Number(e.target.value) || 0)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Extra Fee</label>
            <input
              type="number"
              name="extraFee"
              onChange={(e) => setExtraFee(Number(e.target.value) || 0)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Discount</label>
            <input
              type="number"
              name="discount"
              onChange={(e) => setDiscount(Number(e.target.value) || 0)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
            />
          </div>
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-2 flex flex-col justify-center">
            <span className="block text-4xs font-bold text-indigo-500 uppercase">Calculated Profit</span>
            <span className="text-sm font-black text-indigo-700">৳{calculatedProfit.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 space-y-4">
        <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-100 pb-2">
          Flight Schedule & Client
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-500 font-bold mb-1">Passenger Name</label>
            <input
              type="text"
              name="paxName"
              // value={paxName}
              // onChange={(e) => setPaxName(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Route</label>
            <input
              type="text"
              name="route"
              // value={route}
              // onChange={(e) => setRoute(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Client PNR</label>
            <input
              type="text"
              name="clientPnr"
              // value={pnr}
              // onChange={(e) => setPnr(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 uppercase outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Airline</label>
            <input
              type="text"
              name="airline"
              // value={airline}
              // onChange={(e) => setAirline(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Journey Date</label>
            <input
              type="date"
              name="journeyDate"
              // value={journeyDate}
              // onChange={(e) => setJourneyDate(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Return Date</label>
            <input
              type="date"
              name="returnDate"
              // value={returnDate}
              // onChange={(e) => setReturnDate(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Passenger Email</label>
            <input
              type="email"
              name="passengerEmail"
              // value={email}
              // onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-50 pt-4 text-center">
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="block text-4xs font-bold text-slate-400 uppercase">Gross Margin</span>
            <span className="text-sm font-black text-slate-700">৳{calculatedGrossMargin.toFixed(2)}</span>
          </div>
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
            <span className="block text-4xs font-bold text-indigo-500 uppercase">Net Profit</span>
            <span className="text-sm font-black text-indigo-700">৳{calculatedProfit.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pb-8">
        <button
          type="button"
          // onClick={() => onNavigateToTab('dashboard')}
          className="px-6 py-2.5 border border-slate-200 bg-white text-slate-600 rounded-xl text-xs font-bold cursor-pointer transition-all hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-lg shadow-indigo-500/20"
        >
          {isSubmitting ? 'Saving Non-Commission Invoice...' : 'Save Non-Commission Invoice'}
        </button>
      </div>
    </form>
  )
}

export default NonCommissionForm

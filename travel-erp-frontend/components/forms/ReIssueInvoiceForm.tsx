import React, { useEffect, useMemo, useState } from 'react'
import { User, Calendar, DollarSign } from 'lucide-react'
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '../ui/combobox'
import SuccessPopup from '../common/SuccessPopup'
import { api } from '../../lib/api'

interface ReIssueInvoiceFormProps {
  employeesList: { id: number; name: string }[]
  clientsList: { id: number; name: string }[]
  invoiceNo?: string
  salesDate?: string
  dueDate?: string
  ticketNo?: string
  penalties?: number
  fareDifference?: number
  taxDifference?: number
  purchasePrice?: number
  extraFee?: number
  discount?: number
  airline?: string
  route?: string
  pnr?: string
}

const ReIssueInvoiceForm = ({ employeesList, clientsList }: ReIssueInvoiceFormProps) => {
  const [penalties, setPenalties] = useState(0)
  const [fareDifference, setFareDifference] = useState(0)
  const [taxDifference, setTaxDifference] = useState(0)
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

  const purchasePrice = useMemo(
    () => penalties + fareDifference + taxDifference,
    [fareDifference, penalties, taxDifference],
  )
  const clientPrice = useMemo(() => purchasePrice + extraFee - discount, [discount, extraFee, purchasePrice])
  const profit = useMemo(() => clientPrice - purchasePrice, [clientPrice, purchasePrice])

  const createInvoice = async (invoiceData: any) => {
    const { data } = await api.post('/invoices/reissue', invoiceData)

    if (!data.success) {
      throw new Error(data.message || 'Failed to create invoice')
    }

    return data
  }

  useEffect(() => {
    if (!successOpen) {
      return
    }

    const timeout = window.setTimeout(() => setSuccessOpen(false), 2500)
    return () => window.clearTimeout(timeout)
  }, [successOpen])

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
      ticketNo: toStringValue(formData.get('ticketNo')),
      penalties,
      fareDifference,
      taxDifference,
      purchasePrice,
      extraFee,
      discount,
      airline: toStringValue(formData.get('airline')),
      route: toStringValue(formData.get('route')),
      pnr: toStringValue(formData.get('pnr')),
    }

    try {
      const result = await createInvoice(invoiceData)
      setSuccessDetail(
        `Invoice ${result.data?.invoiceNo || invoiceData.invoiceNumber} saved with ৳${clientPrice.toFixed(2)} total value.`,
      )
      setSuccessOpen(true)
      e.currentTarget.reset()
      setPenalties(0)
      setFareDifference(0)
      setTaxDifference(0)
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
        title="Reissue invoice saved"
        message="The reissue invoice was created successfully."
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
            name="salesBy"
            // value={salesBy}
            // onChange={(e) => setSalesBy(e.target.value)}
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
            name="invoiceNo"
            type="text"
            // value={invoiceNo}
            // onChange={(e) => setInvoiceNo(e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 font-semibold outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-slate-500 font-bold mb-1">Sales Date</label>
          <input
            name="salesDate"
            type="date"
            // value={salesDate}
            // onChange={(e) => setSalesDate(e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 font-bold mb-1">Due Date</label>
          <input
            name="dueDate"
            type="date"
            // value={dueDate}
            // onChange={(e) => setDueDate(e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
          />
        </div>
      </div>

      {/* Reissue Pricing differences */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 space-y-4">
        <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-100 pb-2">
          Reissue Difference Calculations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-500 font-bold mb-1">Ticket No *</label>
            <input
              name="ticketNo"
              type="text"
              // value={ticketNo}
              // onChange={(e) => setTicketNo(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Airline Penalties *</label>
            <input
              name="penalties"
              type="number"
              onChange={(e) => setPenalties(Number(e.target.value) || 0)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Fare Difference *</label>
            <input
              type="number"
              name="fareDifference"
              // value={fareDifference}
              // onChange={(e) => setFareDifference(Number(e.target.value))}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Tax Difference *</label>
            <input
              type="number"
              name="taxDifference"
              // value={taxDifference}
              // onChange={(e) => setTaxDifference(Number(e.target.value))}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-slate-500 font-bold mb-1">Total Purchase Price (Calculated)</label>
            <input
              type="number"
              name="purchasePrice"
              value={purchasePrice}
              readOnly
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-100 text-slate-600 outline-none font-bold"
            />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Client Reissue Markup (Extra Fee)</label>
            <input
              name="extraFee"
              type="number"
              onChange={(e) => setExtraFee(Number(e.target.value) || 0)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Reissue Discount</label>
            <input
              name="discount"
              type="number"
              onChange={(e) => setDiscount(Number(e.target.value) || 0)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
            />
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 flex flex-col justify-center">
            <span className="block text-4xs font-bold text-blue-500 uppercase font-medium">Reissue Net Profit</span>
            <span className="text-sm font-black text-blue-700">৳{profit.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 space-y-4">
        <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-100 pb-2">
          Flight & Routing Specifics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
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
            <label className="block text-slate-500 font-bold mb-1">Route / Sector *</label>
            <input
              type="text"
              name="route"
              // value={route}
              // onChange={(e) => setRoute(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">PNR *</label>
            <input
              type="text"
              name="pnr"
              // value={pnr}
              // onChange={(e) => setPnr(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 uppercase outline-none"
              required
            />
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
          className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-lg shadow-blue-500/20"
        >
          {isSubmitting ? 'Saving Reissue Invoice...' : 'Save Reissue Invoice'}
        </button>
      </div>
    </form>
  )
}

export default ReIssueInvoiceForm

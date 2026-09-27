import React, { useEffect, useMemo, useState } from 'react'
import { Calendar, DollarSign, Plus, Save, Trash2 } from 'lucide-react'
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
  const [passengers, setPassengers] = useState([
    { passengerName: '', ticketNo: '', pnr: '', route: '', penalties: 0, fareDifference: 0, taxDifference: 0 },
  ])
  const [extraFee, setExtraFee] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [validationError, setValidationError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [successDetail, setSuccessDetail] = useState('')

  const toStringValue = (value: FormDataEntryValue | null) => {
    if (value === null) {
      return ''
    }
    return String(value).trim()
  }

  const totals = useMemo(() => {
    const purchasePrice = passengers.reduce(
      (total, passenger) => total + passenger.penalties + passenger.fareDifference + passenger.taxDifference,
      0,
    )
    const clientPrice = purchasePrice + extraFee - discount
    return { purchasePrice, clientPrice, profit: clientPrice - purchasePrice }
  }, [discount, extraFee, passengers])

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
    const ticketNumbers = passengers.map((passenger) => passenger.ticketNo.trim()).filter(Boolean)
    if (new Set(ticketNumbers).size !== ticketNumbers.length) {
      setValidationError('Each passenger must have a unique ticket number.')
      return
    }

    setValidationError('')
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    const invoiceData = {
      clientName: toStringValue(formData.get('clientName')),
      salesBy: toStringValue(formData.get('salesBy')),
      salesDate: toStringValue(formData.get('salesDate')),
      dueDate: toStringValue(formData.get('dueDate')),
      passengers: passengers.map((passenger, index) => ({
        paxName: passenger.passengerName,
        ticketNo: passenger.ticketNo,
        pnr: passenger.pnr,
        route: passenger.route,
        penalties: passenger.penalties,
        fareDifference: passenger.fareDifference,
        taxDifference: passenger.taxDifference,
        baseFare: passenger.penalties + passenger.fareDifference + passenger.taxDifference,
        clientPrice:
          passenger.penalties +
          passenger.fareDifference +
          passenger.taxDifference +
          (index === 0 ? extraFee - discount : 0),
        extraFee: index === 0 ? extraFee : 0,
        discount: index === 0 ? discount : 0,
      })),
      extraFee,
      discount,
      airline: toStringValue(formData.get('airline')),
      route: toStringValue(formData.get('route')),
      pnr: toStringValue(formData.get('pnr')),
    }

    try {
      const result = await createInvoice(invoiceData)
      setSuccessDetail(`Invoice ${result.data?.invoiceNo} saved with ৳${totals.clientPrice.toFixed(2)} total value.`)
      setSuccessOpen(true)
      e.currentTarget.reset()
      setPassengers([
        { passengerName: '', ticketNo: '', pnr: '', route: '', penalties: 0, fareDifference: 0, taxDifference: 0 },
      ])
      setExtraFee(0)
      setDiscount(0)
      setValidationError('')
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

      {/* Reissue passengers and pricing */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 space-y-4">
        <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-100 pb-2">
          Reissue Difference Calculations
        </h3>
        {passengers.map((passenger, index) => (
          <div key={index} className="border border-slate-100 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">Passenger {index + 1}</span>
              {passengers.length > 1 && (
                <button
                  type="button"
                  onClick={() => setPassengers(passengers.filter((_, row) => row !== index))}
                  className="text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              {(['passengerName', 'ticketNo', 'pnr', 'route'] as const).map((field) => (
                <div key={field}>
                  <label className="block text-slate-500 font-bold mb-1">
                    {field === 'passengerName' ? 'Passenger Name *' : field.toUpperCase()}
                  </label>
                  <input
                    value={passenger[field]}
                    required
                    onChange={(event) =>
                      setPassengers(
                        passengers.map((row, rowIndex) =>
                          rowIndex === index ? { ...row, [field]: event.target.value } : row,
                        ),
                      )
                    }
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
                  />
                </div>
              ))}
              {(['penalties', 'fareDifference', 'taxDifference'] as const).map((field) => (
                <div key={field}>
                  <label className="block text-slate-500 font-bold mb-1">{field.replace(/([A-Z])/g, ' $1')}</label>
                  <input
                    type="number"
                    value={passenger[field]}
                    onChange={(event) =>
                      setPassengers(
                        passengers.map((row, rowIndex) =>
                          rowIndex === index ? { ...row, [field]: Number(event.target.value) || 0 } : row,
                        ),
                      )
                    }
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
                  />
                </div>
              ))}
              <div className="bg-slate-100 rounded-lg p-2 flex items-center font-bold text-slate-600">
                Purchase: ৳{(passenger.penalties + passenger.fareDifference + passenger.taxDifference).toFixed(2)}
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setPassengers([
              ...passengers,
              {
                passengerName: '',
                ticketNo: '',
                pnr: '',
                route: '',
                penalties: 0,
                fareDifference: 0,
                taxDifference: 0,
              },
            ])
          }
          className="flex items-center gap-1.5 px-4 py-2 border border-dashed border-blue-300 text-blue-600 rounded-xl text-xs font-bold"
        >
          <Plus className="h-4 w-4" /> Add Passenger
        </button>
        {validationError && <p className="text-red-600 text-xs font-semibold">{validationError}</p>}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-500 font-bold mb-1">Total Purchase Price</label>
            <input
              type="number"
              value={totals.purchasePrice}
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
            <span className="block text-4xs font-bold text-blue-500 uppercase">Reissue Net Profit</span>
            <span className="text-sm font-black text-blue-700">৳{totals.profit.toFixed(2)}</span>
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
            <select
              name="airline"
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
            >
              <option>Emirates</option>
              <option>Qatar Airways</option>
              <option>Singapore Airlines</option>
              <option>Turkish Airlines</option>
              <option>US-Bangla Airlines</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Route / Sector *</label>
            <input
              type="text"
              name="route"
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

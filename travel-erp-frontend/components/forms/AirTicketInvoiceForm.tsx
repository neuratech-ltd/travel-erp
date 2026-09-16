import React, { useEffect, useMemo } from 'react'
import { Controller, useForm, useFieldArray, useWatch } from 'react-hook-form'
import { User, Calendar, DollarSign, Save, Plus, Trash2 } from 'lucide-react'
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '../ui/combobox'
import SuccessPopup from '../common/SuccessPopup'
import { api } from '../../lib/api'

interface AirTicketInvoiceFormProps {
  employeesList: { id: number; name: string }[]
  clientsList: { id: number; name: string }[]
}

interface PassengerRow {
  passengerName: string
  passengerType: string
  passportNo: string
  contactNo: string
  passengerEmail: string
  dateOfBirth: string
  passportIssueDate: string
  passportExpiryDate: string
  ticketNo: string
  pnr: string
  route: string
  ticketClass: string
  journeyDate: string
  returnDate: string
  travelSegment: string
  ticketingRemarks: string
  baseFare: number
  taxesCommission: number
  aitTax: number
  commissionPct: number
  clientPrice: number
  discountGiven: number
  extraFee: number
}

interface FormValues {
  clientName: string
  referenceBy: string
  issueDate: string
  airline: string
  passengers: PassengerRow[]
}

const emptyPassenger: PassengerRow = {
  passengerName: '',
  passengerType: 'Adult',
  passportNo: '',
  contactNo: '',
  passengerEmail: '',
  dateOfBirth: '',
  passportIssueDate: '',
  passportExpiryDate: '',
  ticketNo: '',
  pnr: '',
  route: '',
  ticketClass: 'Economy',
  journeyDate: '',
  returnDate: '',
  travelSegment: '',
  ticketingRemarks: '',
  baseFare: 0,
  taxesCommission: 0,
  aitTax: 0,
  commissionPct: 0,
  clientPrice: 0,
  discountGiven: 0,
  extraFee: 0,
}

const computeRow = (p: PassengerRow) => {
  const baseFare = Number(p.baseFare) || 0
  const taxesCommission = Number(p.taxesCommission) || 0
  const aitTax = Number(p.aitTax) || 0
  const commissionPct = Number(p.commissionPct) || 0
  const clientPrice = Number(p.clientPrice) || 0
  const discountGiven = Number(p.discountGiven) || 0
  const extraFee = Number(p.extraFee) || 0

  const calculatedCommission = Number(((baseFare * commissionPct) / 100).toFixed(2))
  const purchaseCost = Number((baseFare + taxesCommission + aitTax - calculatedCommission).toFixed(2))
  const netCommission = Number((calculatedCommission - extraFee).toFixed(2))
  const profit = Number((clientPrice - purchaseCost - discountGiven + extraFee).toFixed(2))

  return { calculatedCommission, purchaseCost, netCommission, profit }
}

const AirTicketInvoiceForm = ({ employeesList, clientsList }: AirTicketInvoiceFormProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [successOpen, setSuccessOpen] = React.useState(false)
  const [successDetail, setSuccessDetail] = React.useState('')
  const [serverError, setServerError] = React.useState('')

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
  } = useForm<FormValues>({
    defaultValues: {
      clientName: '',
      referenceBy: '',
      issueDate: '',
      airline: 'Emirates',
      passengers: [emptyPassenger],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'passengers' })
  const watchedPassengers = useWatch({ control, name: 'passengers' })

  useEffect(() => {
    if (!successOpen) return
    const timeout = window.setTimeout(() => setSuccessOpen(false), 2500)
    return () => window.clearTimeout(timeout)
  }, [successOpen])

  const totals = useMemo(() => {
    const rows = watchedPassengers ?? []
    return rows.reduce(
      (acc, p) => {
        const { purchaseCost, profit } = computeRow(p)
        return {
          clientPrice: acc.clientPrice + (Number(p.clientPrice) || 0),
          purchaseCost: acc.purchaseCost + purchaseCost,
          profit: acc.profit + profit,
        }
      },
      { clientPrice: 0, purchaseCost: 0, profit: 0 },
    )
  }, [watchedPassengers])

  const createInvoice = async (invoiceData: any) => {
    const { data } = await api.post('/invoices/air-ticket', invoiceData)
    if (!data.success) {
      throw new Error(data.message || 'Failed to create invoice')
    }
    return data
  }

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    setServerError('')

    const invoiceData = {
      clientName: values.clientName,
      reference: values.referenceBy,
      issueDate: values.issueDate,
      airline: values.airline,
      passengers: values.passengers.map((p) => ({
        paxName: p.passengerName,
        paxType: p.passengerType,
        passportNo: p.passportNo || undefined,
        contactNo: p.contactNo || undefined,
        email: p.passengerEmail || undefined,
        dob: p.dateOfBirth || undefined,
        passportIssueDate: p.passportIssueDate || undefined,
        passportExpiryDate: p.passportExpiryDate || undefined,
        ticketNo: p.ticketNo,
        pnr: p.pnr,
        route: p.route,
        class: p.ticketClass,
        journeyDate: p.journeyDate || undefined,
        returnDate: p.returnDate || undefined,
        segment: p.travelSegment || undefined,
        ticketingRemarks: p.ticketingRemarks || undefined,
        baseFare: p.baseFare,
        taxesCommission: p.taxesCommission,
        aitTax: p.aitTax,
        commissionPct: p.commissionPct,
        clientPrice: p.clientPrice,
        discount: p.discountGiven,
        extraFee: p.extraFee,
      })),
    }

    try {
      const result = await createInvoice(invoiceData)
      setSuccessDetail(
        `Invoice ${result.data?.invoiceNo} saved with ৳${totals.profit.toFixed(2)} total profit across ${values.passengers.length} passenger(s).`,
      )
      setSuccessOpen(true)
      reset({
        clientName: '',
        referenceBy: '',
        issueDate: '',
        airline: 'Emirates',
        passengers: [emptyPassenger],
      })
    } catch (error: any) {
      console.error('Error creating invoice:', error)
      setServerError(error?.response?.data?.message ?? error?.message ?? 'Failed to save invoice')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="ticket-invoice-form" className="space-y-6">
      <SuccessPopup
        open={successOpen}
        title="Air ticket invoice saved"
        message="The air ticket invoice was created successfully."
        detail={successDetail}
        onClose={() => setSuccessOpen(false)}
      />

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl p-3">
          {serverError}
        </div>
      )}

      {/* Invoice header — no invoice number input, no due date, no agent select */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div>
          <label className="block text-slate-500 font-bold mb-1">Search Client *</label>
          <Controller
            control={control}
            name="clientName"
            rules={{ required: 'Client is required' }}
            render={({ field }) => {
              const selectedItem = clientsList.find((c) => c.name === field.value) ?? null

              return (
                <Combobox
                  items={clientsList}
                  value={selectedItem}
                  onValueChange={(item: { id: number; name: string } | null) => field.onChange(item?.name ?? '')}
                  itemToStringValue={(item: { id: number; name: string } | null) => item?.name ?? ''}
                  itemToStringLabel={(item: { id: number; name: string } | null) => item?.name ?? ''}
                >
                  <ComboboxInput placeholder="Select a client" onBlur={field.onBlur} />
                  <ComboboxContent>
                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item: { id: number; name: string }) => (
                        <ComboboxItem key={item.id} value={item}>
                          {item.name}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              )
            }}
          />
          {errors.clientName && <span className="text-red-500 text-3xs">{errors.clientName.message}</span>}
        </div>

        <div>
          <label className="block text-slate-500 font-bold mb-1">Reference By</label>
          <select
            {...register('referenceBy')}
            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
          >
            <option value="">Select Employee</option>
            {employeesList.map((emp) => (
              <option key={emp.id} value={emp.name}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-500 font-bold mb-1">Issue Date</label>
          <input
            type="date"
            {...register('issueDate', { required: true })}
            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
          />
          {errors.issueDate && <span className="text-red-500">Issue date is required</span>}
        </div>

        <div>
          <label className="block text-slate-500 font-bold mb-1">Airline</label>
          <select
            {...register('airline', { required: true })}
            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
          >
            <option>Emirates</option>
            <option>Qatar Airways</option>
            <option>Singapore Airlines</option>
            <option>Turkish Airlines</option>
            <option>US-Bangla Airlines</option>
          </select>
        </div>
      </div>

      {/* Passenger cards */}
      {fields.map((field, index) => {
        const row = watchedPassengers?.[index] ?? emptyPassenger
        const { calculatedCommission, purchaseCost, netCommission, profit } = computeRow(row)
        const passengerErrors = errors.passengers?.[index]

        return (
          <div key={field.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase flex items-center gap-1.5">
                <User className="h-4 w-4 text-blue-500" />
                Passenger {index + 1}
              </h3>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="flex items-center gap-1 text-2xs font-bold text-red-500 hover:text-red-600 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              )}
            </div>

            {/* Fare breakdown */}
            <div>
              <h4 className="text-3xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-blue-500" />
                Ticket & Fare Breakdown
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Ticket No *</label>
                  <input
                    type="text"
                    placeholder="e.g. 997-38592038"
                    {...register(`passengers.${index}.ticketNo`, { required: true })}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
                  />
                  {passengerErrors?.ticketNo && <span className="text-red-500">Required</span>}
                </div>

                <div>
                  <label className="block text-slate-500 font-bold mb-1">PNR * (6 digits)</label>
                  <input
                    type="text"
                    placeholder="e.g. 384920"
                    maxLength={6}
                    inputMode="numeric"
                    {...register(`passengers.${index}.pnr`, {
                      required: 'PNR is required',
                      pattern: { value: /^\d{6}$/, message: '6-digit numeric PNR required' },
                      validate: (value) => {
                        const all = getValues('passengers').map((p) => p.pnr)
                        const dupes = all.filter((p) => p === value)
                        return dupes.length <= 1 || 'Duplicate PNR in this invoice'
                      },
                    })}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
                  />
                  {passengerErrors?.pnr && <span className="text-red-500">{passengerErrors.pnr.message}</span>}
                </div>

                <div>
                  <label className="block text-slate-500 font-bold mb-1">Route / Sector *</label>
                  <input
                    type="text"
                    placeholder="e.g. DAC-DXB"
                    {...register(`passengers.${index}.route`, { required: true })}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
                  />
                  {passengerErrors?.route && <span className="text-red-500">Required</span>}
                </div>

                <div>
                  <label className="block text-slate-500 font-bold mb-1">Class</label>
                  <select
                    {...register(`passengers.${index}.ticketClass`)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
                  >
                    <option>Economy</option>
                    <option>Premium Economy</option>
                    <option>Business</option>
                    <option>First Class</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-bold mb-1">Base Fare (Buy) *</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register(`passengers.${index}.baseFare`, { required: true, valueAsNumber: true })}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Taxes Commission</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register(`passengers.${index}.taxesCommission`, { valueAsNumber: true })}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">AIT Tax</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register(`passengers.${index}.aitTax`, { valueAsNumber: true })}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Client Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register(`passengers.${index}.clientPrice`, { required: true, valueAsNumber: true })}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-bold mb-1">Commission %</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register(`passengers.${index}.commissionPct`, { valueAsNumber: true })}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Calculated Commission</label>
                  <input
                    type="number"
                    value={calculatedCommission}
                    readOnly
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-100 text-slate-600 outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Purchase Cost</label>
                  <input
                    type="number"
                    value={purchaseCost}
                    readOnly
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-100 text-slate-600 outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Net Commission</label>
                  <input
                    type="number"
                    value={netCommission}
                    readOnly
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-100 text-slate-600 outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-bold mb-1">Discount Given</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register(`passengers.${index}.discountGiven`, { valueAsNumber: true })}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Extra Fee / Service Charge</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register(`passengers.${index}.extraFee`, { valueAsNumber: true })}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
                  />
                </div>
                <div className="bg-blue-50/50 p-2.5 rounded-lg border border-blue-100 col-span-2 flex items-center justify-between">
                  <div>
                    <span className="block text-3xs font-bold text-blue-500 uppercase">Profit (this passenger)</span>
                    <span className="text-sm font-black text-blue-700">৳{profit.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pax & passport details */}
            <div className="pt-2 border-t border-slate-50">
              <h4 className="text-3xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-blue-500" />
                Pax & Passport Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Passenger Name *</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    {...register(`passengers.${index}.passengerName`, { required: true })}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
                  />
                  {passengerErrors?.passengerName && <span className="text-red-500">Required</span>}
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Passenger Type</label>
                  <select
                    {...register(`passengers.${index}.passengerType`)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
                  >
                    <option>Adult</option>
                    <option>Child</option>
                    <option>Infant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Passport No</label>
                  <input
                    type="text"
                    placeholder="e.g. A048592"
                    {...register(`passengers.${index}.passportNo`)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Contact No</label>
                  <input
                    type="text"
                    placeholder="+8801..."
                    {...register(`passengers.${index}.contactNo`)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-bold mb-1">Passenger Email</label>
                  <input
                    type="email"
                    placeholder="pax@domain.com"
                    {...register(`passengers.${index}.passengerEmail`)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Date of Birth</label>
                  <input
                    type="date"
                    {...register(`passengers.${index}.dateOfBirth`)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Passport Issue Date</label>
                  <input
                    type="date"
                    {...register(`passengers.${index}.passportIssueDate`)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Passport Expiry Date</label>
                  <input
                    type="date"
                    {...register(`passengers.${index}.passportExpiryDate`)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Flight schedule */}
            <div className="pt-2 border-t border-slate-50">
              <h4 className="text-3xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-blue-500" />
                Flight Schedule & Routing (Optional)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Journey Date</label>
                  <input
                    type="date"
                    {...register(`passengers.${index}.journeyDate`)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Return Date</label>
                  <input
                    type="date"
                    {...register(`passengers.${index}.returnDate`)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Travel Segment</label>
                  <input
                    type="text"
                    placeholder="e.g. DAC-DXB"
                    {...register(`passengers.${index}.travelSegment`)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Ticketing Remarks</label>
                  <input
                    type="text"
                    placeholder="FBA: 30Kgs, No refunds"
                    {...register(`passengers.${index}.ticketingRemarks`)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )
      })}

      <button
        type="button"
        onClick={() => append(emptyPassenger)}
        className="flex items-center gap-1.5 px-4 py-2 border border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-bold cursor-pointer transition-all"
      >
        <Plus className="h-4 w-4" />
        Add Passenger
      </button>

      {/* Invoice-level totals */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs">
        <span className="font-bold text-slate-700 uppercase tracking-wider">Invoice Totals</span>
        <div className="flex flex-wrap gap-4 font-bold">
          <span className="text-slate-600">Client: ৳{totals.clientPrice.toFixed(2)}</span>
          <span className="text-slate-600">Cost: ৳{totals.purchaseCost.toFixed(2)}</span>
          <span className="text-blue-700">Profit: ৳{totals.profit.toFixed(2)}</span>
        </div>
      </div>

      {/* Form Actions */}
      <div id="form-submit-panel" className="flex items-center justify-end gap-3 pb-8">
        <button
          type="button"
          id="cancel-invoice-btn"
          className="px-6 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95"
        >
          Cancel
        </button>
        <button
          type="submit"
          id="save-invoice-btn"
          disabled={isSubmitting}
          className="flex items-center gap-1.5 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? 'Saving Invoice...' : 'Save Invoice'}
        </button>
      </div>
    </form>
  )
}

export default AirTicketInvoiceForm

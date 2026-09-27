import React, { useEffect, useMemo } from 'react'
import { Calendar, DollarSign, Plus, Save, Trash2, User } from 'lucide-react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '../ui/combobox'
import SuccessPopup from '../common/SuccessPopup'
import { api } from '../../lib/api'

interface NonCommissionFormProps {
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
  journeyDate: string
  returnDate: string
  grossFare: number
  taxesCommission: number
  aitTax: number
  clientPrice: number
  discount: number
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
  journeyDate: '',
  returnDate: '',
  grossFare: 0,
  taxesCommission: 0,
  aitTax: 0,
  clientPrice: 0,
  discount: 0,
  extraFee: 0,
}

const inputClass =
  'w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none'

const computeRow = (passenger: PassengerRow) => {
  const grossFare = Number(passenger.grossFare) || 0
  const taxesCommission = Number(passenger.taxesCommission) || 0
  const aitTax = Number(passenger.aitTax) || 0
  const purchasePrice = Number(
    (grossFare + (grossFare * taxesCommission) / 100 + (grossFare * aitTax) / 100).toFixed(2),
  )
  const clientPrice = Number(passenger.clientPrice) || 0
  const discount = Number(passenger.discount) || 0
  const extraFee = Number(passenger.extraFee) || 0
  return {
    grossMargin: Number((clientPrice - grossFare).toFixed(2)),
    profit: Number((clientPrice - purchasePrice - discount + extraFee).toFixed(2)),
    clientPrice,
    purchasePrice,
  }
}

const NonCommissionForm = ({ employeesList, clientsList }: NonCommissionFormProps) => {
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
    defaultValues: { clientName: '', referenceBy: '', issueDate: '', airline: '', passengers: [emptyPassenger] },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'passengers' })
  const watchedPassengers = useWatch({ control, name: 'passengers' })

  useEffect(() => {
    if (!successOpen) return
    const timeout = window.setTimeout(() => setSuccessOpen(false), 2500)
    return () => window.clearTimeout(timeout)
  }, [successOpen])

  const totals = useMemo(
    () =>
      (watchedPassengers ?? []).reduce(
        (total, passenger) => {
          const row = computeRow(passenger)
          return {
            clientPrice: total.clientPrice + row.clientPrice,
            purchasePrice: total.purchasePrice + row.purchasePrice,
            profit: total.profit + row.profit,
          }
        },
        { clientPrice: 0, purchasePrice: 0, profit: 0 },
      ),
    [watchedPassengers],
  )

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    setServerError('')
    const invoiceData = {
      clientName: values.clientName,
      reference: values.referenceBy,
      issueDate: values.issueDate,
      airline: values.airline || undefined,
      passengers: values.passengers.map((passenger) => ({
        paxName: passenger.passengerName,
        paxType: passenger.passengerType,
        passportNo: passenger.passportNo || undefined,
        contactNo: passenger.contactNo || undefined,
        email: passenger.passengerEmail || undefined,
        dob: passenger.dateOfBirth || undefined,
        passportIssueDate: passenger.passportIssueDate || undefined,
        passportExpiryDate: passenger.passportExpiryDate || undefined,
        ticketNo: passenger.ticketNo,
        pnr: passenger.pnr,
        route: passenger.route,
        journeyDate: passenger.journeyDate || undefined,
        returnDate: passenger.returnDate || undefined,
        baseFare: passenger.grossFare,
        taxesCommission: passenger.taxesCommission,
        aitTax: passenger.aitTax,
        commissionPct: 0,
        clientPrice: passenger.clientPrice,
        discount: passenger.discount,
        extraFee: passenger.extraFee,
      })),
    }

    try {
      const { data } = await api.post('/invoices/non-commission', invoiceData)
      if (!data.success) throw new Error(data.message || 'Failed to create invoice')
      setSuccessDetail(
        `Invoice ${data.data?.invoiceNo} saved with ৳${totals.profit.toFixed(2)} total profit across ${values.passengers.length} passenger(s).`,
      )
      setSuccessOpen(true)
      reset({ clientName: '', referenceBy: '', issueDate: '', airline: '', passengers: [emptyPassenger] })
    } catch (error: any) {
      console.error('Error creating non-commission invoice:', error)
      setServerError(error?.response?.data?.message ?? error?.message ?? 'Failed to save invoice')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="non-commission-invoice-form" className="space-y-6">
      <SuccessPopup
        open={successOpen}
        title="Non-commission invoice saved"
        message="The non-commission invoice was created successfully."
        detail={successDetail}
        onClose={() => setSuccessOpen(false)}
      />
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl p-3">
          {serverError}
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block text-slate-500 font-bold mb-1">Search Client *</label>
          <Controller
            control={control}
            name="clientName"
            rules={{ required: 'Client is required' }}
            render={({ field }) => {
              const selectedItem = clientsList.find((client) => client.name === field.value) ?? null
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
          <select {...register('referenceBy', { required: 'Reference employee is required' })} className={inputClass}>
            <option value="">Select Employee</option>
            {employeesList.map((employee) => (
              <option key={employee.id} value={employee.name}>
                {employee.name}
              </option>
            ))}
          </select>
          {errors.referenceBy && <span className="text-red-500 text-3xs">{errors.referenceBy.message}</span>}
        </div>
        <div>
          <label className="block text-slate-500 font-bold mb-1">Issue Date</label>
          <input
            type="date"
            {...register('issueDate', { required: 'Issue date is required' })}
            className={inputClass}
          />
          {errors.issueDate && <span className="text-red-500 text-3xs">{errors.issueDate.message}</span>}
        </div>
        <div>
          <label className="block text-slate-500 font-bold mb-1">Airline</label>
          <select {...register('airline')} className={inputClass}>
            <option>Emirates</option>
            <option>Qatar Airways</option>
            <option>Singapore Airlines</option>
            <option>Turkish Airlines</option>
            <option>US-Bangla Airlines</option>
          </select>
        </div>
      </div>

      {fields.map((field, index) => {
        const passenger = watchedPassengers?.[index] ?? emptyPassenger
        const row = computeRow(passenger)
        const passengerErrors = errors.passengers?.[index]
        const fieldName = (name: keyof PassengerRow) => `passengers.${index}.${name}` as const
        return (
          <div key={field.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase flex items-center gap-1.5">
                <User className="h-4 w-4 text-indigo-500" />
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
            <div>
              <h4 className="text-3xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-indigo-500" />
                Ticket & Fare Breakdown
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <Field label="Ticket No *" error={passengerErrors?.ticketNo?.message}>
                  <input
                    type="text"
                    {...register(fieldName('ticketNo'), {
                      required: 'Ticket number is required',
                      validate: (value) => {
                        const ticketNumbers = getValues('passengers').map((passenger) => passenger.ticketNo)
                        return (
                          ticketNumbers.filter((ticketNo) => ticketNo === value).length <= 1 ||
                          'Duplicate ticket number in this invoice'
                        )
                      },
                    })}
                    className={inputClass}
                  />
                </Field>
                <Field label="PNR *" error={passengerErrors?.pnr?.message}>
                  <input
                    type="text"
                    placeholder="e.g. ABC123"
                    {...register(fieldName('pnr'), {
                      required: 'PNR is required',
                      validate: (value) => {
                        const pnrs = getValues('passengers').map((item) => item.pnr)
                        return pnrs.filter((pnr) => pnr === value).length <= 1 || 'Duplicate PNR in this invoice'
                      },
                    })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Route / Sector *" error={passengerErrors?.route?.message}>
                  <input
                    type="text"
                    {...register(fieldName('route'), { required: 'Route is required' })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Gross Fare (Sale)">
                  <input
                    type="number"
                    step="0.01"
                    {...register(fieldName('grossFare'), { valueAsNumber: true })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Purchase Price (Net Rate)">
                  <input type="number" step="0.01" value={row.purchasePrice} readOnly className={inputClass} />
                </Field>
                <Field label="Taxes Commission %">
                  <input
                    type="number"
                    step="0.01"
                    {...register(fieldName('taxesCommission'), { valueAsNumber: true })}
                    className={inputClass}
                  />
                </Field>
                <Field label="AIT Tax %">
                  <input
                    type="number"
                    step="0.01"
                    {...register(fieldName('aitTax'), { valueAsNumber: true })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Total Client Price *" error={passengerErrors?.clientPrice?.message}>
                  <input
                    type="number"
                    step="0.01"
                    {...register(fieldName('clientPrice'), {
                      required: 'Client price is required',
                      valueAsNumber: true,
                    })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Discount">
                  <input
                    type="number"
                    step="0.01"
                    {...register(fieldName('discount'), { valueAsNumber: true })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Extra Fee / Service Charge">
                  <input
                    type="number"
                    step="0.01"
                    {...register(fieldName('extraFee'), { valueAsNumber: true })}
                    className={inputClass}
                  />
                </Field>
                <div className="bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100">
                  <span className="block text-3xs font-bold text-indigo-500 uppercase">Profit</span>
                  <span className="text-sm font-black text-indigo-700">৳{row.profit.toFixed(2)}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="block text-3xs font-bold text-slate-400 uppercase">Gross Margin</span>
                  <span className="text-sm font-black text-slate-700">৳{row.grossMargin.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-50">
              <h4 className="text-3xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-indigo-500" />
                Passenger Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <Field label="Passenger Name *" error={passengerErrors?.passengerName?.message}>
                  <input
                    type="text"
                    {...register(fieldName('passengerName'), { required: 'Passenger name is required' })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Passenger Type">
                  <select {...register(fieldName('passengerType'))} className={inputClass}>
                    <option>Adult</option>
                    <option>Child</option>
                    <option>Infant</option>
                  </select>
                </Field>
                <Field label="Passport No">
                  <input type="text" {...register(fieldName('passportNo'))} className={inputClass} />
                </Field>
                <Field label="Contact No">
                  <input type="text" {...register(fieldName('contactNo'))} className={inputClass} />
                </Field>
                <Field label="Passenger Email">
                  <input type="email" {...register(fieldName('passengerEmail'))} className={inputClass} />
                </Field>
                <Field label="Date of Birth">
                  <input type="date" {...register(fieldName('dateOfBirth'))} className={inputClass} />
                </Field>
                <Field label="Passport Issue Date">
                  <input type="date" {...register(fieldName('passportIssueDate'))} className={inputClass} />
                </Field>
                <Field label="Passport Expiry Date">
                  <input type="date" {...register(fieldName('passportExpiryDate'))} className={inputClass} />
                </Field>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-50">
              <h4 className="text-3xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                Flight Schedule (Optional)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <Field label="Journey Date">
                  <input type="date" {...register(fieldName('journeyDate'))} className={inputClass} />
                </Field>
                <Field label="Return Date">
                  <input type="date" {...register(fieldName('returnDate'))} className={inputClass} />
                </Field>
              </div>
            </div>
          </div>
        )
      })}

      <button
        type="button"
        onClick={() => append(emptyPassenger)}
        className="flex items-center gap-1.5 px-4 py-2 border border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50 rounded-xl text-xs font-bold cursor-pointer transition-all"
      >
        <Plus className="h-4 w-4" />
        Add Passenger
      </button>
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs">
        <span className="font-bold text-slate-700 uppercase tracking-wider">Invoice Totals</span>
        <div className="flex flex-wrap gap-4 font-bold">
          <span className="text-slate-600">Client: ৳{totals.clientPrice.toFixed(2)}</span>
          <span className="text-slate-600">Cost: ৳{totals.purchasePrice.toFixed(2)}</span>
          <span className="text-indigo-700">Profit: ৳{totals.profit.toFixed(2)}</span>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 pb-8">
        <button
          type="button"
          className="px-6 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold cursor-pointer transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-1.5 px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? 'Saving Invoice...' : 'Save Invoice'}
        </button>
      </div>
    </form>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-slate-500 font-bold mb-1">{label}</label>
      {children}
      {error && <span className="text-red-500 text-3xs">{error}</span>}
    </div>
  )
}

export default NonCommissionForm

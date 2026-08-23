import React, { useEffect, useMemo, useState } from 'react'
import { ShieldAlert, Hotel, Ship } from 'lucide-react'
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '../ui/combobox'
import SuccessPopup from '../common/SuccessPopup'

interface HotelAndVisaFormProps {
  bookingType: 'Hotel' | 'Visa'
  loading: boolean
  employeesList: { id: number; name: string }[]
  clientsList: { id: number; name: string }[]
}

const HotelAndVisaForm = ({ bookingType, loading, employeesList, clientsList }: HotelAndVisaFormProps) => {
  const [hotelNights, setHotelNights] = useState(1)
  const [hotelCost, setHotelCost] = useState(0)
  const [hotelSale, setHotelSale] = useState(0)
  const [visaCost, setVisaCost] = useState(0)
  const [visaSale, setVisaSale] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [successDetail, setSuccessDetail] = useState('')

  const currentPurchasePrice = useMemo(() => {
    return bookingType === 'Hotel' ? hotelCost * Math.max(1, hotelNights) : visaCost
  }, [bookingType, hotelCost, hotelNights, visaCost])

  const currentClientPrice = useMemo(() => {
    return bookingType === 'Hotel' ? hotelSale * Math.max(1, hotelNights) : visaSale
  }, [bookingType, hotelSale, hotelNights, visaSale])

  const currentProfit = useMemo(
    () => currentClientPrice - currentPurchasePrice,
    [currentClientPrice, currentPurchasePrice],
  )

  useEffect(() => {
    if (!successOpen) {
      return
    }

    const timeout = window.setTimeout(() => setSuccessOpen(false), 2500)
    return () => window.clearTimeout(timeout)
  }, [successOpen])

  const toStringValue = (value: FormDataEntryValue | null) => {
    if (value === null) {
      return ''
    }

    return String(value).trim()
  }

  const createInvoice = async (invoiceData: Record<string, unknown>) => {
    const response = await fetch('/api/invoices/hotel-visa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoiceData),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to create invoice')
    }

    return data
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const invoiceData = {
      bookingType,
      clientName: toStringValue(formData.get('clientName')),
      salesBy: toStringValue(formData.get('salesBy')),
      invoiceNumber: toStringValue(formData.get('invoiceNo')),
      salesDate: toStringValue(formData.get('salesDate')),
      dueDate: toStringValue(formData.get('dueDate')),
      paxName: toStringValue(formData.get('paxName')),
      route:
        bookingType === 'Hotel' ? toStringValue(formData.get('hotelName')) : toStringValue(formData.get('visaCountry')),
      purchasePrice: currentPurchasePrice,
      clientPrice: currentClientPrice,
      profit: currentProfit,
      hotelName: toStringValue(formData.get('hotelName')),
      roomType: toStringValue(formData.get('roomType')),
      nights: bookingType === 'Hotel' ? hotelNights : undefined,
      hotelCost,
      hotelSale,
      visaCountry: toStringValue(formData.get('visaCountry')),
      visaNo: toStringValue(formData.get('visaNo')),
      visaCost,
      visaSale,
    }

    try {
      const result = await createInvoice(invoiceData)
      setSuccessDetail(
        `Invoice ${result.data?.invoiceNo || invoiceData.invoiceNumber} saved with ৳${currentClientPrice.toFixed(2)} revenue.`,
      )
      setSuccessOpen(true)
      event.currentTarget.reset()
      setHotelNights(1)
      setHotelCost(0)
      setHotelSale(0)
      setVisaCost(0)
      setVisaSale(0)
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
        title="Booking invoice saved"
        message="The hotel or visa invoice was created successfully."
        detail={successDetail}
        onClose={() => setSuccessOpen(false)}
      />

      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
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
            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
          >
            <option value="Select Employee">Select Employee</option>
            {employeesList.map((employee) => (
              <option key={employee.id} value={employee.name}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-slate-500 font-bold mb-1">Invoice Voucher ID *</label>
          <input
            name="invoiceNo"
            type="text"
            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 font-bold outline-none"
            required
          />
        </div>
        <div className="flex items-end pb-1.5">
          <span className="text-3xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-2.5 rounded-lg w-full flex items-center justify-center gap-1">
            <ShieldAlert className="h-3.5 w-3.5" />
            Real-time outstanding check active
          </span>
        </div>
      </div>

      {/* Dynamic Service Inputs */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 space-y-4">
        <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-100 pb-2">
          {bookingType === 'Hotel' ? 'Hotel Booking specifics' : 'Visa Processing specifics'}
        </h3>

        <input type="hidden" name="bookingType" value={bookingType} />

        {bookingType === 'Hotel' ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs animate-fade-in">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Hotel Name</label>
              <input
                type="text"
                name="hotelName"
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Room Type</label>
              <input
                type="text"
                name="roomType"
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Staying Nights</label>
              <input
                type="number"
                name="nights"
                min={1}
                defaultValue={1}
                onChange={(e) => setHotelNights(Number(e.target.value) || 1)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Night Price Cost (Buy)</label>
              <input
                type="number"
                name="hotelCost"
                onChange={(e) => setHotelCost(Number(e.target.value) || 0)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Night Price Sale (Sell)</label>
              <input
                type="number"
                name="hotelSale"
                onChange={(e) => setHotelSale(Number(e.target.value) || 0)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none font-bold"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs animate-fade-in">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Visiting Country</label>
              <input
                type="text"
                name="visaCountry"
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Visa Reference No</label>
              <input
                type="text"
                name="visaNo"
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Visa Processing Fee (Buy)</label>
              <input
                type="number"
                name="visaCost"
                onChange={(e) => setVisaCost(Number(e.target.value) || 0)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Client Sales Price (Sell)</label>
              <input
                type="number"
                name="visaSale"
                onChange={(e) => setVisaSale(Number(e.target.value) || 0)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none font-bold"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-50 pt-6 text-center">
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="block text-4xs font-bold text-slate-400 uppercase">Gross Purchase Cost</span>
            <span className="text-sm font-black text-slate-700">৳{currentPurchasePrice.toFixed(2)}</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="block text-4xs font-bold text-slate-400 uppercase">Voucher Revenue</span>
            <span className="text-sm font-black text-slate-700">৳{currentClientPrice.toFixed(2)}</span>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
            <span className="block text-4xs font-bold text-blue-500 uppercase font-medium">Net Profit Margin</span>
            <span className="text-sm font-black text-blue-700">৳{currentProfit.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pb-8">
        <button
          type="button"
          className="px-6 py-2.5 border border-slate-200 bg-white text-slate-600 rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || isSubmitting}
          className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-lg shadow-indigo-500/20 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving Booking Invoice...' : 'Save Booking Invoice'}
        </button>
      </div>
    </form>
  )
}

export default HotelAndVisaForm

import React, { useEffect, useMemo, useState } from 'react'
import { HeartPulse, User, Plane, Hotel, Ship, ShieldCheck, Save } from 'lucide-react'
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '../ui/combobox'
import SuccessPopup from '@/components/common/SuccessPopup'

interface TourPackageFormProps {
  loading: boolean
  employeesList: { id: number; name: string }[]
  clientsList: { id: number; name: string }[]
  subFormTab: 'passport' | 'ticket' | 'accommodation' | 'visa' | 'medical' | 'billing'
  setSubFormTab: (tab: 'passport' | 'ticket' | 'accommodation' | 'visa' | 'medical' | 'billing') => void
  invoiceNo?: string
  salesDate?: string
  dueDate?: string
  paxName?: string
  passportNo?: string
  nationalId?: string
  contactNo?: string
  email?: string
  dob?: string
  dateOfIssue?: string
  dateOfExpiry?: string
  ticketNo?: string
  pnr?: string
  route?: string
  airline?: string
  journeyDate?: string
  returnDate?: string
  salePrice?: number
  costPrice?: number
  hotelName?: string
  hotelLocation?: string
  roomType?: string
  noOfFlights?: number
  hotelSalePrice?: number
  hotelCostPrice?: number
  visaCountry?: string
  visaCategory?: string
  visaNo?: string
  visaSalePrice?: number
  visaCostPrice?: number
  hospitalName?: string
  doctorName?: string
  appointmentDate?: string
  treatmentCategory?: string
  companionName?: string
  ambulanceRequired?: boolean
  hospitalSalePrice?: number
  hospitalCostPrice?: number
  billingPaxQty?: number
  discountGiven?: number
  extraCharges?: number
  agentCommission?: number
}

const TourPackageForm = ({ loading, employeesList, clientsList, subFormTab, setSubFormTab }: TourPackageFormProps) => {
  const [ticketSalePrice, setTicketSalePrice] = useState(0)
  const [ticketCostPrice, setTicketCostPrice] = useState(0)
  const [hotelNights, setHotelNights] = useState(1)
  const [hotelSalePrice, setHotelSalePrice] = useState(0)
  const [hotelCostPrice, setHotelCostPrice] = useState(0)
  const [visaSalePrice, setVisaSalePrice] = useState(0)
  const [visaCostPrice, setVisaCostPrice] = useState(0)
  const [medicalSalePrice, setMedicalSalePrice] = useState(0)
  const [medicalCostPrice, setMedicalCostPrice] = useState(0)
  const [billingQty, setBillingQty] = useState(1)
  const [discount, setDiscount] = useState(0)
  const [extraFee, setExtraFee] = useState(0)
  const [agentCommission, setAgentCommission] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [successDetail, setSuccessDetail] = useState('')

  const toStringValue = (value: FormDataEntryValue | null) => {
    if (value === null) {
      return ''
    }
    return String(value).trim()
  }

  const ticketProfit = useMemo(() => ticketSalePrice - ticketCostPrice, [ticketCostPrice, ticketSalePrice])
  const accommodationProfit = useMemo(
    () => hotelSalePrice * Math.max(1, hotelNights) - hotelCostPrice * Math.max(1, hotelNights),
    [hotelCostPrice, hotelNights, hotelSalePrice],
  )
  const visaProfit = useMemo(() => visaSalePrice - visaCostPrice, [visaCostPrice, visaSalePrice])
  const medicalProfit = useMemo(() => medicalSalePrice - medicalCostPrice, [medicalCostPrice, medicalSalePrice])

  const packageRevenue = useMemo(
    () => ticketSalePrice + hotelSalePrice * Math.max(1, hotelNights) + visaSalePrice + medicalSalePrice,
    [hotelNights, hotelSalePrice, medicalSalePrice, ticketSalePrice, visaSalePrice],
  )
  const packageCost = useMemo(
    () => ticketCostPrice + hotelCostPrice * Math.max(1, hotelNights) + visaCostPrice + medicalCostPrice,
    [hotelCostPrice, hotelNights, medicalCostPrice, ticketCostPrice, visaCostPrice],
  )
  const billingSubtotal = useMemo(() => packageRevenue * Math.max(1, billingQty), [billingQty, packageRevenue])
  const billingTotalCost = useMemo(() => packageCost * Math.max(1, billingQty), [billingQty, packageCost])
  const billingNetTotal = useMemo(() => billingSubtotal - discount + extraFee, [billingSubtotal, discount, extraFee])
  const billingTotalProfit = useMemo(
    () => billingNetTotal - billingTotalCost - agentCommission,
    [agentCommission, billingNetTotal, billingTotalCost],
  )

  useEffect(() => {
    if (!successOpen) {
      return
    }

    const timeout = window.setTimeout(() => setSuccessOpen(false), 2500)
    return () => window.clearTimeout(timeout)
  }, [successOpen])

  const createInvoice = async (invoiceData: any) => {
    const response = await fetch('/api/invoices/tour-package', {
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

      passportInfo: {
        paxName: toStringValue(formData.get('paxName')),
        passportNo: toStringValue(formData.get('passportNo')),
        nationalId: toStringValue(formData.get('nationalId')),
        contactNo: toStringValue(formData.get('contactNo')),
        email: toStringValue(formData.get('email')),
        dob: toStringValue(formData.get('dob')),
        dateOfIssue: toStringValue(formData.get('dateOfIssue')),
        dateOfExpiry: toStringValue(formData.get('dateOfExpiry')),
      },

      ticketInfo: {
        ticketNo: toStringValue(formData.get('ticketNo')),
        pnr: toStringValue(formData.get('pnr')),
        route: toStringValue(formData.get('route')),
        airline: toStringValue(formData.get('airline')),
        journeyDate: toStringValue(formData.get('journeyDate')),
        returnDate: toStringValue(formData.get('returnDate')),
        salePrice: ticketSalePrice,
        costPrice: ticketCostPrice,
      },

      accommodation: {
        hotelName: toStringValue(formData.get('hotelName')),
        hotelLocation: toStringValue(formData.get('hotelLocation')),
        roomType: toStringValue(formData.get('roomType')),
        nights: hotelNights,
        salePrice: hotelSalePrice,
        costPrice: hotelCostPrice,
      },

      visaInfo: {
        country: toStringValue(formData.get('visaCountry')),
        visaCategory: toStringValue(formData.get('visaCategory')),
        visaNo: toStringValue(formData.get('visaNo')),
        salePrice: visaSalePrice,
        costPrice: visaCostPrice,
      },

      medicalInfo: {
        hospitalName: toStringValue(formData.get('hospitalName')),
        doctorName: toStringValue(formData.get('doctorName')),
        appointmentDate: toStringValue(formData.get('appointmentDate')),
        treatmentCategory: toStringValue(formData.get('treatmentCategory')),
        companionName: toStringValue(formData.get('companionName')),
        ambulanceRequired: formData.get('ambulanceRequired') === 'on',
        salePrice: medicalSalePrice,
        costPrice: medicalCostPrice,
      },

      billing: {
        unitPrice: billingQty ? billingSubtotal / billingQty : billingSubtotal,
        costPrice: billingQty ? billingTotalCost / billingQty : billingTotalCost,
        billingQty,
        discount,
        extraFee,
        totalCost: billingTotalCost,
        totalProfit: billingTotalProfit,
        subTotal: billingSubtotal,
        netTotal: billingNetTotal,
        agentCommission,
      },
    }

    try {
      const result = await createInvoice(invoiceData)
      setSuccessDetail(
        `Invoice ${result.data?.invoiceNo || invoiceData.invoiceNumber} saved with ৳${billingNetTotal.toFixed(2)} net total.`,
      )
      setSuccessOpen(true)
      e.currentTarget.reset()
      setTicketSalePrice(0)
      setTicketCostPrice(0)
      setHotelNights(1)
      setHotelSalePrice(0)
      setHotelCostPrice(0)
      setVisaSalePrice(0)
      setVisaCostPrice(0)
      setMedicalSalePrice(0)
      setMedicalCostPrice(0)
      setBillingQty(1)
      setDiscount(0)
      setExtraFee(0)
      setAgentCommission(0)
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
        title="Tour package saved"
        message="The tour package invoice was created successfully."
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
            type="text"
            name="invoiceNo"
            // value={invoiceNumber}
            // onChange={(e) => setInvoiceNumber(e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 font-semibold outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-slate-500 font-bold mb-1">Sales Date</label>
          <input
            type="date"
            name="salesDate"
            //value={salesDate}
            //onChange={(e) => setSalesDate(e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 font-bold mb-1">Due Date</label>
          <input
            type="date"
            name="dueDate"
            //value={dueDate}
            //onChange={(e) => setDueDate(e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none"
          />
        </div>
      </div>

      {/* Subform Tab Selector */}
      <div className="flex border-b border-slate-200 gap-1 text-xs">
        <button
          type="button"

          onClick={() => setSubFormTab('passport')}
          className={`px-4 py-2 font-bold cursor-pointer border-b-2 ${subFormTab === 'passport' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Passport Details
        </button>
        <button
          type="button"
          onClick={() => setSubFormTab('ticket')}
          className={`px-4 py-2 font-bold cursor-pointer border-b-2 ${subFormTab === 'ticket' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Flights Information
        </button>
        <button
          type="button"
          onClick={() => setSubFormTab('accommodation')}
          className={`px-4 py-2 font-bold cursor-pointer border-b-2 ${subFormTab === 'accommodation' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Accommodation
        </button>
        <button
          type="button"
          onClick={() => setSubFormTab('visa')}
          className={`px-4 py-2 font-bold cursor-pointer border-b-2 ${subFormTab === 'visa' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Visa Services
        </button>
        <button
          type="button"
          onClick={() => setSubFormTab('medical')}
          className={`px-4 py-2 font-bold cursor-pointer border-b-2 ${subFormTab === 'medical' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'} flex items-center gap-1`}
        >
          <HeartPulse className="h-3.5 w-3.5" /> Medical Care & Tourism
        </button>
        <button
          type="button"
          onClick={() => setSubFormTab('billing')}
          className={`px-4 py-2 font-bold cursor-pointer border-b-2 ${subFormTab === 'billing' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Billing Ledger
        </button>
      </div>

      {/* Subform content */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm min-h-64">
        <div className={`${subFormTab === 'passport' ? 'block' : 'hidden'} space-y-4 text-xs animate-fade-in`}>
          <h3 className="font-bold text-slate-700 flex items-center gap-1.5">
            <User className="h-4 w-4 text-emerald-500" /> Primary Passport Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Pax Name</label>
              <input
                type="text"
                name="paxName"
                // value={paxName}
                // onChange={(e) => setPaxName(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Passport No</label>
              <input
                type="text"
                name="passportNo"
                // value={passportNo}
                // onChange={(e) => setPassportNo(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">National ID</label>
              <input
                type="text"
                name="nationalId"
                // value={nationalId}
                // onChange={(e) => setNationalId(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Contact No</label>
              <input
                type="text"
                name="contactNo"
                // value={contactNo}
                // onChange={(e) => setContactNo(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Email</label>
              <input
                type="email"
                name="email"
                // value={email}
                // onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">DOB</label>
              <input
                type="date"
                name="dob"
                // value={dob}
                // onChange={(e) => setDob(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Date of Issue</label>
              <input
                type="date"
                name="dateOfIssue"
                // value={doi}
                // onChange={(e) => setDoi(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Date of Expire</label>
              <input
                type="date"
                name="dateOfExpiry"
                // value={doe}
                // onChange={(e) => setDoe(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
          </div>
        </div>

        <div className={`${subFormTab === 'ticket' ? 'block' : 'hidden'} space-y-4 text-xs animate-fade-in`}>
          <h3 className="font-bold text-slate-700 flex items-center gap-1.5">
            <Plane className="h-4 w-4 text-emerald-500" /> Package Flight Connections
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Ticket No</label>
              <input
                type="text"
                name="ticketNo"
                // value={tktNo}
                // onChange={(e) => setTktNo(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">PNR</label>
              <input
                type="text"
                name="pnr"
                // value={tktPnr}
                // onChange={(e) => setTktPnr(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Route / Sector</label>
              <input
                type="text"
                name="route"
                // value={tktRoute}
                // onChange={(e) => setTktRoute(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Airline</label>
              <input
                type="text"
                name="airline"
                // value={tktAirline}
                // onChange={(e) => setTktAirline(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Journey Date</label>
              <input
                type="date"
                name="journeyDate"
                // value={tktJourneyDate}
                // onChange={(e) => setTktJourneyDate(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Return Date</label>
              <input
                type="date"
                name="returnDate"
                // value={tktReturnDate}
                // onChange={(e) => setTktReturnDate(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Sale Price</label>
              <input
                type="number"
                name="salePrice"
                onChange={(e) => setTicketSalePrice(Number(e.target.value) || 0)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Cost Price (Buy)</label>
              <input
                type="number"
                name="costPrice"
                onChange={(e) => setTicketCostPrice(Number(e.target.value) || 0)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
          </div>
        </div>

        <div className={`${subFormTab === 'accommodation' ? 'block' : 'hidden'} space-y-4 text-xs animate-fade-in`}>
          <h3 className="font-bold text-slate-700 flex items-center gap-1.5">
            <Hotel className="h-4 w-4 text-emerald-500" /> Accommodation Staying
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Hotel Name</label>
              <input
                type="text"
                name="hotelName"
                // value={hotelName}
                // onChange={(e) => setHotelName(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Hotel Location</label>
              <input
                type="text"
                name="hotelLocation"
                // value={hotelLocation}
                // onChange={(e) => setHotelLocation(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Room Type</label>
              <input
                type="text"
                name="roomType"
                // value={roomType}
                // onChange={(e) => setRoomType(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">No of Nights</label>
              <input
                type="number"
                name="nights"
                min={1}
                defaultValue={1}
                onChange={(e) => setHotelNights(Number(e.target.value) || 1)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Hotel Sale Price</label>
              <input
                type="number"
                name="hotelSalePrice"
                onChange={(e) => setHotelSalePrice(Number(e.target.value) || 0)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Hotel Cost Price</label>
              <input
                type="number"
                name="hotelCostPrice"
                onChange={(e) => setHotelCostPrice(Number(e.target.value) || 0)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
          </div>
        </div>

        <div className={`${subFormTab === 'visa' ? 'block' : 'hidden'} space-y-4 text-xs animate-fade-in`}>
          <h3 className="font-bold text-slate-700 flex items-center gap-1.5">
            <Ship className="h-4 w-4 text-emerald-500" /> Visa Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Visa Country</label>
              <input
                type="text"
                name="visaCountry"
                // value={visaCountry}
                // onChange={(e) => setVisaCountry(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Visa Category</label>
              <input
                type="text"
                name="visaCategory"
                // value={visaCategory}
                // onChange={(e) => setVisaCategory(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Visa No / Ref</label>
              <input
                type="text"
                name="visaNo"
                // value={visaNo}
                // onChange={(e) => setVisaNo(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Visa Sale Price</label>
              <input
                type="number"
                name="visaSalePrice"
                onChange={(e) => setVisaSalePrice(Number(e.target.value) || 0)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Visa Cost Price</label>
              <input
                type="number"
                name="visaCostPrice"
                onChange={(e) => setVisaCostPrice(Number(e.target.value) || 0)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
          </div>
        </div>

        <div className={`${subFormTab === 'medical' ? 'block' : 'hidden'} space-y-4 text-xs animate-fade-in`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-700 flex items-center gap-1.5">
              <HeartPulse className="h-4 w-4 text-emerald-500" /> Medical Tourism & Partner Hospital Coordination
            </h3>
            <span className="text-3xs font-semibold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full uppercase">
              Welcare Trip Exclusive
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Hospital Partner</label>
              <select
                name="hospitalName"
                // value={hospitalName}
                // onChange={(e) => setHospitalName(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none bg-slate-50 focus:bg-white text-slate-800 font-medium"
              >
                <option value="">-- Select Partner Hospital --</option>
                <option value="Mount Elizabeth Hospital (Singapore)">Mount Elizabeth Hospital (Singapore)</option>
                <option value="Bumrungrad International Hospital (Thailand)">
                  Bumrungrad International Hospital (Thailand)
                </option>
                <option value="Bangkok Hospital (Thailand)">Bangkok Hospital (Thailand)</option>
                <option value="Apollo Hospitals (India)">Apollo Hospitals (India)</option>
                <option value="Fortis Healthcare (India)">Fortis Healthcare (India)</option>
                <option value="Gleneagles Hospital (Malaysia)">Gleneagles Hospital (Malaysia)</option>
                <option value="Raffles Hospital (Singapore)">Raffles Hospital (Singapore)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Doctor Name</label>
              <input
                type="text"
                placeholder="e.g. Dr. Tan Seng Kiat"
                name="doctorName"
                // value={doctorName}
                // onChange={(e) => setDoctorName(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Appointment Date & Time</label>
              <input
                type="datetime-local"
                name="appointmentDate"
                // value={appointmentDate}
                // onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Treatment / Dept Category</label>
              <input
                type="text"
                placeholder="e.g. Cardiology, Oncology"
                name="treatmentCategory"
                // value={treatmentCategory}
                // onChange={(e) => setTreatmentCategory(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Companion / Medical Attendant</label>
              <input
                type="text"
                placeholder="Companion full name"
                name="companionName"
                // value={companionName}
                // onChange={(e) => setCompanionName(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="ambulance"
                name="ambulanceRequired"
                // checked={ambulanceRequired}
                // onChange={(e) => setAmbulanceRequired(e.target.checked)}
                className="h-4 w-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
              />
              <label htmlFor="ambulance" className="text-slate-600 font-bold select-none">
                Ambulance / Wheelchair Required
              </label>
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Hospital Services Sale Price</label>
              <input
                type="number"
                name="hospitalSalePrice"
                onChange={(e) => setMedicalSalePrice(Number(e.target.value) || 0)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none font-bold text-emerald-600"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Hospital Services Cost (Buy)</label>
              <input
                type="number"
                name="hospitalCostPrice"
                onChange={(e) => setMedicalCostPrice(Number(e.target.value) || 0)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
          </div>
        </div>

        <div className={`${subFormTab === 'billing' ? 'block' : 'hidden'} space-y-6 text-xs animate-fade-in`}>
          <h3 className="font-bold text-slate-700 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Billing Ledger Summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Billing Pax Quantity</label>
              <input
                type="number"
                name="billingQty"
                min={1}
                defaultValue={1}
                onChange={(e) => setBillingQty(Math.max(1, Number(e.target.value) || 1))}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Discount Given</label>
              <input
                type="number"
                name="discount"
                onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Extra Fee / Surcharge</label>
              <input
                type="number"
                name="extraFee"
                onChange={(e) => setExtraFee(Number(e.target.value) || 0)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Agent Commissions</label>
              <input
                type="number"
                name="agentCommission"
                onChange={(e) => setAgentCommission(Number(e.target.value) || 0)}
                className="w-full border border-slate-200 rounded-lg p-2 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-6">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
              <span className="block text-4xs font-bold text-slate-400 uppercase">Aggregated Cost (Buy)</span>
              <span className="text-sm font-black text-slate-700">৳{billingTotalCost.toFixed(2)}</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
              <span className="block text-4xs font-bold text-slate-400 uppercase">Aggregated Sales Price</span>
              <span className="text-sm font-black text-slate-700">৳{billingSubtotal.toFixed(2)}</span>
            </div>
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
              <span className="block text-4xs font-bold text-emerald-500 uppercase">Consolidated Margin</span>
              <span className="text-sm font-black text-emerald-700">৳{billingTotalProfit.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
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
          disabled={loading || isSubmitting}
          className="flex items-center gap-1.5 px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-lg shadow-emerald-500/20"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? 'Assembling Tour...' : 'Save Packaged Tour Invoice'}
        </button>
      </div>
    </form>
  )
}

export default TourPackageForm

import React, { useEffect, useState } from 'react'
import { Hotel } from 'lucide-react'
import TitleCard from '@/components/common/TitleCard'
import HotelAndVisaForm from '@/components/forms/HotelAndVisaForm'

export default function HotelVisaInvoice() {
  const [loading, setLoading] = useState(true)
  const [bookingType, setBookingType] = useState<'Hotel' | 'Visa'>('Hotel')
  const [employeesList, setEmployeesList] = useState<any[]>([])
  const [clientsList, setClientsList] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

      try {
        const [employeesResponse, clientsResponse] = await Promise.all([fetch('/api/employees'), fetch('/api/clients')])
        const employeesJson = await employeesResponse.json()
        const clientsJson = await clientsResponse.json()

        if (employeesJson.success) {
          setEmployeesList(employeesJson.data)
        }

        if (clientsJson.success) {
          setClientsList(clientsJson.data)
        }
      } catch (error) {
        console.error('Failed to load hotel/visa form data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div id="hotel-visa-container" className="flex-1 p-8 bg-slate-50 overflow-y-auto space-y-6 animate-fade-in">
      <div
        id="hv-header"
        className="bg-white p-6 rounded-2xl border border-slate-200/60 flex justify-between items-center"
      >
        <TitleCard
          icon={<Hotel className="h-5 w-5 text-indigo-500 animate-bounce" />}
          title="STANDALONE HOTEL & VISA BOOKINGS"
          description="Quick invoice entries for standalone non-flight travel voucher bookings"
        />
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            type="button"
            // onClick={() => setBookingType('Hotel')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all 
          ${bookingType === 'Hotel' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Hotel Stay
          </button>
          <button
            type="button"
            // onClick={() => setBookingType('Visa')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all 
          ${bookingType === 'Visa' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Visa Service
          </button>
        </div>
      </div>

      <HotelAndVisaForm
        bookingType={bookingType}
        loading={loading}
        employeesList={employeesList}
        clientsList={clientsList}
      />
    </div>
  )
}

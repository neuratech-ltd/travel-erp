import { useState, useEffect } from 'react'
import { Briefcase, Sparkles } from 'lucide-react'
import TitleCard from '../components/common/TitleCard'
import TourPackageForm from '../components/forms/TourPackageForm'

export default function TourPackageInvoice() {
  const [subFormTab, setSubFormTab] = useState<
    'passport' | 'ticket' | 'accommodation' | 'visa' | 'medical' | 'billing'
  >('passport')
  const [employeesList, setEmployeesList] = useState<any[]>([])
  const [clientsList, setClientsList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    fetch('/api/employees')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setEmployeesList(json.data)
        }
      })
      .catch((err) => console.error(err))
  }, [])

  const fetchEmployees = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/employees')
      const data = await response.json()
      if (data.success) {
        setEmployeesList(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchClients = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/clients')
      const data = await response.json()
      if (data.success) {
        setClientsList(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const success = await onAddInvoice({
  //     invoiceNo,
  //     clientName,
  //     salesBy,
  //     salesDate,
  //     dueDate,
  //     type: 'Tour Package',
  //     status: 'Paid',
  //     passportInfo: { passportNo, paxName, paxType, nationalId, contactNo, email, dob, dateOfIssue: doi, dateOfExpiry: doe },
  //     ticketInfo: { ticketNo: tktNo, pnr: tktPnr, route: tktRoute, journeyDate: tktJourneyDate, returnDate: tktReturnDate, airline: tktAirline, salePrice: tktSalePrice, costPrice: tktCostPrice, profit: flightProfit, vendor: tktVendor },
  //     accommodation: { hotelName, hotelLocation, roomType, checkIn, checkOut, nights, salePrice: hotelSalePrice, costPrice: hotelCostPrice, profit: hotelProfit, vendor: hotelVendor },
  //     visaInfo: { visaCategory, country: visaCountry, visaType, visaNo, salePrice: visaSalePrice, costPrice: visaCostPrice, profit: visaProfit },
  //     medicalInfo: { hospitalName, doctorName, appointmentDate, treatmentCategory, companionName, ambulanceRequired, treatmentCost: medicalCostPrice, salePrice: medicalSalePrice, costPrice: medicalCostPrice, profit: medicalProfit },
  //     billing: { unitPrice: subTotal / billingQty, costPrice: totalCost / billingQty, billingQty, discount, extraFee, totalCost, totalProfit, subTotal, netTotal, agentCommission },
  //     profit: totalProfit,
  //     clientPrice: netTotal,
  //     purchasePrice: totalCost,
  //     route: tktRoute || 'Packaged Medical Tour',
  //     paxName: paxName || 'Haji Mohammad Selim'
  //   });

  //   setLoading(false);
  //   if (success) {
  //     onNavigateToTab('ledger');
  //   }
  // };

  return (
    <div id="tour-package-container" className="flex-1 p-8 bg-slate-50 overflow-y-auto space-y-6">
      <div
        id="tour-header"
        className="bg-white p-6 rounded-2xl border border-slate-200/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <TitleCard
          icon={<Briefcase className="h-5 w-5 text-emerald-500 animate-bounce" />}
          title="CREATE NEW PACKAGED TOUR INVOICE"
          description="Consolidates flights, hotel stays, transport guides, and visas into a single customer billing voucher"
        />
      </div>

      <TourPackageForm
        loading={isLoading}
        clientsList={clientsList}
        employeesList={employeesList}
        subFormTab={subFormTab}
        setSubFormTab={setSubFormTab}
      />
    </div>
  )
}

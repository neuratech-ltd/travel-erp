import React, { useEffect, useState } from 'react'
import { Plane, Sparkles, Save, User, DollarSign, FileText, Calendar, HelpCircle } from 'lucide-react'
import { Invoice, ReportStats } from '../types'
import TitleCard from '@/components/common/TitleCard'
import AirTicketInvoiceForm from '@/components/forms/AirTicketInvoiceForm'

export default function AirTicketInvoice() {
  const [loading, setLoading] = useState(false)
  const [aiFilling, setAiFilling] = useState(false)
  const [employeesList, setEmployeesList] = useState<any[]>([])
  const [clientsList, setClientsList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

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

  // const fetchErpData = async () => {
  //   setIsLoading(true);
  //   try {
  //     // 1. Fetch Invoices
  //     const invResponse = await fetch('/api/invoices');
  //     const invData = await invResponse.json();
  //     if (invData.success) {
  //       setInvoices(invData.data);
  //     }

  //     // 2. Fetch Report Stats
  //     const statsResponse = await fetch('/api/reports/stats');
  //     const statsData = await statsResponse.json();
  //     if (statsData.success) {
  //       setStats(statsData.data);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch ERP data from Express API:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  //  const handleAddInvoice = async (newInvoiceData: Partial<Invoice>): Promise<boolean> => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch('/api/invoices', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(newInvoiceData),
  //     });

  //     const resData = await response.json();
  //     if (resData.success) {
  //       // Recalculate and pull latest state
  //       await fetchErpData();
  //       return true;
  //     } else {
  //       throw new Error(resData.message || 'API rejected billing entry');
  //     }
  //   } catch (e: any) {
  //     alert(`Error logging travel billing voucher: ${e.message}`);
  //     return false;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Auto calculate based on inputs
  // const handleCalculate = () => {
  //   const calcCommission = Number(baseFare) * (Number(commissionPct) / 100);
  //   const calculatedPurchasePrice = Number(baseFare) + Number(tax) - calcCommission;
  //   const calculatedProfit = Number(clientPrice) - calculatedPurchasePrice - Number(discount) + Number(extraFee);

  //   setCommission(calcCommission);
  //   setPurchasePrice(calculatedPurchasePrice);
  //   setNetCommission(calcCommission - Number(vat));
  //   setProfit(Math.max(0, calculatedProfit));
  // };

  // React.useEffect(() => {
  //   handleCalculate();
  // }, [baseFare, commissionPct, tax, clientPrice, discount, extraFee, vat]);

  return (
    <div id="air-ticket-container" className="flex-1 p-8 bg-slate-50 overflow-y-auto space-y-6">
      <div
        id="form-header-panel"
        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <TitleCard
          icon={<Plane className="h-5 w-5 text-blue-500 animate-bounce" />}
          title="CREATE NEW AIR TICKET INVOICE"
          description="Logs a standard IATA billing, calculates commission & creates client accounts"
        />
      </div>

      <AirTicketInvoiceForm employeesList={employeesList} clientsList={clientsList} />
    </div>
  )
}

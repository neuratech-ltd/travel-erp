import React, { useState, useEffect } from 'react'
import { Coins, Sparkles, Save } from 'lucide-react'
import { Invoice } from '../types'
import TitleCard from '@/components/common/TitleCard'
import NonCommissionForm from '@/components/forms/NonCommissionForm'

export default function NonCommissionInvoice() {
  const [loading, setIsLoading] = useState(false)
  const [employeesList, setEmployeesList] = useState<any[]>([])
  const [clientsList, setClientsList] = useState<any[]>([])

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

  return (
    <div id="non-commission-container" className="flex-1 p-8 bg-slate-50 overflow-y-auto space-y-6">
      {/* Header Panel */}
      <div
        id="nc-header"
        className="bg-white p-6 rounded-2xl border border-slate-200/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <TitleCard
          icon={<Coins className="h-5 w-5 text-indigo-500 animate-bounce" />}
          title="CREATE NON-COMMISSION INVOICE"
          description="Logs Net-Rate tickets, consolidates markups, and tracks booking files"
        />
      </div>

      <NonCommissionForm clientsList={clientsList} employeesList={employeesList} />
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { RefreshCw, Sparkles, Save } from 'lucide-react'
import { Invoice } from '../types'
import TitleCard from '../components/common/TitleCard'
import ReissueInvoiceForm from '../components/forms/ReIssueInvoiceForm'
import { api } from '../lib/api'

export default function ReissueInvoice() {
  const [loading, setLoading] = useState(false)
  const [employeesList, setEmployeesList] = useState<any[]>([])
  const [clientsList, setClientsList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchEmployees = async () => {
    setIsLoading(true)
    try {
      const { data } = await api.get('/employees')
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
      const { data } = await api.get('/clients')
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
    <div id="reissue-invoice-container" className="flex-1 p-8 bg-slate-50 overflow-y-auto space-y-6">
      {/* Header Panel */}
      <div
        id="reissue-header"
        className="bg-white p-6 rounded-2xl border border-slate-200/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <TitleCard
          icon={<RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />}
          title="CREATE TICKET REISSUE INVOICE"
          description="Re-calculates fare grids, computes airline penalties, and structures differences"
        />
        {/* <button
          type="button"
          onClick={triggerAiFill}
          disabled={aiFilling}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          {aiFilling ? 'Gemini Generating...' : 'AI Auto-Fill Form'}
        </button> */}
      </div>

      <ReissueInvoiceForm employeesList={employeesList} clientsList={clientsList} />
    </div>
  )
}

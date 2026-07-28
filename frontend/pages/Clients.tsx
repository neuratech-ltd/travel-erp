import { useState, useEffect } from 'react'
import { Plus, Search, RefreshCw } from 'lucide-react'
import { Client } from '../../backend/modules/client/client.services'
import DataTable from '@/components/client/DataTable'
import { getClientColumns, ClientColumnsProps } from '@/components/client/ClientColums'
import AddClientModal from '@/components/client/AddClientModal'
import EditClientModal from '@/components/client/EditClientModal'

export default function Clients() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = (client: ClientColumnsProps) => {
    setIsEditModalOpen(true)
  }

  const handleDelete = (client: ClientColumnsProps) => {
    // call DELETE /api/clients/:id, then refetch/mutate
  }

  const columns = getClientColumns({ onEdit: handleEdit, onDelete: handleDelete })

  const fetchClients = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/clients')
      const json = await res.json()
      setClients(json.data ?? [])
    } catch (e) {
      console.error('Failed to fetch clients', e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  return (
    <div id="employees-container" className="flex-1 p-6 bg-slate-50 overflow-y-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0A1D1C]">Client Directory</h2>
          <p className="text-xs text-slate-500 font-medium">
            Manage Welcare Trip advisors, executives and office administrators
          </p>
        </div>

        <button
          onClick={setIsModalOpen.bind(null, true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          ADD NEW CLIENT
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Search employee by name, designation, email..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500"
          />
        </div>

        <button
          onClick={fetchClients}
          className="p-2 text-slate-500 hover:text-emerald-600 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer self-start sm:self-auto"
          title="Refresh employees list"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <DataTable columns={columns} data={clients} />

      {isModalOpen && <AddClientModal setIsModalOpen={setIsModalOpen} />}
      {isEditModalOpen && <EditClientModal setIsModalOpen={setIsEditModalOpen} />}
    </div>
  )
}

import React, { useEffect } from 'react'

interface ClientFormProps {
  setIsModalOpen: (isOpen: boolean) => void
}
interface ClientFormProps {
  setIsModalOpen: (isOpen: boolean) => void
  id?: string
}

const ClientForm = ({ setIsModalOpen, id }: ClientFormProps) => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    passportNumber: '',
    phone: '',
    address: '',
  })

  useEffect(() => {
    if (!id) return
    fetch(`/api/clients/${id}`)
      .then((res) => res.json())
      .then((json) => {
        const client = json.data ?? json
        setFormData({
          name: client.name,
          email: client.email,
          passportNumber: client.passportNumber,
          phone: client.phone,
          address: client.address,
        })
      })
  }, [id])

  const [isLoading, setIsLoading] = React.useState(false)

  const addClient = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          passportNumber: formData.passportNumber,
          phone: formData.phone,
          address: formData.address,
        }),
      })
      const json = await res.json()
      return json.data
    } catch (e) {
      console.error('Failed to add client', e)
    } finally {
      setIsLoading(false)
    }
  }

  const updateClient = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          passportNumber: formData.passportNumber,
          phone: formData.phone,
          address: formData.address,
        }),
      })
      const json = await res.json()
      return json.data
    } catch (e) {
      console.error('Failed to update client', e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (id) {
      updateClient()
    } else {
      addClient()
    }
    setIsModalOpen(false)
  }

  return (
    <form className="flex-1 overflow-y-auto p-6 space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Client Full Name *</label>
        <input
          type="text"
          placeholder="e.g. Haji Mohammad Selim"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none"
          required
        />
      </div>
      <div>
        <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Email</label>
        <input
          type="email"
          placeholder="e.g. selim@welcaretrip.com"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Passport Number</label>
        <input
          type="text"
          placeholder="e.g. A12345678"
          name="passportNumber"
          value={formData.passportNumber}
          onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none"
        />
      </div>

      <div>
        <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Contact Number</label>
        <input
          type="text"
          placeholder="e.g. +88017XXXXXXXX"
          name="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none"
        />
      </div>

      <div>
        <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Address</label>
        <input
          type="text"
          placeholder="e.g. +88017XXXXXXXX"
          name="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          // value={formData.address}
          // onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none"
        />
      </div>

      <div className="pt-6 flex gap-3">
        <button
          type="submit"
          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-colors cursor-pointer"
        >
          {id ? 'Update Client' : 'Add Client'}
        </button>
        <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
        >
          CANCEL
        </button>
      </div>
    </form>
  )
}

export default ClientForm

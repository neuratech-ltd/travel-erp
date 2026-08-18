import React from 'react'
import { useEffect } from 'react'

interface EmployeeFormProps {
  setIsModalOpen: (isOpen: boolean) => void
  id?: string
}

const EmployeeForm = ({ setIsModalOpen, id }: EmployeeFormProps) => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    designation: '',
    department: 'Sales & Marketing',
    phone: '',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
  })

  useEffect(() => {
    if (!id) return
    fetch(`/api/employees/${id}`)
      .then((res) => res.json())
      .then((json) => {
        const employee = json.data ?? json
        setFormData({
          name: employee.name ?? '',
          email: employee.email ?? '',
          designation: employee.designation ?? '',
          department: employee.department ?? 'Sales & Marketing',
          phone: employee.phone ?? '',
          joiningDate: employee.joiningDate
            ? new Date(employee.joiningDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          status: employee.status ?? 'ACTIVE',
        })
      })
  }, [id])

  const addEmployee = async () => {
    const payload = {
      ...formData,
      status: formData.status.toUpperCase(),
      phone: formData.phone || undefined,
      designation: formData.designation || undefined,
      joiningDate: formData.joiningDate ? new Date(formData.joiningDate).toISOString() : undefined,
    }

    const res = await fetch('/api/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      throw new Error('Failed to add employee')
    }

    return res.json()
  }

  const updateEmployee = async () => {
    const payload = {
      ...formData,
      status: formData.status.toUpperCase(),
      phone: formData.phone || undefined,
      designation: formData.designation || undefined,
      joiningDate: formData.joiningDate ? new Date(formData.joiningDate).toISOString() : undefined,
    }

    const res = await fetch(`/api/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      throw new Error('Failed to update employee')
    }
    return res.json()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (id) {
      await updateEmployee()
    } else {
      await addEmployee()
    }
    setIsModalOpen(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
      {/* {formError && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-2xs font-bold">
                {formError}
              </div>
            )} */}

      <div>
        <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Employee Full Name *</label>
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
        <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Job Designation</label>
        <input
          type="text"
          placeholder="e.g. Senior Medical Travel Advisor"
          name="designation"
          value={formData.designation}
          onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none"
        />
      </div>

      <div>
        <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Department</label>
        <select
          name="department"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700 outline-none"
        >
          <option value="Administration">Administration</option>
          <option value="Sales & Marketing">Sales & Marketing</option>
          <option value="Reservations">Reservations</option>
          <option value="Visa Desk">Visa Desk</option>
          <option value="Accounts & Audit">Accounts & Audit</option>
          <option value="Medical Desk">Medical Coordination Desk</option>
        </select>
      </div>

      <div>
        <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Email Address</label>
        <input
          type="email"
          placeholder="e.g. selim@welcaretrip.com"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
        <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Joining Date</label>
        <input
          type="date"
          name="joiningDate"
          value={formData.joiningDate}
          onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none"
        />
      </div>

      <div>
        <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Status</label>
        <div className="flex gap-4 mt-1">
          <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
            <input
              type="radio"
              name="status"
              checked={formData.status === 'ACTIVE'}
              onChange={() => setFormData({ ...formData, status: 'ACTIVE' })}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            Active
          </label>
          <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
            <input
              type="radio"
              name="status"
              checked={formData.status === 'INACTIVE'}
              onChange={() => setFormData({ ...formData, status: 'INACTIVE' })}
              className="text-rose-600 focus:ring-emerald-500"
            />
            Inactive / On Leave
          </label>
        </div>
      </div>

      <div className="pt-6 flex gap-3">
        <button
          type="submit"
          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-colors cursor-pointer"
        >
          {id ? 'SAVE DETAILS' : 'CREATE ACCOUNT'}
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

export default EmployeeForm

import React from 'react'
import { User, Mail, Phone, Calendar, Edit2, Trash2 } from 'lucide-react'
import { Employee } from '../../../backend/modules/employee/employee.services'

interface EmployeeCardProps {
  setIsModalOpen: (isOpen: boolean) => void
  onEdit: (employee: Employee) => void
  employee?: Employee
}
const EmployeeCard = ({ setIsModalOpen, onEdit, employee }: EmployeeCardProps) => {
  return (
    <div className="flex">
      <div
        key={employee?.id}
        className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between hover:border-emerald-600/30 hover:shadow-md transition-all group"
      >
        <div className="p-4 pb-0 flex justify-between items-start">
          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-4xs font-semibold tracking-wide">
            {employee?.department}
          </span>
          <span
            className={`px-2 py-0.5  rounded-full text-4xs font-bold bg-emerald-100 text-emerald-600 tracking-wide }`}
          >
            {employee?.status}
          </span>
        </div>

        <div className="p-4 text-center">
          <div className="h-14 w-14 rounded-full bg-[#0A1D1C]/5 group-hover:bg-emerald-50 transition-colors border border-slate-100 flex items-center justify-center mx-auto mb-3">
            <User className="h-6 w-6 text-[#0A1D1C]/60 group-hover:text-emerald-600 transition-colors" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm tracking-tight"> {employee?.name}</h3>
          <p className="text-4xs text-[#0A1D1C]/80 font-bold tracking-widest mt-0.5"> {employee?.designation}</p>

          <div className="mt-4 pt-3 border-t border-slate-50 space-y-2 text-3xs text-slate-500 text-left">
            <div className="flex items-center gap-1.5 truncate">
              <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{employee?.email}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>{employee?.phone}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>Joined: Jan 1, 2023</span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-1.5">
          <button
            onClick={() => {
              if (employee) {
                onEdit(employee)
              }
              setIsModalOpen(true)
            }}
            className="p-1.5 hover:bg-white border border-transparent hover:border-slate-200 rounded text-indigo-600 transition-all cursor-pointer"
            title="Edit employee"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            // onClick={() => handleDelete(emp.id, emp.name)}
            className="p-1.5 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded text-rose-600 transition-all cursor-pointer"
            title="Delete employee"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmployeeCard

import React from 'react'
import { User, X } from 'lucide-react'
import EmployeeForm from './EmployeeForm'

interface EditEmployeeModalProps {
  setIsModalOpen: (isOpen: boolean) => void
  id?: string
}

const EditEmployeeModal = ({ setIsModalOpen, id }: EditEmployeeModalProps) => {
  return (
    <div>
      <div
        id="modal-overlay"
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex justify-end z-50 animate-fade-in"
      >
        <div id="modal-drawer" className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-[#0A1D1C] text-white">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-emerald-400" />
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wide">Edit Employee Info</h3>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <EmployeeForm setIsModalOpen={setIsModalOpen} id={id} />
        </div>
      </div>
    </div>
  )
}

export default EditEmployeeModal

import React from 'react'
import { User, X } from 'lucide-react'
import ClientForm from './ClientForm'

interface EditClientModalProps {
  setIsModalOpen: (isOpen: boolean) => void
  id?: string
}

const EditClientModal = ({ setIsModalOpen, id }: EditClientModalProps) => {
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
                <h3 className="font-bold text-sm uppercase tracking-wide">Edit Client</h3>
                <p className="text-4xs text-emerald-300">Update the details of the client</p>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <ClientForm id={id} setIsModalOpen={setIsModalOpen} />
        </div>
      </div>
    </div>
  )
}

export default EditClientModal

import React from 'react'
import { User, X } from 'lucide-react'

interface EmployeeModalProps {
  setIsModalOpen: (isOpen: boolean) => void;
}

const EmployeeModal = ({ setIsModalOpen }: EmployeeModalProps) => {
  return (
    <div>
      <div id="modal-overlay" className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex justify-end z-50 animate-fade-in">
          <div id="modal-drawer" className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-[#0A1D1C] text-white">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wide">
                    {/* {editingEmployee ? 'Edit Employee Info' : 'Register New Employee'} */}
                    Register New Employee
                  </h3>
                  <p className="text-4xs text-emerald-300">Set ERP access roles & metadata</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form 
            // onSubmit={handleSubmit}
             className="flex-1 overflow-y-auto p-6 space-y-4">
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
                  // value={formData.name}
                  // onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Job Designation</label>
                <input 
                  type="text" 
                  placeholder="e.g. Senior Medical Travel Advisor"
                  // value={formData.designation}
                  // onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Department</label>
                <select 
                  // value={formData.department}
                  // onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
                  // value={formData.email}
                  // onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Contact Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. +88017XXXXXXXX"
                  // value={formData.phone}
                  // onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Joining Date</label>
                <input 
                  type="date" 
                  // value={formData.joiningDate}
                  // onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
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
                      // checked={formData.status === 'Active'}
                      // onChange={() => setFormData({ ...formData, status: 'Active' })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="status"
                      // checked={formData.status === 'Inactive'}
                      // onChange={() => setFormData({ ...formData, status: 'Inactive' })}
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
                  {/* {editingEmployee ? 'SAVE DETAILS' : 'CREATE ACCOUNT'} */}
                  CREATE ACCOUNT
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
          </div>
        </div>
    </div>
  )
}

export default EmployeeModal

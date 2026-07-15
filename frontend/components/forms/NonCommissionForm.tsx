import React from 'react'

import { User, Calendar, DollarSign } from 'lucide-react'

interface NonCommissionFormProps {
    employeesList: { id: number; name: string }[];
}

const NonCommissionForm = ({ employeesList }: NonCommissionFormProps) => {
  return (
      <form 
      // onSubmit={handleSubmit} 
      className="space-y-6">
        
        {/* Metadata */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
          <div>
            <label className="block text-slate-500 font-bold mb-1">Search Client *</label>
            <input type="text" 
            // value={clientName} 
            // onChange={(e) => setClientName(e.target.value)} 
            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 focus:bg-white outline-none" required />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Sales By</label>
            <select 
            // value={salesBy} 
            // onChange={(e) => setSalesBy(e.target.value)} 
            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none">
              <option value="Select Employee">Select Employee</option>
              {/* {employeesList.map(emp => (
                <option key={emp.id} value={emp.name}>{emp.name}</option>
              ))} */}
            </select>
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Invoice No *</label>
            <input type="text" 
            // value={invoiceNo} 
            // onChange={(e) => setInvoiceNo(e.target.value)} 
            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 font-semibold outline-none" required />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Sales Date</label>
            <input type="date" 
            // value={salesDate} 
            // onChange={(e) => setSalesDate(e.target.value)} 
            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Due Date</label>
            <input type="date" 
            // value={dueDate} 
            // onChange={(e) => setDueDate(e.target.value)} 
            className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
          </div>
        </div>

        {/* Pricing & Ticket details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-100 pb-2">Ticket Details & Markup Calculations</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Ticket No *</label>
              <input type="text" 
              // value={ticketNo} 
              // onChange={(e) => setTicketNo(e.target.value)} 
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" required />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Gross Fare (Sale)</label>
              <input type="number" 
              // value={grossFare} 
              // onChange={(e) => setGrossFare(Number(e.target.value))} 
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Purchase Price (Net Rate) *</label>
              <input type="number" 
              // value={purchasePrice} 
              // onChange={(e) => setPurchasePrice(Number(e.target.value))} 
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" required />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Total Client Price *</label>
              <input type="number" 
              // value={clientPrice} 
              // onChange={(e) => setClientPrice(Number(e.target.value))} 
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" required />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">AIT Tax</label>
              <input type="number" 
              // value={ait} 
              // onChange={(e) => setAit(Number(e.target.value))} 
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Extra Fee</label>
              <input type="number" 
              // value={extraFee} 
              // onChange={(e) => setExtraFee(Number(e.target.value))} 
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Discount</label>
              <input type="number" 
              // value={discount} 
              // onChange={(e) => setDiscount(Number(e.target.value))} 
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-2 flex flex-col justify-center">
              <span className="block text-4xs font-bold text-indigo-500 uppercase">Calculated Profit</span>
              <span className="text-sm font-black text-indigo-700">৳99999</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-100 pb-2">Flight Schedule & Client</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Passenger Name</label>
              <input type="text" 
              // value={paxName}
               // onChange={(e) => setPaxName(e.target.value)} 
               className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Route</label>
              <input type="text" 
              // value={route} 
              // onChange={(e) => setRoute(e.target.value)} 
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Client PNR</label>
              <input type="text" 
              // value={pnr} 
              // onChange={(e) => setPnr(e.target.value)} 
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 uppercase outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Airline</label>
              <input type="text" 
              // value={airline} 
              // onChange={(e) => setAirline(e.target.value)} 
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Journey Date</label>
              <input type="date" 
              // value={journeyDate} 
              // onChange={(e) => setJourneyDate(e.target.value)} 
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Return Date</label>
              <input type="date" 
              // value={returnDate} 
              // onChange={(e) => setReturnDate(e.target.value)} 
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Passenger Email</label>
              <input type="email" 
              // value={email} 
              // onChange={(e) => setEmail(e.target.value)} 
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <button type="button" 
          // onClick={() => onNavigateToTab('dashboard')} 
          className="px-6 py-2.5 border border-slate-200 bg-white text-slate-600 rounded-xl text-xs font-bold cursor-pointer transition-all hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-lg shadow-indigo-500/20">
         Save Non-Commission Invoice
          </button>
        </div>

      </form>

  )
}

export default NonCommissionForm

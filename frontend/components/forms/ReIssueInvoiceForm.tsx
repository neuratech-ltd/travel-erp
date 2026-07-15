import React from 'react'
import { User, Calendar, DollarSign } from 'lucide-react'


const ReIssueInvoiceForm = () => {
  return (
     <form // onSubmit={handleSubmit} 
        className="space-y-6">
        
        {/* Metadata */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
          <div>
            <label className="block text-slate-500 font-bold mb-1">Select Client *</label>
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

        {/* Reissue Pricing differences */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-100 pb-2">Reissue Difference Calculations</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Ticket No *</label>
              <input type="text" 
              // value={ticketNo} 
              // onChange={(e) => setTicketNo(e.target.value)} 
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" required />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Airline Penalties *</label>
              <input type="number" 
              // value={penalties} 
              // onChange={(e) => setPenalties(Number(e.target.value))} 
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" required />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Fare Difference *</label>
              <input type="number" 
              // value={fareDifference} 
              // onChange={(e) => setFareDifference(Number(e.target.value))} 
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" required />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Tax Difference *</label>
              <input type="number" 
              // value={taxDifference} 
              // onChange={(e) => setTaxDifference(Number(e.target.value))} 
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" required />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Total Purchase Price (Calculated)</label>
              <input type="number" 
              // value={purchasePrice} 
              // onChange={(e) => setPurchasePrice(Number(e.target.value))} 
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-100 text-slate-600 outline-none font-bold" disabled />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Client Reissue Markup (Extra Fee)</label>
              <input type="number" 
              // value={extraFee} 
              // onChange={(e) => setExtraFee(Number(e.target.value))} 
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Reissue Discount</label>
              <input type="number" 
              // value={discount} 
              // onChange={(e) => setDiscount(Number(e.target.value))} 
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 flex flex-col justify-center">
              <span className="block text-4xs font-bold text-blue-500 uppercase font-medium">Reissue Net Profit</span>
              <span className="text-sm font-black text-blue-700">৳0000</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-100 pb-2">Flight & Routing Specifics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Airline</label>
              <input type="text" 
              // value={airline} 
              // onChange={(e) => setAirline(e.target.value)} 
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Route / Sector *</label>
              <input type="text" 
              // value={route} 
              // onChange={(e) => setRoute(e.target.value)} 
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" required />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">PNR *</label>
              <input type="text" 
              // value={pnr} 
              // onChange={(e) => setPnr(e.target.value)} 
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 uppercase outline-none" required />
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
          <button type="submit"  className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-lg shadow-blue-500/20">
         Save Reissue Invoice
          </button>
        </div>

      </form>

  )
}

export default ReIssueInvoiceForm

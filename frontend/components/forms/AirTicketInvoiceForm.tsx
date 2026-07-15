import React from 'react'
import { User, Calendar, DollarSign, Save } from 'lucide-react'

interface AirTicketInvoiceFormProps {
    employeesList: { id: number; name: string }[];

}

const AirTicketInvoiceForm = ({ employeesList }: AirTicketInvoiceFormProps) => {
  return (
    <form onSubmit={() => {}} id="ticket-invoice-form" className="space-y-6">
        
        {/* Core Invoice Metadata */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
          <div>
            <label className="block text-slate-500 font-bold mb-1">Search Client *</label>
            <input 
              type="text" 
              // value={clientName} 
              // onChange={(e) => setClientName(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none" 
              required 
            />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Sales By</label>
            <select 
              // value={salesBy} 
              // onChange={(e) => setSalesBy(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
            >
              <option value="Select Employee">Select Employee</option>
              {employeesList.map(emp => (
                <option key={emp.id} value={emp.name}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Invoice No *</label>
            <input 
              type="text" 
              // value={invoiceNo} 
              // onChange={(e) => setInvoiceNo(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 font-semibold focus:ring-2 focus:ring-blue-500/20 outline-none" 
              required 
            />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Sales Date</label>
            <input 
              type="date" 
              // value={salesDate} 
              // onChange={(e) => setSalesDate(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
            />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Due Date</label>
            <input 
              type="date" 
              // value={dueDate} 
              // onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
            />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Select Agent</label>
            <select 
              // value={selectAgent} 
              // onChange={(e) => setSelectAgent(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
            >
              <option>Select Agent</option>
              <option>Walk-In</option>
              <option>Online API</option>
            </select>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <DollarSign className="h-4 w-4 text-blue-500" />
            Ticket Details & Fare breakdown
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Ticket No *</label>
              <input 
                type="text" 
                placeholder="e.g. 997-38592038"
                // value={ticketNo} 
                // onChange={(e) => setTicketNo(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
                required 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Base Fare (Buy) *</label>
              <input 
                type="number" 
                // value={baseFare} 
                // onChange={(e) => setBaseFare(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
                required 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Taxes Commission</label>
              <input 
                type="number" 
                // value={tax} 
                // onChange={(e) => setTax(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Client Price *</label>
              <input 
                type="number" 
                // value={clientPrice} 
                // onChange={(e) => setClientPrice(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
                required 
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Commission %</label>
              <input 
                type="number" 
                // value={commissionPct} 
                // onChange={(e) => setCommissionPct(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Calculated Commission</label>
              <input 
                type="number" 
                // value={commission} 
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-100 text-slate-600 outline-none font-semibold" 
                disabled 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Purchase Cost</label>
              <input 
                type="number" 
                // value={purchasePrice} 
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-100 text-slate-600 outline-none font-semibold" 
                disabled 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Net Commission</label>
              <input 
                type="number" 
                // value={netCommission} 
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-100 text-slate-600 outline-none font-semibold" 
                disabled 
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Discount Given</label>
              <input 
                type="number" 
                // value={discount} 
                // onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Extra Fee / Service Charge</label>
              <input 
                type="number" 
                // value={extraFee} 
                // onChange={(e) => setExtraFee(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
              />
            </div>
            <div className="bg-blue-50/50 p-2.5 rounded-lg border border-blue-100 col-span-2 flex items-center justify-between">
              <div>
                <span className="block text-3xs font-bold text-blue-500 uppercase">Calculated Profit</span>
                <span className="text-sm font-black text-blue-700">৳4444</span>
              </div>
              <button 
                type="button" 
                // onClick={handleCalculate}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-3xs font-semibold cursor-pointer"
              >
                Recalculate
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs pt-4 border-t border-slate-50">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Airline</label>
              <select 
                // value={airline} 
                // onChange={(e) => setAirline(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
              >
                <option>Emirates</option>
                <option>Qatar Airways</option>
                <option>Singapore Airlines</option>
                <option>Turkish Airlines</option>
                <option>US-Bangla Airlines</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Route / Sector *</label>
              <input 
                type="text" 
                placeholder="e.g. DAC-DXB"
                // value={route} 
                // onChange={(e) => setRoute(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
                required 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">PNR *</label>
              <input 
                type="text" 
                placeholder="e.g. EKW82"
                // value={pnr} 
                // onChange={(e) => setPnr(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 uppercase outline-none" 
                required 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Class</label>
              <select 
                // value={ticketClass} 
                // onChange={(e) => setTicketClass(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
              >
                <option>Economy</option>
                <option>Premium Economy</option>
                <option>Business</option>
                <option>First Class</option>
              </select>
            </div>
          </div>
        </div>

        {/* Country Taxes Section (matching mockup) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
          <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-100 pb-2 mb-4">
            Country Taxes Breakdown (Regulatory Matching)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-bold mb-1">BD Tax</label>
              <input type="text" 
                // value={taxBd}
                //  onChange={(e) => setTaxBd(e.target.value)} 
               className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-700 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">UT Tax</label>
              <input type="text" 
                // value={taxUt}
                // onChange={(e) => setTaxUt(e.target.value)} 
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-700 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">ES Tax</label>
              <input type="text" 
                // value={taxEs}
                // onChange={(e) => setTaxEs(e.target.value)} 
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-700 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">XT Tax</label>
              <input type="text" 
                // value={taxXt}
                // onChange={(e) => setTaxXt(e.target.value)} 
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-700 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">QA Tax</label>
              <input type="text" 
                // value={taxQa}
                // onChange={(e) => setTaxQa(e.target.value)} 
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-700 outline-none" />
            </div>
            <div className="flex items-end pb-1.5">
              <span className="text-2xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 p-2 rounded-lg w-full text-center">
                Audited & Verified
              </span>
            </div>
          </div>
        </div>

        {/* Pax & Passport Details */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <User className="h-4 w-4 text-blue-500" />
            Pax & Passport Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Passenger Name *</label>
              <input 
                type="text" 
                placeholder="John Doe"
                // value={paxName}
                // onChange={(e) => setPaxName(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
                required 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Passenger Type</label>
              <select 
                // value={paxType} 
                // onChange={(e) => setPaxType(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
              >
                <option>Adult</option>
                <option>Child</option>
                <option>Infant</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Passport No</label>
              <input 
                type="text" 
                placeholder="e.g. A048592"
                // value={passportNo} 
                // onChange={(e) => setPassportNo(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Contact No</label>
              <input 
                type="text" 
                placeholder="+8801..."
                // value={contactNo} 
                // onChange={(e) => setContactNo(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Passenger Email</label>
              <input 
                type="email" 
                placeholder="pax@domain.com"
                // value={email} 
                // onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Date of Birth</label>
              <input 
                type="date" 
                // value={dob} 
                // onChange={(e) => setDob(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Passport Issue Date</label>
              <input 
                type="date" 
                // value={doi} 
                // onChange={(e) => setDoi(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Passport Expiry Date</label>
              <input 
                type="date" 
                // value={doe} 
                // onChange={(e) => setDoe(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
              />
            </div>
          </div>
        </div>

        {/* Flight Schedule details (optional) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-blue-500" />
            Flight Schedule & Routing details (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Journey Date</label>
              <input 
                type="date" 
                // value={journeyDate} 
                // onChange={(e) => setJourneyDate(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Return Date</label>
              <input 
                type="date" 
                // value={returnDate} 
                // onChange={(e) => setReturnDate(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Travel Segment</label>
              <input 
                type="text" 
                placeholder="e.g. DAC-DXB"
                // value={segment} 
                // onChange={(e) => setSegment(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Ticketing Remarks</label>
              <input 
                type="text" 
                placeholder="FBA: 30Kgs, No refunds"
                // value={remarks} 
                // onChange={(e) => setRemarks(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div id="form-submit-panel" className="flex items-center justify-end gap-3 pb-8">
          <button
            type="button"
            id="cancel-invoice-btn"
            // onClick={() => onNavigateToTab('dashboard')}
            className="px-6 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            type="submit"
            id="save-invoice-btn"
            className="flex items-center gap-1.5 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Save Invoice
          </button>
        </div>

      </form>
  )
}

export default AirTicketInvoiceForm

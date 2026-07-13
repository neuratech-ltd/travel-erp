import React, { useState, useEffect } from 'react';
import { Coins, Sparkles, Save } from 'lucide-react';
import { Invoice } from '../types';



export default function NonCommissionInvoice() {
  const [loading, setLoading] = useState(false);
  const [aiFilling, setAiFilling] = useState(false);
  const [employeesList, setEmployeesList] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/employees')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setEmployeesList(json.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  // Core metadata
  const [clientName, setClientName] = useState('Skyline Travels');
  const [salesBy, setSalesBy] = useState('Select Employee');
  const [invoiceNo, setInvoiceNo] = useState(`ANC-00${Math.floor(Math.random() * 90) + 10}`);
  const [salesDate, setSalesDate] = useState('2026-07-07');
  const [dueDate, setDueDate] = useState('2026-07-15');

  // Booking details
  const [ticketNo, setTicketNo] = useState('');
  const [vendor, setVendor] = useState('Qatar Airways');
  const [grossFare, setGrossFare] = useState<number>(0);
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [clientPrice, setClientPrice] = useState<number>(0);
  const [extraFee, setExtraFee] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [ait, setAit] = useState<number>(0);
  
  // Schedule
  const [journeyDate, setJourneyDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [route, setRoute] = useState('');
  const [pnr, setPnr] = useState('');
  const [airline, setAirline] = useState('Qatar Airways');
  const [paxName, setPaxName] = useState('');
  const [email, setEmail] = useState('');

  // Auto calculate profit
  const profit = Math.max(0, clientPrice - purchasePrice + extraFee - discount - ait);

  const triggerAiFill = async () => {
    setAiFilling(true);
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: "Generate a non-commission ticket details for DAC to New York (JFK) on Qatar Airways. Output a clean JSON block.",
          contextType: "autoFill"
        })
      });
      const data = await response.json();
      if (data.success && data.text) {
        const jsonMatch = data.text.match(/```json\n([\s\S]*?)\n```/) || data.text.match(/{[\s\S]*?}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
          setTicketNo(parsed.ticketNo || '124-948503847');
          setGrossFare(parsed.baseFare || 12000);
          setPurchasePrice(parsed.purchasePrice || 15000);
          setClientPrice(parsed.clientPrice || 18500);
          setRoute(parsed.route || 'DAC-DOH-JFK');
          setPnr(parsed.pnr || 'QRX892');
          setJourneyDate(parsed.journeyDate || '2026-07-28');
          setReturnDate(parsed.returnDate || '2026-08-20');
          setPaxName(parsed.paxName || 'Jane Smith');
          setEmail(parsed.email || 'jane.smith@skyline.com');
        }
      }
    } catch (e) {
      setTicketNo('124-948503847');
      setGrossFare(12000);
      setPurchasePrice(15000);
      setClientPrice(18500);
      setRoute('DAC-DOH-JFK');
    } finally {
      setAiFilling(false);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const success = await onAddInvoice({
  //     invoiceNo,
  //     clientName,
  //     salesBy,
  //     salesDate,
  //     dueDate,
  //     type: 'Non Commission',
  //     status: 'Unpaid',
  //     ticketNo,
  //     paxName,
  //     email,
  //     airline,
  //     route,
  //     pnr,
  //     journeyDate,
  //     returnDate,
  //     grossFare: Number(grossFare),
  //     purchasePrice: Number(purchasePrice),
  //     clientPrice: Number(clientPrice),
  //     profit,
  //     extraFee: Number(extraFee),
  //     discount: Number(discount)
  //   });

  //   setLoading(false);
  //   if (success) {
  //     onNavigateToTab('ledger');
  //   }
  // };

  return (
    <div id="non-commission-container" className="flex-1 p-8 bg-slate-50 overflow-y-auto space-y-6">
      
      {/* Header Panel */}
      <div id="nc-header" className="bg-white p-6 rounded-2xl border border-slate-200/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Coins className="h-5 w-5 text-indigo-500" />
            CREATE NON-COMMISSION INVOICE
          </h2>
          <p className="text-2xs text-slate-400 font-medium">Logs Net-Rate tickets, consolidates markups, and tracks booking files</p>
        </div>
        <button
          type="button"
          onClick={triggerAiFill}
          disabled={aiFilling}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          {aiFilling ? 'Gemini Generating...' : 'AI Auto-Fill Form'}
        </button>
      </div>

      <form 
      // onSubmit={handleSubmit} 
      className="space-y-6">
        
        {/* Metadata */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
          <div>
            <label className="block text-slate-500 font-bold mb-1">Search Client *</label>
            <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 focus:bg-white outline-none" required />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Sales By</label>
            <select value={salesBy} onChange={(e) => setSalesBy(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none">
              <option value="Select Employee">Select Employee</option>
              {employeesList.map(emp => (
                <option key={emp.id} value={emp.name}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Invoice No *</label>
            <input type="text" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 font-semibold outline-none" required />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Sales Date</label>
            <input type="date" value={salesDate} onChange={(e) => setSalesDate(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
          </div>
        </div>

        {/* Pricing & Ticket details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-100 pb-2">Ticket Details & Markup Calculations</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Ticket No *</label>
              <input type="text" value={ticketNo} onChange={(e) => setTicketNo(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" required />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Gross Fare (Sale)</label>
              <input type="number" value={grossFare} onChange={(e) => setGrossFare(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Purchase Price (Net Rate) *</label>
              <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" required />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Total Client Price *</label>
              <input type="number" value={clientPrice} onChange={(e) => setClientPrice(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" required />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">AIT Tax</label>
              <input type="number" value={ait} onChange={(e) => setAit(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Extra Fee</label>
              <input type="number" value={extraFee} onChange={(e) => setExtraFee(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Discount</label>
              <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-2 flex flex-col justify-center">
              <span className="block text-4xs font-bold text-indigo-500 uppercase">Calculated Profit</span>
              <span className="text-sm font-black text-indigo-700">৳{profit}</span>
            </div>
          </div>
        </div>

        {/* Flight Schedule */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-100 pb-2">Flight Schedule & Client</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Passenger Name</label>
              <input type="text" value={paxName} onChange={(e) => setPaxName(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Route</label>
              <input type="text" value={route} onChange={(e) => setRoute(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Client PNR</label>
              <input type="text" value={pnr} onChange={(e) => setPnr(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 uppercase outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Airline</label>
              <input type="text" value={airline} onChange={(e) => setAirline(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Journey Date</label>
              <input type="date" value={journeyDate} onChange={(e) => setJourneyDate(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Return Date</label>
              <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Passenger Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
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
          <button type="submit" disabled={loading} className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-lg shadow-indigo-500/20">
            {loading ? 'Saving...' : 'Save Non-Commission Invoice'}
          </button>
        </div>

      </form>

    </div>
  );
}

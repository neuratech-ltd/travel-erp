import React, { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, Save } from 'lucide-react';
import { Invoice } from '../types';

interface ReissueInvoiceProps {
  onAddInvoice: (inv: Partial<Invoice>) => Promise<boolean>;
  onNavigateToTab: (tab: string) => void;
}

export default function ReissueInvoice({ onAddInvoice, onNavigateToTab }: ReissueInvoiceProps) {
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
  const [clientName, setClientName] = useState('Globe Trotter Agency');
  const [salesBy, setSalesBy] = useState('Select Employee');
  const [invoiceNo, setInvoiceNo] = useState(`ARI-00${Math.floor(Math.random() * 90) + 10}`);
  const [salesDate, setSalesDate] = useState('2026-07-06');
  const [dueDate, setDueDate] = useState('2026-07-20');

  // Reissue specifics
  const [ticketNo, setTicketNo] = useState('');
  const [airline, setAirline] = useState('Turkish Airlines');
  const [route, setRoute] = useState('');
  const [pnr, setPnr] = useState('');
  const [penalties, setPenalties] = useState<number>(0);
  const [fareDifference, setFareDifference] = useState<number>(0);
  const [taxDifference, setTaxDifference] = useState<number>(0);
  const [extraFee, setExtraFee] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);

  // Computed values
  const purchasePrice = Number(penalties) + Number(fareDifference) + Number(taxDifference);
  const clientPrice = purchasePrice + Number(extraFee) - Number(discount);
  const profit = Math.max(0, clientPrice - purchasePrice);

  const triggerAiFill = async () => {
    setAiFilling(true);
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: "Generate a flight reissue details for ticket reissue: penalties 2000, fare difference 2500, tax difference 500. Route DAC-IST-CDG on Turkish Airlines. Output a clean JSON block.",
          contextType: "autoFill"
        })
      });
      const data = await response.json();
      if (data.success && data.text) {
        const jsonMatch = data.text.match(/```json\n([\s\S]*?)\n```/) || data.text.match(/{[\s\S]*?}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
          setTicketNo(parsed.ticketNo || '074-123456789');
          setPenalties(parsed.penalties || 2000);
          setFareDifference(parsed.fareDifference || 2500);
          setTaxDifference(parsed.taxDifference || 500);
          setRoute(parsed.route || 'DAC-IST-CDG');
          setPnr(parsed.pnr || 'TKZ859');
          setAirline(parsed.airline || 'Turkish Airlines');
        }
      }
    } catch (e) {
      setTicketNo('074-123456789');
      setPenalties(2000);
      setFareDifference(2500);
      setTaxDifference(500);
      setRoute('DAC-IST-CDG');
    } finally {
      setAiFilling(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await onAddInvoice({
      invoiceNo,
      clientName,
      salesBy,
      salesDate,
      dueDate,
      type: 'Reissue',
      status: 'Unpaid',
      ticketNo,
      paxName: 'Robert Johnson', // default matching list
      airline,
      route,
      pnr,
      purchasePrice,
      clientPrice,
      profit,
      extraFee: Number(extraFee),
      discount: Number(discount)
    });

    setLoading(false);
    if (success) {
      onNavigateToTab('ledger');
    }
  };

  return (
    <div id="reissue-invoice-container" className="flex-1 p-8 bg-slate-50 overflow-y-auto space-y-6">
      
      {/* Header Panel */}
      <div id="reissue-header" className="bg-white p-6 rounded-2xl border border-slate-200/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
            CREATE TICKET REISSUE INVOICE
          </h2>
          <p className="text-2xs text-slate-400 font-medium">Re-calculates fare grids, computes airline penalties, and structures differences</p>
        </div>
        <button
          type="button"
          onClick={triggerAiFill}
          disabled={aiFilling}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          {aiFilling ? 'Gemini Generating...' : 'AI Auto-Fill Form'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Metadata */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
          <div>
            <label className="block text-slate-500 font-bold mb-1">Select Client *</label>
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

        {/* Reissue Pricing differences */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-100 pb-2">Reissue Difference Calculations</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Ticket No *</label>
              <input type="text" value={ticketNo} onChange={(e) => setTicketNo(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" required />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Airline Penalties *</label>
              <input type="number" value={penalties} onChange={(e) => setPenalties(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" required />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Fare Difference *</label>
              <input type="number" value={fareDifference} onChange={(e) => setFareDifference(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" required />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Tax Difference *</label>
              <input type="number" value={taxDifference} onChange={(e) => setTaxDifference(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" required />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Total Purchase Price (Calculated)</label>
              <input type="number" value={purchasePrice} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-100 text-slate-600 outline-none font-bold" disabled />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Client Reissue Markup (Extra Fee)</label>
              <input type="number" value={extraFee} onChange={(e) => setExtraFee(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Reissue Discount</label>
              <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 flex flex-col justify-center">
              <span className="block text-4xs font-bold text-blue-500 uppercase font-medium">Reissue Net Profit</span>
              <span className="text-sm font-black text-blue-700">৳{profit}</span>
            </div>
          </div>
        </div>

        {/* Airline details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-100 pb-2">Flight & Routing Specifics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Airline</label>
              <input type="text" value={airline} onChange={(e) => setAirline(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Route / Sector *</label>
              <input type="text" value={route} onChange={(e) => setRoute(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" required />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">PNR *</label>
              <input type="text" value={pnr} onChange={(e) => setPnr(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 uppercase outline-none" required />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <button type="button" onClick={() => onNavigateToTab('dashboard')} className="px-6 py-2.5 border border-slate-200 bg-white text-slate-600 rounded-xl text-xs font-bold cursor-pointer transition-all hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-lg shadow-blue-500/20">
            {loading ? 'Reissuing...' : 'Save Reissue Invoice'}
          </button>
        </div>

      </form>

    </div>
  );
}

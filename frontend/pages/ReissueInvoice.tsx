import React, { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, Save } from 'lucide-react';
import { Invoice } from '../types';
import TitleCard from '@/components/common/TitleCard';
import ReissueInvoiceForm from '@/components/forms/ReIssueInvoiceForm';



export default function ReissueInvoice() {
  const [loading, setLoading] = useState(false);
  const [aiFilling, setAiFilling] = useState(false);
  // const [employeesList, setEmployeesList] = useState<any[]>([]);

  // useEffect(() => {
  //   fetch('/api/employees')
  //     .then(res => res.json())
  //     .then(json => {
  //       if (json.success) {
  //         setEmployeesList(json.data);
  //       }
  //     })
  //     .catch(err => console.error(err));
  // }, []);

  // Core metadata
  // const [clientName, setClientName] = useState('Globe Trotter Agency');
  // const [salesBy, setSalesBy] = useState('Select Employee');
  // const [invoiceNo, setInvoiceNo] = useState(`ARI-00${Math.floor(Math.random() * 90) + 10}`);
  // const [salesDate, setSalesDate] = useState('2026-07-06');
  // const [dueDate, setDueDate] = useState('2026-07-20');

  // // Reissue specifics
  // const [ticketNo, setTicketNo] = useState('');
  // const [airline, setAirline] = useState('Turkish Airlines');
  // const [route, setRoute] = useState('');
  // const [pnr, setPnr] = useState('');
  // const [penalties, setPenalties] = useState<number>(0);
  // const [fareDifference, setFareDifference] = useState<number>(0);
  // const [taxDifference, setTaxDifference] = useState<number>(0);
  // const [extraFee, setExtraFee] = useState<number>(0);
  // const [discount, setDiscount] = useState<number>(0);

  // Computed values
    // const purchasePrice = Number(penalties) + Number(fareDifference) + Number(taxDifference);
    // const clientPrice = purchasePrice + Number(extraFee) - Number(discount);
    // const profit = Math.max(0, clientPrice - purchasePrice);

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
          // setTicketNo(parsed.ticketNo || '074-123456789');
          // setPenalties(parsed.penalties || 2000);
          // setFareDifference(parsed.fareDifference || 2500);
          // setTaxDifference(parsed.taxDifference || 500);
          // setRoute(parsed.route || 'DAC-IST-CDG');
          // setPnr(parsed.pnr || 'TKZ859');
          // setAirline(parsed.airline || 'Turkish Airlines');
        }
      }
    } catch (e) {
      // setTicketNo('074-123456789');
      // setPenalties(2000);
      // setFareDifference(2500);
      // setTaxDifference(500);
      // setRoute('DAC-IST-CDG');
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
  //     type: 'Reissue',
  //     status: 'Unpaid',
  //     ticketNo,
  //     paxName: 'Robert Johnson', // default matching list
  //     airline,
  //     route,
  //     pnr,
  //     purchasePrice,
  //     clientPrice,
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
    <div id="reissue-invoice-container" className="flex-1 p-8 bg-slate-50 overflow-y-auto space-y-6">
      
      {/* Header Panel */}
      <div id="reissue-header" className="bg-white p-6 rounded-2xl border border-slate-200/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <TitleCard 
          icon={<RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />}
          title="CREATE TICKET REISSUE INVOICE"
          description="Re-calculates fare grids, computes airline penalties, and structures differences"
        />
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

    <ReissueInvoiceForm />

    </div>
  );
}

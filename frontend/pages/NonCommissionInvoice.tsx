import React, { useState, useEffect } from 'react';
import { Coins, Sparkles, Save } from 'lucide-react';
import { Invoice } from '../types';
import TitleCard from '@/components/common/TitleCard';
import NonCommissionForm from '@/components/forms/NonCommissionForm';



export default function NonCommissionInvoice() {
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
  // const [clientName, setClientName] = useState('Skyline Travels');
  // const [salesBy, setSalesBy] = useState('Select Employee');
  // const [invoiceNo, setInvoiceNo] = useState(`ANC-00${Math.floor(Math.random() * 90) + 10}`);
  // const [salesDate, setSalesDate] = useState('2026-07-07');
  // const [dueDate, setDueDate] = useState('2026-07-15');

  // // Booking details
  // const [ticketNo, setTicketNo] = useState('');
  // const [vendor, setVendor] = useState('Qatar Airways');
  // const [grossFare, setGrossFare] = useState<number>(0);
  // const [purchasePrice, setPurchasePrice] = useState<number>(0);
  // const [clientPrice, setClientPrice] = useState<number>(0);
  // const [extraFee, setExtraFee] = useState<number>(0);
  // const [discount, setDiscount] = useState<number>(0);
  // const [ait, setAit] = useState<number>(0);
  
  // Schedule
  // const [journeyDate, setJourneyDate] = useState('');
  // const [returnDate, setReturnDate] = useState('');
  // const [route, setRoute] = useState('');
  // const [pnr, setPnr] = useState('');
  // const [airline, setAirline] = useState('Qatar Airways');
  // const [paxName, setPaxName] = useState('');
  // const [email, setEmail] = useState('');

  // Auto calculate profit
  // const profit = Math.max(0, clientPrice - purchasePrice + extraFee - discount - ait);

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
        // if (jsonMatch) {
        //   const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        //   setTicketNo(parsed.ticketNo || '124-948503847');
        //   setGrossFare(parsed.baseFare || 12000);
        //   setPurchasePrice(parsed.purchasePrice || 15000);
        //   setClientPrice(parsed.clientPrice || 18500);
        //   setRoute(parsed.route || 'DAC-DOH-JFK');
        //   setPnr(parsed.pnr || 'QRX892');
        //   setJourneyDate(parsed.journeyDate || '2026-07-28');
        //   setReturnDate(parsed.returnDate || '2026-08-20');
        //   setPaxName(parsed.paxName || 'Jane Smith');
        //   setEmail(parsed.email || 'jane.smith@skyline.com');
        // }
      }
    } catch (e) {
      // setTicketNo('124-948503847');
      // setGrossFare(12000);
      // setPurchasePrice(15000);
      // setClientPrice(18500);
      // setRoute('DAC-DOH-JFK');
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
        <TitleCard 
          icon={<Coins className="h-5 w-5 text-indigo-500 animate-bounce" />}
          title="CREATE NON-COMMISSION INVOICE"
          description="Logs Net-Rate tickets, consolidates markups, and tracks booking files"
        />
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

    <NonCommissionForm employeesList={[]} />
    </div>
  );
}

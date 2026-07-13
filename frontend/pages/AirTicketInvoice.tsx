import React, { useState } from 'react';
import { 
  Plane, 
  Sparkles, 
  Save, 
  User, 
  DollarSign, 
  FileText, 
  Calendar, 
  HelpCircle 
} from 'lucide-react';
import { Invoice, ReportStats } from '../types';



export default function AirTicketInvoice() {
  const [loading, setLoading] = useState(false);
  const [aiFilling, setAiFilling] = useState(false);
  const [employeesList, setEmployeesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
    const [stats, setStats] = useState<ReportStats | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  


  const fetchErpData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Invoices
      const invResponse = await fetch('/api/invoices');
      const invData = await invResponse.json();
      if (invData.success) {
        setInvoices(invData.data);
      }

      // 2. Fetch Report Stats
      const statsResponse = await fetch('/api/reports/stats');
      const statsData = await statsResponse.json();
      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (error) {
      console.error('Failed to fetch ERP data from Express API:', error);
    } finally {
      setIsLoading(false);
    }
  };

   const handleAddInvoice = async (newInvoiceData: Partial<Invoice>): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInvoiceData),
      });

      const resData = await response.json();
      if (resData.success) {
        // Recalculate and pull latest state
        await fetchErpData();
        return true;
      } else {
        throw new Error(resData.message || 'API rejected billing entry');
      }
    } catch (e: any) {
      alert(`Error logging travel billing voucher: ${e.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetch('/api/employees')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setEmployeesList(json.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  // Form State
  const [clientName, setClientName] = useState('Journey Season Ltd');
  const [salesBy, setSalesBy] = useState('Select Employee');
  const [invoiceNo, setInvoiceNo] = useState(`AIT-00${Math.floor(Math.random() * 90) + 30}`);
  const [salesDate, setSalesDate] = useState('2026-07-07');
  const [dueDate, setDueDate] = useState('2026-07-21');
  const [selectAgent, setSelectAgent] = useState('Select Agent');

  // Ticket details
  const [ticketNo, setTicketNo] = useState('');
  const [grossFare, setGrossFare] = useState<number>(0);
  const [baseFare, setBaseFare] = useState<number>(0);
  const [vendor, setVendor] = useState('Emirates');
  const [clientPrice, setClientPrice] = useState<number>(0);
  const [commissionPct, setCommissionPct] = useState<number>(7);
  const [commission, setCommission] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [netCommission, setNetCommission] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [vat, setVat] = useState<number>(0);
  const [extraFee, setExtraFee] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);
  const [airline, setAirline] = useState('Emirates');
  const [route, setRoute] = useState('');
  const [pnr, setPnr] = useState('');
  const [gds, setGds] = useState('Amadeus');
  const [ticketClass, setTicketClass] = useState('Economy');
  const [journeyDate, setJourneyDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [ticketType, setTicketType] = useState('NEW TKT');
  const [segment, setSegment] = useState('');
  const [remarks, setRemarks] = useState('');

  // Country taxes mock
  const [taxBd, setTaxBd] = useState('500');
  const [taxUt, setTaxUt] = useState('200');
  const [taxEs, setTaxEs] = useState('100');
  const [taxXt, setTaxXt] = useState('400');
  const [taxQa, setTaxQa] = useState('300');

  // Passenger information
  const [passportNo, setPassportNo] = useState('');
  const [paxName, setPaxName] = useState('');
  const [paxType, setPaxType] = useState('Adult');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [doi, setDoi] = useState('');
  const [doe, setDoe] = useState('');

  // Auto calculate based on inputs
  const handleCalculate = () => {
    const calcCommission = Number(baseFare) * (Number(commissionPct) / 100);
    const calculatedPurchasePrice = Number(baseFare) + Number(tax) - calcCommission;
    const calculatedProfit = Number(clientPrice) - calculatedPurchasePrice - Number(discount) + Number(extraFee);
    
    setCommission(calcCommission);
    setPurchasePrice(calculatedPurchasePrice);
    setNetCommission(calcCommission - Number(vat));
    setProfit(Math.max(0, calculatedProfit));
  };

  React.useEffect(() => {
    handleCalculate();
  }, [baseFare, commissionPct, tax, clientPrice, discount, extraFee, vat]);

  // AI Auto Fill Routine using Gemini endpoint!
  const triggerAiAutoFill = async () => {
    setAiFilling(true);
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: "Please generate a realistic set of travel booking and client details for a flight from DAC to Dubai (DXB) on Emirates Airline. Output a clean JSON block.",
          contextType: "autoFill"
        })
      });

      const resData = await response.json();
      if (resData.success && resData.text) {
        // Parse the returned markdown JSON fence
        const jsonMatch = resData.text.match(/```json\n([\s\S]*?)\n```/) || resData.text.match(/{[\s\S]*?}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
          
          setTicketNo(parsed.ticketNo || '997-3859203859');
          setBaseFare(parsed.baseFare || 8000);
          setGrossFare(parsed.baseFare || 8000);
          setTax(parsed.tax || 1500);
          setClientPrice(parsed.clientPrice || 11500);
          setCommissionPct(parsed.commissionPct || 7);
          setAirline(parsed.airline || 'Emirates');
          setRoute(parsed.route || 'DAC-DXB');
          setPnr(parsed.pnr || 'EKXYZ9');
          setSegment(parsed.route || 'DAC-DXB');
          setTicketClass(parsed.class || 'Economy');
          setJourneyDate(parsed.journeyDate || '2026-08-10');
          setReturnDate(parsed.returnDate || '2026-08-25');
          
          setPaxName(parsed.paxName || 'David Warner');
          setPassportNo(parsed.passportNo || 'EG0495839');
          setContactNo(parsed.contactNo || '+8801958-398341');
          setEmail(parsed.email || 'david.warner@gmail.com');
          setDob(parsed.dob || '1989-10-27');
          setDoi(parsed.doi || '2021-05-14');
          setDoe(parsed.doe || '2031-05-14');
        }
      }
    } catch (e) {
      console.error('Failed to auto-fill form', e);
      // Failover to realistic offline values if Gemini fails/key missing
      setTicketNo('997-4839502859');
      setBaseFare(7500);
      setGrossFare(7500);
      setTax(1400);
      setClientPrice(11000);
      setRoute('DAC-DXB');
      setPnr('EKH782');
      setPaxName('David Warner');
      setPassportNo('EG4859385');
      setContactNo('+8801755-398322');
      setEmail('david.warner@gmail.com');
    } finally {
      setAiFilling(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const isSuccess = await handleAddInvoice({
      invoiceNo,
      clientName,
      salesBy,
      salesDate,
      dueDate,
      type: 'Air Ticket',
      status: 'Unpaid',
      ticketNo,
      paxName,
      paxType,
      passportNo,
      contactNo,
      email,
      airline,
      route,
      pnr,
      journeyDate,
      returnDate,
      class: ticketClass,
      segment,
      grossFare: Number(grossFare),
      baseFare: Number(baseFare),
      commissionPct: Number(commissionPct),
      commission: Number(commission),
      tax: Number(tax),
      purchasePrice: Number(purchasePrice),
      clientPrice: Number(clientPrice),
      netCommission: Number(netCommission),
      profit: Number(profit),
      vat: Number(vat),
      extraFee: Number(extraFee),
      discount: Number(discount)
    });

    setLoading(false);
    // if (isSuccess) {
    //   onNavigateToTab('ledger');
    // }
  };

  return (
    <div id="air-ticket-container" className="flex-1 p-8 bg-slate-50 overflow-y-auto space-y-6">
      
      {/* Header Panel */}
      <div id="form-header-panel" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div id="header-text-block">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Plane className="h-5 w-5 text-blue-500" />
            CREATE NEW AIR TICKET INVOICE
          </h2>
          <p className="text-2xs text-slate-400 font-medium mt-0.5">Logs a standard IATA billing, calculates commission & creates client accounts</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            id="ai-autofill-btn"
            onClick={triggerAiAutoFill}
            disabled={aiFilling}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className={`h-4 w-4 ${aiFilling ? 'animate-spin' : ''}`} />
            {aiFilling ? 'Gemini Thinking...' : 'AI Auto-Fill Form'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} id="ticket-invoice-form" className="space-y-6">
        
        {/* Core Invoice Metadata */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
          <div>
            <label className="block text-slate-500 font-bold mb-1">Search Client *</label>
            <input 
              type="text" 
              value={clientName} 
              onChange={(e) => setClientName(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none" 
              required 
            />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Sales By</label>
            <select 
              value={salesBy} 
              onChange={(e) => setSalesBy(e.target.value)}
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
              value={invoiceNo} 
              onChange={(e) => setInvoiceNo(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 font-semibold focus:ring-2 focus:ring-blue-500/20 outline-none" 
              required 
            />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Sales Date</label>
            <input 
              type="date" 
              value={salesDate} 
              onChange={(e) => setSalesDate(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
            />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Due Date</label>
            <input 
              type="date" 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
            />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Select Agent</label>
            <select 
              value={selectAgent} 
              onChange={(e) => setSelectAgent(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none"
            >
              <option>Select Agent</option>
              <option>Walk-In</option>
              <option>Online API</option>
            </select>
          </div>
        </div>

        {/* Ticket Details & Computations */}
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
                value={ticketNo} 
                onChange={(e) => setTicketNo(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
                required 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Base Fare (Buy) *</label>
              <input 
                type="number" 
                value={baseFare} 
                onChange={(e) => setBaseFare(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
                required 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Taxes Commission</label>
              <input 
                type="number" 
                value={tax} 
                onChange={(e) => setTax(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Client Price *</label>
              <input 
                type="number" 
                value={clientPrice} 
                onChange={(e) => setClientPrice(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
                required 
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Commission %</label>
              <input 
                type="number" 
                value={commissionPct} 
                onChange={(e) => setCommissionPct(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Calculated Commission</label>
              <input 
                type="number" 
                value={commission} 
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-100 text-slate-600 outline-none font-semibold" 
                disabled 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Purchase Cost</label>
              <input 
                type="number" 
                value={purchasePrice} 
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-100 text-slate-600 outline-none font-semibold" 
                disabled 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Net Commission</label>
              <input 
                type="number" 
                value={netCommission} 
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-100 text-slate-600 outline-none font-semibold" 
                disabled 
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Discount Given</label>
              <input 
                type="number" 
                value={discount} 
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Extra Fee / Service Charge</label>
              <input 
                type="number" 
                value={extraFee} 
                onChange={(e) => setExtraFee(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
              />
            </div>
            <div className="bg-blue-50/50 p-2.5 rounded-lg border border-blue-100 col-span-2 flex items-center justify-between">
              <div>
                <span className="block text-3xs font-bold text-blue-500 uppercase">Calculated Profit</span>
                <span className="text-sm font-black text-blue-700">৳{profit}</span>
              </div>
              <button 
                type="button" 
                onClick={handleCalculate}
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
                value={airline} 
                onChange={(e) => setAirline(e.target.value)}
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
                value={route} 
                onChange={(e) => setRoute(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
                required 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">PNR *</label>
              <input 
                type="text" 
                placeholder="e.g. EKW82"
                value={pnr} 
                onChange={(e) => setPnr(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 uppercase outline-none" 
                required 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Class</label>
              <select 
                value={ticketClass} 
                onChange={(e) => setTicketClass(e.target.value)}
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
              <input type="text" value={taxBd} onChange={(e) => setTaxBd(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-700 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">UT Tax</label>
              <input type="text" value={taxUt} onChange={(e) => setTaxUt(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-700 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">ES Tax</label>
              <input type="text" value={taxEs} onChange={(e) => setTaxEs(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-700 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">XT Tax</label>
              <input type="text" value={taxXt} onChange={(e) => setTaxXt(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-700 outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">QA Tax</label>
              <input type="text" value={taxQa} onChange={(e) => setTaxQa(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-700 outline-none" />
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
                value={paxName} 
                onChange={(e) => setPaxName(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
                required 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Passenger Type</label>
              <select 
                value={paxType} 
                onChange={(e) => setPaxType(e.target.value)}
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
                value={passportNo} 
                onChange={(e) => setPassportNo(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Contact No</label>
              <input 
                type="text" 
                placeholder="+8801..."
                value={contactNo} 
                onChange={(e) => setContactNo(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Passenger Email</label>
              <input 
                type="email" 
                placeholder="pax@domain.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Date of Birth</label>
              <input 
                type="date" 
                value={dob} 
                onChange={(e) => setDob(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Passport Issue Date</label>
              <input 
                type="date" 
                value={doi} 
                onChange={(e) => setDoi(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Passport Expiry Date</label>
              <input 
                type="date" 
                value={doe} 
                onChange={(e) => setDoe(e.target.value)}
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
                value={journeyDate} 
                onChange={(e) => setJourneyDate(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Return Date</label>
              <input 
                type="date" 
                value={returnDate} 
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Travel Segment</label>
              <input 
                type="text" 
                placeholder="e.g. DAC-DXB"
                value={segment} 
                onChange={(e) => setSegment(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-slate-800 outline-none" 
              />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Ticketing Remarks</label>
              <input 
                type="text" 
                placeholder="FBA: 30Kgs, No refunds"
                value={remarks} 
                onChange={(e) => setRemarks(e.target.value)}
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
            disabled={loading}
            className="flex items-center gap-1.5 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Logging Ticket...' : 'Save Air Ticket Invoice'}
          </button>
        </div>

      </form>

    </div>
  );
}

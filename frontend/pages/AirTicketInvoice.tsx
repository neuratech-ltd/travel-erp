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
import TitleCard from '@/components/common/TitleCard';
import AirTicketInvoiceForm from '@/components/forms/AirTicketInvoiceForm';



export default function AirTicketInvoice() {
  const [loading, setLoading] = useState(false);
  const [aiFilling, setAiFilling] = useState(false);
  const [employeesList, setEmployeesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
    const [stats, setStats] = useState<ReportStats | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  


  // const fetchErpData = async () => {
  //   setIsLoading(true);
  //   try {
  //     // 1. Fetch Invoices
  //     const invResponse = await fetch('/api/invoices');
  //     const invData = await invResponse.json();
  //     if (invData.success) {
  //       setInvoices(invData.data);
  //     }

  //     // 2. Fetch Report Stats
  //     const statsResponse = await fetch('/api/reports/stats');
  //     const statsData = await statsResponse.json();
  //     if (statsData.success) {
  //       setStats(statsData.data);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch ERP data from Express API:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  //  const handleAddInvoice = async (newInvoiceData: Partial<Invoice>): Promise<boolean> => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch('/api/invoices', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(newInvoiceData),
  //     });

  //     const resData = await response.json();
  //     if (resData.success) {
  //       // Recalculate and pull latest state
  //       await fetchErpData();
  //       return true;
  //     } else {
  //       throw new Error(resData.message || 'API rejected billing entry');
  //     }
  //   } catch (e: any) {
  //     alert(`Error logging travel billing voucher: ${e.message}`);
  //     return false;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // React.useEffect(() => {
  //   fetch('/api/employees')
  //     .then(res => res.json())
  //     .then(json => {
  //       if (json.success) {
  //         setEmployeesList(json.data);
  //       }
  //     })
  //     .catch(err => console.error(err));
  // }, []);

  // Form State
  // const [clientName, setClientName] = useState('Journey Season Ltd');
  // const [salesBy, setSalesBy] = useState('Select Employee');
  // const [invoiceNo, setInvoiceNo] = useState(`AIT-00${Math.floor(Math.random() * 90) + 30}`);
  // const [salesDate, setSalesDate] = useState('2026-07-07');
  // const [dueDate, setDueDate] = useState('2026-07-21');
  // const [selectAgent, setSelectAgent] = useState('Select Agent');

  // Ticket details
  // const [ticketNo, setTicketNo] = useState('');
  // const [grossFare, setGrossFare] = useState<number>(0);
  // const [baseFare, setBaseFare] = useState<number>(0);
  // const [vendor, setVendor] = useState('Emirates');
  // const [clientPrice, setClientPrice] = useState<number>(0);
  // const [commissionPct, setCommissionPct] = useState<number>(7);
  // const [commission, setCommission] = useState<number>(0);
  // const [tax, setTax] = useState<number>(0);
  // const [purchasePrice, setPurchasePrice] = useState<number>(0);
  // const [netCommission, setNetCommission] = useState<number>(0);
  // const [discount, setDiscount] = useState<number>(0);
  // const [vat, setVat] = useState<number>(0);
  // const [extraFee, setExtraFee] = useState<number>(0);
  // const [profit, setProfit] = useState<number>(0);
  // const [airline, setAirline] = useState('Emirates');
  // const [route, setRoute] = useState('');
  // const [pnr, setPnr] = useState('');
  // const [gds, setGds] = useState('Amadeus');
  // const [ticketClass, setTicketClass] = useState('Economy');
  // const [journeyDate, setJourneyDate] = useState('');
  // const [returnDate, setReturnDate] = useState('');
  // const [ticketType, setTicketType] = useState('NEW TKT');
  // const [segment, setSegment] = useState('');
  // const [remarks, setRemarks] = useState('');

  // Country taxes mock
  // const [taxBd, setTaxBd] = useState('500');
  // const [taxUt, setTaxUt] = useState('200');
  // const [taxEs, setTaxEs] = useState('100');
  // const [taxXt, setTaxXt] = useState('400');
  // const [taxQa, setTaxQa] = useState('300');

  // Passenger information
  // const [passportNo, setPassportNo] = useState('');
  // const [paxName, setPaxName] = useState('');
  // const [paxType, setPaxType] = useState('Adult');
  // const [contactNo, setContactNo] = useState('');
  // const [email, setEmail] = useState('');
  // const [dob, setDob] = useState('');
  // const [doi, setDoi] = useState('');
  // const [doe, setDoe] = useState('');

  // Auto calculate based on inputs
  // const handleCalculate = () => {
  //   const calcCommission = Number(baseFare) * (Number(commissionPct) / 100);
  //   const calculatedPurchasePrice = Number(baseFare) + Number(tax) - calcCommission;
  //   const calculatedProfit = Number(clientPrice) - calculatedPurchasePrice - Number(discount) + Number(extraFee);
    
  //   setCommission(calcCommission);
  //   setPurchasePrice(calculatedPurchasePrice);
  //   setNetCommission(calcCommission - Number(vat));
  //   setProfit(Math.max(0, calculatedProfit));
  // };

  // React.useEffect(() => {
  //   handleCalculate();
  // }, [baseFare, commissionPct, tax, clientPrice, discount, extraFee, vat]);

  // const triggerAiAutoFill = async () => {
  //   setAiFilling(true);
  //   try {
  //     const response = await fetch('/api/ai/chat', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         message: "Please generate a realistic set of travel booking and client details for a flight from DAC to Dubai (DXB) on Emirates Airline. Output a clean JSON block.",
  //         contextType: "autoFill"
  //       })
  //     });

  //     const resData = await response.json();
  //     if (resData.success && resData.text) {
  //       // Parse the returned markdown JSON fence
  //       const jsonMatch = resData.text.match(/```json\n([\s\S]*?)\n```/) || resData.text.match(/{[\s\S]*?}/);
  //       if (jsonMatch) {
  //         const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
          
  //         setTicketNo(parsed.ticketNo || '997-3859203859');
  //         setBaseFare(parsed.baseFare || 8000);
  //         setGrossFare(parsed.baseFare || 8000);
  //         setTax(parsed.tax || 1500);
  //         setClientPrice(parsed.clientPrice || 11500);
  //         setCommissionPct(parsed.commissionPct || 7);
  //         setAirline(parsed.airline || 'Emirates');
  //         setRoute(parsed.route || 'DAC-DXB');
  //         setPnr(parsed.pnr || 'EKXYZ9');
  //         setSegment(parsed.route || 'DAC-DXB');
  //         setTicketClass(parsed.class || 'Economy');
  //         setJourneyDate(parsed.journeyDate || '2026-08-10');
  //         setReturnDate(parsed.returnDate || '2026-08-25');
          
  //         setPaxName(parsed.paxName || 'David Warner');
  //         setPassportNo(parsed.passportNo || 'EG0495839');
  //         setContactNo(parsed.contactNo || '+8801958-398341');
  //         setEmail(parsed.email || 'david.warner@gmail.com');
  //         setDob(parsed.dob || '1989-10-27');
  //         setDoi(parsed.doi || '2021-05-14');
  //         setDoe(parsed.doe || '2031-05-14');
  //       }
  //     }
  //   } catch (e) {
  //     console.error('Failed to auto-fill form', e);
  //     // Failover to realistic offline values if Gemini fails/key missing
  //     setTicketNo('997-4839502859');
  //     setBaseFare(7500);
  //     setGrossFare(7500);
  //     setTax(1400);
  //     setClientPrice(11000);
  //     setRoute('DAC-DXB');
  //     setPnr('EKH782');
  //     setPaxName('David Warner');
  //     setPassportNo('EG4859385');
  //     setContactNo('+8801755-398322');
  //     setEmail('david.warner@gmail.com');
  //   } finally {
  //     setAiFilling(false);
  //   }
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
    
  //   const isSuccess = await handleAddInvoice({
  //     invoiceNo,
  //     clientName,
  //     salesBy,
  //     salesDate,
  //     dueDate,
  //     type: 'Air Ticket',
  //     status: 'Unpaid',
  //     ticketNo,
  //     paxName,
  //     paxType,
  //     passportNo,
  //     contactNo,
  //     email,
  //     airline,
  //     route,
  //     pnr,
  //     journeyDate,
  //     returnDate,
  //     class: ticketClass,
  //     segment,
  //     grossFare: Number(grossFare),
  //     baseFare: Number(baseFare),
  //     commissionPct: Number(commissionPct),
  //     commission: Number(commission),
  //     tax: Number(tax),
  //     purchasePrice: Number(purchasePrice),
  //     clientPrice: Number(clientPrice),
  //     netCommission: Number(netCommission),
  //     profit: Number(profit),
  //     vat: Number(vat),
  //     extraFee: Number(extraFee),
  //     discount: Number(discount)
  //   });

  //   setLoading(false);
  //   // if (isSuccess) {
  //   //   onNavigateToTab('ledger');
  //   // }
  // };

  return (
    <div id="air-ticket-container" className="flex-1 p-8 bg-slate-50 overflow-y-auto space-y-6">
      
      {/* Header Panel */}
      <div id="form-header-panel" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <TitleCard 
          icon={<Plane className="h-5 w-5 text-blue-500 animate-bounce" />}
          title="CREATE NEW AIR TICKET INVOICE"
          description="Logs a standard IATA billing, calculates commission & creates client accounts"
        />
        <div className="flex gap-3">
          <button
            type="button"
            id="ai-autofill-btn"
            // onClick={triggerAiAutoFill}
            disabled={aiFilling}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className={`h-4 w-4 ${aiFilling ? 'animate-spin' : ''}`} />
            {aiFilling ? 'Gemini Thinking...' : 'AI Auto-Fill Form'}
          </button>
        </div>
      </div>

     <AirTicketInvoiceForm employeesList={employeesList} />

    </div>
  );
}

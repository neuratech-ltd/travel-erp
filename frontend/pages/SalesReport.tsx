import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  Trash2, 
  Edit2, 
  Printer, 
  Download, 
  Search, 
  Building, 
  MapPin, 
  X,
  Info,
  RefreshCw
} from 'lucide-react';
import { SalesReportRow } from '../types';

export default function SalesReport() {
  const [rows, setRows] = useState<SalesReportRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter states
  // const [monthFilter, setMonthFilter] = useState('05'); // May
  // const [yearFilter, setYearFilter] = useState('26'); // 2026
  // const [salesRefFilter, setSalesRefFilter] = useState('All');
  // const [ticketTypeFilter, setTicketTypeFilter] = useState('All');
  // const [dueFilter, setDueFilter] = useState('All'); // All, Has Due, Cleared
  
  // // Modal states for creating/editing rows
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [editingRow, setEditingRow] = useState<SalesReportRow | null>(null);
  // const [formError, setFormError] = useState('');
  
  // Form fields
  // const [formData, setFormData] = useState({
  //   date: '02.05.26',
  //   invoiceNo: '',
  //   ticketType: 'Int:',
  //   ticketCount: 1,
  //   mrNo: '',
  //   salesRef: 'Ekramul',
  //   ticketReissue: 0,
  //   admaVoidCharge: 0,
  //   visaAppFee: 0,
  //   hotelBooking: 0,
  //   ticket: 0,
  //   receivedDate: '',
  //   cash: 0,
  //   bankBrac: 0,
  //   bankPubali: 0,
  //   bankDbbl: 0
  // });

  // Fetch all rows from backend
  const fetchRows = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/sales-reports');
      const json = await res.json();
      if (json.success) {
        setRows(json.data);
      }
    } catch (e) {
      console.error('Failed to load sales report data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  // Sync edit form with selected row
  const handleOpenEdit = (row: SalesReportRow) => {
    setEditingRow(row);
    setFormData({
      date: row.date,
      invoiceNo: row.invoiceNo,
      ticketType: row.ticketType,
      ticketCount: row.ticketCount,
      mrNo: row.mrNo,
      salesRef: row.salesRef,
      ticketReissue: row.ticketReissue,
      admaVoidCharge: row.admaVoidCharge,
      visaAppFee: row.visaAppFee,
      hotelBooking: row.hotelBooking,
      ticket: row.ticket,
      receivedDate: row.receivedDate,
      cash: row.cash,
      bankBrac: row.bankBrac,
      bankPubali: row.bankPubali,
      bankDbbl: row.bankDbbl
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingRow(null);
    // Find highest invoice number to prefill next invoice
    let nextInvoiceNum = '582';
    if (rows.length > 0) {
      const nums = rows.map(r => parseInt(r.invoiceNo)).filter(n => !isNaN(n));
      if (nums.length > 0) {
        nextInvoiceNum = String(Math.max(...nums) + 1);
      }
    }
    
    setFormData({
      date: '05.05.26',
      invoiceNo: nextInvoiceNum,
      ticketType: 'Int:',
      ticketCount: 1,
      mrNo: '',
      salesRef: 'Ekramul',
      ticketReissue: 0,
      admaVoidCharge: 0,
      visaAppFee: 0,
      hotelBooking: 0,
      ticket: 0,
      receivedDate: '',
      cash: 0,
      bankBrac: 0,
      bankPubali: 0,
      bankDbbl: 0
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Submit create or edit form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.invoiceNo || !formData.date) {
      setFormError('Please fill in Date and Invoice Number');
      return;
    }

    try {
      const url = editingRow ? `/api/sales-reports/${editingRow.id}` : '/api/sales-reports';
      const method = editingRow ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const json = await res.json();
      if (json.success) {
        fetchRows();
        setIsModalOpen(false);
        setEditingRow(null);
      } else {
        setFormError(json.message || 'Operation failed');
      }
    } catch (err: any) {
      setFormError(err.message || 'Network error');
    }
  };

  // Delete row
  const handleDeleteRow = async (id: string, invoiceNo: string) => {
    if (confirm(`Are you sure you want to delete Sales Voucher #${invoiceNo}? This will immediately adjust sheet calculations.`)) {
      try {
        const res = await fetch(`/api/sales-reports/${id}`, { method: 'DELETE' });
        const json = await res.json();
        if (json.success) {
          fetchRows();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Filter Rows
  // const filteredRows = useMemo(() => {
  //   return rows.filter(row => {
  //     // Date Month filter: e.g. "02.05.26" contains ".05.26"
  //     const dateParts = row.date.split('.');
  //     const matchMonth = monthFilter === 'All' || (dateParts[1] === monthFilter);
  //     const matchYear = yearFilter === 'All' || (dateParts[2] === yearFilter);
      
  //     const matchSalesRef = salesRefFilter === 'All' || row.salesRef.toLowerCase() === salesRefFilter.toLowerCase();
      
  //     // Match ticket type ("Int:" or "Domestic")
  //     let matchTicketType = true;
  //     if (ticketTypeFilter !== 'All') {
  //       if (ticketTypeFilter === 'Int:') {
  //         matchTicketType = row.ticketType.toLowerCase().startsWith('int');
  //       } else if (ticketTypeFilter === 'Domestic') {
  //         matchTicketType = row.ticketType.toLowerCase().startsWith('dom');
  //       } else {
  //         matchTicketType = row.ticketType.toLowerCase() === ticketTypeFilter.toLowerCase();
  //       }
  //     }

  //     // Due Filter
  //     let matchDue = true;
  //     if (dueFilter === 'Has Due') {
  //       matchDue = row.dueAmount > 0;
  //     } else if (dueFilter === 'Cleared') {
  //       matchDue = row.dueAmount <= 0;
  //     }

  //     // Text search
  //     const query = searchQuery.toLowerCase();
  //     const matchSearch = query === '' || 
  //       row.invoiceNo.toLowerCase().includes(query) ||
  //       row.mrNo.toLowerCase().includes(query) ||
  //       row.salesRef.toLowerCase().includes(query) ||
  //       row.ticketType.toLowerCase().includes(query);

  //     return matchMonth && matchYear && matchSalesRef && matchTicketType && matchDue && matchSearch;
  //   });
  // }, [rows, monthFilter, yearFilter, salesRefFilter, ticketTypeFilter, dueFilter, searchQuery]);

  // Unique lists for dropdowns
  const salesRefs = useMemo(() => {
    const list = new Set<string>();
    rows.forEach(r => { if (r.salesRef) list.add(r.salesRef); });
    return Array.from(list);
  }, [rows]);

  // Calculations for Grand Totals
  // const totals = useMemo(() => {
  //   let ticketReissueSum = 0;
  //   let admaVoidChargeSum = 0;
  //   let visaAppFeeSum = 0;
  //   let hotelBookingSum = 0;
  //   let ticketSum = 0;
  //   let totalSalesSum = 0;
  //   let cashSum = 0;
  //   let bankBracSum = 0;
  //   let bankPubaliSum = 0;
  //   let bankDbblSum = 0;
  //   let totalReceivedSum = 0;
  //   let dueAmountSum = 0;
  //   let ticketCountSum = 0;

  //   filteredRows.forEach(row => {
  //     ticketReissueSum += row.ticketReissue || 0;
  //     admaVoidChargeSum += row.admaVoidCharge || 0;
  //     visaAppFeeSum += row.visaAppFee || 0;
  //     hotelBookingSum += row.hotelBooking || 0;
  //     ticketSum += row.ticket || 0;
  //     totalSalesSum += row.totalSales || 0;
  //     cashSum += row.cash || 0;
  //     bankBracSum += row.bankBrac || 0;
  //     bankPubaliSum += row.bankPubali || 0;
  //     bankDbblSum += row.bankDbbl || 0;
  //     totalReceivedSum += row.totalReceived || 0;
  //     dueAmountSum += row.dueAmount || 0;
  //     ticketCountSum += row.ticketCount || 0;
  //   });

  //   return {
  //     ticketReissue: ticketReissueSum,
  //     admaVoidCharge: admaVoidChargeSum,
  //     visaAppFee: visaAppFeeSum,
  //     hotelBooking: hotelBookingSum,
  //     ticket: ticketSum,
  //     totalSales: totalSalesSum,
  //     cash: cashSum,
  //     bankBrac: bankBracSum,
  //     bankPubali: bankPubaliSum,
  //     bankDbbl: bankDbblSum,
  //     totalReceived: totalReceivedSum,
  //     dueAmount: dueAmountSum,
  //     ticketCount: ticketCountSum
  //   };
  // }, [filteredRows]);

  // Form helper calculations
  // const liveFormSalesTotal = Number(formData.ticketReissue || 0) + 
  //                            Number(formData.admaVoidCharge || 0) + 
  //                            Number(formData.visaAppFee || 0) + 
  //                            Number(formData.hotelBooking || 0) + 
  //                            Number(formData.ticket || 0);

  // const liveFormReceivedTotal = Number(formData.cash || 0) + 
  //                                Number(formData.bankBrac || 0) + 
  //                                Number(formData.bankPubali || 0) + 
  //                                Number(formData.bankDbbl || 0);

  // const liveFormDueTotal = liveFormSalesTotal - liveFormReceivedTotal;

  // Format helper
  // const formatBDT = (num: number) => {
  //   if (num === 0) return '-';
  //   return num.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  // };

  // const handlePrint = () => {
  //   window.print();
  // };

  // const handleExportCSV = () => {
  //   const headers = [
  //     'Date', 'Inv. No', 'Type of Ticket', 'No of Ticket', 'MR No', 'Sales Ref.',
  //     'Ticket Reissue', 'ADMA/Void Charge', 'Visa App. fee', 'Hotel Booking', 'Ticket', 'Total Sales',
  //     'Received Date', 'Cash', 'Brac Bank', 'Pubali Bank', 'DBBL', 'Total Received', 'Due Amount'
  //   ];
    
  //   const csvRows = [headers.join(',')];
    
  //   filteredRows.forEach(r => {
  //     csvRows.push([
  //       r.date,
  //       r.invoiceNo,
  //       `"${r.ticketType}"`,
  //       r.ticketCount,
  //       `"${r.mrNo}"`,
  //       `"${r.salesRef}"`,
  //       r.ticketReissue,
  //       r.admaVoidCharge,
  //       r.visaAppFee,
  //       r.hotelBooking,
  //       r.ticket,
  //       r.totalSales,
  //       r.receivedDate,
  //       r.cash,
  //       r.bankBrac,
  //       r.bankPubali,
  //       r.bankDbbl,
  //       r.totalReceived,
  //       r.dueAmount
  //     ].join(','));
  //   });

  //   // Add Grand Totals Row
  //   csvRows.push([
  //     'GRAND TOTALS', '', '', totals.ticketCount, '', '',
  //     totals.ticketReissue, totals.admaVoidCharge, totals.visaAppFee, totals.hotelBooking, totals.ticket, totals.totalSales,
  //     '', totals.cash, totals.bankBrac, totals.bankPubali, totals.bankDbbl, totals.totalReceived, totals.dueAmount
  //   ].join(','));

  //   const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = `Welcare_Trip_Sales_Report_${monthFilter}_20${yearFilter}.csv`;
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  // };

  return (
    <div id="sales-report-container" className="flex-1 p-6 bg-slate-100 overflow-y-auto space-y-6 print:p-0 print:bg-white print:overflow-visible">
      
      {/* Interactive Toolbar (Hidden in Print Mode) */}
      <div id="report-controls" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600 rounded-xl text-white">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">SALES EXCEL WORKSHEET</h2>
              <p className="text-2xs text-slate-400 font-medium">Monthly ledger calculation & bank audit reconciliation</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={handleOpenCreate}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-2xs rounded-lg shadow flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              ADD NEW RECORD
            </button>
            <button 
              // onClick={handlePrint}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              PRINT REPORT
            </button>
            <button 
              // onClick={handleExportCSV}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4" />
              EXPORT CSV
            </button>
            <button 
              onClick={fetchRows}
              className="p-2 text-slate-500 hover:text-emerald-600 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer"
              title="Refresh spreadsheet"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Select Month</label>
            <select 
              // value={monthFilter} 
              // onChange={(e) => setMonthFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none"
            >
              <option value="All">All Months</option>
              <option value="01">January</option>
              <option value="02">February</option>
              <option value="03">March</option>
              <option value="04">April</option>
              <option value="05">May</option>
              <option value="06">June</option>
              <option value="07">July</option>
              <option value="08">August</option>
              <option value="09">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>

          <div>
            <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Select Year</label>
            <select 
              // value={yearFilter} 
              // onChange={(e) => setYearFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none"
            >
              <option value="All">All Years</option>
              <option value="25">2025</option>
              <option value="26">2026</option>
              <option value="27">2027</option>
            </select>
          </div>

          <div>
            <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Sales Advisor</label>
            <select 
              // value={salesRefFilter} 
              // onChange={(e) => setSalesRefFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none"
            >
              <option value="All">All Advisors</option>
              {salesRefs.map(ref => (
                <option key={ref} value={ref}>{ref}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Ticket Class</label>
            <select 
              // value={ticketTypeFilter} 
              // onChange={(e) => setTicketTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none"
            >
              <option value="All">All Types</option>
              <option value="Int:">International (Int:)</option>
              <option value="Domestic">Domestic</option>
            </select>
          </div>

          <div>
            <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Due Reconciliation</label>
            <select 
              // value={dueFilter} 
              // onChange={(e) => setDueFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none"
            >
              <option value="All">All Accounts</option>
              <option value="Has Due">Has Unpaid Due</option>
              <option value="Cleared">Cleared (Zero Due)</option>
            </select>
          </div>

          <div className="relative flex items-end">
            <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none pb-1.5">
              <Search className="h-3.5 w-3.5 text-slate-400" />
            </span>
            <input 
              type="text" 
              placeholder="Search invoices/MR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Main Print/Excel Page Container */}
      <div id="sales-excel-card" className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-full overflow-x-auto print:p-0 print:border-none print:shadow-none font-sans">
        
        {/* Spreadsheet Header / Letterhead */}
        <div id="excel-letterhead" className="flex flex-col items-center text-center pb-6 border-b-2 border-slate-900/10 mb-6 space-y-2">
          <h1 className="text-3xl font-extrabold text-[#0B2E2D] tracking-wider uppercase font-sans">Welcare Trip</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1 text-4xs text-slate-500 max-w-2xl font-medium">
            <div className="flex items-center justify-center gap-1">
              <Building className="h-3 w-3 text-emerald-600 shrink-0" />
              <span><strong>Head Office:</strong> Sena Kalyan Bhaban, 20th Floor, 195, Motijheel, Dhaka-1000.</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
              <span><strong>Branch Office:</strong> Kunio Bithi, 7th Floor, House# 63, Road# 27, Gulshan-1, Dhaka-121.</span>
            </div>
          </div>
          
          <div className="pt-2">
            <span className="px-5 py-1.5 bg-[#0B2E2D] text-white text-xs font-bold rounded-full uppercase tracking-widest">
              Sales Report for the month of ?
            </span>
          </div>
        </div>

        {/* Live Filter Info banner in spreadsheet */}
        <div className="flex justify-between items-center text-4xs text-slate-400 font-semibold uppercase tracking-wider pb-3 print:hidden">
          <div>
            Showing: <strong className="text-slate-700"> 3 transactions</strong>
          </div>
          <div>
            Base Currency: <strong className="text-emerald-700">BDT (taka)</strong>
          </div>
        </div>

        {/* Real-time audit metrics blocks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 print:hidden">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left">
            <span className="block text-4xs text-slate-400 font-bold uppercase">Total Gross Sales</span>
            <strong className="text-lg text-slate-800 font-mono">৳ 444555</strong>
          </div>
          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/60 text-left">
            <span className="block text-4xs text-emerald-600 font-bold uppercase">Total Bank Receipt</span>
            <strong className="text-lg text-emerald-700 font-mono">৳ 444555</strong>
          </div>
          <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100/60 text-left">
            <span className="block text-4xs text-teal-600 font-bold uppercase">Total Cash Receipt</span>
            <strong className="text-lg text-teal-700 font-mono">৳ 444555</strong>
          </div>
          <div className={`p-4 rounded-2xl border text-left`}>
            <span className="block text-4xs font-bold uppercase">Total Due Outstanding</span>
            <strong className="text-lg font-mono">৳ 444555</strong>
          </div>
        </div>

        <div className="overflow-x-auto min-w-full">
          <table className="w-full text-left border-collapse text-3xs border border-slate-300 font-sans">
            <thead>
              <tr className="bg-[#0B2E2D] text-white text-center font-bold uppercase tracking-wider border border-slate-300">
                <th rowSpan={2} className="py-2.5 px-2 border-r border-slate-400 text-left min-w-[70px]">Date</th>
                <th rowSpan={2} className="py-2.5 px-1 border-r border-slate-400 min-w-[50px]">Inv. No</th>
                <th rowSpan={2} className="py-2.5 px-2 border-r border-slate-400 min-w-[75px]">Type of Ticket</th>
                <th rowSpan={2} className="py-2.5 px-1 border-r border-slate-400 min-w-[50px]">No of Ticket</th>
                <th rowSpan={2} className="py-2.5 px-2 border-r border-slate-400 min-w-[90px]">MR No</th>
                <th rowSpan={2} className="py-2.5 px-2 border-r border-slate-400 min-w-[90px]">Sales Ref.</th>
                
                <th colSpan={6} className="py-1.5 border-b border-r border-slate-400 text-center tracking-widest text-4xs bg-[#103D3C]">Sales Amount</th>
                
                <th rowSpan={2} className="py-2.5 px-2 border-r border-slate-400 min-w-[70px]">Received Date</th>
                
                {/* Received Group */}
                <th colSpan={5} className="py-1.5 border-b border-r border-slate-400 text-center tracking-widest text-4xs bg-[#144D4B]">Received</th>
                
                <th rowSpan={2} className="py-2.5 px-2 text-right min-w-[85px] bg-rose-900/20 text-[#4D1416]">Due Amount</th>
                <th rowSpan={2} className="py-2.5 px-2 text-center print:hidden min-w-[70px]">Actions</th>
              </tr>

              {/* Layer 2: Breakdown Columns */}
              <tr className="bg-[#154645] text-white text-right font-semibold border-b border-slate-300">
                {/* Sales breakdown */}
                <th className="py-1.5 px-2 border-r border-slate-400 font-mono text-center min-w-[75px]">Ticket Reissue</th>
                <th className="py-1.5 px-2 border-r border-slate-400 font-mono text-center min-w-[75px]">ADMA/Void</th>
                <th className="py-1.5 px-2 border-r border-slate-400 font-mono text-center min-w-[75px]">Visa App</th>
                <th className="py-1.5 px-2 border-r border-slate-400 font-mono text-center min-w-[75px]">Hotel Book</th>
                <th className="py-1.5 px-2 border-r border-slate-400 font-mono text-center min-w-[80px]">Ticket</th>
                <th className="py-1.5 px-2 border-r border-slate-400 font-bold bg-[#1C5E5C] text-center min-w-[90px]">Total Sales</th>
                
                {/* Received breakdown */}
                <th className="py-1.5 px-2 border-r border-slate-400 font-mono text-center min-w-[75px]">Cash</th>
                <th className="py-1.5 px-2 border-r border-slate-400 font-mono text-center min-w-[75px]">Brac Bank</th>
                <th className="py-1.5 px-2 border-r border-slate-400 font-mono text-center min-w-[75px]">Pubali Bank</th>
                <th className="py-1.5 px-2 border-r border-slate-400 font-mono text-center min-w-[75px]">DBBL</th>
                <th className="py-1.5 px-2 border-r border-slate-400 font-bold bg-[#1D5F5D] text-center min-w-[90px]">Total (taka)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 bg-white">
                <tr  className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-2 border-r border-slate-300 font-medium text-slate-700">5/1/2023</td>
                  <td className="py-2 px-1 border-r border-slate-300 font-bold text-slate-900 text-center">INV-001</td>
                  <td className="py-2 px-2 border-r border-slate-300 text-slate-600">
                    {/* <span className={`px-1.5 py-0.5 rounded text-4xs font-bold ${
                      row.ticketType.startsWith('Int') ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}>
                      {row.ticketType}
                    </span> */}
                  </td>
                  <td className="py-2 px-1 border-r border-slate-300 font-bold text-slate-800 text-center">1</td>
                  <td className="py-2 px-2 border-r border-slate-300 font-mono text-slate-600 break-all">MR-001</td>
                  <td className="py-2 px-2 border-r border-slate-300 text-slate-700 font-medium">REF-001</td>
                  
                  {/* Sales Breakdown Values */}
                  <td className="py-2 px-2 border-r border-slate-300 text-right font-mono text-slate-700">03/1/2023</td>
                  <td className="py-2 px-2 border-r border-slate-300 text-right font-mono text-slate-700"></td>
                  <td className="py-2 px-2 border-r border-slate-300 text-right font-mono text-slate-700">50000</td>
                  <td className="py-2 px-2 border-r border-slate-300 text-right font-mono text-slate-700">55544</td>
                  <td className="py-2 px-2 border-r border-slate-300 text-right font-mono text-slate-700">44444</td>
                  
                  {/* Total Sales */}
                  <td className="py-2 px-2 border-r border-slate-300 text-right font-mono font-extrabold text-slate-900 bg-slate-50/70">
                    {/* {formatBDT(row.totalSales)} */}
                    100000
                  </td>
                  
                  {/* Received Date */}
                  <td className="py-2 px-2 border-r border-slate-300 text-slate-600 font-mono">04/01/2023</td>
                  
                  {/* Received Breakdown Values */}
                  <td className="py-2 px-2 border-r border-slate-300 text-right font-mono text-slate-700">5000</td>
                  <td className="py-2 px-2 border-r border-slate-300 text-right font-mono text-slate-700">50000</td>
                  <td className="py-2 px-2 border-r border-slate-300 text-right font-mono text-slate-700">55544</td>
                  <td className="py-2 px-2 border-r border-slate-300 text-right font-mono text-slate-700">44444</td>
                  
                  {/* Total Received */}
                  <td className="py-2 px-2 border-r border-slate-300 text-right font-mono font-extrabold text-slate-900 bg-emerald-50/30">
                    {/* {formatBDT(row.totalReceived)} */}
                    100000
                  </td>
                  
                  {/* Due Amount */}
                  <td className={`py-2 px-2 border-r border-slate-300 text-right font-mono font-black`}>
                    {/* {formatBDT(row.dueAmount)} */}
                    0
                  </td>

                  {/* Actions for local edit/delete */}
                  <td className="py-2 px-2 text-center print:hidden">
                    <div className="flex items-center justify-center gap-1.5">
                      <button 
                        // onClick={() => handleOpenEdit(row)}
                        className="p-1 hover:bg-slate-100 rounded text-indigo-600 transition-colors cursor-pointer"
                        title="Edit entry"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button 
                        // onClick={() => handleDeleteRow(row.id, row.invoiceNo)}
                        className="p-1 hover:bg-rose-50 rounded text-rose-500 transition-colors cursor-pointer"
                        title="Delete entry"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>

              {/* {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={20} className="py-8 text-center text-slate-400 font-semibold uppercase tracking-wider">
                    {isLoading ? 'SYNCING EXCEL WORKSHEET...' : 'No sales ledger entries found matching criteria.'}
                  </td>
                </tr>
              )} */}

              <tr className="bg-emerald-500/10 font-extrabold text-slate-950 border-t-2 border-slate-900 border-b-4 border-double border-slate-900">
                <td colSpan={3} className="py-3 px-2 border-r border-slate-300 text-left font-black tracking-wider uppercase bg-emerald-600/5">
                  GRAND TOTAL
                </td>
                <td className="py-3 px-1 border-r border-slate-300 text-center text-slate-900 font-black">
                  10
                </td>
                <td colSpan={2} className="py-3 px-2 border-r border-slate-300 text-center">
                  -
                </td>
                
                <td className="py-3 px-2 border-r border-slate-300 text-right font-mono text-slate-900">৳ 0000</td>
                <td className="py-3 px-2 border-r border-slate-300 text-right font-mono text-slate-900">৳ 0000</td>
                <td className="py-3 px-2 border-r border-slate-300 text-right font-mono text-slate-900">৳ 0000</td>
                <td className="py-3 px-2 border-r border-slate-300 text-right font-mono text-slate-900">৳ 0000</td>
                <td className="py-3 px-2 border-r border-slate-300 text-right font-mono text-slate-900">৳ 0000</td>
                <td className="py-3 px-2 border-r border-slate-300 text-right font-mono text-[#0B2E2D] font-black bg-emerald-500/10">
                 ৳ 100000
                </td>
                
                <td className="py-3 px-2 border-r border-slate-300 text-center">-</td>
                
                {/* Received Totals */}
                <td className="py-3 px-2 border-r border-slate-300 text-right font-mono text-slate-900">৳ 0000</td>
                <td className="py-3 px-2 border-r border-slate-300 text-right font-mono text-slate-900">৳ 0000</td>
                <td className="py-3 px-2 border-r border-slate-300 text-right font-mono text-slate-900">৳ 0000</td>
                <td className="py-3 px-2 border-r border-slate-300 text-right font-mono text-slate-900">৳ 0000</td>
                <td className="py-3 px-2 border-r border-slate-300 text-right font-mono text-[#0B2E2D] font-black bg-emerald-500/10">
                  ৳ 4000
                </td>
                
                {/* Due Outstanding Total */}
                <td className={`py-3 px-2 border-r border-slate-300 text-right font-mono font-black ${
                  44 > 0 ? 'text-rose-700 bg-rose-50' : 'text-slate-400'
                }`}>
                  {/* ৳ {totals.dueAmount.toLocaleString()} */}
                </td>
                
                <td className="py-3 px-2 text-center print:hidden bg-[#0B2E2D]/5">-</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Footnotes / Reconciliation Notes (Perfect for audit) */}
        <div className="mt-8 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-4xs text-slate-400 font-medium">
          <div>
            <p className="font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
              <Info className="h-3 w-3 text-indigo-500 shrink-0" />
              Spreadsheet Audit Guidelines
            </p>
            <p>1. Total (taka) received is computed dynamically as sum of Cash and active Clearing bank channels (Brac, Pubali, DBBL).</p>
            <p>2. Sales Amount reflects absolute ticket costs, ADMA/Void, visa fees, hotel bookings, and ticket reissues.</p>
          </div>
          <div className="text-right md:text-right text-slate-400 self-end">
            <p>Certified Monthly Reconciliation Copy</p>
            <p className="font-semibold text-slate-500 mt-0.5">Welcare Trip Accounts & Finance Dept.</p>
          </div>
        </div>
      </div>

      {/* Slide-over Form Overlay Modal (Adding/Editing rows) */}
      {isModalOpen && (
        <div id="form-overlay" className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex justify-end z-50 animate-fade-in print:hidden">
          <div id="form-drawer" className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-slide-left">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-[#0B2E2D] text-white">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wide">
                    {/* {editingRow ? `Edit Sales Record #${formData.invoiceNo}` : 'Add New Sales Record'}
                     */}
                     Add new sales record
                  </h3>
                  <p className="text-4xs text-emerald-300">Live calculating grid inputs</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* {formError && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-2xs font-bold">
                  {formError}
                </div>
              )} */}

              {/* SECTION A: General Details */}
              <div className="space-y-4">
                <h4 className="text-4xs font-bold text-emerald-600 uppercase tracking-widest border-b border-slate-100 pb-1">
                  1. GENERAL VOUCHER DETAILS
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Transaction Date</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 02.05.26"
                      // value={formData.date}
                      // onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Invoice Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 560"
                      // value={formData.invoiceNo}
                      // onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Ticket Class</label>
                    <select 
                      //value={formData.ticketType}
                     // onChange={(e) => setFormData({ ...formData, ticketType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700 outline-none"
                    >
                      <option value="Int:">International (Int:)</option>
                      <option value="Domestic">Domestic</option>
                      <option value="Visa">Visa Service</option>
                      <option value="Hotel">Hotel Stay</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Ticket Count (No. of Ticket)</label>
                    <input 
                      type="number" 
                      // value={formData.ticketCount}
                      //  onChange={(e) => setFormData({ ...formData, ticketCount: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">MR (Money Receipt) No.</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 331/251"
                      // value={formData.mrNo}
                      // onChange={(e) => setFormData({ ...formData, mrNo: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Sales Advisor Reference</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Ekramul"
                      // value={formData.salesRef}
                      // onChange={(e) => setFormData({ ...formData, salesRef: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: Sales Amount Breakdown */}
              <div className="space-y-4">
                <h4 className="text-4xs font-bold text-emerald-600 uppercase tracking-widest border-b border-slate-100 pb-1">
                  2. SALES REVENUE BREAKDOWN (BDT)
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Ticket Reissue Amount</label>
                    <input 
                      type="number" 
                      // value={formData.ticketReissue}
                      // onChange={(e) => setFormData({ ...formData, ticketReissue: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">ADMA/Void Charge</label>
                    <input 
                      type="number" 
                      // value={formData.admaVoidCharge}
                      // onChange={(e) => setFormData({ ...formData, admaVoidCharge: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Visa App Fee</label>
                    <input 
                      type="number" 
                      // value={formData.visaAppFee}
                      // onChange={(e) => setFormData({ ...formData, visaAppFee: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Hotel Booking</label>
                    <input 
                      type="number" 
                      // value={formData.hotelBooking}
                      // onChange={(e) => setFormData({ ...formData, hotelBooking: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none text-right"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Standard Ticket Fare Amount</label>
                    <input 
                      type="number" 
                      // value={formData.ticket}
                      // onChange={(e) => setFormData({ ...formData, ticket: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none text-right font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: Collections / Received */}
              <div className="space-y-4">
                <h4 className="text-4xs font-bold text-emerald-600 uppercase tracking-widest border-b border-slate-100 pb-1">
                  3. CASH & BANK RECEIPT RECONCILIATION
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Received Date</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 13.05.26"
                      // value={formData.receivedDate}
                      // onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Cash Collection</label>
                    <input 
                      type="number" 
                      // value={formData.cash}
                     // onChange={(e) => setFormData({ ...formData, cash: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Brac Bank receipt</label>
                    <input 
                      type="number" 
                      // value={formData.bankBrac}
                      // onChange={(e) => setFormData({ ...formData, bankBrac: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Pubali Bank receipt</label>
                    <input 
                      type="number" 
                      // value={formData.bankPubali}
                      // onChange={(e) => setFormData({ ...formData, bankPubali: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none text-right"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">DBBL receipt</label>
                    <input 
                      type="number" 
                      // value={formData.bankDbbl}
                      // onChange={(e) => setFormData({ ...formData, bankDbbl: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:bg-white outline-none text-right"
                    />
                  </div>
                </div>
              </div>

              {/* LIVE CALC SUMMARY INSIDE FORM */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-3xs font-semibold text-slate-600">
                <span className="block font-black text-4xs uppercase tracking-wider text-slate-500">Live Auto-Calculation Summary</span>
                <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                  <span>Total Sales Amount:</span>
                  <span className="font-mono text-slate-900">৳ 44444</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                  <span>Total Received (Taka):</span>
                  <span className="font-mono text-slate-900 text-emerald-600">৳ 44444</span>
                </div>
                <div className="flex justify-between pt-1 font-bold">
                  <span>Balance Due Amount:</span>
                  <span className={`font-mono 5000 > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {/* ৳ {liveFormDueTotal.toLocaleString()} */}
                    ৳ 04543
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-4 flex gap-3">
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-2xs rounded-xl shadow-lg transition-colors cursor-pointer"
                >
                  {/* {editingRow ? 'SAVE ADJUSTMENTS' : 'INSERT RECORD'} */}
                  INSERT RECORD
                </button>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-2xs rounded-xl transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  MoreVertical, 
  DollarSign, 
  TrendingUp, 
  Plane,
  Briefcase,
  Layers,
  Sparkles,
  HeartPulse,
  Hotel,
  User,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { Invoice } from '../types';

// interface InvoiceLedgerProps {
//   invoices: Invoice[];
//   onUpdateStatus: (id: string, status: 'Paid' | 'Unpaid' | 'Partial') => Promise<void>;
//   onDeleteInvoice: (id: string) => Promise<void>;
//   isLoading?: boolean;
// }

export default function InvoiceLedger() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);

  

  // Compute stats on the current filtered view!
  // const filteredInvoices = useMemo(() => {
  //   return invoices.filter((inv) => {
  //     const matchSearch = 
  //       inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       (inv.paxName && inv.paxName.toLowerCase().includes(searchQuery.toLowerCase())) ||
  //       (inv.route && inv.route.toLowerCase().includes(searchQuery.toLowerCase()));

  //     const matchType = typeFilter === 'All' || inv.type === typeFilter;
  //     const matchStatus = statusFilter === 'All' || inv.status === statusFilter;

  //     return matchSearch && matchType && matchStatus;
  //   });
  // }, [invoices, searchQuery, typeFilter, statusFilter]);

  // Aggregate totals of filtered rows
  // const ledgerTotals = useMemo(() => {
  //   let totalSales = 0;
  //   let totalProfit = 0;
  //   filteredInvoices.forEach(inv => {
  //     totalSales += inv.clientPrice || (inv.billing?.netTotal) || 0;
  //     totalProfit += inv.profit || (inv.billing?.totalProfit) || 0;
  //   });
  //   return { sales: totalSales, profit: totalProfit };
  // }, [filteredInvoices]);

  const getTypeBadgeStyles = (type: string) => {
    switch (type) {
      case 'Air Ticket': return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'Non Commission': return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
      case 'Reissue': return 'bg-purple-50 text-purple-600 border border-purple-100';
      case 'Tour Package': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'Hotel': return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'Visa': return 'bg-pink-50 text-pink-600 border border-pink-100';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      case 'Partial': return 'bg-amber-50 text-amber-700 border border-amber-100';
      case 'Unpaid': return 'bg-rose-50 text-rose-700 border border-rose-100';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div id="invoice-ledger-container" className="flex-1 p-8 bg-slate-50 overflow-y-auto space-y-6">
      
      {/* Search & Filter Top Bar */}
      <div id="ledger-filters" className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-500" />
              FINANCIAL TRANSACTION LEDGER
            </h2>
            <p className="text-2xs text-slate-400 font-medium">Browse, search, audit, or delete logged travel transactions</p>
          </div>
          {/* Quick Stats overview */}
          <div className="flex gap-4 text-xs font-semibold text-slate-600">
            <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-slate-400" />
              Sales Total: <strong className="text-slate-800">৳ 000</strong>
            </div>
            <div className="bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1.5 text-emerald-700">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Profit Margin: <strong>৳ 000</strong>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {/* Search bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Search by Invoice, Client, Pax, Route..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
            />
          </div>

          {/* Type dropdown */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 text-slate-700 outline-none"
            >
              <option value="All">All Booking Types</option>
              <option value="Air Ticket">Air Ticket</option>
              <option value="Non Commission">Non Commission</option>
              <option value="Reissue">Reissue</option>
              <option value="Tour Package">Tour Package</option>
              <option value="Hotel">Hotel</option>
              <option value="Visa">Visa</option>
            </select>
          </div>

          {/* Status dropdown */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 text-slate-700 outline-none"
            >
              <option value="All">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>

          {/* Clean filters link */}
          <div className="flex items-center">
            {(searchQuery || typeFilter !== 'All' || statusFilter !== 'All') && (
              <button 
                onClick={() => { setSearchQuery(''); setTypeFilter('All'); setStatusFilter('All'); }}
                className="text-2xs text-rose-500 hover:text-rose-700 font-bold transition-colors cursor-pointer"
              >
                Clear All Filter Constraints
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Ledger Table Grid */}
      <div id="ledger-grid" className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-3xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Invoice No</th>
                <th className="py-4 px-4">Client Name</th>
                <th className="py-4 px-4">Booking Type</th>
                <th className="py-4 px-4">Passenger Name</th>
                <th className="py-4 px-4">Route / Sector / Booking</th>
                <th className="py-4 px-4 text-right">Revenue</th>
                <th className="py-4 px-4 text-right">Profit</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-2xs text-slate-700">
              {/* {filteredInvoices.map((inv) => {
                const revenue = inv.clientPrice || (inv.billing?.netTotal) || 0;
                const profitVal = inv.profit || (inv.billing?.totalProfit) || 0;
                const displayRoute = inv.route || (inv.ticketInfo?.route) || 'Local Tour';
                const displayPax = inv.paxName || (inv.passportInfo?.paxName) || 'Walk-In Customer';
                const isExpanded = expandedInvoiceId === inv.id;

                return (
                  <React.Fragment key={inv.id}>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-6 font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <button 
                          onClick={() => setExpandedInvoiceId(isExpanded ? null : inv.id)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </button>
                        <span>{inv.invoiceNo}</span>
                      </td>
                      
                      <td className="py-3.5 px-4 font-semibold text-slate-700 max-w-xs truncate">{inv.clientName}</td>
                      
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-3xs ${getTypeBadgeStyles(inv.type)}`}>
                          {inv.type}
                        </span>
                      </td>
                      
                      <td className="py-3.5 px-4 font-medium text-slate-600">{displayPax}</td>
                      
                      <td className="py-3.5 px-4 font-semibold text-slate-500 font-mono tracking-tight">{displayRoute}</td>
                      
                      <td className="py-3.5 px-4 text-right font-bold text-slate-800">৳{revenue.toLocaleString()}</td>
                      
                      <td className="py-3.5 px-4 text-right text-emerald-600 font-bold">৳{profitVal.toLocaleString()}</td>
                      
                      <td className="py-3.5 px-4 text-center relative">
                        <select
                          value={inv.status}
                          // onChange={(e) => onUpdateStatus(inv.id, e.target.value as any)}
                          className={`text-3xs font-bold py-1 px-2.5 rounded-full outline-none cursor-pointer transition-colors ${getStatusBadgeStyles(inv.status)}`}
                        >
                          <option value="Paid">Paid</option>
                          <option value="Partial">Partial</option>
                          <option value="Unpaid">Unpaid</option>
                        </select>
                      </td>
                      
                      <td className="py-3.5 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete invoice ${inv.invoiceNo}? This is non-reversible and will adjust the reports.`)) {
                                // onDeleteInvoice(inv.id);
                              }
                            }}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Voucher"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-slate-50/60">
                        <td colSpan={9} className="p-6 border-t border-b border-slate-200/50">
                          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-inner grid grid-cols-1 md:grid-cols-2 gap-6 text-xs animate-fade-in">
                            
                            <div className="space-y-4">
                              <h4 className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                                <User className="h-4 w-4 text-emerald-500" />
                                Primary Customer & Passport File
                              </h4>
                              
                              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <div><span className="text-slate-400 block font-medium">Full Passenger Name:</span> <span className="font-bold text-slate-800">{inv.passportInfo?.paxName || displayPax}</span></div>
                                <div><span className="text-slate-400 block font-medium">Passport Number:</span> <span className="font-semibold text-slate-800 font-mono uppercase">{inv.passportInfo?.passportNo || 'N/A'}</span></div>
                                <div><span className="text-slate-400 block font-medium">National Identity (NID):</span> <span className="text-slate-700">{inv.passportInfo?.nationalId || 'N/A'}</span></div>
                                <div><span className="text-slate-400 block font-medium">Date of Birth:</span> <span className="text-slate-700">{inv.passportInfo?.dob || 'N/A'}</span></div>
                                <div><span className="text-slate-400 block font-medium">Contact Phone No:</span> <span className="text-slate-700">{inv.passportInfo?.contactNo || 'N/A'}</span></div>
                                <div><span className="text-slate-400 block font-medium">Email Address:</span> <span className="text-slate-700">{inv.passportInfo?.email || 'N/A'}</span></div>
                              </div>

                              {inv.ticketInfo && inv.ticketInfo.ticketNo && (
                                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                                  <h4 className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 pb-1">
                                    <Plane className="h-4 w-4 text-emerald-500" />
                                    IATA Air Ticket segment
                                  </h4>
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                    <div><span className="text-slate-400 block font-medium">Airline / GDS:</span> <span className="text-slate-800 font-semibold">{inv.ticketInfo.airline}</span></div>
                                    <div><span className="text-slate-400 block font-medium">Flight PNR Code:</span> <span className="text-slate-800 font-mono font-bold uppercase">{inv.ticketInfo.pnr}</span></div>
                                    <div><span className="text-slate-400 block font-medium">Ticket E-No:</span> <span className="text-slate-800 font-mono font-medium">{inv.ticketInfo.ticketNo}</span></div>
                                    <div><span className="text-slate-400 block font-medium">Sectors:</span> <span className="text-slate-800 font-bold font-mono text-xs">{inv.ticketInfo.route}</span></div>
                                    <div><span className="text-slate-400 block font-medium">Journey Date:</span> <span className="text-slate-700">{inv.ticketInfo.journeyDate}</span></div>
                                    <div><span className="text-slate-400 block font-medium">Return Date:</span> <span className="text-slate-700">{inv.ticketInfo.returnDate || 'N/A'}</span></div>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="space-y-4">
                              {inv.medicalInfo && inv.medicalInfo.hospitalName ? (
                                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/60 space-y-2">
                                  <h4 className="font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-emerald-100">
                                    <HeartPulse className="h-4 w-4 text-emerald-600 animate-pulse" />
                                    Medical Coordination Detail
                                  </h4>
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-2xs">
                                    <div className="col-span-2">
                                      <span className="text-slate-500 block font-bold">Partner Hospital:</span> 
                                      <span className="font-extrabold text-slate-800 text-xs">{inv.medicalInfo.hospitalName}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-500 block font-bold">Consulting Doctor:</span> 
                                      <span className="font-bold text-slate-800">{inv.medicalInfo.doctorName || 'Assigned Specialist'}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-500 block font-bold">Treatment Dept:</span> 
                                      <span className="font-bold text-slate-800">{inv.medicalInfo.treatmentCategory || 'General Diagnostics'}</span>
                                    </div>
                                    <div className="col-span-2">
                                      <span className="text-slate-500 block font-bold">Appointment Scheduled:</span> 
                                      <span className="font-semibold text-emerald-700 font-mono">
                                        {inv.medicalInfo.appointmentDate ? new Date(inv.medicalInfo.appointmentDate).toLocaleString(undefined, {month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'}) : 'TBD'}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-500 block font-bold">Accompanied Attendant:</span> 
                                      <span className="font-medium text-slate-800">{inv.medicalInfo.companionName || 'None'}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-500 block font-bold">Ambulance Care:</span> 
                                      <span className={`font-bold px-1.5 py-0.5 rounded text-3xs inline-block ${inv.medicalInfo.ambulanceRequired ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                                        {inv.medicalInfo.ambulanceRequired ? 'Ambulance / Wheelchair Requested' : 'Not Required'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-3xs text-slate-500">
                                  <p className="font-semibold text-slate-600">Standard Travel Voucher</p>
                                  <p>This transaction is a standard flights or visa voucher and has no associated hospital companion files or doctor appointment coordination data.</p>
                                </div>
                              )}

                              {inv.accommodation && inv.accommodation.hotelName && (
                                <div className="space-y-2">
                                  <h4 className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100">
                                    <Hotel className="h-4 w-4 text-emerald-500" />
                                    Accommodation Stay
                                  </h4>
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                    <div><span className="text-slate-400 block font-medium">Hotel Staying:</span> <span className="font-bold text-slate-800">{inv.accommodation.hotelName}</span></div>
                                    <div><span className="text-slate-400 block font-medium">Location:</span> <span className="text-slate-800">{inv.accommodation.hotelLocation}</span></div>
                                    <div><span className="text-slate-400 block font-medium">Room Category:</span> <span className="text-slate-800">{inv.accommodation.roomType}</span></div>
                                    <div><span className="text-slate-400 block font-medium">Nights:</span> <span className="text-slate-800 font-bold">{inv.accommodation.nights} Nights</span></div>
                                  </div>
                                </div>
                              )}

                              {inv.visaInfo && inv.visaInfo.visaNo && (
                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                  <h4 className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 pb-1">
                                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                    Visa Coordination Status
                                  </h4>
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                    <div><span className="text-slate-400 block font-medium">Country Applied:</span> <span className="text-slate-800 font-bold">{inv.visaInfo.country}</span></div>
                                    <div><span className="text-slate-400 block font-medium">Visa Reference:</span> <span className="text-slate-800 font-mono font-semibold">{inv.visaInfo.visaNo}</span></div>
                                  </div>
                                </div>
                              )}

                              {inv.billing && (
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                                  <p className="font-bold text-slate-700 uppercase tracking-widest text-4xs">Financial Ledger Summary</p>
                                  <div className="flex justify-between"><span>Flights & Hotel Base:</span> <span className="font-mono">৳{(inv.billing.subTotal || 0).toLocaleString()}</span></div>
                                  <div className="flex justify-between"><span>Voucher Fees:</span> <span className="font-mono">+৳{(inv.billing.extraFee || 0).toLocaleString()}</span></div>
                                  <div className="flex justify-between text-rose-500"><span>Special Discounts:</span> <span className="font-mono">-৳{(inv.billing.discount || 0).toLocaleString()}</span></div>
                                  <div className="flex justify-between border-t border-dashed border-slate-200 pt-1 font-bold"><span>Total Paid Amount:</span> <span className="text-slate-800 font-mono">৳{(inv.billing.netTotal || 0).toLocaleString()}</span></div>
                                </div>
                              )}
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })} */}

              {/* {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 font-medium">
                    {isLoading ? 'Fetching database logs...' : 'No invoices matched current query filter parameters.'}
                  </td>
                </tr>
              )} */}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

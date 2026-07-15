import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  ArrowUpRight, 
  Clock, 
  UserCheck, 
  Activity,
  Award,
  HeartPulse
} from 'lucide-react';
import { Invoice, ReportStats } from '../types';
import ReportCard from '@/components/dashboard/ReportCard';
import TourismOverviewCard from '@/components/dashboard/TourismOverviewCard';
import BillingSummeryCard from '@/components/dashboard/BillingSummeryCard';


export default function DashboardOverview() {
  // Compute dynamic medical tourism metrics
  // const medicalHighlights = useMemo(() => {
  //   let count = 0;
  //   let sales = 0;
  //   let profit = 0;
  //   const appointments: Array<{ patient: string; hospital: string; doctor: string; treatment: string; date: string }> = [];

  //   invoices.forEach((inv) => {
  //     if (inv.medicalInfo && inv.medicalInfo.hospitalName) {
  //       count++;
  //       sales += inv.medicalInfo.salePrice || 0;
  //       profit += inv.medicalInfo.profit || 0;
  //       appointments.push({
  //         patient: inv.paxName || 'Haji Mohammad Selim',
  //         hospital: inv.medicalInfo.hospitalName,
  //         doctor: inv.medicalInfo.doctorName || 'Assigned Consultant',
  //         treatment: inv.medicalInfo.treatmentCategory || 'General Checkup',
  //         date: inv.medicalInfo.appointmentDate || '2026-08-03'
  //       });
  //     } else if (inv.clientName && inv.clientName.toLowerCase().includes('medical')) {
  //       count++;
  //       sales += inv.clientPrice || 0;
  //       profit += inv.profit || 0;
  //       appointments.push({
  //         patient: inv.paxName || 'Welcare Medical Patient',
  //         hospital: 'Mount Elizabeth Hospital (Singapore)',
  //         doctor: 'Cardiology Consultant',
  //         treatment: 'Cardiac Checkup & Treatment',
  //         date: '2026-07-20'
  //       });
  //     }
  //   });

  //   return {
  //     count,
  //     sales,
  //     profit,
  //     appointments
  //   };
  // }, [invoices]);

  // Compute dynamic client-wise sales summary based on existing invoices
  // const clientWiseSummary = useMemo(() => {
  //   const clients: Record<string, { purchase: number; sales: number; profit: number }> = {};
    
  //   invoices.forEach((inv) => {
  //     const clientName = inv.clientName || 'Walk-In Customer';
  //     const clientPrice = inv.clientPrice || (inv.billing?.netTotal) || 0;
  //     const costPrice = inv.purchasePrice || (inv.billing?.totalCost) || 0;
  //     const profit = inv.profit || (inv.billing?.totalProfit) || 0;

  //     if (!clients[clientName]) {
  //       clients[clientName] = { purchase: 0, sales: 0, profit: 0 };
  //     }
  //     clients[clientName].purchase += costPrice;
  //     clients[clientName].sales += clientPrice;
  //     clients[clientName].profit += profit;
  //   });

  //   return Object.entries(clients).map(([name, data]) => ({
  //     name,
  //     ...data
  //   }));
  // }, [invoices]);

  // Compute stats if not ready from backend
  // const displayStats = useMemo(() => {
  //   if (stats) return stats;

  //   // Fallback/Default values if API hasn't resolved
  //   return {
  //     daily: { sales: 20500, collections: 12000, discount: 200, purchased: 15800, serviceCharge: 100, payment: 12000, profit: 4700 },
  //     monthly: { sales: 36500, collections: 30500, discount: 400, purchased: 30800, serviceCharge: 100, payment: 30500, profit: 7000 },
  //     yearly: { sales: 36500, collections: 30500, discount: 400, purchased: 30800, serviceCharge: 100, payment: 30500, profit: 7000 }
  //   };
  // }, [stats]);

  // // BSP upcoming calculations based on unpaid/partial invoices
  // const bspBilling = useMemo(() => {
  //   let totalIssues = 0;
  //   let totalReissues = 0;
  //   let totalPayable = 0;

  //   // invoices.forEach((inv) => {
  //   //   const isUnpaid = inv.status !== 'Paid';
  //   //   if (isUnpaid) {
  //   //     const clientPrice = inv.clientPrice || (inv.billing?.netTotal) || 0;
  //   //     if (inv.type === 'Reissue') {
  //   //       totalReissues += clientPrice;
  //   //     } else {
  //   //       totalIssues += clientPrice;
  //   //     }
  //   //     totalPayable += clientPrice;
  //   //   }
  //   // });

  //   return {
  //     issues: totalIssues,
  //     reissues: totalReissues,
  //     payable: totalPayable
  //   };
  // }, [invoices]);

  const remittancePercentage = 42; // Dynamic representation based on current usage / RHC Limit

  return (
    <div id="dashboard-overview-container" className="flex-1 p-8 overflow-y-auto space-y-8 bg-slate-50">
      
      <div id="report-grids-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ReportCard icon={<Clock className="h-5 w-5 text-blue-500" />} title="DAILY REPORT" date="Today (Jul 7)" />
        <ReportCard icon={<TrendingUp className="h-5 w-5 text-amber-500" />} title="MONTHLY REPORT" date="July 2026" />
        <ReportCard icon={<Award className="h-5 w-5 text-emerald-500" />} title="YEARLY REPORT" date="2026 Overview" />
      </div>

      {/* Remittance Holding Capacity & Vendor wise remittance */}
      <div id="remittance-sec-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Remittance Holding Capacity SVG Gauge Card */}
        <div id="rhc-card" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-800 text-xs tracking-wider uppercase flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                REMITTANCE CAPACITY
              </h3>
              <span className="text-4xs font-bold text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-100 uppercase tracking-widest">IATA BSP</span>
            </div>
            
            <div id="rhc-gauge-wrapper" className="flex flex-col items-center justify-center pt-2">
              {/* SVG Arc Gauge (Upward Rainbow Dome Sweep with Sleek Meter Pointer) */}
              <div className="relative w-48 h-26 flex items-center justify-center overflow-hidden mb-2">
                <svg className="absolute top-0 left-0 w-full h-full filter drop-shadow-sm" viewBox="0 0 100 50">
                  {/* Outer subtle glow or background track container */}
                  <path 
                    d="M 10 46 A 40 40 0 0 1 90 46" 
                    fill="none" 
                    stroke="#F1F5F9" 
                    strokeWidth="12" 
                    strokeLinecap="round"
                  />
                  {/* Color/Usage arc progress indicator with a rich 6-stop rainbow gradient */}
                  <path 
                    d="M 10 46 A 40 40 0 0 1 90 46" 
                    fill="none" 
                    stroke="url(#rainbowGradient)" 
                    strokeWidth="10" 
                    strokeDasharray="125.6" 
                    strokeDashoffset={125.6 - (125.6 * remittancePercentage) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  
                  {/* Inner Sleek Dial Guideline */}
                  <path 
                    d="M 16 46 A 34 34 0 0 1 84 46" 
                    fill="none" 
                    stroke="#E2E8F0" 
                    strokeWidth="1" 
                    strokeDasharray="2 2"
                  />
                  
                  {/* Precision Tick Marks along the arc */}
                  {/* 0% Tick */}
                  <line x1="10" y1="46" x2="14" y2="46" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                  {/* 25% Tick */}
                  <line x1="22" y1="22" x2="25" y2="25" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                  {/* 50% Tick */}
                  <line x1="50" y1="6" x2="50" y2="11" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                  {/* 75% Tick */}
                  <line x1="78" y1="22" x2="75" y2="25" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                  {/* 100% Tick */}
                  <line x1="90" y1="46" x2="86" y2="46" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                  
                  {/* Styled Pointer Needle */}
                  <g transform={`rotate(${(remittancePercentage / 100) * 180}, 50, 46)`} className="transition-transform duration-1000 ease-out">
                    {/* Shadow for needle */}
                    <line x1="50" y1="46" x2="16" y2="46" stroke="rgba(15, 23, 42, 0.15)" strokeWidth="4" strokeLinecap="round" transform="translate(0, 1.5)" />
                    {/* Sleek needle body */}
                    <line x1="50" y1="46" x2="16" y2="46" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Glowing Indicator tip on needle */}
                    <circle cx="16" cy="46" r="3" fill="#EF4444" stroke="#FFFFFF" strokeWidth="0.75" />
                  </g>

                  {/* Needle cap hub center */}
                  <circle cx="50" cy="46" r="6" fill="#0F172A" stroke="#E2E8F0" strokeWidth="1.5" />
                  <circle cx="50" cy="46" r="2.5" fill="#38BDF8" />

                  {/* Gradient Definitions */}
                  <defs>
                    <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />    {/* Blue */}
                      <stop offset="20%" stopColor="#06B6D4" />   {/* Cyan */}
                      <stop offset="40%" stopColor="#10B981" />   {/* Green */}
                      <stop offset="60%" stopColor="#F59E0B" />   {/* Yellow */}
                      <stop offset="80%" stopColor="#F97316" />   {/* Orange/Caution */}
                      <stop offset="100%" stopColor="#EF4444" />  {/* Red/Critical */}
                    </linearGradient>
                  </defs>
                </svg>
                {/* Central Text percentage indicator nested under the dome */}
                <div className="absolute bottom-1 text-center flex flex-col items-center justify-end select-none">
                  <span className="text-3xl font-black text-slate-800 leading-none">{remittancePercentage}%</span>
                  <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest mt-1.5">Capacity Used</p>
                </div>
              </div>

              {/* Min/Max indicators */}
              <div className="w-full flex justify-between px-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span>0% Safe</span>
                <span className="text-amber-500">Caution (70%)</span>
                <span>100% Limit</span>
              </div>
              
              <p className="text-2xs font-semibold text-slate-600 text-center mt-3">
                Percentage usage: <span className="text-emerald-600 font-bold">{remittancePercentage}%</span>
              </p>
              <p className="text-4xs text-slate-400 mt-0.5 mb-5 text-center font-semibold">Last Updated: July 10, 2026</p>
  
              {/* Capacity stats list */}
              <div className="w-full space-y-2.5 border-t border-slate-100 pt-4 text-2xs text-slate-600">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-slate-500 font-medium"><ShieldCheck className="h-3.5 w-3.5 text-slate-400" /> RHC Limit Amount</span>
                  <span className="font-bold text-slate-800 font-mono text-xs">৳5,000,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Current Usage</span>
                  <span className="font-extrabold text-amber-600 font-mono text-xs">৳{(5000000 * remittancePercentage / 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Current Financial Security</span>
                  <span className="font-bold text-emerald-600 font-mono text-xs">৳1,500,000 (IATA Bonded)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Remittance Frequency</span>
                  <span className="font-bold text-slate-700">Fortnightly</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            id="iata-estatement-btn"
            onClick={() => alert('Launching secured connection to IATA E-Statement portal...')} 
            className="mt-6 w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-800 border border-slate-200/80 rounded-xl text-3xs font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-sm hover:shadow"
          >
            <Activity className="h-3.5 w-3.5 text-slate-500 animate-pulse" />
            Access IATA E-Statement
          </button>
        </div>

        {/* Vendors Wise Remittance Card */}
        <div id="vendors-remittance-card" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight uppercase">Vendors Wise Remittance</h3>
              <span className="text-3xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-md uppercase">Live</span>
            </div>
            
            <div id="vendors-table-container" className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-3xs font-semibold uppercase tracking-wider">
                    <th className="py-2">Vendor Name</th>
                    <th className="py-2 text-right">IATA Code</th>
                    <th className="py-2 text-right">Net Outstanding</th>
                    <th className="py-2 text-right">Credit Term</th>
                    <th className="py-2 text-right">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-2xs text-slate-700">
                  <tr>
                    <td className="py-3 font-medium text-slate-800 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      Emirates (IATA Pay)
                    </td>
                    <td className="py-3 text-right">EK-176</td>
                    <td className="py-3 text-right font-semibold">৳804,000</td>
                    <td className="py-3 text-right">15 Days</td>
                    <td className="py-3 text-right text-emerald-600">July 20, 2026</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-slate-800 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                      Qatar Airways
                    </td>
                    <td className="py-3 text-right">QR-157</td>
                    <td className="py-3 text-right font-semibold">৳1,200,000</td>
                    <td className="py-3 text-right">15 Days</td>
                    <td className="py-3 text-right text-emerald-600">July 15, 2026</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-slate-800 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                      Singapore Airlines
                    </td>
                    <td className="py-3 text-right">SQ-618</td>
                    <td className="py-3 text-right font-semibold">৳380,000</td>
                    <td className="py-3 text-right">30 Days</td>
                    <td className="py-3 text-right text-amber-600">July 25, 2026</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-slate-800 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                      Turkish Airlines
                    </td>
                    <td className="py-3 text-right">TK-235</td>
                    <td className="py-3 text-right font-semibold">৳500,000</td>
                    <td className="py-3 text-right">7 Days</td>
                    <td className="py-3 text-right text-rose-500">July 13, 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 mt-4 text-3xs text-slate-500 font-medium">
            <span>Aggregated Outstanding Vendor Claims:</span>
            <span className="font-bold text-slate-800 text-xs">৳2,884,000 BDT</span>
          </div>
        </div>

      </div>

      {/* Medical Tourism Partner Hospital coordination - Welcare Trip Exclusive */}
      <div id="medical-tourism-summary-board" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm tracking-tight uppercase flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-emerald-500 animate-pulse" />
              PARTNER HOSPITAL & MEDICAL TOURISM OVERVIEW
            </h3>
            <p className="text-3xs text-slate-400 font-medium mt-0.5">Real-time status of patients, medical visas, and treatments</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-4xs font-bold text-slate-500">ACTIVE CASES: <strong className="text-slate-800 text-2xs">{Math.max(1, 2)}</strong></span>
            <span className="h-2.5 w-px bg-slate-200"></span>
            <span className="text-4xs font-bold text-slate-500">MEDICAL SALES: <strong className="text-emerald-600 text-2xs">৳{Math.max(145000, 2 * 10).toLocaleString()}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         

          <TourismOverviewCard title={"Hospital Booking Value"} ammount={145000} description="Direct corporate and personal healthcare treatment invoices" />
          <TourismOverviewCard title={"Medical Agency Margin"} ammount={20000} description="Welcare Trip premium commission & consultation margin" />
          <TourismOverviewCard title={"Treatment Destinations"} list={[{ label: "Singapore", value: 1 }, { label: "Thailand", value: 2 }, { label: "India", value: 3 }]} description="Patients currently under treatment or consultation" />
          
        </div>

        {/* Live appointments list */}
        <div className="space-y-3">
          <h4 className="text-3xs uppercase tracking-widest font-extrabold text-slate-400">Live Coordinating Cases</h4>
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left border-collapse bg-slate-50/40">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-100/50 text-slate-400 text-4xs font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-4">Patient Name</th>
                  <th className="py-2.5 px-4">Hospital Partner</th>
                  <th className="py-2.5 px-4">Consultant Doctor</th>
                  <th className="py-2.5 px-4 text-center">Treatment Dept</th>
                  <th className="py-2.5 px-4 text-right">Appt Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-2xs text-slate-700">
                {/* {medicalHighlights.appointments.map((appt, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-slate-800">{appt.patient}</td>
                    <td className="py-2.5 px-4 font-medium text-slate-600">{appt.hospital}</td>
                    <td className="py-2.5 px-4 text-slate-500">{appt.doctor}</td>
                    <td className="py-2.5 px-4 text-center"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold rounded-full text-3xs">{appt.treatment}</span></td>
                    <td className="py-2.5 px-4 text-right text-slate-500 font-mono text-3xs">
                      {appt.date.includes('T') ? new Date(appt.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'}) : appt.date}
                    </td>
                  </tr>
                ))} */}
                {/* {medicalHighlights.appointments.length === 0 && (
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-800">Haji Mohammad Selim</td>
                    <td className="py-2.5 px-4 font-medium text-slate-600">Mount Elizabeth Hospital (Singapore)</td>
                    <td className="py-2.5 px-4 text-slate-500">Dr. Tan Seng Kiat (Cardiology)</td>
                    <td className="py-2.5 px-4 text-center"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold rounded-full text-3xs">Cardiology</span></td>
                    <td className="py-2.5 px-4 text-right text-slate-500 font-mono text-3xs">Jul 20, 2026</td>
                  </tr>
                )} */}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* BSP Upcoming Billing Area */}
      <div id="bsp-billing-container" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm tracking-tight uppercase flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
              BSP UPCOMING BILLING SUMMARY
            </h3>
            <p className="text-3xs text-slate-400 font-medium mt-0.5">IATA BSP Clearing Bank matching</p>
          </div>
          <div className="flex items-center gap-3 text-3xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
            <span>Sales Period: <strong className="text-slate-800">01-JUL-2026 to 15-JUL-2026</strong></span>
            <span className="text-slate-300">|</span>
            <span>Billing Period: <strong className="text-slate-800">16-JUL-2026 to 31-JUL-2026</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <BillingSummeryCard title="Unpaid Issues" amount={0} />
          <BillingSummeryCard title="Unpaid Reissues" amount={0}  />
          <BillingSummeryCard title="Est. Net Commission" amount={22}  />
          <BillingSummeryCard title="Total BSP Payable" amount={333}  />
        </div>
      </div>

      <div id="client-sales-container" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800 text-sm tracking-tight uppercase flex items-center gap-1.5">
            <UserCheck className="h-4 w-4 text-blue-500" />
            CLIENT WISE ACCOUNT STATUS & SALES
          </h3>
          <button 
            id="view-all-invoices-dashboard"
            // onClick={() => onNavigateToTab('ledger')}
            className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-0.5 cursor-pointer"
          >
            Go to Ledger
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div id="clients-table-container" className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-3xs font-semibold uppercase tracking-wider">
                <th className="py-3">Client Name</th>
                <th className="py-3 text-right">Total Purchase Cost</th>
                <th className="py-3 text-right">Total Sales Revenue</th>
                <th className="py-3 text-right">Total Realized Profit</th>
                <th className="py-3 text-right">Avg. Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-2xs text-slate-700">
              {/* {clientWiseSummary.map((client, index) => {
                const margin = client.sales > 0 ? (client.profit / client.sales) * 100 : 0;
                return (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 font-bold text-slate-800">{client.name}</td>
                    <td className="py-3.5 text-right text-slate-500">৳{client.purchase.toLocaleString()}</td>
                    <td className="py-3.5 text-right font-semibold text-slate-800">৳{client.sales.toLocaleString()}</td>
                    <td className="py-3.5 text-right text-emerald-600 font-bold">৳{client.profit.toLocaleString()}</td>
                    <td className="py-3.5 text-right">
                      <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                        {margin.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })} */}
              {/* {clientWiseSummary.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">No client transactions logged yet. Add a booking to generate ledger accounts.</td>
                </tr>
              )} */}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

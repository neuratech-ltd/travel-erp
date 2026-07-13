import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Plane, 
  Coins, 
  RefreshCw, 
  Briefcase, 
  Hotel, 
  FileText, 
  FileSpreadsheet,
  Sparkles, 
  User, 
  Map,
  DollarSign,
  HeartPulse
} from 'lucide-react';
import { paths } from '../routes/paths';

export default function Sidebar() {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Core', path: paths.dashboard },
    { id: 'employees', label: 'Employees', icon: User, section: 'Core', path: paths.employees },
    { id: 'air-ticket', label: 'New Air Ticket', icon: Plane, section: 'Invoicing', path: paths.airTicketInvoice },
    { id: 'non-commission', label: 'Non Commission', icon: Coins, section: 'Invoicing', path: paths.nonCommissionInvoice },
    { id: 'reissue', label: 'Reissue Invoice', icon: RefreshCw, section: 'Invoicing', path: paths.reissueInvoice },
    { id: 'tour-package', label: 'Holiday & Medical', icon: Briefcase, section: 'Packages', path: paths.tourPackageInvoice },
    { id: 'hotel-visa', label: 'Hotel & Visa', icon: Hotel, section: 'Packages', path: paths.hotelVisaInvoice },
    { id: 'ledger', label: 'Invoice Ledger', icon: FileText, section: 'Financials', path: paths.invoiceLedger },
    { id: 'sales-report', label: 'Sales Spreadsheet', icon: FileSpreadsheet, section: 'Financials', path: paths.salesReport },
    { id: 'ai-consultant', label: 'AI Consultant', icon: Sparkles, section: 'Intelligence', path: paths.aiConsultant },
  ];

  // Group items by section
  const sections = ['Core', 'Invoicing', 'Packages', 'Financials', 'Intelligence'];

  return (
    <aside id="sidebar-container" className="w-64 bg-[#0A1D1C] text-slate-300 flex flex-col border-r border-[#153432] h-screen shrink-0 overflow-y-auto">
      {/* Brand Header */}
      <div id="sidebar-brand" className="px-6 py-5 border-b border-[#153432] flex items-center gap-3">
        <div id="brand-logo-container" className="p-2 bg-emerald-600 rounded-lg text-white">
          <HeartPulse className="h-6 w-6" id="brand-icon" />
        </div>
        <div>
          <h1 id="brand-title" className="font-bold text-white text-base tracking-wide leading-tight">Welcare Trip</h1>
          <span id="brand-subtitle" className="text-3xs text-emerald-400 font-bold uppercase tracking-wider">Travel & Medical ERP</span>
        </div>
      </div>

      {/* User Info Quick Card */}
      <div id="sidebar-user-card" className="p-4 mx-4 my-3 bg-[#153432]/40 rounded-xl border border-[#153432]/60 flex items-center gap-3">
        <div id="user-avatar" className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
          WA
        </div>
        <div id="user-details" className="overflow-hidden">
          <p id="user-name" className="text-sm font-semibold text-white truncate">Welcare Advisor</p>
          <p id="user-role" className="text-xs text-slate-400 truncate">Senior Travel Advisor</p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav id="sidebar-nav" className="flex-1 px-4 py-3 space-y-6">
        {sections.map((section) => {
          const sectionItems = menuItems.filter(item => item.section === section);
          return (
            <div key={section} id={`section-group-${section.toLowerCase()}`} className="space-y-1">
              <h2 id={`section-header-${section.toLowerCase()}`} className="px-3 text-2xs uppercase tracking-widest font-bold text-emerald-500/50 mb-2">
                {section}
              </h2>
              {sectionItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.id}
                    id={`sidebar-btn-${item.id}`}
                    to={item.path}
                    end
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                        isActive 
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40' 
                          : 'text-slate-400 hover:bg-[#153432]/50 hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                        {item.id === 'tour-package' && (
                          <span className="ml-auto text-4xs font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            MED
                          </span>
                        )}
                        {item.id === 'ai-consultant' && (
                          <span className="ml-auto text-4xs font-bold bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 px-1.5 py-0.5 rounded-full animate-pulse">
                            GENAI
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer Branding Info */}
      <div id="sidebar-footer" className="p-4 border-t border-[#153432] text-center text-3xs text-slate-500">
        <p>© 2026 Welcare Trip ERP</p>
        <p className="mt-1">Active UTC: 2026-07-10</p>
      </div>
    </aside>
  );
}
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, matchPath } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { paths } from './routes/paths';
import { Invoice, ReportStats } from './types';

// Shared data + handlers passed down to every routed page via useOutletContext()
export interface WorkspaceContext {
  invoices: Invoice[];
  stats: ReportStats | null;
  isLoading: boolean;
  globalSearch: string;
  onAddInvoice: (newInvoiceData: Partial<Invoice>) => Promise<boolean>;
  onUpdateStatus: (id: string, status: 'Paid' | 'Unpaid' | 'Partial') => Promise<void>;
  onDeleteInvoice: (id: string) => Promise<void>;
}

// Maps a route path to the readable header title for that page
const TAB_TITLES: { path: string; title: string }[] = [
  { path: paths.dashboard, title: 'Welcare Trip Executive Analytics' },
  { path: paths.airTicketInvoice, title: 'Air Ticket Booking Billing' },
  { path: paths.nonCommissionInvoice, title: 'Net-Rate Non-Commission Invoice' },
  { path: paths.reissueInvoice, title: 'Airline Booking Reissue Adjuster' },
  { path: paths.tourPackageInvoice, title: 'Holiday & Medical Package Builder' },
  { path: paths.hotelVisaInvoice, title: 'Hotel Bookings & Visa Desk' },
  { path: paths.invoiceLedger, title: 'Financial Ledger Accounts & Receipts' },
  { path: paths.salesReport, title: 'Welcare Trip Monthly Sales Worksheet' },
  { path: paths.employees, title: 'Employee Directory & ERP Access Roles' },
  { path: paths.aiConsultant, title: 'AI Travel & Medical Intelligence Consultant' },
];

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Fetch invoices and stats from the backend server
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

  useEffect(() => {
    fetchErpData();
  }, []);

  // Handler to add a new invoice (triggers POST request)
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

  // Handler to update invoice payment status (triggers PATCH request)
  const handleUpdateStatus = async (id: string, status: 'Paid' | 'Unpaid' | 'Partial') => {
    try {
      const response = await fetch(`/api/invoices/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const resData = await response.json();
      if (resData.success) {
        await fetchErpData();
      }
    } catch (error) {
      console.error('Failed to update payment status:', error);
    }
  };

  // Handler to delete an invoice (triggers DELETE request)
  const handleDeleteInvoice = async (id: string) => {
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: 'DELETE',
      });

      const resData = await response.json();
      if (resData.success) {
        await fetchErpData();
      }
    } catch (error) {
      console.error('Failed to delete invoice:', error);
    }
  };

  const handleGlobalSearch = (query: string) => {
    setGlobalSearch(query);
    // If the search query has content, automatically navigate to ledger for instant filtration!
    const onLedger = !!matchPath(paths.invoiceLedger, location.pathname);
    const onAiConsultant = !!matchPath(paths.aiConsultant, location.pathname);
    if (query.trim() !== '' && !onLedger && !onAiConsultant) {
      navigate(paths.invoiceLedger);
    }
  };

  // Maps the current route to its readable title
  const getHeaderTitle = () => {
    const match = TAB_TITLES.find((tab) => matchPath({ path: tab.path, end: true }, location.pathname));
    return match ? match.title : 'Welcare Trip ERP Workspace';
  };

  const outletContext: WorkspaceContext = {
    invoices,
    stats,
    isLoading,
    globalSearch,
    onAddInvoice: handleAddInvoice,
    onUpdateStatus: handleUpdateStatus,
    onDeleteInvoice: handleDeleteInvoice,
  };

  return (
    <div id="app-root-layout" className="flex h-screen w-screen overflow-hidden font-sans antialiased text-slate-800 bg-slate-100">
      <Sidebar />

      <div id="main-workspace-frame" className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title={getHeaderTitle()}
          onSearch={handleGlobalSearch}
          onRefresh={fetchErpData}
          isLoading={isLoading}
        />
        <main id="active-viewport" className="flex-1 overflow-hidden flex flex-col">
          <Outlet context={outletContext} />
        </main>
      </div>
    </div>
  );
}
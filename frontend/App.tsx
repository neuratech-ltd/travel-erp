import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import AirTicketInvoice from './pages/AirTicketInvoice';
import NonCommissionInvoice from './pages/NonCommissionInvoice';
import ReissueInvoice from './pages/ReissueInvoice';
import TourPackageInvoice from './pages/TourPackageInvoice';
import HotelVisaInvoice from './pages/HotelVisaInvoice';
import InvoiceLedger from './pages/InvoiceLedger';
import AiConsultant from './pages/AiConsultant';
import SalesReport from './pages/SalesReport';
import Employees from './pages/Employees';
import { Invoice, ReportStats } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
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
    if (query.trim() !== '' && activeTab !== 'ledger' && activeTab !== 'ai-consultant') {
      setActiveTab('ledger');
    }
  };

  // Maps active tab ID to tab readable title
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Welcare Trip Executive Analytics';
      case 'air-ticket': return 'Air Ticket Booking Billing';
      case 'non-commission': return 'Net-Rate Non-Commission Invoice';
      case 'reissue': return 'Airline Booking Reissue Adjuster';
      case 'tour-package': return 'Holiday & Medical Package Builder';
      case 'hotel-visa': return 'Hotel Bookings & Visa Desk';
      case 'ledger': return 'Financial Ledger Accounts & Receipts';
      case 'sales-report': return 'Welcare Trip Monthly Sales Worksheet';
      case 'employees': return 'Employee Directory & ERP Access Roles';
      case 'ai-consultant': return 'AI Travel & Medical Intelligence Consultant';
      default: return 'Welcare Trip ERP Workspace';
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardOverview 
            stats={stats} 
            invoices={invoices} 
            onNavigateToTab={setActiveTab} 
          />
        );
      case 'air-ticket':
        return (
          <AirTicketInvoice 
            onAddInvoice={handleAddInvoice} 
            onNavigateToTab={setActiveTab} 
          />
        );
      case 'non-commission':
        return (
          <NonCommissionInvoice 
            onAddInvoice={handleAddInvoice} 
            onNavigateToTab={setActiveTab} 
          />
        );
      case 'reissue':
        return (
          <ReissueInvoice 
            onAddInvoice={handleAddInvoice} 
            onNavigateToTab={setActiveTab} 
          />
        );
      case 'tour-package':
        return (
          <TourPackageInvoice 
            onAddInvoice={handleAddInvoice} 
            onNavigateToTab={setActiveTab} 
          />
        );
      case 'hotel-visa':
        return (
          <HotelVisaInvoice 
            onAddInvoice={handleAddInvoice} 
            onNavigateToTab={setActiveTab} 
          />
        );
      case 'ledger':
        return (
          <InvoiceLedger 
            invoices={invoices} 
            onUpdateStatus={handleUpdateStatus} 
            onDeleteInvoice={handleDeleteInvoice} 
            isLoading={isLoading}
          />
        );
      case 'sales-report':
        return <SalesReport />;
      case 'employees':
        return <Employees />;
      case 'ai-consultant':
        return <AiConsultant />;
      default:
        return (
          <div className="flex-1 p-8 flex items-center justify-center text-slate-400 font-medium bg-slate-50">
            Select a valid module in the left sidebar navigation menu to load.
          </div>
        );
    }
  };

  return (
    <div id="app-root-layout" className="flex h-screen w-screen overflow-hidden font-sans antialiased text-slate-800 bg-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace Frame */}
      <div id="main-workspace-frame" className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Bar */}
        <Header 
          title={getHeaderTitle()} 
          onSearch={handleGlobalSearch} 
          onRefresh={fetchErpData} 
          isLoading={isLoading}
        />

        {/* Dynamic Workspace Container */}
        <main id="active-viewport" className="flex-1 overflow-hidden flex flex-col">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}

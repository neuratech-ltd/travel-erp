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
} from 'lucide-react'
import { paths } from '../routes/paths'

export const siteMap = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Core', path: paths.dashboard },
  { id: 'employees', label: 'Employees', icon: User, section: 'Core', path: paths.employees },
  { id: 'clients', label: 'Clients', icon: User, section: 'Core', path: paths.clients },
  { id: 'air-ticket', label: 'New Air Ticket', icon: Plane, section: 'Invoicing', path: paths.airTicketInvoice },
  {
    id: 'non-commission',
    label: 'Non Commission',
    icon: Coins,
    section: 'Invoicing',
    path: paths.nonCommissionInvoice,
  },
  { id: 'reissue', label: 'Reissue Invoice', icon: RefreshCw, section: 'Invoicing', path: paths.reissueInvoice },
  {
    id: 'tour-package',
    label: 'Holiday & Medical',
    icon: Briefcase,
    section: 'Packages',
    path: paths.tourPackageInvoice,
  },
  { id: 'hotel-visa', label: 'Hotel & Visa', icon: Hotel, section: 'Packages', path: paths.hotelVisaInvoice },
  { id: 'ledger', label: 'Invoice Ledger', icon: FileText, section: 'Financials', path: paths.invoiceLedger },
  {
    id: 'sales-report',
    label: 'Sales Spreadsheet',
    icon: FileSpreadsheet,
    section: 'Financials',
    path: paths.salesReport,
  },
  { id: 'ai-consultant', label: 'AI Consultant', icon: Sparkles, section: 'Intelligence', path: paths.aiConsultant },
]

import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { paths } from './paths';
import { Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorBoundaryFallback from '../components/common/errors/ErrorBoundaryFallback';

const App = lazy(() => import('../App'));

const DashboardOverview = lazy(() => import('../components/DashboardOverview'));
const AiConsultant = lazy(() => import('../pages/AiConsultant'));
const AirTicketInvoice = lazy(() => import('../pages/AirTicketInvoice'));
const Employees = lazy(() => import('../pages/Employees'));
const HotelVisaInvoice = lazy(() => import('../pages/HotelVisaInvoice'));
const InvoiceLedger = lazy(() => import('../pages/InvoiceLedger'));
const NonCommissionInvoice = lazy(() => import('../pages/NonCommissionInvoice'));
const ReissueInvoice = lazy(() => import('../pages/ReissueInvoice'));
const SalesReport = lazy(() => import('../pages/SalesReport'));
const TourPackageInvoice = lazy(() => import('../pages/TourPackageInvoice'));

export const routes: RouteObject[] = [
  {
    element: (
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen w-screen">
            Loading...
          </div>
        }
      >
        <ErrorBoundary fallbackRender={ErrorBoundaryFallback}>
          <App />
        </ErrorBoundary>
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <DashboardOverview />,
      },
      {
        path: paths.aiConsultant,
        element: <AiConsultant />,
      },
      {
        path: paths.airTicketInvoice,
        element: <AirTicketInvoice />,
      },
      {
        path: paths.employees,
        element: <Employees />,
      },
      {
        path: paths.hotelVisaInvoice,
        element: <HotelVisaInvoice />,
      },
      {
        path: paths.invoiceLedger,
        element: <InvoiceLedger />,
      },
      {
        path: paths.nonCommissionInvoice,
        element: <NonCommissionInvoice />,
      },
      {
        path: paths.reissueInvoice,
        element: <ReissueInvoice />,
      },
      {
        path: paths.salesReport,
        element: <SalesReport />,
      },
      {
        path: paths.tourPackageInvoice,
        element: <TourPackageInvoice />,
      },
    ],
  },
];

const router = createBrowserRouter(routes, {
  basename: '/',
});

export default router;
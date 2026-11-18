import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Activity, Award, Clock, HeartPulse, TrendingUp, UserCheck } from 'lucide-react'
import { Invoice } from '../types'
import ReportCard from '../components/dashboard/ReportCard'
import RhcMeter from '../components/dashboard/RhcMeter'
import { api } from '../lib/api'

type DashboardRow = {
  id: string
  date: string
  ticketType: string
  totalSales: number
  totalReceived: number
  dueAmount: number
}

type DashboardInvoice = Invoice & {
  vendor?: { name?: string; iataCode?: string }
  client?: { name?: string }
  billing?: { netTotal?: number; totalCost?: number; totalProfit?: number; discount?: number; extraFee?: number }
}

type IurImport = {
  id: string
  extractedData?: {
    invoice?: {
      clientPrice?: number | null
      baseFare?: number | null
    }
    ticket?: {
      baseAmount?: number | null
    }
  } | null
}

type IurImportsResponse = {
  items: IurImport[]
  pagination: {
    total: number
    totalPages: number
  }
}

type IurMeterCache = {
  usage: number
  dataKey: string
  lastUpdated: string
}

type Metrics = {
  sales: number
  collections: number
  discount: number
  purchased: number
  serviceCharge: number
  payment: number
  profit: number
}

const money = (value?: number) => Number((value ?? 0).toFixed(2))
const formatMoney = (value: number) => `৳${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
const invoiceSale = (invoice?: DashboardInvoice) => invoice?.totalClientPrice ?? invoice?.billing?.netTotal ?? 0
const invoiceCost = (invoice?: DashboardInvoice) => invoice?.totalPurchaseCost ?? invoice?.billing?.totalCost ?? 0
const invoiceProfit = (invoice?: DashboardInvoice) =>
  invoice?.totalProfit ?? invoice?.billing?.totalProfit ?? invoiceSale(invoice) - invoiceCost(invoice)
const invoiceDiscount = (invoice?: DashboardInvoice) => invoice?.totalDiscount ?? invoice?.billing?.discount ?? 0
const invoiceServiceCharge = (invoice?: DashboardInvoice) => invoice?.totalExtraFee ?? invoice?.billing?.extraFee ?? 0
const RHC_CAPACITY = 10_000_000
const IUR_METER_CACHE_KEY = 'dashboard-iur-meter'

const emptyMetrics = (): Metrics => ({
  sales: 0,
  collections: 0,
  discount: 0,
  purchased: 0,
  serviceCharge: 0,
  payment: 0,
  profit: 0,
})

function readIurMeterCache(): IurMeterCache | null {
  try {
    const cached = window.localStorage.getItem(IUR_METER_CACHE_KEY)
    if (!cached) return null

    const parsed = JSON.parse(cached) as Partial<IurMeterCache>
    if (
      typeof parsed.usage !== 'number' ||
      typeof parsed.dataKey !== 'string' ||
      typeof parsed.lastUpdated !== 'string'
    ) {
      return null
    }

    return parsed as IurMeterCache
  } catch {
    return null
  }
}

function writeIurMeterCache(cache: IurMeterCache) {
  try {
    window.localStorage.setItem(IUR_METER_CACHE_KEY, JSON.stringify(cache))
  } catch {
    // The meter still works when browser storage is unavailable.
  }
}

export default function DashboardOverview() {
  const [rows, setRows] = useState<DashboardRow[]>([])
  const [invoices, setInvoices] = useState<DashboardInvoice[]>([])
  const [iurMeter, setIurMeter] = useState(() => {
    const cached = readIurMeterCache()
    return {
      usage: cached?.usage ?? 0,
      lastUpdated: cached ? new Date(cached.lastUpdated) : null,
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [dashboardError, setDashboardError] = useState('')

  const loadDashboardData = useCallback(async () => {
    setDashboardError('')
    try {
      const [salesResponse, invoiceResponse, iurResponse] = await Promise.all([
        api.get('/sales-reports'),
        api.get('/invoices'),
        api.get<IurImportsResponse>('/iur/imports?page=1&limit=100'),
      ])
      if (salesResponse.data.success) setRows(salesResponse.data.data)
      const invoiceData = invoiceResponse.data
      setInvoices(invoiceData.success ? invoiceData.data : Array.isArray(invoiceData) ? invoiceData : [])
      const firstIurPage = iurResponse.data
      const remainingPages = await Promise.all(
        Array.from({ length: Math.max(firstIurPage.pagination.totalPages - 1, 0) }, (_, index) =>
          api.get<IurImportsResponse>(`/iur/imports?page=${index + 2}&limit=100`),
        ),
      )
      const iurPages = [firstIurPage, ...remainingPages.map((response) => response.data)]
      const imports = iurPages.flatMap((page) => page.items)
      const latestImport = imports[0]
      const dataKey = `${firstIurPage.pagination.total}:${latestImport?.id ?? 'empty'}`
      const usage = imports.reduce((sum, item) => {
        const invoice = item.extractedData?.invoice
        const ticket = item.extractedData?.ticket
        return sum + (invoice?.clientPrice ?? invoice?.baseFare ?? ticket?.baseAmount ?? 0)
      }, 0)
      const cached = readIurMeterCache()

      if (!cached || cached.dataKey !== dataKey) {
        const updatedAt = new Date()
        setIurMeter({ usage, lastUpdated: updatedAt })
        writeIurMeterCache({ usage, dataKey, lastUpdated: updatedAt.toISOString() })
      }
    } catch (error) {
      console.error('Failed to load dashboard data', error)
      setDashboardError('Could not update dashboard data. Please try again.')
    }
  }, [])

  useEffect(() => {
    loadDashboardData().finally(() => setIsLoading(false))
  }, [loadDashboardData])

  const requestBalanceUpdate = async () => {
    setIsRefreshing(true)
    try {
      await loadDashboardData()
    } finally {
      setIsRefreshing(false)
    }
  }

  const invoiceById = useMemo(() => new Map(invoices.map((invoice) => [invoice.id, invoice])), [invoices])

  const getPeriodMetrics = (period: 'day' | 'month' | 'year') => {
    const now = new Date()
    const metrics = emptyMetrics()

    rows.forEach((row) => {
      const date = new Date(row.date)
      const matches =
        period === 'day'
          ? date.toDateString() === now.toDateString()
          : period === 'month'
            ? date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
            : date.getFullYear() === now.getFullYear()
      if (!matches) return

      const invoice = invoiceById.get(row.id)
      metrics.sales += row.totalSales
      metrics.collections += row.totalReceived
      metrics.payment += row.totalReceived
      metrics.discount += invoiceDiscount(invoice)
      metrics.purchased += invoiceCost(invoice)
      metrics.serviceCharge += invoiceServiceCharge(invoice)
      metrics.profit += invoiceProfit(invoice)
    })

    return Object.fromEntries(Object.entries(metrics).map(([key, value]) => [key, money(value)])) as Metrics
  }

  const dailyMetrics = useMemo(() => getPeriodMetrics('day'), [rows, invoiceById])
  const monthlyMetrics = useMemo(() => getPeriodMetrics('month'), [rows, invoiceById])
  const yearlyMetrics = useMemo(() => getPeriodMetrics('year'), [rows, invoiceById])

  const clientSummary = useMemo(() => {
    const grouped = new Map<string, { sales: number; profit: number }>()
    invoices.forEach((invoice) => {
      const name = invoice.client?.name ?? 'Unknown Client'
      const current = grouped.get(name) ?? { sales: 0, profit: 0 }
      current.sales += invoiceSale(invoice)
      current.profit += invoiceProfit(invoice)
      grouped.set(name, current)
    })
    return Array.from(grouped, ([name, values]) => ({ name, ...values })).sort((a, b) => b.sales - a.sales)
  }, [invoices])

  const vendorSummary = useMemo(() => {
    const grouped = new Map<string, { cost: number; iataCode?: string }>()
    invoices.forEach((invoice) => {
      const name = invoice.vendor?.name ?? invoice.airline ?? 'Unassigned Vendor'
      const current = grouped.get(name) ?? { cost: 0, iataCode: invoice.vendor?.iataCode }
      current.cost += invoiceCost(invoice)
      grouped.set(name, current)
    })
    return Array.from(grouped, ([name, values]) => ({ name, ...values })).sort((a, b) => b.cost - a.cost)
  }, [invoices])

  const medicalSummary = useMemo(() => {
    const medicalInvoices = invoices.filter((invoice) => invoice.type === 'VISA' || invoice.medicalInfo)
    return {
      count: medicalInvoices.length,
      sales: medicalInvoices.reduce((sum, invoice) => sum + invoiceSale(invoice), 0),
      profit: medicalInvoices.reduce((sum, invoice) => sum + invoiceProfit(invoice), 0),
    }
  }, [invoices])

  const unpaidIssues = rows
    .filter((row) => row.dueAmount > 0 && row.ticketType !== 'Reissue')
    .reduce((sum, row) => sum + row.dueAmount, 0)
  const unpaidReissues = rows
    .filter((row) => row.dueAmount > 0 && row.ticketType === 'Reissue')
    .reduce((sum, row) => sum + row.dueAmount, 0)

  return (
    <div id="dashboard-overview-container" className="flex-1 p-8 overflow-y-auto space-y-6 bg-slate-50">
      {isLoading && <p className="text-sm text-slate-500">Loading dashboard...</p>}
      {dashboardError && <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{dashboardError}</p>}

      <RhcMeter
        capacity={RHC_CAPACITY}
        usage={iurMeter.usage}
        lastUpdated={iurMeter.lastUpdated}
        isRefreshing={isRefreshing}
        onRequestUpdate={requestBalanceUpdate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ReportCard
          icon={<Clock className="h-5 w-5 text-blue-500" />}
          title="DAILY REPORT"
          date="Today"
          metrics={dailyMetrics}
        />
        <ReportCard
          icon={<TrendingUp className="h-5 w-5 text-amber-500" />}
          title="MONTHLY REPORT"
          date={new Date().toLocaleString('en', { month: 'long', year: 'numeric' })}
          metrics={monthlyMetrics}
        />
        <ReportCard
          icon={<Award className="h-5 w-5 text-emerald-500" />}
          title="YEARLY REPORT"
          date={`${new Date().getFullYear()} Overview`}
          metrics={yearlyMetrics}
        />
      </div>

      <section className="bg-white p-6 rounded-2xl border border-slate-200/60">
        <h2 className="font-bold text-slate-800 text-sm uppercase mb-4">Outstanding Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Summary label="Unpaid Issues" value={unpaidIssues} />
          <Summary label="Unpaid Reissues" value={unpaidReissues} />
          <Summary label="Total Outstanding" value={unpaidIssues + unpaidReissues} />
        </div>
      </section>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SimpleTable
          title="Client Sales"
          icon={<UserCheck className="h-4 w-4 text-blue-500" />}
          headers={['Client', 'Sales', 'Profit']}
          rows={clientSummary
            .slice(0, 8)
            .map((client) => [client.name, formatMoney(client.sales), formatMoney(client.profit)])}
        />
        <SimpleTable
          title="Vendor Purchase Cost"
          icon={<Activity className="h-4 w-4 text-amber-500" />}
          headers={['Vendor', 'IATA', 'Cost']}
          rows={vendorSummary
            .slice(0, 8)
            .map((vendor) => [vendor.name, vendor.iataCode ?? '-', formatMoney(vendor.cost)])}
        />
      </div>

      <section className="bg-white p-6 rounded-2xl border border-slate-200/60">
        <h2 className="font-bold text-slate-800 text-sm uppercase flex items-center gap-2 mb-4">
          <HeartPulse className="h-4 w-4 text-emerald-500" /> Medical Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Summary label="Cases" value={medicalSummary.count} currency={false} />
          <Summary label="Sales" value={medicalSummary.sales} />
          <Summary label="Profit" value={medicalSummary.profit} />
        </div>
      </section>
    </div>
  )
}

function Summary({ label, value, currency = true }: { label: string; value: number; currency?: boolean }) {
  return (
    <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-xl font-bold text-slate-800 mt-1">{currency ? formatMoney(value) : value.toLocaleString()}</p>
    </div>
  )
}

function SimpleTable({
  title,
  icon,
  headers,
  rows,
}: {
  title: string
  icon: React.ReactNode
  headers: string[]
  rows: string[][]
}) {
  return (
    <section className="bg-white p-6 rounded-2xl border border-slate-200/60">
      <h2 className="font-bold text-slate-800 text-sm uppercase flex items-center gap-2 mb-4">
        {icon}
        {title}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs text-slate-400 uppercase">
              {headers.map((header) => (
                <th key={header} className="py-2 pr-4">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr key={`${row[0]}-${index}`} className="text-slate-700">
                {row.map((cell, cellIndex) => (
                  <td key={`${cell}-${cellIndex}`} className="py-3 pr-4">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={headers.length} className="py-6 text-center text-slate-400">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

import React, { useEffect, useMemo, useState } from 'react'
import { FileSpreadsheet, Printer, Download, Search, Building, MapPin, Info, RefreshCw } from 'lucide-react'
import { SalesReportRow } from '../types'

type DueFilter = 'All' | 'Has Due' | 'Cleared'

const monthLabel = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const toDate = (value?: string) => {
  if (!value) {
    return null
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed
}

const formatDate = (value?: string) => {
  const parsed = toDate(value)
  if (!parsed) {
    return '-'
  }

  return parsed.toLocaleDateString('en-GB')
}

const formatMonthYear = (month: string, year: string) => {
  if (month === 'All' && year === 'All') {
    return 'All Months'
  }

  if (month === 'All' && year !== 'All') {
    return `Year ${year}`
  }

  const monthText = monthLabel[Number(month) - 1] ?? 'Unknown'
  return year === 'All' ? monthText : `${monthText} ${year}`
}

const formatBDT = (value: number) => {
  return `৳ ${value.toLocaleString('en-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

const toCsvValue = (value: string | number) => {
  const text = String(value)
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`
  }

  return text
}

export default function SalesReport() {
  const [rows, setRows] = useState<SalesReportRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [monthFilter, setMonthFilter] = useState('All')
  const [yearFilter, setYearFilter] = useState('All')
  const [salesRefFilter, setSalesRefFilter] = useState('All')
  const [ticketTypeFilter, setTicketTypeFilter] = useState('All')
  const [dueFilter, setDueFilter] = useState<DueFilter>('All')

  const fetchRows = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/sales-reports')
      const json = await res.json()
      if (json.success) {
        setRows(json.data)
      }
    } catch (error) {
      console.error('Failed to load sales report data', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRows()
  }, [])

  const salesRefs = useMemo(() => {
    const list = new Set<string>()
    rows.forEach((row) => {
      if (row.salesRef) {
        list.add(row.salesRef)
      }
    })
    return Array.from(list).sort((a, b) => a.localeCompare(b))
  }, [rows])

  const ticketTypes = useMemo(() => {
    const list = new Set<string>()
    rows.forEach((row) => {
      if (row.ticketType) {
        list.add(row.ticketType)
      }
    })
    return Array.from(list).sort((a, b) => a.localeCompare(b))
  }, [rows])

  const years = useMemo(() => {
    const list = new Set<string>()
    rows.forEach((row) => {
      const parsed = toDate(row.date)
      if (parsed) {
        list.add(String(parsed.getFullYear()))
      }
    })
    return Array.from(list).sort((a, b) => b.localeCompare(a))
  }, [rows])

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const parsedDate = toDate(row.date)
      const month = parsedDate ? String(parsedDate.getMonth() + 1).padStart(2, '0') : ''
      const year = parsedDate ? String(parsedDate.getFullYear()) : ''

      const matchesMonth = monthFilter === 'All' || month === monthFilter
      const matchesYear = yearFilter === 'All' || year === yearFilter
      const matchesSalesRef = salesRefFilter === 'All' || row.salesRef === salesRefFilter
      const matchesTicketType = ticketTypeFilter === 'All' || row.ticketType === ticketTypeFilter

      const matchesDue =
        dueFilter === 'All' ||
        (dueFilter === 'Has Due' && row.dueAmount > 0) ||
        (dueFilter === 'Cleared' && row.dueAmount <= 0)

      const query = searchQuery.trim().toLowerCase()
      const matchesSearch =
        query === '' ||
        row.invoiceNo.toLowerCase().includes(query) ||
        row.mrNo.toLowerCase().includes(query) ||
        row.salesRef.toLowerCase().includes(query) ||
        row.ticketType.toLowerCase().includes(query)

      return matchesMonth && matchesYear && matchesSalesRef && matchesTicketType && matchesDue && matchesSearch
    })
  }, [rows, monthFilter, yearFilter, salesRefFilter, ticketTypeFilter, dueFilter, searchQuery])

  const totals = useMemo(() => {
    return filteredRows.reduce(
      (acc, row) => {
        acc.ticketReissue += row.ticketReissue || 0
        acc.admaVoidCharge += row.admaVoidCharge || 0
        acc.visaAppFee += row.visaAppFee || 0
        acc.hotelBooking += row.hotelBooking || 0
        acc.ticket += row.ticket || 0
        acc.totalSales += row.totalSales || 0
        acc.cash += row.cash || 0
        acc.bankBrac += row.bankBrac || 0
        acc.bankPubali += row.bankPubali || 0
        acc.bankDbbl += row.bankDbbl || 0
        acc.totalReceived += row.totalReceived || 0
        acc.dueAmount += row.dueAmount || 0
        acc.ticketCount += row.ticketCount || 0
        return acc
      },
      {
        ticketReissue: 0,
        admaVoidCharge: 0,
        visaAppFee: 0,
        hotelBooking: 0,
        ticket: 0,
        totalSales: 0,
        cash: 0,
        bankBrac: 0,
        bankPubali: 0,
        bankDbbl: 0,
        totalReceived: 0,
        dueAmount: 0,
        ticketCount: 0,
      },
    )
  }, [filteredRows])

  const handlePrint = () => {
    window.print()
  }

  const handleExportCSV = () => {
    const headers = [
      'Date',
      'Inv. No',
      'Type of Ticket',
      'No of Ticket',
      'MR No',
      'Sales Ref.',
      'Ticket Reissue',
      'ADMA/Void Charge',
      'Visa App. Fee',
      'Hotel Booking',
      'Ticket',
      'Total Sales',
      'Received Date',
      'Cash',
      'Brac Bank',
      'Pubali Bank',
      'DBBL',
      'Total Received',
      'Due Amount',
    ]

    const csvRows = [headers.map((header) => toCsvValue(header)).join(',')]

    filteredRows.forEach((row) => {
      csvRows.push(
        [
          formatDate(row.date),
          row.invoiceNo,
          row.ticketType,
          row.ticketCount,
          row.mrNo,
          row.salesRef,
          row.ticketReissue,
          row.admaVoidCharge,
          row.visaAppFee,
          row.hotelBooking,
          row.ticket,
          row.totalSales,
          formatDate(row.receivedDate),
          row.cash,
          row.bankBrac,
          row.bankPubali,
          row.bankDbbl,
          row.totalReceived,
          row.dueAmount,
        ]
          .map((value) => toCsvValue(value))
          .join(','),
      )
    })

    csvRows.push(
      [
        'GRAND TOTAL',
        '',
        '',
        totals.ticketCount,
        '',
        '',
        totals.ticketReissue,
        totals.admaVoidCharge,
        totals.visaAppFee,
        totals.hotelBooking,
        totals.ticket,
        totals.totalSales,
        '',
        totals.cash,
        totals.bankBrac,
        totals.bankPubali,
        totals.bankDbbl,
        totals.totalReceived,
        totals.dueAmount,
      ]
        .map((value) => toCsvValue(value))
        .join(','),
    )

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    const scopeText = formatMonthYear(monthFilter, yearFilter).replace(/\s+/g, '_')
    a.href = url
    a.download = `Welcare_Trip_Sales_Report_${scopeText}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const duePositive = totals.dueAmount > 0

  return (
    <div
      id="sales-report-container"
      className="flex-1 p-6 bg-slate-100 overflow-y-auto space-y-6 print:p-0 print:bg-white print:overflow-visible"
    >
      <div
        id="report-controls"
        className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 print:hidden"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600 rounded-xl text-white">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">SALES EXCEL WORKSHEET</h2>
              <p className="text-2xs text-slate-400 font-medium">
                Generated directly from invoice records and payment receipts
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-2xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              PRINT REPORT
            </button>
            <button
              onClick={handleExportCSV}
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Select Month</label>
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
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
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none"
            >
              <option value="All">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Sales Advisor</label>
            <select
              value={salesRefFilter}
              onChange={(e) => setSalesRefFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none"
            >
              <option value="All">All Advisors</option>
              {salesRefs.map((ref) => (
                <option key={ref} value={ref}>
                  {ref}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Ticket Class</label>
            <select
              value={ticketTypeFilter}
              onChange={(e) => setTicketTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none"
            >
              <option value="All">All Types</option>
              {ticketTypes.map((ticketType) => (
                <option key={ticketType} value={ticketType}>
                  {ticketType}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-4xs font-bold text-slate-400 uppercase mb-1">Due Reconciliation</label>
            <select
              value={dueFilter}
              onChange={(e) => setDueFilter(e.target.value as DueFilter)}
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

      <div
        id="sales-excel-card"
        className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-full overflow-x-auto print:p-0 print:border-none print:shadow-none font-sans"
      >
        <div
          id="excel-letterhead"
          className="flex flex-col items-center text-center pb-6 border-b-2 border-slate-900/10 mb-6 space-y-2"
        >
          <h1 className="text-3xl font-extrabold text-[#0B2E2D] tracking-wider uppercase font-sans">Welcare Trip</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1 text-4xs text-slate-500 max-w-2xl font-medium">
            <div className="flex items-center justify-center gap-1">
              <Building className="h-3 w-3 text-emerald-600 shrink-0" />
              <span>
                <strong>Head Office:</strong> Sena Kalyan Bhaban, 20th Floor, 195, Motijheel, Dhaka-1000.
              </span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
              <span>
                <strong>Branch Office:</strong> Kunio Bithi, 7th Floor, House# 63, Road# 27, Gulshan-1, Dhaka-121.
              </span>
            </div>
          </div>

          <div className="pt-2">
            <span className="px-5 py-1.5 bg-[#0B2E2D] text-white text-xs font-bold rounded-full uppercase tracking-widest">
              Sales Report for {formatMonthYear(monthFilter, yearFilter)}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center text-4xs text-slate-400 font-semibold uppercase tracking-wider pb-3 print:hidden">
          <div>
            Showing: <strong className="text-slate-700">{filteredRows.length} transactions</strong>
          </div>
          <div>
            Base Currency: <strong className="text-emerald-700">BDT (taka)</strong>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 print:hidden">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left">
            <span className="block text-4xs text-slate-400 font-bold uppercase">Total Gross Sales</span>
            <strong className="text-lg text-slate-800 font-mono">{formatBDT(totals.totalSales)}</strong>
          </div>
          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/60 text-left">
            <span className="block text-4xs text-emerald-600 font-bold uppercase">Total Bank Receipt</span>
            <strong className="text-lg text-emerald-700 font-mono">
              {formatBDT(totals.bankBrac + totals.bankPubali + totals.bankDbbl)}
            </strong>
          </div>
          <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100/60 text-left">
            <span className="block text-4xs text-teal-600 font-bold uppercase">Total Cash Receipt</span>
            <strong className="text-lg text-teal-700 font-mono">{formatBDT(totals.cash)}</strong>
          </div>
          <div
            className={`p-4 rounded-2xl border text-left ${duePositive ? 'bg-rose-50/50 border-rose-100/60' : 'bg-emerald-50/40 border-emerald-100/60'}`}
          >
            <span
              className={`block text-4xs font-bold uppercase ${duePositive ? 'text-rose-600' : 'text-emerald-600'}`}
            >
              Total Due Outstanding
            </span>
            <strong className={`text-lg font-mono ${duePositive ? 'text-rose-700' : 'text-emerald-700'}`}>
              {formatBDT(totals.dueAmount)}
            </strong>
          </div>
        </div>

        <div className="overflow-x-auto min-w-full">
          <table className="w-full text-left border-collapse text-3xs border border-slate-300 font-sans">
            <thead>
              <tr className="bg-[#0B2E2D] text-white text-center font-bold uppercase tracking-wider border border-slate-300">
                <th rowSpan={2} className="py-2.5 px-2 border-r border-slate-400 text-left min-w-[70px]">
                  Date
                </th>
                <th rowSpan={2} className="py-2.5 px-1 border-r border-slate-400 min-w-[50px]">
                  Inv. No
                </th>
                <th rowSpan={2} className="py-2.5 px-2 border-r border-slate-400 min-w-[75px]">
                  Type of Ticket
                </th>
                <th rowSpan={2} className="py-2.5 px-1 border-r border-slate-400 min-w-[50px]">
                  No of Ticket
                </th>
                <th rowSpan={2} className="py-2.5 px-2 border-r border-slate-400 min-w-[90px]">
                  MR No
                </th>
                <th rowSpan={2} className="py-2.5 px-2 border-r border-slate-400 min-w-[90px]">
                  Sales Ref.
                </th>

                <th
                  colSpan={6}
                  className="py-1.5 border-b border-r border-slate-400 text-center tracking-widest text-4xs bg-[#103D3C]"
                >
                  Sales Amount
                </th>

                <th rowSpan={2} className="py-2.5 px-2 border-r border-slate-400 min-w-[70px]">
                  Received Date
                </th>

                <th
                  colSpan={5}
                  className="py-1.5 border-b border-r border-slate-400 text-center tracking-widest text-4xs bg-[#144D4B]"
                >
                  Received
                </th>

                <th rowSpan={2} className="py-2.5 px-2 text-right min-w-[85px] bg-rose-900/20 text-[#4D1416]">
                  Due Amount
                </th>
              </tr>

              <tr className="bg-[#154645] text-white text-right font-semibold border-b border-slate-300">
                <th className="py-1.5 px-2 border-r border-slate-400 font-mono text-center min-w-[75px]">
                  Ticket Reissue
                </th>
                <th className="py-1.5 px-2 border-r border-slate-400 font-mono text-center min-w-[75px]">ADMA/Void</th>
                <th className="py-1.5 px-2 border-r border-slate-400 font-mono text-center min-w-[75px]">Visa App</th>
                <th className="py-1.5 px-2 border-r border-slate-400 font-mono text-center min-w-[75px]">Hotel Book</th>
                <th className="py-1.5 px-2 border-r border-slate-400 font-mono text-center min-w-[80px]">Ticket</th>
                <th className="py-1.5 px-2 border-r border-slate-400 font-bold bg-[#1C5E5C] text-center min-w-[90px]">
                  Total Sales
                </th>

                <th className="py-1.5 px-2 border-r border-slate-400 font-mono text-center min-w-[75px]">Cash</th>
                <th className="py-1.5 px-2 border-r border-slate-400 font-mono text-center min-w-[75px]">Brac Bank</th>
                <th className="py-1.5 px-2 border-r border-slate-400 font-mono text-center min-w-[75px]">
                  Pubali Bank
                </th>
                <th className="py-1.5 px-2 border-r border-slate-400 font-mono text-center min-w-[75px]">DBBL</th>
                <th className="py-1.5 px-2 border-r border-slate-400 font-bold bg-[#1D5F5D] text-center min-w-[90px]">
                  Total (taka)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 bg-white">
              {filteredRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-2 border-r border-slate-300 font-medium text-slate-700">
                    {formatDate(row.date)}
                  </td>
                  <td className="py-2 px-1 border-r border-slate-300 font-bold text-slate-900 text-center">
                    {row.invoiceNo}
                  </td>
                  <td className="py-2 px-2 border-r border-slate-300 text-slate-600 text-center">
                    {row.ticketType || '-'}
                  </td>
                  <td className="py-2 px-1 border-r border-slate-300 font-bold text-slate-800 text-center">
                    {row.ticketCount}
                  </td>
                  <td className="py-2 px-2 border-r border-slate-300 font-mono text-slate-600 break-all">
                    {row.mrNo || '-'}
                  </td>
                  <td className="py-2 px-2 border-r border-slate-300 text-slate-700 font-medium">
                    {row.salesRef || '-'}
                  </td>

                  <td className="py-2 px-2 border-r border-slate-300 text-right font-mono text-slate-700">
                    {formatBDT(row.ticketReissue)}
                  </td>
                  <td className="py-2 px-2 border-r border-slate-300 text-right font-mono text-slate-700">
                    {formatBDT(row.admaVoidCharge)}
                  </td>
                  <td className="py-2 px-2 border-r border-slate-300 text-right font-mono text-slate-700">
                    {formatBDT(row.visaAppFee)}
                  </td>
                  <td className="py-2 px-2 border-r border-slate-300 text-right font-mono text-slate-700">
                    {formatBDT(row.hotelBooking)}
                  </td>
                  <td className="py-2 px-2 border-r border-slate-300 text-right font-mono text-slate-700">
                    {formatBDT(row.ticket)}
                  </td>

                  <td className="py-2 px-2 border-r border-slate-300 text-right font-mono font-extrabold text-slate-900 bg-slate-50/70">
                    {formatBDT(row.totalSales)}
                  </td>

                  <td className="py-2 px-2 border-r border-slate-300 text-slate-600 font-mono">
                    {formatDate(row.receivedDate)}
                  </td>

                  <td className="py-2 px-2 border-r border-slate-300 text-right font-mono text-slate-700">
                    {formatBDT(row.cash)}
                  </td>
                  <td className="py-2 px-2 border-r border-slate-300 text-right font-mono text-slate-700">
                    {formatBDT(row.bankBrac)}
                  </td>
                  <td className="py-2 px-2 border-r border-slate-300 text-right font-mono text-slate-700">
                    {formatBDT(row.bankPubali)}
                  </td>
                  <td className="py-2 px-2 border-r border-slate-300 text-right font-mono text-slate-700">
                    {formatBDT(row.bankDbbl)}
                  </td>

                  <td className="py-2 px-2 border-r border-slate-300 text-right font-mono font-extrabold text-slate-900 bg-emerald-50/30">
                    {formatBDT(row.totalReceived)}
                  </td>

                  <td
                    className={`py-2 px-2 border-r border-slate-300 text-right font-mono font-black ${row.dueAmount > 0 ? 'text-rose-700 bg-rose-50' : 'text-emerald-700 bg-emerald-50/40'}`}
                  >
                    {formatBDT(row.dueAmount)}
                  </td>
                </tr>
              ))}

              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={19} className="py-8 text-center text-slate-400 font-semibold uppercase tracking-wider">
                    {isLoading ? 'SYNCING EXCEL WORKSHEET...' : 'No sales ledger entries found matching criteria.'}
                  </td>
                </tr>
              )}

              <tr className="bg-emerald-500/10 font-extrabold text-slate-950 border-t-2 border-slate-900 border-b-4 border-double border-slate-900">
                <td
                  colSpan={3}
                  className="py-3 px-2 border-r border-slate-300 text-left font-black tracking-wider uppercase bg-emerald-600/5"
                >
                  GRAND TOTAL
                </td>
                <td className="py-3 px-1 border-r border-slate-300 text-center text-slate-900 font-black">
                  {totals.ticketCount}
                </td>
                <td colSpan={2} className="py-3 px-2 border-r border-slate-300 text-center">
                  -
                </td>

                <td className="py-3 px-2 border-r border-slate-300 text-right font-mono text-slate-900">
                  {formatBDT(totals.ticketReissue)}
                </td>
                <td className="py-3 px-2 border-r border-slate-300 text-right font-mono text-slate-900">
                  {formatBDT(totals.admaVoidCharge)}
                </td>
                <td className="py-3 px-2 border-r border-slate-300 text-right font-mono text-slate-900">
                  {formatBDT(totals.visaAppFee)}
                </td>
                <td className="py-3 px-2 border-r border-slate-300 text-right font-mono text-slate-900">
                  {formatBDT(totals.hotelBooking)}
                </td>
                <td className="py-3 px-2 border-r border-slate-300 text-right font-mono text-slate-900">
                  {formatBDT(totals.ticket)}
                </td>
                <td className="py-3 px-2 border-r border-slate-300 text-right font-mono text-[#0B2E2D] font-black bg-emerald-500/10">
                  {formatBDT(totals.totalSales)}
                </td>

                <td className="py-3 px-2 border-r border-slate-300 text-center">-</td>

                <td className="py-3 px-2 border-r border-slate-300 text-right font-mono text-slate-900">
                  {formatBDT(totals.cash)}
                </td>
                <td className="py-3 px-2 border-r border-slate-300 text-right font-mono text-slate-900">
                  {formatBDT(totals.bankBrac)}
                </td>
                <td className="py-3 px-2 border-r border-slate-300 text-right font-mono text-slate-900">
                  {formatBDT(totals.bankPubali)}
                </td>
                <td className="py-3 px-2 border-r border-slate-300 text-right font-mono text-slate-900">
                  {formatBDT(totals.bankDbbl)}
                </td>
                <td className="py-3 px-2 border-r border-slate-300 text-right font-mono text-[#0B2E2D] font-black bg-emerald-500/10">
                  {formatBDT(totals.totalReceived)}
                </td>

                <td
                  className={`py-3 px-2 border-r border-slate-300 text-right font-mono font-black ${duePositive ? 'text-rose-700 bg-rose-50' : 'text-emerald-700 bg-emerald-50/40'}`}
                >
                  {formatBDT(totals.dueAmount)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-4xs text-slate-400 font-medium">
          <div>
            <p className="font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
              <Info className="h-3 w-3 text-indigo-500 shrink-0" />
              Spreadsheet Audit Guidelines
            </p>
            <p>1. Total (taka) received is computed as the sum of cash and BRAC/Pubali/DBBL bank channels.</p>
            <p>2. Sales Amount is generated from invoice type and invoice financial data.</p>
          </div>
          <div className="text-right md:text-right text-slate-400 self-end">
            <p>Certified Monthly Reconciliation Copy</p>
            <p className="font-semibold text-slate-500 mt-0.5">Welcare Trip Accounts & Finance Dept.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

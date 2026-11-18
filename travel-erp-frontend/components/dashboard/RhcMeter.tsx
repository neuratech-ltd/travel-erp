import { AlertTriangle, Gauge, RefreshCw } from 'lucide-react'

interface RhcMeterProps {
  capacity: number
  usage: number
  lastUpdated: Date | null
  isRefreshing: boolean
  onRequestUpdate: () => void
}

const formatMoney = (value: number) => `৳${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`

export default function RhcMeter({ capacity, usage, lastUpdated, isRefreshing, onRequestUpdate }: RhcMeterProps) {
  const percentage = capacity > 0 ? Math.min((usage / capacity) * 100, 100) : 0
  const angle = (-90 + percentage * 1.8) * (Math.PI / 180)
  const needleX = 100 + Math.cos(angle) * 58
  const needleY = 112 + Math.sin(angle) * 58
  const isNearLimit = percentage >= 80

  return (
    <section className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Gauge className="h-5 w-5 text-blue-600" />
            Remittance Holding Capacity
          </h2>
          <p className="text-xs text-slate-500 mt-1">Usage calculated from imported IUR client prices</p>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
            isNearLimit ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          {isNearLimit ? 'Approaching limit' : 'Within capacity'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-center">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Metric label="RHC amount" value={formatMoney(capacity)} />
          <Metric label="Current usage" value={formatMoney(usage)} />
          <Metric label="Financial security" value={formatMoney(capacity)} />
          <Metric label="Frequency" value="Monthly" />
        </div>

        <div className="flex flex-col items-center min-w-56">
          <svg viewBox="0 0 200 130" className="w-56 h-36" role="img" aria-label={`${percentage.toFixed(0)}% RHC used`}>
            <path
              d="M 28 112 A 72 72 0 0 1 172 112"
              pathLength="100"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="18"
              strokeLinecap="round"
            />
            <path
              d="M 28 112 A 72 72 0 0 1 172 112"
              pathLength="100"
              fill="none"
              stroke={isNearLimit ? '#f59e0b' : '#22c55e'}
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray={`${percentage} ${100 - percentage}`}
            />
            <line x1="100" y1="112" x2={needleX} y2={needleY} stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            <circle cx="100" cy="112" r="6" fill="#0f172a" />
            <text x="100" y="92" textAnchor="middle" className="fill-slate-800 text-[18px] font-bold">
              {percentage.toFixed(0)}%
            </text>
          </svg>
          <p className="text-xs text-slate-500 -mt-2">Percentage usage</p>
          {lastUpdated && (
            <p className="text-[11px] text-slate-400 mt-1">
              Updated {lastUpdated.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          )}
        </div>
      </div>

      {isNearLimit && (
        <p className="mt-4 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Current usage is close to the configured RHC amount.
        </p>
      )}

      {/* <button
        type="button"
        onClick={onRequestUpdate}
        disabled={isRefreshing}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? 'Updating balance...' : 'Request balance update'}
      </button> */}
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-800">{value}</p>
    </div>
  )
}

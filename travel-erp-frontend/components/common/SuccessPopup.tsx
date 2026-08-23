import React from 'react'
import { CheckCircle2, X } from 'lucide-react'

interface SuccessPopupProps {
  open: boolean
  title: string
  message: string
  detail?: string
  onClose: () => void
}

const SuccessPopup = ({ open, title, message, detail, onClose }: SuccessPopupProps) => {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-6 shadow-2xl shadow-emerald-950/20 animate-fade-in">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{message}</p>
              {detail ? <p className="mt-2 text-xs font-semibold text-emerald-600">{detail}</p> : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close success popup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuccessPopup
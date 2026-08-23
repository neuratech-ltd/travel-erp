import React from 'react'
import { Clock } from 'lucide-react'

interface ReportCardProps {
    icon?: React.ReactNode;
    title: string;
    date: string;
}

const ReportCard = ({ icon, title, date }: ReportCardProps) => {
  return (
     <div id="report-card-daily" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              {icon}
              {title}
            </h3>
            <span className="text-3xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full uppercase tracking-wider">
              {date}
            </span>
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Sales Amount</span><span className="font-semibold text-slate-800">৳000</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Collection Amount</span><span className="font-semibold text-emerald-600">৳000</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Discount Amount</span><span className="font-semibold text-rose-500">৳000</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Purchased Amount</span><span className="font-semibold text-slate-800">৳000</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Service Charge</span><span className="font-semibold text-slate-800">৳000</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Payment Amount</span><span className="font-semibold text-slate-800">৳000</span></div>
            <div className="flex justify-between pt-2.5 border-t border-dashed border-slate-100 font-bold">
              <span className="text-slate-700">Net Profit</span>
              <span className="text-blue-600">৳00</span>
            </div>
          </div>
        </div>
  )
}

export default ReportCard

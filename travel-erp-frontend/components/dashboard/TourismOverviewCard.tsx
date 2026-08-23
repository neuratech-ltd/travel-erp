import React from 'react'

interface TourismOverviewCardProps {
    title: string;
    ammount?: number;
    list?: { label: string; value: number }[];
    description?: string;
}

const TourismOverviewCard = ({ title, ammount, list, description }: TourismOverviewCardProps) => {
  return (
    <div className={`p-4 rounded-xl border ${ammount ? 'bg-gradient-to-br from-emerald-50 to-teal-50/50  border-emerald-100/60' : 'bg-slate-50  border-slate-100'}  flex flex-col justify-between`}>
            <div>
            <span className={`text-4xs font-extrabold ${ammount ? 'text-emerald-600' : 'text-slate-400'} tracking-wider uppercase block`}>{title}</span>
              {ammount && <span className="text-2xl font-black text-slate-800 block mt-1">৳{ammount.toLocaleString()}</span>}
              {list && <div className="flex gap-1.5 mt-2 flex-wrap">
                {list.map((item, index) => (
                  <span key={index} className="px-2 py-0.5 bg-white text-slate-600 text-3xs font-semibold rounded border border-slate-200">
                    {item.label}
                  </span>
                ))}
              </div>}
            </div>
            <p className="text-4xs text-slate-400 font-medium mt-3">{description}</p>
    </div>
  )
}

export default TourismOverviewCard

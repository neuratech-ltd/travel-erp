import React from 'react'

interface BillingSummeryCardProps {
    title?: string;
    amount?: number;
    description?: string;
}


const BillingSummeryCard = ({ title, amount, description }: BillingSummeryCardProps) => {
  return (
     <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
            <p className="text-3xs text-slate-400 uppercase tracking-widest font-bold">{title}</p>
            <p className="text-base font-bold text-slate-800 mt-1">৳{amount?.toLocaleString()}</p>
            {description && <p className="text-4xs text-slate-400 font-medium mt-2">{description}</p>}
    </div>
  )
}

export default BillingSummeryCard

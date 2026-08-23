import React from 'react'

interface EmployeeStatsCardProps {
    icon?: React.ReactNode;
    title?: string;
    amount?: number;
    status?: 'active' | 'inactive';
}

const EmployeeStatsCard = ({ icon, title, amount, status }: EmployeeStatsCardProps) => {

  const getColorClass = () => {
    if (status) {
      return status === 'active' ? 'text-emerald-600' : 'text-rose-500';
    }
    if (amount !== undefined) {
      return 'text-slate-500';
    }
    return 'text-slate-500'; 
  };

  const colorClass = getColorClass();

  return (
     <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
          <div>
            <span className={`block text-4xs font-bold ${colorClass} uppercase tracking-widest`}>
              {title}
            </span>
            <strong className={`text-xl font-semibold ${status ? colorClass : 'text-slate-700'} block`}>
              {amount}
            </strong>
          </div>
          <div className={`p-2.5 rounded-xl ${status ? (status === 'active' ? 'bg-emerald-500/10' : 'bg-rose-500/10') : 'bg-[#0A1D1C]/5'} ${status ? colorClass : 'text-[#0A1D1C]'}`}>
            {icon}
          </div>
        </div>
  )
}

export default EmployeeStatsCard
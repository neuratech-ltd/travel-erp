import React, { useState, useEffect } from 'react';
import { Search, Bell, Calendar, Sparkles, User, RefreshCw } from 'lucide-react';

interface HeaderProps {
  title: string;
  onSearch: (query: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export default function Header({ title, onSearch, onRefresh, isLoading = false }: HeaderProps) {
  const [searchVal, setSearchVal] = useState('');
  const [dateTimeStr, setDateTimeStr] = useState('July 10, 2026 - 22:50 UTC');

  useEffect(() => {
    const updateTimeStr = () => {
      const now = new Date();
      const timePart = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setDateTimeStr(`July 10, 2026 - ${timePart} (UTC)`);
    };
    
    updateTimeStr();
    const interval = setInterval(updateTimeStr, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header id="header-container" className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
      <div id="header-title-block" className="flex items-center gap-3">
        <h2 id="header-title" className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
        {isLoading && (
          <span id="loading-spinner-wrapper" className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full animate-pulse">
            <RefreshCw className="h-3 w-3 animate-spin" />
            Loading Data...
          </span>
        )}
      </div>

      <div id="header-search-bar" className="relative w-80 max-w-md hidden md:block">
        <span id="search-icon-wrapper" className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </span>
        <input
          id="header-search-input"
          type="text"
          placeholder="Search bookings, invoices, clients..."
          value={searchVal}
          onChange={handleSearchChange}
          className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 outline-none"
        />
      </div>

      <div id="header-right-actions" className="flex items-center gap-4">
        <div id="header-clock" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/50">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>{dateTimeStr}</span>
        </div>

        <button
          id="header-refresh-btn"
          onClick={onRefresh}
          title="Refresh ERP Data"
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer transition-all active:scale-95"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>

        <div id="header-profile-badge" className="flex items-center gap-2 border-l border-slate-200 pl-4">
          <div id="profile-avatar" className="h-9 w-9 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center font-bold text-slate-700 shadow-inner">
            <User className="h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
  );
}

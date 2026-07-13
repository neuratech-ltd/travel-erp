import React, { useState } from 'react';
import { Hotel, ShieldAlert, Sparkles, Save } from 'lucide-react';
import { Invoice } from '../types';



export default function HotelVisaInvoice() {
  const [loading, setLoading] = useState(false);
  const [bookingType, setBookingType] = useState<'Hotel' | 'Visa'>('Hotel');
  const [employeesList, setEmployeesList] = useState<any[]>([]);

  React.useEffect(() => {
    fetch('/api/employees')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setEmployeesList(json.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  // Metadata
  const [clientName, setClientName] = useState('Zenith Corporates');
  const [salesBy, setSalesBy] = useState('Select Employee');
  const [invoiceNo, setInvoiceNo] = useState(`HV-${Math.floor(Math.random() * 900) + 100}`);
  
  // Hotel states
  const [hotelName, setHotelName] = useState('Marina Bay Sands');
  const [roomType, setRoomType] = useState('Deluxe Suite');
  const [nights, setNights] = useState<number>(3);
  const [hotelCost, setHotelCost] = useState<number>(1500);
  const [hotelSale, setHotelSale] = useState<number>(1900);

  // Visa states
  const [visaCountry, setVisaCountry] = useState('Singapore');
  const [visaNo, setVisaNo] = useState('VISA-SG-04958');
  const [visaCost, setVisaCost] = useState<number>(120);
  const [visaSale, setVisaSale] = useState<number>(180);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cost = bookingType === 'Hotel' ? Number(hotelCost) * Number(nights) : Number(visaCost);
    const sale = bookingType === 'Hotel' ? Number(hotelSale) * Number(nights) : Number(visaSale);
    const profit = Math.max(0, sale - cost);

    // const success = await onAddInvoice({
    //   invoiceNo,
    //   clientName,
    //   salesBy,
    //   salesDate: '2026-07-07',
    //   dueDate: '2026-07-21',
    //   type: bookingType,
    //   status: 'Paid',
    //   purchasePrice: cost,
    //   clientPrice: sale,
    //   profit,
    //   route: bookingType === 'Hotel' ? hotelName : `Visa: ${visaCountry}`,
    //   paxName: 'Michael Chang'
    // });

    // setLoading(false);
    // if (success) {
    //   onNavigateToTab('ledger');
    // }
  };

  return (
    <div id="hotel-visa-container" className="flex-1 p-8 bg-slate-50 overflow-y-auto space-y-6 animate-fade-in">
      
      <div id="hv-header" className="bg-white p-6 rounded-2xl border border-slate-200/60 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Hotel className="h-5 w-5 text-indigo-500" />
            STANDALONE HOTEL & VISA BOOKINGS
          </h2>
          <p className="text-2xs text-slate-400 font-medium">Quick invoice entries for standalone non-flight travel voucher bookings</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button type="button" onClick={() => setBookingType('Hotel')} className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${bookingType === 'Hotel' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500 hover:text-slate-800'}`}>Hotel Stay</button>
          <button type="button" onClick={() => setBookingType('Visa')} className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${bookingType === 'Visa' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500 hover:text-slate-800'}`}>Visa Service</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* General */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-500 font-bold mb-1">Search Client *</label>
            <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 focus:bg-white outline-none" required />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Sales By</label>
            <select value={salesBy} onChange={(e) => setSalesBy(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none">
              <option value="Select Employee">Select Employee</option>
              {employeesList.map(emp => (
                <option key={emp.id} value={emp.name}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Invoice Voucher ID *</label>
            <input type="text" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 font-bold outline-none" required />
          </div>
          <div className="flex items-end pb-1.5">
            <span className="text-3xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-2.5 rounded-lg w-full flex items-center justify-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5" />
              Real-time outstanding check active
            </span>
          </div>
        </div>

        {/* Dynamic Service Inputs */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 tracking-wider uppercase border-b border-slate-100 pb-2">
            {bookingType === 'Hotel' ? 'Hotel Booking specifics' : 'Visa Processing specifics'}
          </h3>

          {bookingType === 'Hotel' ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs animate-fade-in">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Hotel Name</label>
                <input type="text" value={hotelName} onChange={(e) => setHotelName(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Room Type</label>
                <input type="text" value={roomType} onChange={(e) => setRoomType(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Staying Nights</label>
                <input type="number" value={nights} onChange={(e) => setNights(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none font-bold" />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Night Price Cost (Buy)</label>
                <input type="number" value={hotelCost} onChange={(e) => setHotelCost(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Night Price Sale (Sell)</label>
                <input type="number" value={hotelSale} onChange={(e) => setHotelSale(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none font-bold" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs animate-fade-in">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Visiting Country</label>
                <input type="text" value={visaCountry} onChange={(e) => setVisaCountry(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Visa Reference No</label>
                <input type="text" value={visaNo} onChange={(e) => setVisaNo(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Visa Processing Fee (Buy)</label>
                <input type="number" value={visaCost} onChange={(e) => setVisaCost(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Client Sales Price (Sell)</label>
                <input type="number" value={visaSale} onChange={(e) => setVisaSale(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none font-bold" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-50 pt-6 text-center">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="block text-4xs font-bold text-slate-400 uppercase">Gross Purchase Cost</span>
              <span className="text-sm font-black text-slate-700">
                ৳{bookingType === 'Hotel' ? Number(hotelCost) * Number(nights) : Number(visaCost)}
              </span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="block text-4xs font-bold text-slate-400 uppercase">Voucher Revenue</span>
              <span className="text-sm font-black text-slate-700">
                ৳{bookingType === 'Hotel' ? Number(hotelSale) * Number(nights) : Number(visaSale)}
              </span>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <span className="block text-4xs font-bold text-blue-500 uppercase font-medium">Net Profit Margin</span>
              <span className="text-sm font-black text-blue-700">
                ৳{bookingType === 'Hotel' 
                  ? (Number(hotelSale) - Number(hotelCost)) * Number(nights)
                  : Number(visaSale) - Number(visaCost)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <button type="button" 
          // onClick={() => onNavigateToTab('dashboard')} 
          className="px-6 py-2.5 border border-slate-200 bg-white text-slate-600 rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-lg shadow-indigo-500/20">
            {loading ? 'Creating Voucher...' : 'Save Booking Invoice'}
          </button>
        </div>

      </form>

    </div>
  );
}

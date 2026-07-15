import React, { useState } from 'react';
import { Hotel, ShieldAlert, Sparkles, Save } from 'lucide-react';
import { Invoice } from '../types';
import TitleCard from '@/components/common/TitleCard';
import HotelAndVisaForm from '@/components/forms/HotelAndVisaForm';



export default function HotelVisaInvoice() {
  const [loading, setLoading] = useState(false);
  const [bookingType, setBookingType] = useState<'Hotel' | 'Visa'>('Hotel');
  // const [employeesList, setEmployeesList] = useState<any[]>([]);

  // React.useEffect(() => {
  //   fetch('/api/employees')
  //     .then(res => res.json())
  //     .then(json => {
  //       if (json.success) {
  //         setEmployeesList(json.data);
  //       }
  //     })
  //     .catch(err => console.error(err));
  // }, []);

  // Metadata
  // const [clientName, setClientName] = useState('Zenith Corporates');
  // const [salesBy, setSalesBy] = useState('Select Employee');
  // const [invoiceNo, setInvoiceNo] = useState(`HV-${Math.floor(Math.random() * 900) + 100}`);
  
  // // Hotel states
  // const [hotelName, setHotelName] = useState('Marina Bay Sands');
  // const [roomType, setRoomType] = useState('Deluxe Suite');
  // const [nights, setNights] = useState<number>(3);
  // const [hotelCost, setHotelCost] = useState<number>(1500);
  // const [hotelSale, setHotelSale] = useState<number>(1900);

  // // Visa states
  // const [visaCountry, setVisaCountry] = useState('Singapore');
  // const [visaNo, setVisaNo] = useState('VISA-SG-04958');
  // const [visaCost, setVisaCost] = useState<number>(120);
  // const [visaSale, setVisaSale] = useState<number>(180);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // const cost = bookingType === 'Hotel' ? Number(hotelCost) * Number(nights) : Number(visaCost);
    // const sale = bookingType === 'Hotel' ? Number(hotelSale) * Number(nights) : Number(visaSale);
    // const profit = Math.max(0, sale - cost);

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
        <TitleCard 
          icon={<Hotel className="h-5 w-5 text-indigo-500 animate-bounce" />}
          title="STANDALONE HOTEL & VISA BOOKINGS"
          description="Quick invoice entries for standalone non-flight travel voucher bookings"
        />
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button type="button" 
          // onClick={() => setBookingType('Hotel')} 
          className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all 
          ${bookingType === 'Hotel' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500 hover:text-slate-800'}`}>Hotel Stay</button>
          <button type="button" 
          // onClick={() => setBookingType('Visa')} 
          className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all 
          ${bookingType === 'Visa' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500 hover:text-slate-800'}`}>Visa Service</button>
        </div>
      </div>

      <HotelAndVisaForm 
        bookingType={bookingType} 
        loading={loading} 
        handleSubmit={handleSubmit} 
      />

    </div>
  );
}

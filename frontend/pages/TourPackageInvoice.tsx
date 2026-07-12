import React, { useState, useEffect } from 'react';
import { Briefcase, Sparkles, Save, User, Hotel, Plane, Ship, ShieldCheck, HeartPulse } from 'lucide-react';
import { Invoice } from '../types';

interface TourPackageInvoiceProps {
  onAddInvoice: (inv: Partial<Invoice>) => Promise<boolean>;
  onNavigateToTab: (tab: string) => void;
}

export default function TourPackageInvoice({ onAddInvoice, onNavigateToTab }: TourPackageInvoiceProps) {
  const [loading, setLoading] = useState(false);
  const [aiFilling, setAiFilling] = useState(false);
  const [subFormTab, setSubFormTab] = useState<'passport' | 'ticket' | 'accommodation' | 'visa' | 'medical' | 'billing'>('passport');
  const [employeesList, setEmployeesList] = useState<any[]>([]);

  useEffect(() => {
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
  const [clientName, setClientName] = useState('Welcare Medical Patients');
  const [salesBy, setSalesBy] = useState('Select Employee');
  const [invoiceNo, setInvoiceNo] = useState(`WCT-00${Math.floor(Math.random() * 90) + 10}`);
  const [salesDate, setSalesDate] = useState('2026-07-10');
  const [dueDate, setDueDate] = useState('2026-07-25');

  // Subform states
  // 1. Passport
  const [passportNo, setPassportNo] = useState('');
  const [paxName, setPaxName] = useState('');
  const [paxType, setPaxType] = useState('Adult');
  const [nationalId, setNationalId] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [doi, setDoi] = useState('');
  const [doe, setDoe] = useState('');

  // 2. Ticket
  const [tktNo, setTktNo] = useState('');
  const [tktPnr, setTktPnr] = useState('');
  const [tktRoute, setTktRoute] = useState('');
  const [tktJourneyDate, setTktJourneyDate] = useState('');
  const [tktReturnDate, setTktReturnDate] = useState('');
  const [tktAirline, setTktAirline] = useState('Singapore Airlines');
  const [tktSalePrice, setTktSalePrice] = useState<number>(0);
  const [tktCostPrice, setTktCostPrice] = useState<number>(0);
  const [tktVendor, setTktVendor] = useState('SQ Agents');

  // 3. Accommodation
  const [hotelName, setHotelName] = useState('');
  const [hotelLocation, setHotelLocation] = useState('');
  const [roomType, setRoomType] = useState('Deluxe Room');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [nights, setNights] = useState<number>(1);
  const [hotelSalePrice, setHotelSalePrice] = useState<number>(0);
  const [hotelCostPrice, setHotelCostPrice] = useState<number>(0);
  const [hotelVendor, setHotelVendor] = useState('Expedia Partner');

  // 4. Transport & Visa
  const [visaCategory, setVisaCategory] = useState('MEDICAL');
  const [visaCountry, setVisaCountry] = useState('Singapore');
  const [visaType, setVisaType] = useState('Medical Visa Single Entry');
  const [visaNo, setVisaNo] = useState('');
  const [visaSalePrice, setVisaSalePrice] = useState<number>(0);
  const [visaCostPrice, setVisaCostPrice] = useState<number>(0);

  // 4b. Medical Tourism Specialized Fields
  const [hospitalName, setHospitalName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [treatmentCategory, setTreatmentCategory] = useState('General Health Screening');
  const [companionName, setCompanionName] = useState('');
  const [ambulanceRequired, setAmbulanceRequired] = useState(false);
  const [medicalSalePrice, setMedicalSalePrice] = useState<number>(0);
  const [medicalCostPrice, setMedicalCostPrice] = useState<number>(0);

  // 5. Billing Totals
  const [billingQty, setBillingQty] = useState<number>(1);
  const [discount, setDiscount] = useState<number>(0);
  const [extraFee, setExtraFee] = useState<number>(0);
  const [agentCommission, setAgentCommission] = useState<number>(0);

  // Compute values dynamically
  const flightProfit = Math.max(0, Number(tktSalePrice) - Number(tktCostPrice));
  const hotelProfit = Math.max(0, Number(hotelSalePrice) - Number(hotelCostPrice));
  const visaProfit = Math.max(0, Number(visaSalePrice) - Number(visaCostPrice));
  const medicalProfit = Math.max(0, Number(medicalSalePrice) - Number(medicalCostPrice));

  const totalCost = (Number(tktCostPrice) + Number(hotelCostPrice) + Number(visaCostPrice) + Number(medicalCostPrice)) * Number(billingQty);
  const subTotal = (Number(tktSalePrice) + Number(hotelSalePrice) + Number(visaSalePrice) + Number(medicalSalePrice)) * Number(billingQty);
  const netTotal = subTotal + Number(extraFee) - Number(discount);
  const totalProfit = netTotal - totalCost;

  const triggerAiFill = async () => {
    setAiFilling(true);
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: "Generate complete packaged medical tour details for a patient 'Haji Mohammad Selim' going to Singapore for a cardiac checkup at Mount Elizabeth Hospital. Include flight on Singapore Airlines, lodging at Royal Plaza on Scotts, Medical Visa, and medical + travel pricing grids. Output a clean JSON block.",
          contextType: "autoFill"
        })
      });
      const data = await response.json();
      if (data.success && data.text) {
        const jsonMatch = data.text.match(/```json\n([\s\S]*?)\n```/) || data.text.match(/{[\s\S]*?}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
          
          setPaxName(parsed.paxName || 'Haji Mohammad Selim');
          setPassportNo(parsed.passportNo || 'B08593859');
          setNationalId(parsed.nationalId || '1982483958');
          setContactNo(parsed.contactNo || '+8801711-234567');
          setEmail(parsed.email || 'm.selim@welcaregroupbd.com');
          setDob(parsed.dob || '1982-05-12');
          setDoi(parsed.doi || '2022-01-10');
          setDoe(parsed.doe || '2032-01-10');

          setTktNo(parsed.ticketNo || '098-938593849');
          setTktPnr(parsed.pnr || 'SQXYZ9');
          setTktRoute(parsed.route || 'DAC-SIN-DAC');
          setTktJourneyDate(parsed.journeyDate || '2026-08-01');
          setTktReturnDate(parsed.returnDate || '2026-08-07');
          setTktAirline(parsed.airline || 'Singapore Airlines');
          setTktSalePrice(parsed.flightSale || 4800);
          setTktCostPrice(parsed.flightCost || 4100);

          setHotelName(parsed.hotelName || 'Royal Plaza on Scotts');
          setHotelLocation(parsed.hotelLocation || 'Singapore (Orchard)');
          setCheckIn(parsed.checkIn || '2026-08-01');
          setCheckOut(parsed.checkOut || '2026-08-07');
          setNights(parsed.nights || 6);
          setHotelSalePrice(parsed.hotelSale || 13200);
          setHotelCostPrice(parsed.hotelCost || 11000);

          setVisaNo(parsed.visaNo || 'VISA-SG-39485');
          setVisaCategory(parsed.visaCategory || 'MEDICAL');
          setVisaCountry(parsed.country || 'Singapore');
          setVisaType(parsed.visaType || 'Medical Visa Single Entry');
          setVisaSalePrice(parsed.visaSale || 1500);
          setVisaCostPrice(parsed.visaCost || 1000);

          if (parsed.medicalInfo) {
            setHospitalName(parsed.medicalInfo.hospitalName || 'Mount Elizabeth Hospital');
            setDoctorName(parsed.medicalInfo.doctorName || 'Dr. Tan Seng Kiat (Cardiology)');
            setAppointmentDate(parsed.medicalInfo.appointmentDate || '2026-08-03T10:00:00.000Z');
            setTreatmentCategory(parsed.medicalInfo.treatmentCategory || 'Cardiology');
            setCompanionName(parsed.medicalInfo.companionName || 'Mrs. Selim Begum');
            setAmbulanceRequired(parsed.medicalInfo.ambulanceRequired || true);
            setMedicalSalePrice(parsed.medicalInfo.salePrice || 14500);
            setMedicalCostPrice(parsed.medicalInfo.costPrice || 12500);
          } else {
            setHospitalName('Mount Elizabeth Hospital');
            setDoctorName('Dr. Tan Seng Kiat (Cardiology)');
            setAppointmentDate('2026-08-03T10:00:00.000Z');
            setTreatmentCategory('Cardiology');
            setCompanionName('Mrs. Selim Begum');
            setAmbulanceRequired(true);
            setMedicalSalePrice(14500);
            setMedicalCostPrice(12500);
          }
        }
      }
    } catch (e) {
      console.error(e);
      setPaxName('Haji Mohammad Selim');
      setPassportNo('B08593859');
      setTktNo('098-938593849');
      setTktSalePrice(4800);
      setTktCostPrice(4100);
      setHotelName('Royal Plaza on Scotts');
      setHotelSalePrice(13200);
      setHotelCostPrice(11000);
      setHospitalName('Mount Elizabeth Hospital');
      setDoctorName('Dr. Tan Seng Kiat (Cardiology)');
      setMedicalSalePrice(14500);
      setMedicalCostPrice(12500);
    } finally {
      setAiFilling(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await onAddInvoice({
      invoiceNo,
      clientName,
      salesBy,
      salesDate,
      dueDate,
      type: 'Tour Package',
      status: 'Paid',
      passportInfo: { passportNo, paxName, paxType, nationalId, contactNo, email, dob, dateOfIssue: doi, dateOfExpiry: doe },
      ticketInfo: { ticketNo: tktNo, pnr: tktPnr, route: tktRoute, journeyDate: tktJourneyDate, returnDate: tktReturnDate, airline: tktAirline, salePrice: tktSalePrice, costPrice: tktCostPrice, profit: flightProfit, vendor: tktVendor },
      accommodation: { hotelName, hotelLocation, roomType, checkIn, checkOut, nights, salePrice: hotelSalePrice, costPrice: hotelCostPrice, profit: hotelProfit, vendor: hotelVendor },
      visaInfo: { visaCategory, country: visaCountry, visaType, visaNo, salePrice: visaSalePrice, costPrice: visaCostPrice, profit: visaProfit },
      medicalInfo: { hospitalName, doctorName, appointmentDate, treatmentCategory, companionName, ambulanceRequired, treatmentCost: medicalCostPrice, salePrice: medicalSalePrice, costPrice: medicalCostPrice, profit: medicalProfit },
      billing: { unitPrice: subTotal / billingQty, costPrice: totalCost / billingQty, billingQty, discount, extraFee, totalCost, totalProfit, subTotal, netTotal, agentCommission },
      profit: totalProfit,
      clientPrice: netTotal,
      purchasePrice: totalCost,
      route: tktRoute || 'Packaged Medical Tour',
      paxName: paxName || 'Haji Mohammad Selim'
    });

    setLoading(false);
    if (success) {
      onNavigateToTab('ledger');
    }
  };

  return (
    <div id="tour-package-container" className="flex-1 p-8 bg-slate-50 overflow-y-auto space-y-6">
      
      {/* Header Panel */}
      <div id="tour-header" className="bg-white p-6 rounded-2xl border border-slate-200/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-emerald-500 animate-bounce" />
            CREATE NEW PACKAGED TOUR INVOICE
          </h2>
          <p className="text-2xs text-slate-400 font-medium">Consolidates flights, hotel stays, transport guides, and visas into a single customer billing voucher</p>
        </div>
        <button
          type="button"
          onClick={triggerAiFill}
          disabled={aiFilling}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          {aiFilling ? 'Gemini Assembling...' : 'AI Package Auto-Fill'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Core Metadata */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
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
            <label className="block text-slate-500 font-bold mb-1">Invoice No *</label>
            <input type="text" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 font-semibold outline-none" required />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Sales Date</label>
            <input type="date" value={salesDate} onChange={(e) => setSalesDate(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
          </div>
          <div>
            <label className="block text-slate-500 font-bold mb-1">Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 outline-none" />
          </div>
        </div>

        {/* Subform Tab Selector */}
        <div className="flex border-b border-slate-200 gap-1 text-xs">
          <button type="button" onClick={() => setSubFormTab('passport')} className={`px-4 py-2 font-bold cursor-pointer border-b-2 ${subFormTab === 'passport' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Passport Details</button>
          <button type="button" onClick={() => setSubFormTab('ticket')} className={`px-4 py-2 font-bold cursor-pointer border-b-2 ${subFormTab === 'ticket' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Flights Information</button>
          <button type="button" onClick={() => setSubFormTab('accommodation')} className={`px-4 py-2 font-bold cursor-pointer border-b-2 ${subFormTab === 'accommodation' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Accommodation</button>
          <button type="button" onClick={() => setSubFormTab('visa')} className={`px-4 py-2 font-bold cursor-pointer border-b-2 ${subFormTab === 'visa' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Visa Services</button>
          <button type="button" onClick={() => setSubFormTab('medical')} className={`px-4 py-2 font-bold cursor-pointer border-b-2 ${subFormTab === 'medical' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'} flex items-center gap-1`}>
            <HeartPulse className="h-3.5 w-3.5" /> Medical Care & Tourism
          </button>
          <button type="button" onClick={() => setSubFormTab('billing')} className={`px-4 py-2 font-bold cursor-pointer border-b-2 ${subFormTab === 'billing' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Billing Ledger</button>
        </div>

        {/* Subform content */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm min-h-64">
          
          {subFormTab === 'passport' && (
            <div className="space-y-4 text-xs animate-fade-in">
              <h3 className="font-bold text-slate-700 flex items-center gap-1.5"><User className="h-4 w-4 text-emerald-500" /> Primary Passport Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Pax Name</label>
                  <input type="text" value={paxName} onChange={(e) => setPaxName(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Passport No</label>
                  <input type="text" value={passportNo} onChange={(e) => setPassportNo(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">National ID</label>
                  <input type="text" value={nationalId} onChange={(e) => setNationalId(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Contact No</label>
                  <input type="text" value={contactNo} onChange={(e) => setContactNo(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">DOB</label>
                  <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Date of Issue</label>
                  <input type="date" value={doi} onChange={(e) => setDoi(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Date of Expire</label>
                  <input type="date" value={doe} onChange={(e) => setDoe(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
              </div>
            </div>
          )}

          {subFormTab === 'ticket' && (
            <div className="space-y-4 text-xs animate-fade-in">
              <h3 className="font-bold text-slate-700 flex items-center gap-1.5"><Plane className="h-4 w-4 text-emerald-500" /> Package Flight Connections</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Ticket No</label>
                  <input type="text" value={tktNo} onChange={(e) => setTktNo(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">PNR</label>
                  <input type="text" value={tktPnr} onChange={(e) => setTktPnr(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Route / Sector</label>
                  <input type="text" value={tktRoute} onChange={(e) => setTktRoute(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Airline</label>
                  <input type="text" value={tktAirline} onChange={(e) => setTktAirline(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Journey Date</label>
                  <input type="date" value={tktJourneyDate} onChange={(e) => setTktJourneyDate(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Return Date</label>
                  <input type="date" value={tktReturnDate} onChange={(e) => setTktReturnDate(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Sale Price</label>
                  <input type="number" value={tktSalePrice} onChange={(e) => setTktSalePrice(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Cost Price (Buy)</label>
                  <input type="number" value={tktCostPrice} onChange={(e) => setTktCostPrice(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
              </div>
            </div>
          )}

          {subFormTab === 'accommodation' && (
            <div className="space-y-4 text-xs animate-fade-in">
              <h3 className="font-bold text-slate-700 flex items-center gap-1.5"><Hotel className="h-4 w-4 text-emerald-500" /> Accommodation Staying</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Hotel Name</label>
                  <input type="text" value={hotelName} onChange={(e) => setHotelName(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Hotel Location</label>
                  <input type="text" value={hotelLocation} onChange={(e) => setHotelLocation(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Room Type</label>
                  <input type="text" value={roomType} onChange={(e) => setRoomType(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">No of Nights</label>
                  <input type="number" value={nights} onChange={(e) => setNights(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Hotel Sale Price</label>
                  <input type="number" value={hotelSalePrice} onChange={(e) => setHotelSalePrice(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Hotel Cost Price</label>
                  <input type="number" value={hotelCostPrice} onChange={(e) => setHotelCostPrice(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
              </div>
            </div>
          )}

          {subFormTab === 'visa' && (
            <div className="space-y-4 text-xs animate-fade-in">
              <h3 className="font-bold text-slate-700 flex items-center gap-1.5"><Ship className="h-4 w-4 text-emerald-500" /> Visa Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Visa Country</label>
                  <input type="text" value={visaCountry} onChange={(e) => setVisaCountry(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Visa Category</label>
                  <input type="text" value={visaCategory} onChange={(e) => setVisaCategory(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Visa No / Ref</label>
                  <input type="text" value={visaNo} onChange={(e) => setVisaNo(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Visa Sale Price</label>
                  <input type="number" value={visaSalePrice} onChange={(e) => setVisaSalePrice(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Visa Cost Price</label>
                  <input type="number" value={visaCostPrice} onChange={(e) => setVisaCostPrice(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
              </div>
            </div>
          )}

          {subFormTab === 'medical' && (
            <div className="space-y-4 text-xs animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-700 flex items-center gap-1.5">
                  <HeartPulse className="h-4 w-4 text-emerald-500" /> Medical Tourism & Partner Hospital Coordination
                </h3>
                <span className="text-3xs font-semibold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full uppercase">
                  Welcare Trip Exclusive
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Hospital Partner</label>
                  <select 
                    value={hospitalName} 
                    onChange={(e) => setHospitalName(e.target.value)} 
                    className="w-full border border-slate-200 rounded-lg p-2 outline-none bg-slate-50 focus:bg-white text-slate-800 font-medium"
                  >
                    <option value="">-- Select Partner Hospital --</option>
                    <option value="Mount Elizabeth Hospital (Singapore)">Mount Elizabeth Hospital (Singapore)</option>
                    <option value="Bumrungrad International Hospital (Thailand)">Bumrungrad International Hospital (Thailand)</option>
                    <option value="Bangkok Hospital (Thailand)">Bangkok Hospital (Thailand)</option>
                    <option value="Apollo Hospitals (India)">Apollo Hospitals (India)</option>
                    <option value="Fortis Healthcare (India)">Fortis Healthcare (India)</option>
                    <option value="Gleneagles Hospital (Malaysia)">Gleneagles Hospital (Malaysia)</option>
                    <option value="Raffles Hospital (Singapore)">Raffles Hospital (Singapore)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Doctor Name</label>
                  <input type="text" placeholder="e.g. Dr. Tan Seng Kiat" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Appointment Date & Time</label>
                  <input type="datetime-local" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Treatment / Dept Category</label>
                  <input type="text" placeholder="e.g. Cardiology, Oncology" value={treatmentCategory} onChange={(e) => setTreatmentCategory(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Companion / Medical Attendant</label>
                  <input type="text" placeholder="Companion full name" value={companionName} onChange={(e) => setCompanionName(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input 
                    type="checkbox" 
                    id="ambulance"
                    checked={ambulanceRequired} 
                    onChange={(e) => setAmbulanceRequired(e.target.checked)} 
                    className="h-4 w-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" 
                  />
                  <label htmlFor="ambulance" className="text-slate-600 font-bold select-none">Ambulance / Wheelchair Required</label>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Hospital Services Sale Price</label>
                  <input type="number" value={medicalSalePrice} onChange={(e) => setMedicalSalePrice(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 outline-none font-bold text-emerald-600" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Hospital Services Cost (Buy)</label>
                  <input type="number" value={medicalCostPrice} onChange={(e) => setMedicalCostPrice(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
              </div>
            </div>
          )}

          {subFormTab === 'billing' && (
            <div className="space-y-6 text-xs animate-fade-in">
              <h3 className="font-bold text-slate-700 flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Billing Ledger Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Billing Pax Quantity</label>
                  <input type="number" value={billingQty} onChange={(e) => setBillingQty(Math.max(1, Number(e.target.value)))} className="w-full border border-slate-200 rounded-lg p-2 outline-none font-bold" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Discount Given</label>
                  <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Extra Fee / Surcharge</label>
                  <input type="number" value={extraFee} onChange={(e) => setExtraFee(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Agent Commissions</label>
                  <input type="number" value={agentCommission} onChange={(e) => setAgentCommission(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg p-2 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-6">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
                  <span className="block text-4xs font-bold text-slate-400 uppercase">Aggregated Cost (Buy)</span>
                  <span className="text-sm font-black text-slate-700">৳{totalCost}</span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
                  <span className="block text-4xs font-bold text-slate-400 uppercase">Aggregated Sales Price</span>
                  <span className="text-sm font-black text-slate-700">৳{netTotal}</span>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                  <span className="block text-4xs font-bold text-emerald-500 uppercase">Consolidated Margin</span>
                  <span className="text-sm font-black text-emerald-700">৳{totalProfit}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <button type="button" onClick={() => onNavigateToTab('dashboard')} className="px-6 py-2.5 border border-slate-200 bg-white text-slate-600 rounded-xl text-xs font-bold cursor-pointer transition-all hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="flex items-center gap-1.5 px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-lg shadow-emerald-500/20">
            <Save className="h-4 w-4" />
            {loading ? 'Assembling Tour...' : 'Save Packaged Tour Invoice'}
          </button>
        </div>

      </form>

    </div>
  );
}

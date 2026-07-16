import React, { useState, useEffect } from 'react';
import { Briefcase, Sparkles, Save, User, Hotel, Plane, Ship, ShieldCheck, HeartPulse } from 'lucide-react';
import { Invoice } from '../types';
import TitleCard from '@/components/common/TitleCard';
import TourPackageForm from '@/components/forms/TourPackageForm';



export default function TourPackageInvoice() {
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
  // const [clientName, setClientName] = useState('Welcare Medical Patients');
  // const [salesBy, setSalesBy] = useState('Select Employee');
  // const [invoiceNo, setInvoiceNo] = useState(`WCT-00${Math.floor(Math.random() * 90) + 10}`);
  // const [salesDate, setSalesDate] = useState('2026-07-10');
  // const [dueDate, setDueDate] = useState('2026-07-25');

  // Subform states
  // 1. Passport
  // const [passportNo, setPassportNo] = useState('');
  // const [paxName, setPaxName] = useState('');
  // const [paxType, setPaxType] = useState('Adult');
  // const [nationalId, setNationalId] = useState('');
  // const [contactNo, setContactNo] = useState('');
  // const [email, setEmail] = useState('');
  // const [dob, setDob] = useState('');
  // const [doi, setDoi] = useState('');
  // const [doe, setDoe] = useState('');

  // 2. Ticket
  // const [tktNo, setTktNo] = useState('');
  // const [tktPnr, setTktPnr] = useState('');
  // const [tktRoute, setTktRoute] = useState('');
  // const [tktJourneyDate, setTktJourneyDate] = useState('');
  // const [tktReturnDate, setTktReturnDate] = useState('');
  // const [tktAirline, setTktAirline] = useState('Singapore Airlines');
  // const [tktSalePrice, setTktSalePrice] = useState<number>(0);
  // const [tktCostPrice, setTktCostPrice] = useState<number>(0);
  // const [tktVendor, setTktVendor] = useState('SQ Agents');

  // 3. Accommodation
  // const [hotelName, setHotelName] = useState('');
  // const [hotelLocation, setHotelLocation] = useState('');
  // const [roomType, setRoomType] = useState('Deluxe Room');
  // const [checkIn, setCheckIn] = useState('');
  // const [checkOut, setCheckOut] = useState('');
  // const [nights, setNights] = useState<number>(1);
  // const [hotelSalePrice, setHotelSalePrice] = useState<number>(0);
  // const [hotelCostPrice, setHotelCostPrice] = useState<number>(0);
  // const [hotelVendor, setHotelVendor] = useState('Expedia Partner');

  // 4. Transport & Visa
  // const [visaCategory, setVisaCategory] = useState('MEDICAL');
  // const [visaCountry, setVisaCountry] = useState('Singapore');
  // const [visaType, setVisaType] = useState('Medical Visa Single Entry');
  // const [visaNo, setVisaNo] = useState('');
  // const [visaSalePrice, setVisaSalePrice] = useState<number>(0);
  // const [visaCostPrice, setVisaCostPrice] = useState<number>(0);

  // 4b. Medical Tourism Specialized Fields
  // const [hospitalName, setHospitalName] = useState('');
  // const [doctorName, setDoctorName] = useState('');
  // const [appointmentDate, setAppointmentDate] = useState('');
  // const [treatmentCategory, setTreatmentCategory] = useState('General Health Screening');
  // const [companionName, setCompanionName] = useState('');
  // const [ambulanceRequired, setAmbulanceRequired] = useState(false);
  // const [medicalSalePrice, setMedicalSalePrice] = useState<number>(0);
  // const [medicalCostPrice, setMedicalCostPrice] = useState<number>(0);

  // 5. Billing Totals
  // const [billingQty, setBillingQty] = useState<number>(1);
  // const [discount, setDiscount] = useState<number>(0);
  // const [extraFee, setExtraFee] = useState<number>(0);
  // const [agentCommission, setAgentCommission] = useState<number>(0);

  // Compute values dynamically
  // const flightProfit = Math.max(0, Number(tktSalePrice) - Number(tktCostPrice));
  // const hotelProfit = Math.max(0, Number(hotelSalePrice) - Number(hotelCostPrice));
  // const visaProfit = Math.max(0, Number(visaSalePrice) - Number(visaCostPrice));
  // const medicalProfit = Math.max(0, Number(medicalSalePrice) - Number(medicalCostPrice));

  // const totalCost = (Number(tktCostPrice) + Number(hotelCostPrice) + Number(visaCostPrice) + Number(medicalCostPrice)) * Number(billingQty);
  // const subTotal = (Number(tktSalePrice) + Number(hotelSalePrice) + Number(visaSalePrice) + Number(medicalSalePrice)) * Number(billingQty);
  // const netTotal = subTotal + Number(extraFee) - Number(discount);
  // const totalProfit = netTotal - totalCost;

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
          
          // setPaxName(parsed.paxName || 'Haji Mohammad Selim');
          // setPassportNo(parsed.passportNo || 'B08593859');
          // setNationalId(parsed.nationalId || '1982483958');
          // setContactNo(parsed.contactNo || '+8801711-234567');
          // setEmail(parsed.email || 'm.selim@welcaregroupbd.com');
          // setDob(parsed.dob || '1982-05-12');
          // setDoi(parsed.doi || '2022-01-10');
          // setDoe(parsed.doe || '2032-01-10');

          // setTktNo(parsed.ticketNo || '098-938593849');
          // setTktPnr(parsed.pnr || 'SQXYZ9');
          // setTktRoute(parsed.route || 'DAC-SIN-DAC');
          // setTktJourneyDate(parsed.journeyDate || '2026-08-01');
          // setTktReturnDate(parsed.returnDate || '2026-08-07');
          // setTktAirline(parsed.airline || 'Singapore Airlines');
          // setTktSalePrice(parsed.flightSale || 4800);
          // setTktCostPrice(parsed.flightCost || 4100);

          // setHotelName(parsed.hotelName || 'Royal Plaza on Scotts');
          // setHotelLocation(parsed.hotelLocation || 'Singapore (Orchard)');
          // setCheckIn(parsed.checkIn || '2026-08-01');
          // setCheckOut(parsed.checkOut || '2026-08-07');
          // setNights(parsed.nights || 6);
          // setHotelSalePrice(parsed.hotelSale || 13200);
          // setHotelCostPrice(parsed.hotelCost || 11000);

          // setVisaNo(parsed.visaNo || 'VISA-SG-39485');
          // setVisaCategory(parsed.visaCategory || 'MEDICAL');
          // setVisaCountry(parsed.country || 'Singapore');
          // setVisaType(parsed.visaType || 'Medical Visa Single Entry');
          // setVisaSalePrice(parsed.visaSale || 1500);
          // setVisaCostPrice(parsed.visaCost || 1000);

          // if (parsed.medicalInfo) {
          //   setHospitalName(parsed.medicalInfo.hospitalName || 'Mount Elizabeth Hospital');
          //   setDoctorName(parsed.medicalInfo.doctorName || 'Dr. Tan Seng Kiat (Cardiology)');
          //   setAppointmentDate(parsed.medicalInfo.appointmentDate || '2026-08-03T10:00:00.000Z');
          //   setTreatmentCategory(parsed.medicalInfo.treatmentCategory || 'Cardiology');
          //   setCompanionName(parsed.medicalInfo.companionName || 'Mrs. Selim Begum');
          //   setAmbulanceRequired(parsed.medicalInfo.ambulanceRequired || true);
          //   setMedicalSalePrice(parsed.medicalInfo.salePrice || 14500);
          //   setMedicalCostPrice(parsed.medicalInfo.costPrice || 12500);
          // } else {
          //   setHospitalName('Mount Elizabeth Hospital');
          //   setDoctorName('Dr. Tan Seng Kiat (Cardiology)');
          //   setAppointmentDate('2026-08-03T10:00:00.000Z');
          //   setTreatmentCategory('Cardiology');
          //   setCompanionName('Mrs. Selim Begum');
          //   setAmbulanceRequired(true);
          //   setMedicalSalePrice(14500);
          //   setMedicalCostPrice(12500);
          // }
        }
      }
    } catch (e) {
      console.error(e);
      // setPaxName('Haji Mohammad Selim');
      // setPassportNo('B08593859');
      // setTktNo('098-938593849');
      // setTktSalePrice(4800);
      // setTktCostPrice(4100);
      // setHotelName('Royal Plaza on Scotts');
      // setHotelSalePrice(13200);
      // setHotelCostPrice(11000);
      // setHospitalName('Mount Elizabeth Hospital');
      // setDoctorName('Dr. Tan Seng Kiat (Cardiology)');
      // setMedicalSalePrice(14500);
      // setMedicalCostPrice(12500);
    } finally {
      setAiFilling(false);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const success = await onAddInvoice({
  //     invoiceNo,
  //     clientName,
  //     salesBy,
  //     salesDate,
  //     dueDate,
  //     type: 'Tour Package',
  //     status: 'Paid',
  //     passportInfo: { passportNo, paxName, paxType, nationalId, contactNo, email, dob, dateOfIssue: doi, dateOfExpiry: doe },
  //     ticketInfo: { ticketNo: tktNo, pnr: tktPnr, route: tktRoute, journeyDate: tktJourneyDate, returnDate: tktReturnDate, airline: tktAirline, salePrice: tktSalePrice, costPrice: tktCostPrice, profit: flightProfit, vendor: tktVendor },
  //     accommodation: { hotelName, hotelLocation, roomType, checkIn, checkOut, nights, salePrice: hotelSalePrice, costPrice: hotelCostPrice, profit: hotelProfit, vendor: hotelVendor },
  //     visaInfo: { visaCategory, country: visaCountry, visaType, visaNo, salePrice: visaSalePrice, costPrice: visaCostPrice, profit: visaProfit },
  //     medicalInfo: { hospitalName, doctorName, appointmentDate, treatmentCategory, companionName, ambulanceRequired, treatmentCost: medicalCostPrice, salePrice: medicalSalePrice, costPrice: medicalCostPrice, profit: medicalProfit },
  //     billing: { unitPrice: subTotal / billingQty, costPrice: totalCost / billingQty, billingQty, discount, extraFee, totalCost, totalProfit, subTotal, netTotal, agentCommission },
  //     profit: totalProfit,
  //     clientPrice: netTotal,
  //     purchasePrice: totalCost,
  //     route: tktRoute || 'Packaged Medical Tour',
  //     paxName: paxName || 'Haji Mohammad Selim'
  //   });

  //   setLoading(false);
  //   if (success) {
  //     onNavigateToTab('ledger');
  //   }
  // };

  return (
    <div id="tour-package-container" className="flex-1 p-8 bg-slate-50 overflow-y-auto space-y-6">
      
      <div id="tour-header" className="bg-white p-6 rounded-2xl border border-slate-200/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <TitleCard 
          icon={<Briefcase className="h-5 w-5 text-emerald-500 animate-bounce" />}
          title="CREATE NEW PACKAGED TOUR INVOICE"
          description="Consolidates flights, hotel stays, transport guides, and visas into a single customer billing voucher"
        />
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
      
      <TourPackageForm loading={loading} employeesList={employeesList} subFormTab={subFormTab} setSubFormTab={setSubFormTab} />

    </div>
  );
}

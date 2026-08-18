import React from 'react'
import { User, Plane, HeartPulse, Hotel, ShieldCheck } from 'lucide-react'
import { Accommodation, Billing, InvoiceContact, MedicalInfo, PassportInfo, TicketInfo, VisaInfo } from '@/types'

interface ExpandedDetailsProps {
  inv: {
    paxName?: string
    passportNo?: string
    passportInfo?: PassportInfo
    client?: InvoiceContact
    ticketInfo?: TicketInfo
    medicalInfo?: MedicalInfo
    visaInfo?: VisaInfo
    accommodation?: Accommodation
    billing?: Billing
  }
}

const ExpandedDetails = ({ inv }: ExpandedDetailsProps) => {
  return (
    <tr className="bg-slate-50/60">
      <td colSpan={9} className="p-6 border-t border-b border-slate-200/50">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-inner grid grid-cols-1 md:grid-cols-2 gap-6 text-xs animate-fade-in">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <User className="h-4 w-4 text-emerald-500" />
              Primary Customer & Passport File
            </h4>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <span className="text-slate-400 block font-medium">Full Passenger Name:</span>{' '}
                <span className="font-bold text-slate-800">{inv.paxName}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Passport Number:</span>{' '}
                <span className="font-semibold text-slate-800 font-mono uppercase">{inv.passportNo || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">National Identity (NID):</span>{' '}
                <span className="text-slate-700">{inv.passportInfo?.nationalId || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Address:</span>{' '}
                <span className="text-slate-700">{inv.client?.address || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Contact Phone No:</span>{' '}
                <span className="text-slate-700">{inv.client?.phone || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Email Address:</span>{' '}
                <span className="text-slate-700">{inv.client?.email || 'N/A'}</span>
              </div>
            </div>

            {inv.ticketInfo && inv.ticketInfo.ticketNo && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 pb-1">
                  <Plane className="h-4 w-4 text-emerald-500" />
                  IATA Air Ticket segment
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <span className="text-slate-400 block font-medium">Airline / GDS:</span>{' '}
                    <span className="text-slate-800 font-semibold">{inv.ticketInfo.airline}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Flight PNR Code:</span>{' '}
                    <span className="text-slate-800 font-mono font-bold uppercase">{inv.ticketInfo.pnr}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Ticket E-No:</span>{' '}
                    <span className="text-slate-800 font-mono font-medium">{inv.ticketInfo.ticketNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Sectors:</span>{' '}
                    <span className="text-slate-800 font-bold font-mono text-xs">{inv.ticketInfo.route}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Journey Date:</span>{' '}
                    <span className="text-slate-700">{inv.ticketInfo.journeyDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Return Date:</span>{' '}
                    <span className="text-slate-700">{inv.ticketInfo.returnDate || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {inv.medicalInfo && inv.medicalInfo.hospitalName ? (
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/60 space-y-2">
                <h4 className="font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-emerald-100">
                  <HeartPulse className="h-4 w-4 text-emerald-600 animate-pulse" />
                  Medical Coordination Detail
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-2xs">
                  <div className="col-span-2">
                    <span className="text-slate-500 block font-bold">Partner Hospital:</span>
                    <span className="font-extrabold text-slate-800 text-xs">{inv.medicalInfo.hospitalName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-bold">Consulting Doctor:</span>
                    <span className="font-bold text-slate-800">
                      {inv.medicalInfo.doctorName || 'Assigned Specialist'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-bold">Treatment Dept:</span>
                    <span className="font-bold text-slate-800">
                      {inv.medicalInfo.treatmentCategory || 'General Diagnostics'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block font-bold">Appointment Scheduled:</span>
                    <span className="font-semibold text-emerald-700 font-mono">
                      {inv.medicalInfo.appointmentDate
                        ? new Date(inv.medicalInfo.appointmentDate).toLocaleString(undefined, {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'TBD'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-bold">Accompanied Attendant:</span>
                    <span className="font-medium text-slate-800">{inv.medicalInfo.companionName || 'None'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-bold">Ambulance Care:</span>
                    <span
                      className={`font-bold px-1.5 py-0.5 rounded text-3xs inline-block ${inv.medicalInfo.ambulanceRequired ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}
                    >
                      {inv.medicalInfo.ambulanceRequired ? 'Ambulance / Wheelchair Requested' : 'Not Required'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-3xs text-slate-500">
                <p className="font-semibold text-slate-600">Standard Travel Voucher</p>
                <p>
                  This transaction is a standard flights or visa voucher and has no associated hospital companion files
                  or doctor appointment coordination data.
                </p>
              </div>
            )}

            {inv.accommodation && inv.accommodation.hotelName && (
              <div className="space-y-2">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100">
                  <Hotel className="h-4 w-4 text-emerald-500" />
                  Accommodation Stay
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <span className="text-slate-400 block font-medium">Hotel Staying:</span>{' '}
                    <span className="font-bold text-slate-800">{inv.accommodation.hotelName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Location:</span>{' '}
                    <span className="text-slate-800">{inv.accommodation.hotelLocation}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Room Category:</span>{' '}
                    <span className="text-slate-800">{inv.accommodation.roomType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Nights:</span>{' '}
                    <span className="text-slate-800 font-bold">{inv.accommodation.nights} Nights</span>
                  </div>
                </div>
              </div>
            )}

            {inv.visaInfo && inv.visaInfo.visaNo && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 pb-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Visa Coordination Status
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <span className="text-slate-400 block font-medium">Country Applied:</span>{' '}
                    <span className="text-slate-800 font-bold">{inv.visaInfo.country}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Visa Reference:</span>{' '}
                    <span className="text-slate-800 font-mono font-semibold">{inv.visaInfo.visaNo}</span>
                  </div>
                </div>
              </div>
            )}

            {inv.billing && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                <p className="font-bold text-slate-700 uppercase tracking-widest text-4xs">Financial Ledger Summary</p>
                <div className="flex justify-between">
                  <span>Flights & Hotel Base:</span>{' '}
                  <span className="font-mono">৳{(inv.billing.subTotal || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Voucher Fees:</span>{' '}
                  <span className="font-mono">+৳{(inv.billing.extraFee || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-rose-500">
                  <span>Special Discounts:</span>{' '}
                  <span className="font-mono">-৳{(inv.billing.discount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-dashed border-slate-200 pt-1 font-bold">
                  <span>Total Paid Amount:</span>{' '}
                  <span className="text-slate-800 font-mono">৳{(inv.billing.netTotal || 0).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  )
}

export default ExpandedDetails

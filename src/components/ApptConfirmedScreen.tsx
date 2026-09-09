import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Calendar,
  Clock,
  Building2,
  User,
  Printer,
  Share2,
  Home,
  FileText,
} from 'lucide-react';
import { generateQrSvg, fmtDate } from '../lib/utils';
import { HOSPITALS, DOCTORS } from '../data/staticData';

export const ApptConfirmedScreen: React.FC = () => {
  const { appointments, screenParams, navigate } = useApp();

  const appt =
    appointments.find(a => a.id === screenParams.apptId) || appointments[0];

  if (!appt) {
    return (
      <div className="p-4 text-center">
        <p className="text-xs text-[#5d6f6a]">Appointment record not found.</p>
        <button
          onClick={() => navigate('home')}
          className="mt-3 px-4 py-2 bg-[#0e7c66] text-white rounded-xl text-xs"
        >
          Return Home
        </button>
      </div>
    );
  }

  const doctor = DOCTORS.find(d => d.id === appt.doc);
  const hospital = HOSPITALS.find(h => h.id === appt.hosp);

  return (
    <div className="space-y-4 pb-20 pt-2 max-w-md mx-auto">
      {/* Confirmation header */}
      <div className="text-center pt-2">
        <div className="w-12 h-12 rounded-full bg-[#e6f4e9] text-[#2f9e44] flex items-center justify-center mx-auto mb-2 shadow-xs">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-black text-[#13231f]">OPD Registration Confirmed</h2>
        <p className="text-xs text-[#5d6f6a]">
          Your token is confirmed and registered with the hospital queue.
        </p>
      </div>

      {/* Official OPD Slip / Pass Card */}
      <div
        id="print-area"
        className="bg-white rounded-2xl p-5 border border-[#e2ebe8] shadow-sm text-center space-y-4 relative"
      >
        <div className="border-b border-[#e2ebe8] pb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0e7c66] bg-[#e3f3ef] px-2 py-0.5 rounded-full inline-block mb-1">
            Official OPD Pass
          </span>
          <h3 className="text-base font-bold text-[#13231f]">
            {hospital?.name || 'District General Hospital'}
          </h3>
          <p className="text-[11px] text-[#5d6f6a] font-mono mt-0.5">
            Token / Reg ID: <span className="font-bold text-[#13231f]">{appt.reg}</span>
          </p>
        </div>

        {/* QR Code Container */}
        <div className="flex justify-center py-1">
          <div
            className="p-2 border border-[#e2ebe8] rounded-2xl bg-white shadow-2xs"
            dangerouslySetInnerHTML={{ __html: generateQrSvg(appt.reg, 120) }}
          />
        </div>

        {/* Slot details breakdown */}
        <div className="bg-[#f2f6f5] rounded-xl p-3 text-xs space-y-2 text-left">
          <div className="flex justify-between">
            <span className="text-[#5d6f6a]">Date & Time</span>
            <span className="font-bold text-[#13231f]">
              {fmtDate(appt.date)} • {appt.time} hrs
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5d6f6a]">OPD Department</span>
            <span className="font-bold text-[#13231f]">{appt.dept}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5d6f6a]">Clinician</span>
            <span className="font-bold text-[#13231f]">
              {doctor?.name || 'Duty Medical Officer'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5d6f6a]">Consultation Fee</span>
            <span className="font-bold text-[#0e7c66]">{appt.fee || '₹0 (Govt OPD)'}</span>
          </div>
        </div>

        <p className="text-[10px] text-[#5d6f6a]">
          Please show this QR token at the hospital reception/registration desk upon arrival.
        </p>
      </div>

      {/* Actions: Print & Done */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => window.print()}
          className="w-full py-2.5 bg-white border border-[#e2ebe8] hover:bg-[#f2f6f5] text-[#13231f] font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Printer className="w-4 h-4 text-[#5d6f6a]" />
          <span>Print / Save Slip PDF</span>
        </button>

        <button
          onClick={() => navigate('home')}
          className="w-full py-3 bg-[#0e7c66] hover:bg-[#0a5f4e] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Go to Home Dashboard</span>
        </button>
      </div>
    </div>
  );
};

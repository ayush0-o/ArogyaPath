import React from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle,
  Building2,
  ChevronRight,
  Shield,
  Stethoscope,
  PhoneCall,
  Activity,
} from 'lucide-react';
import { fmtDate, generateQrSvg } from '../lib/utils';
import { HOSPITALS } from '../data/staticData';

export const PatientHomeScreen: React.FC = () => {
  const { currentUser, patients, cases, appointments, navigate } = useApp();

  const myPid = currentUser?.pid || 'P-1001';
  const patient = patients.find(p => p.id === myPid) || patients[0];

  const myCases = cases.filter(c => c.pid === myPid);
  const myAppts = appointments.filter(a => a.pid === myPid);
  const nextAppt = myAppts.find(a => a.status === 'upcoming');

  return (
    <div className="space-y-4 pb-20 pt-2">
      {/* Patient Health ID Card */}
      <div className="bg-gradient-to-br from-[#0e7c66] to-[#0a5f4e] rounded-2xl p-4 text-white shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md inline-block mb-1.5">
              Arogya Health Pass
            </span>
            <h2 className="text-lg font-bold">{patient?.name}</h2>
            <p className="text-xs text-white/80">
              {patient?.gender} • {patient?.age} yrs • Blood Group {patient?.blood}
            </p>
            <p className="text-[11px] text-white/70 mt-1">ID: {patient?.id}</p>
          </div>

          <div
            className="cursor-pointer bg-white p-1 rounded-xl shadow-xs"
            onClick={() => navigate('profile')}
            title="Tap to view larger QR Health Card"
            dangerouslySetInnerHTML={{
              __html: generateQrSvg(patient?.id || 'P-1001', 58),
            }}
          />
        </div>

        {patient?.allergies && patient.allergies.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center gap-1.5 text-xs text-white/90">
            <span className="bg-[#e5484d] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              Allergy Alert
            </span>
            <span className="truncate">{patient.allergies.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Main Action Buttons: Intake & Appointment */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('case-taking')}
          className="bg-white border border-[#e2ebe8] hover:border-[#0e7c66] p-4 rounded-2xl shadow-xs hover:shadow-sm text-left transition-all group flex flex-col justify-between h-28"
        >
          <div className="w-10 h-10 rounded-xl bg-[#e3f3ef] text-[#0e7c66] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#13231f] group-hover:text-[#0e7c66]">
              Start Clinical Intake
            </h3>
            <p className="text-[10px] text-[#5d6f6a]">AI symptom voice/chat</p>
          </div>
        </button>

        <button
          onClick={() => navigate('book-appt')}
          className="bg-white border border-[#e2ebe8] hover:border-[#2f6fed] p-4 rounded-2xl shadow-xs hover:shadow-sm text-left transition-all group flex flex-col justify-between h-28"
        >
          <div className="w-10 h-10 rounded-xl bg-[#e8effd] text-[#2f6fed] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#13231f] group-hover:text-[#2f6fed]">
              Book Hospital OPD
            </h3>
            <p className="text-[10px] text-[#5d6f6a]">Verified doctor slot</p>
          </div>
        </button>
      </div>

      {/* Next Appointment Card (if any) */}
      {nextAppt && (
        <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#0e7c66] flex items-center gap-1 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" /> Next Confirmed OPD
            </span>
            <span className="text-[10px] font-semibold bg-[#e3f3ef] text-[#0e7c66] px-2 py-0.5 rounded-full">
              {nextAppt.status}
            </span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#13231f]">{nextAppt.dept}</h4>
              <p className="text-xs text-[#5d6f6a]">
                {fmtDate(nextAppt.date)} at {nextAppt.time} hrs
              </p>
              <p className="text-[11px] text-[#5d6f6a] mt-0.5 font-mono">
                Token: {nextAppt.reg}
              </p>
            </div>
            <button
              onClick={() => navigate('appt-detail', { apptId: nextAppt.id })}
              className="px-3 py-1.5 bg-[#f2f6f5] hover:bg-[#e2ebe8] text-[#13231f] text-xs font-semibold rounded-xl transition-colors"
            >
              Slip & QR
            </button>
          </div>
        </div>
      )}

      {/* Quick Access Grid: Hospitals, Lab Reports, Emergency */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <button
          onClick={() => navigate('hospitals')}
          className="bg-white p-3 rounded-xl border border-[#e2ebe8] hover:bg-[#f2f6f5] transition-colors"
        >
          <Building2 className="w-5 h-5 text-[#0e7c66] mx-auto mb-1" />
          <span className="text-[11px] font-semibold text-[#13231f] block">Hospitals</span>
        </button>
        <button
          onClick={() => navigate('lab-reports')}
          className="bg-white p-3 rounded-xl border border-[#e2ebe8] hover:bg-[#f2f6f5] transition-colors"
        >
          <FileText className="w-5 h-5 text-[#2f6fed] mx-auto mb-1" />
          <span className="text-[11px] font-semibold text-[#13231f] block">Lab Reports</span>
        </button>
        <button
          onClick={() => navigate('emergency')}
          className="bg-white p-3 rounded-xl border border-[#e2ebe8] hover:bg-[#fdeaea] transition-colors"
        >
          <PhoneCall className="w-5 h-5 text-[#e5484d] mx-auto mb-1" />
          <span className="text-[11px] font-semibold text-[#e5484d] block">108 Help</span>
        </button>
      </div>

      {/* Recent Health Cases List */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#5d6f6a]">
            My Medical Cases ({myCases.length})
          </h3>
          <button
            onClick={() => navigate('my-cases')}
            className="text-xs text-[#0e7c66] font-semibold hover:underline"
          >
            View All
          </button>
        </div>

        {myCases.length === 0 ? (
          <p className="text-xs text-[#5d6f6a] py-3 text-center">
            No medical cases recorded yet.
          </p>
        ) : (
          <div className="space-y-2.5">
            {myCases.slice(0, 3).map(c => (
              <div
                key={c.id}
                onClick={() => navigate('case-detail', { caseId: c.id })}
                className="p-3 rounded-xl border border-[#e2ebe8] hover:border-[#0e7c66] hover:bg-[#f2f6f5]/50 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#13231f] truncate">
                      {c.complaint}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5d6f6a]">
                    {fmtDate(c.created)} • {c.summary.symptoms.slice(0, 2).join(', ')}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      c.status === 'completed'
                        ? 'bg-[#e6f4e9] text-[#2f9e44]'
                        : c.status === 'reviewed'
                        ? 'bg-[#e3f3ef] text-[#0e7c66]'
                        : 'bg-[#fdf3dd] text-[#e8a013]'
                    }`}
                  >
                    {c.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#5d6f6a]" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Doctor-in-the-Loop Transparency Banner */}
      <div className="p-3 bg-[#e3f3ef] rounded-xl border border-[#0e7c66]/20 flex items-start gap-2.5">
        <Shield className="w-4 h-4 text-[#0e7c66] shrink-0 mt-0.5" />
        <p className="text-[11px] text-[#0a5f4e] leading-snug">
          <strong>Doctor Verification Mandate:</strong> AI suggestions are strictly for clinical
          intake and triage structuring. Every prescription and diagnosis is authorized by a
          registered medical practitioner.
        </p>
      </div>
    </div>
  );
};

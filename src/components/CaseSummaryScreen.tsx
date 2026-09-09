import React from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Calendar,
  AlertCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Share2,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { classifyDepartment } from '../lib/utils';

export const CaseSummaryScreen: React.FC = () => {
  const { cases, screenParams, navigate } = useApp();

  const currentCase =
    cases.find(c => c.id === screenParams.caseId) || cases[0];

  if (!currentCase) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-[#5d6f6a]">No case found.</p>
        <button
          onClick={() => navigate('home')}
          className="mt-3 px-4 py-2 bg-[#0e7c66] text-white rounded-xl text-xs"
        >
          Return Home
        </button>
      </div>
    );
  }

  const s = currentCase.summary;
  const suggestedDept = classifyDepartment(s.chief + ' ' + (s.symptoms || []).join(' '));

  return (
    <div className="space-y-4 pb-20 pt-2 max-w-md mx-auto">
      {/* Case Header Card */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0e7c66] bg-[#e3f3ef] px-2 py-0.5 rounded-full">
            Clinical Triage Synthesis • Case {currentCase.id}
          </span>
          <span className="text-[10px] text-[#5d6f6a] font-mono">{currentCase.created}</span>
        </div>

        <h2 className="text-base font-bold text-[#13231f]">{s.chief}</h2>
        <p className="text-xs text-[#5d6f6a] mt-0.5">
          Duration: <span className="font-semibold text-[#13231f]">{s.duration}</span> • Severity:{' '}
          <span className="font-semibold text-[#13231f]">{s.severity}</span>
        </p>
      </div>

      {/* Structured Symptoms Matrix */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#5d6f6a]">
          Extracted Clinical Parameters
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-[#f2f6f5] rounded-xl">
            <span className="text-[10px] text-[#5d6f6a] block">Symptoms</span>
            <span className="font-bold text-[#13231f]">{s.symptoms.join(', ') || 'None'}</span>
          </div>

          <div className="p-2.5 bg-[#f2f6f5] rounded-xl">
            <span className="text-[10px] text-[#5d6f6a] block">Appetite / Sleep</span>
            <span className="font-bold text-[#13231f]">
              {s.appetite} / {s.sleep}
            </span>
          </div>

          <div className="p-2.5 bg-[#f2f6f5] rounded-xl">
            <span className="text-[10px] text-[#5d6f6a] block">Medications Taken</span>
            <span className="font-bold text-[#13231f]">{s.meds || 'None'}</span>
          </div>

          <div className="p-2.5 bg-[#f2f6f5] rounded-xl">
            <span className="text-[10px] text-[#5d6f6a] block">Allergies</span>
            <span className="font-bold text-[#e5484d]">{s.allergies || 'None reported'}</span>
          </div>
        </div>

        {s.past && (
          <div className="p-2.5 bg-[#f2f6f5] rounded-xl text-xs">
            <span className="text-[10px] text-[#5d6f6a] block">Relevant Past Medical Record</span>
            <span className="font-medium text-[#13231f]">{s.past}</span>
          </div>
        )}
      </div>

      {/* Suggested Department Recommendation */}
      <div className="bg-[#e8effd] border border-[#2f6fed]/20 rounded-2xl p-4 text-xs space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#2f6fed] block">
          Recommended OPD Clinical Department
        </span>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[#13231f]">{suggestedDept}</span>
          <span className="text-[11px] text-[#2f6fed] font-semibold">Triage Matched</span>
        </div>
        <p className="text-[11px] text-[#5d6f6a]">
          Based on presenting complaint of {s.chief.toLowerCase()}, your case should be reviewed by
          the {suggestedDept} OPD department.
        </p>
      </div>

      {/* Mandatory Safety Notice */}
      <div className="p-3 bg-[#fdf3dd] rounded-xl border border-[#e8a013]/30 flex items-start gap-2 text-xs text-[#ad7205]">
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#e8a013]" />
        <p className="leading-snug text-[11px]">
          <strong>Doctor-in-the-loop:</strong> This automated summary will be sent directly to the
          assigned doctor during your OPD consult. AI does not dispense treatment or prescribe medicines.
        </p>
      </div>

      {/* Booking / Action Buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() =>
            navigate('book-appt', {
              caseId: currentCase.id,
              defaultDept: suggestedDept,
            })
          }
          className="w-full py-3 bg-[#0e7c66] hover:bg-[#0a5f4e] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Hospital OPD for this Case</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => navigate('home')}
          className="w-full py-2.5 bg-white border border-[#e2ebe8] hover:bg-[#f2f6f5] text-[#13231f] font-semibold text-xs rounded-xl transition-colors"
        >
          Save & Return to Dashboard
        </button>
      </div>
    </div>
  );
};

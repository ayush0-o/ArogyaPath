import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Calendar,
  Clock,
  Building2,
  PhoneCall,
  User,
  Activity,
  PlusCircle,
  AlertTriangle,
  ChevronRight,
  Shield,
  Printer,
} from 'lucide-react';
import { generateQrSvg, fmtDate } from '../lib/utils';
import { HOSPITALS, DOCTORS, HELPLINES, STATIC_REPORTS } from '../data/staticData';

// 1. My Cases Screen
export const MyCasesScreen: React.FC = () => {
  const { currentUser, cases, navigate } = useApp();
  const myPid = currentUser?.pid || 'P-1001';
  const myCases = cases.filter(c => c.pid === myPid);

  return (
    <div className="space-y-4 pb-20 pt-2 max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#13231f]">My Case Records ({myCases.length})</h2>
        <button
          onClick={() => navigate('case-taking')}
          className="px-3 py-1.5 bg-[#0e7c66] text-white text-xs font-semibold rounded-xl flex items-center gap-1 shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Intake</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {myCases.map(c => (
          <div
            key={c.id}
            onClick={() => navigate('case-detail', { caseId: c.id })}
            className="p-3.5 bg-white rounded-2xl border border-[#e2ebe8] hover:border-[#0e7c66] transition-all cursor-pointer shadow-xs space-y-1.5"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#0e7c66] bg-[#e3f3ef] px-1.5 py-0.5 rounded">
                  {c.id}
                </span>
                <h3 className="text-xs font-bold text-[#13231f] mt-1">{c.complaint}</h3>
              </div>
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
            </div>

            <p className="text-[11px] text-[#5d6f6a]">
              Recorded {fmtDate(c.created)} • {c.summary.symptoms.join(', ')}
            </p>

            {c.notes.length > 0 && (
              <div className="pt-1.5 border-t border-[#f2f6f5] flex items-center gap-1 text-[11px] text-[#0e7c66] font-medium">
                <span>✓ Doctor reviewed ({c.notes.length} note/Rx attached)</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. MyAppts Screen
export const MyApptsScreen: React.FC = () => {
  const { currentUser, appointments, navigate } = useApp();
  const myPid = currentUser?.pid || 'P-1001';
  const myAppts = appointments.filter(a => a.pid === myPid);

  return (
    <div className="space-y-4 pb-20 pt-2 max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#13231f]">My OPD Appointments ({myAppts.length})</h2>
        <button
          onClick={() => navigate('book-appt')}
          className="px-3 py-1.5 bg-[#0e7c66] text-white text-xs font-semibold rounded-xl flex items-center gap-1 shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Book OPD</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {myAppts.map(a => {
          const doc = DOCTORS.find(d => d.id === a.doc);
          const hosp = HOSPITALS.find(h => h.id === a.hosp);
          return (
            <div
              key={a.id}
              onClick={() => navigate('appt-detail', { apptId: a.id })}
              className="p-3.5 bg-white rounded-2xl border border-[#e2ebe8] hover:border-[#0e7c66] transition-all cursor-pointer shadow-xs space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#0e7c66] bg-[#e3f3ef] px-2 py-0.5 rounded">
                    Token: {a.reg}
                  </span>
                  <h3 className="text-xs font-bold text-[#13231f] mt-1">{a.dept}</h3>
                  <p className="text-[11px] text-[#5d6f6a]">{hosp?.name}</p>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    a.status === 'completed'
                      ? 'bg-[#e6f4e9] text-[#2f9e44]'
                      : 'bg-[#e3f3ef] text-[#0e7c66]'
                  }`}
                >
                  {a.status}
                </span>
              </div>

              <div className="pt-2 border-t border-[#f2f6f5] flex justify-between items-center text-xs">
                <span className="font-semibold text-[#13231f]">
                  {fmtDate(a.date)} at {a.time} hrs
                </span>
                <span className="text-[11px] text-[#0e7c66] font-bold">View Slip & QR →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 3. Hospitals Directory Screen
export const HospitalsScreen: React.FC = () => {
  const { navigate } = useApp();
  const [filterType, setFilterType] = useState('All');

  const filtered = HOSPITALS.filter(
    h => filterType === 'All' || h.type.toLowerCase() === filterType.toLowerCase()
  );

  return (
    <div className="space-y-4 pb-20 pt-2 max-w-md mx-auto">
      <div className="flex gap-1.5 bg-white p-1 rounded-xl border border-[#e2ebe8]">
        {['All', 'Government', 'Private', 'PHC'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all ${
              filterType === tab ? 'bg-[#0e7c66] text-white' : 'text-[#5d6f6a]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(h => (
          <div
            key={h.id}
            onClick={() => navigate('hospital-detail', { hospId: h.id })}
            className="p-4 bg-white rounded-2xl border border-[#e2ebe8] hover:border-[#0e7c66] transition-all cursor-pointer shadow-xs space-y-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0e7c66] bg-[#e3f3ef] px-2 py-0.5 rounded-full">
                  {h.type} Hospital
                </span>
                <h3 className="text-xs font-bold text-[#13231f] mt-1">{h.name}</h3>
                <p className="text-[11px] text-[#5d6f6a]">{h.addr}</p>
              </div>
              <span className="text-xs font-bold text-[#13231f] bg-[#f2f6f5] px-2 py-1 rounded-lg">
                ★ {h.rating}
              </span>
            </div>

            <div className="pt-2 border-t border-[#f2f6f5] flex justify-between items-center text-[11px] text-[#5d6f6a]">
              <span>{h.dist} away • {h.beds} beds</span>
              <span className="text-[#0e7c66] font-bold">OPD Schedule →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. Lab Reports Screen
export const LabReportsScreen: React.FC = () => {
  const [selectedReportKey, setSelectedReportKey] = useState<string | null>(null);

  const reportKeys = Object.keys(STATIC_REPORTS);

  return (
    <div className="space-y-4 pb-20 pt-2 max-w-md mx-auto">
      <h2 className="text-sm font-bold text-[#13231f]">Diagnostic Lab Reports & Pathology</h2>

      <div className="space-y-2.5">
        {reportKeys.map(k => {
          const rep = STATIC_REPORTS[k];
          const isOpen = selectedReportKey === k;
          return (
            <div
              key={k}
              className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs space-y-2"
            >
              <div
                onClick={() => setSelectedReportKey(isOpen ? null : k)}
                className="flex justify-between items-center cursor-pointer"
              >
                <div>
                  <span className="text-[10px] font-mono text-[#0e7c66] bg-[#e3f3ef] px-1.5 py-0.5 rounded">
                    {k}
                  </span>
                  <h3 className="text-xs font-bold text-[#13231f] mt-0.5">{rep.name}</h3>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-[#5d6f6a] transition-transform ${
                    isOpen ? 'rotate-90' : ''
                  }`}
                />
              </div>

              {isOpen && (
                <div className="pt-3 border-t border-[#f2f6f5] space-y-2">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="text-[10px] uppercase text-[#5d6f6a] border-b border-[#e2ebe8]">
                        <th className="pb-1.5">Parameter</th>
                        <th className="pb-1.5">Value</th>
                        <th className="pb-1.5">Ref Range</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f2f6f5]">
                      {rep.rows.map(([param, val, ref], i) => (
                        <tr key={i} className="py-1">
                          <td className="py-1.5 font-medium text-[#13231f]">{param}</td>
                          <td className="py-1.5 font-bold text-[#0e7c66]">{val}</td>
                          <td className="py-1.5 text-[#5d6f6a]">{ref}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-[10px] text-[#5d6f6a] pt-1">
                    District Hospital Central Pathology Lab • Verified by Pathologist
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 5. Emergency 108 Screen
export const EmergencyScreen: React.FC = () => {
  return (
    <div className="space-y-4 pb-20 pt-2 max-w-md mx-auto">
      <div className="bg-[#e5484d] text-white rounded-2xl p-4 shadow-sm text-center">
        <AlertTriangle className="w-8 h-8 mx-auto mb-1" />
        <h2 className="text-lg font-black">National Emergency Helplines</h2>
        <p className="text-xs text-white/90">
          Dial directly for immediate medical, trauma, or maternal dispatch.
        </p>
      </div>

      <div className="space-y-2.5">
        {HELPLINES.map(h => (
          <a
            key={h.n}
            href={`tel:${h.n}`}
            className="p-4 bg-white rounded-2xl border border-[#e2ebe8] hover:border-[#e5484d] transition-all flex items-center justify-between shadow-xs"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-[#e5484d] font-mono">{h.n}</span>
                <span className="text-xs font-bold text-[#13231f]">{h.l}</span>
              </div>
              <p className="text-[11px] text-[#5d6f6a] mt-0.5">{h.desc}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#fdeaea] text-[#e5484d] flex items-center justify-center shrink-0">
              <PhoneCall className="w-4 h-4" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

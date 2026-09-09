import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Users,
  Bed,
  CheckCircle,
  Clock,
  Search,
  ChevronRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { fmtDate, today } from '../lib/utils';
import { HOSPITALS, DOCTORS } from '../data/staticData';

export const HospitalHomeScreen: React.FC = () => {
  const { appointments, updateAppointmentStatus, navigate } = useApp();
  const [activeTab, setActiveTab] = useState<'queue' | 'doctors' | 'beds'>('queue');
  const [searchToken, setSearchToken] = useState('');

  const todaysAppts = appointments.filter(a => a.date === today());

  const handleCheckIn = (id: string) => {
    updateAppointmentStatus(id, 'checkedIn');
  };

  const handleMarkComplete = (id: string) => {
    updateAppointmentStatus(id, 'completed');
  };

  return (
    <div className="space-y-4 pb-20 pt-2">
      {/* Hospital Banner */}
      <div className="bg-gradient-to-br from-[#e8a013] to-[#ad7205] rounded-2xl p-4 text-white shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md inline-block mb-1">
              OPD Reception & Desk
            </span>
            <h2 className="text-lg font-bold">District General Hospital, Nashik</h2>
            <p className="text-xs text-white/80">Govt Civil Hospital • 220 Bed Capacity</p>
          </div>
          <span className="bg-white/25 text-white font-bold text-xs px-2.5 py-1 rounded-full">
            OPD Open
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/15 text-center">
          <div>
            <span className="text-lg font-black block">{todaysAppts.length}</span>
            <span className="text-[10px] text-white/70 uppercase">Booked Today</span>
          </div>
          <div>
            <span className="text-lg font-black block">
              {todaysAppts.filter(a => a.checkedIn).length}
            </span>
            <span className="text-[10px] text-white/70 uppercase">Checked In</span>
          </div>
          <div>
            <span className="text-lg font-black block">
              {todaysAppts.filter(a => a.status === 'completed').length}
            </span>
            <span className="text-[10px] text-white/70 uppercase">Done</span>
          </div>
        </div>
      </div>

      {/* Hospital Sub-Tabs */}
      <div className="flex bg-white rounded-xl p-1 border border-[#e2ebe8] shadow-xs">
        <button
          onClick={() => setActiveTab('queue')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'queue'
              ? 'bg-[#0e7c66] text-white'
              : 'text-[#5d6f6a] hover:text-[#13231f]'
          }`}
        >
          Daily OPD Check-in
        </button>
        <button
          onClick={() => setActiveTab('doctors')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'doctors'
              ? 'bg-[#0e7c66] text-white'
              : 'text-[#5d6f6a] hover:text-[#13231f]'
          }`}
        >
          OPD Doctors
        </button>
        <button
          onClick={() => setActiveTab('beds')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'beds'
              ? 'bg-[#0e7c66] text-white'
              : 'text-[#5d6f6a] hover:text-[#13231f]'
          }`}
        >
          Wards & Beds
        </button>
      </div>

      {/* Content depending on Tab */}
      {activeTab === 'queue' && (
        <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#13231f]">
              Patient Token Verification & Queue
            </h3>
          </div>

          <div className="space-y-3">
            {todaysAppts.map(appt => (
              <div
                key={appt.id}
                className="p-3 rounded-xl border border-[#e2ebe8] bg-white flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#0e7c66] bg-[#e3f3ef] px-2 py-0.5 rounded">
                      {appt.reg}
                    </span>
                    <h4 className="text-xs font-bold text-[#13231f] mt-1">
                      {appt.dept} • Slot {appt.time} hrs
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      appt.status === 'completed'
                        ? 'bg-[#e6f4e9] text-[#2f9e44]'
                        : appt.checkedIn
                        ? 'bg-[#e8effd] text-[#2f6fed]'
                        : 'bg-[#fdf3dd] text-[#e8a013]'
                    }`}
                  >
                    {appt.status === 'completed'
                      ? 'Consulted'
                      : appt.checkedIn
                      ? 'At Hospital (Checked In)'
                      : 'Expected Arrival'}
                  </span>
                </div>

                <div className="flex gap-2 pt-1 border-t border-[#f2f6f5]">
                  {!appt.checkedIn && appt.status !== 'completed' && (
                    <button
                      onClick={() => handleCheckIn(appt.id)}
                      className="flex-1 py-1.5 bg-[#0e7c66] hover:bg-[#0a5f4e] text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Scan / Check-in
                    </button>
                  )}
                  {appt.checkedIn && appt.status !== 'completed' && (
                    <button
                      onClick={() => handleMarkComplete(appt.id)}
                      className="flex-1 py-1.5 bg-[#2f9e44] hover:bg-[#258237] text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Mark Completed
                    </button>
                  )}
                  <button
                    onClick={() => navigate('appt-detail', { apptId: appt.id })}
                    className="px-3 py-1.5 bg-[#f2f6f5] hover:bg-[#e2ebe8] text-[#13231f] text-xs font-semibold rounded-lg transition-colors"
                  >
                    Slip
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'doctors' && (
        <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#13231f]">
            Hospital On-Duty Clinicians
          </h3>
          <div className="space-y-2">
            {DOCTORS.filter(d => d.h === 'h1').map(d => (
              <div
                key={d.id}
                onClick={() => navigate('doctor-detail', { docId: d.id })}
                className="p-3 rounded-xl border border-[#e2ebe8] hover:border-[#0e7c66] transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#13231f]">{d.name}</h4>
                  <p className="text-[11px] text-[#5d6f6a]">
                    {d.dept} • {d.exp} yrs experience • {d.edu}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#5d6f6a]" />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'beds' && (
        <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#13231f]">
            Live Bed Occupancy & Critical Care
          </h3>

          <div className="space-y-3">
            {[
              { ward: 'General Medical Ward (Male)', total: 60, occ: 52 },
              { ward: 'General Medical Ward (Female)', total: 60, occ: 48 },
              { ward: 'Pediatrics Ward', total: 30, occ: 21 },
              { ward: 'ICU / Critical Trauma', total: 20, occ: 18 },
              { ward: 'Maternity Ward', total: 50, occ: 38 },
            ].map(w => {
              const pct = Math.round((w.occ / w.total) * 100);
              return (
                <div key={w.ward} className="p-3 rounded-xl bg-[#f2f6f5] space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{w.ward}</span>
                    <span>
                      {w.occ} / {w.total} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#e2ebe8] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        pct > 85 ? 'bg-[#e5484d]' : pct > 70 ? 'bg-[#e8a013]' : 'bg-[#0e7c66]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

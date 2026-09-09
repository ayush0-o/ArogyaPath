import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PatientPastRecordsModal } from './PatientPastRecordsModal';
import { Patient } from '../types';
import { getPatientClinicalRecords } from '../data/clinicalRecordsData';
import {
  Users,
  CheckCircle2,
  FileText,
  Calendar,
  Stethoscope,
  Activity,
  ArrowRight,
  Clock,
  AlertTriangle,
  History,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Play,
  HeartPulse,
} from 'lucide-react';
import { today } from '../lib/utils';

export const DoctorHomeScreen: React.FC = () => {
  const {
    currentUser,
    appointments,
    cases,
    patients,
    navigate,
    updateAppointmentStatus,
  } = useApp();

  const [selectedPatientForRecords, setSelectedPatientForRecords] = useState<Patient | null>(null);
  const [dutyStatus, setDutyStatus] = useState<'on-duty' | 'rounds' | 'break'>('on-duty');

  const myDocId = currentUser?.did || 'd1';

  // Appointments assigned to this doctor for today
  const todaysAppts = appointments.filter(a => a.doc === myDocId && a.date === today());
  const completedToday = todaysAppts.filter(a => a.status === 'completed');
  const waitingAppts = todaysAppts.filter(a => a.status !== 'completed');

  // Cases awaiting doctor review / clinical attention
  const pendingCases = cases.filter(
    c => c.status === 'intake' || c.status === 'reviewed' || c.status === 'submitted'
  );

  // Identify next upcoming patient in line
  const nextAppt = todaysAppts.find(a => a.status === 'upcoming') || todaysAppts[0];
  const nextPatient = patients.find(p => p.id === nextAppt?.pid) || patients[1] || patients[0];
  const nextCase = cases.find(c => c.pid === nextPatient?.id);
  const nextPatientRecords = nextPatient ? getPatientClinicalRecords(nextPatient) : [];

  // Urgent triage items to highlight
  const highRiskPatients = patients.filter(
    p =>
      p.allergies.length > 0 ||
      p.cond.some(c => c.toLowerCase().includes('angina') || c.toLowerCase().includes('asthma') || c.toLowerCase().includes('severe'))
  ).slice(0, 2);

  const completionRate = todaysAppts.length > 0
    ? Math.round((completedToday.length / todaysAppts.length) * 100)
    : 0;

  const handleStartConsultation = () => {
    if (!nextPatient) return;
    if (nextCase) {
      navigate('case-detail', { caseId: nextCase.id, patientId: nextPatient.id });
    } else {
      navigate('patient-detail', { patientId: nextPatient.id });
    }
  };

  const handleMarkConsulted = () => {
    if (nextAppt) {
      updateAppointmentStatus(nextAppt.id, 'completed');
    }
  };

  return (
    <div className="space-y-4 pb-20 pt-2 max-w-md mx-auto">
      {/* 1. Doctor Clinic Header & Duty Status Banner */}
      <div className="bg-gradient-to-br from-[#083a30] via-[#0e7c66] to-[#0a5f4e] rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full text-white">
                OPD Clinical Console
              </span>
              <span className="text-[10px] font-medium text-white/70">
                Room 12
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight">
              {currentUser?.name || 'Dr. Priya Sharma, MD'}
            </h2>
            <p className="text-xs text-white/80 flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5 text-[#48e5c2]" />
              <span>General Medicine • District General Hospital</span>
            </p>
          </div>

          {/* Duty Status Switcher */}
          <button
            onClick={() => {
              setDutyStatus(prev =>
                prev === 'on-duty' ? 'rounds' : prev === 'rounds' ? 'break' : 'on-duty'
              );
            }}
            className="inline-flex items-center gap-1.5 text-[11px] bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full font-bold transition-all shrink-0 cursor-pointer shadow-xs"
            title="Click to toggle status"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                dutyStatus === 'on-duty'
                  ? 'bg-[#2f9e44] animate-pulse'
                  : dutyStatus === 'rounds'
                  ? 'bg-[#e8a013]'
                  : 'bg-[#e5484d]'
              }`}
            />
            <span>
              {dutyStatus === 'on-duty' ? 'On Duty' : dutyStatus === 'rounds' ? 'In Rounds' : 'On Break'}
            </span>
          </button>
        </div>

        {/* Shift Timing Bar */}
        <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-white/80">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#48e5c2]" />
            <span>Morning OPD: 09:00 AM - 01:00 PM</span>
          </div>
          <span className="font-semibold text-[#48e5c2]">Active Session</span>
        </div>
      </div>

      {/* 2. EXACT DATA METRICS DASHBOARD (Total Queue, Consulted, Active Cases) */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* KPI 1: Total Queue */}
        <div className="bg-white rounded-2xl p-3.5 border border-[#e2ebe8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5d6f6a] uppercase tracking-wide">
              Total Queue
            </span>
            <div className="w-7 h-7 rounded-xl bg-[#e3f3ef] flex items-center justify-center text-[#0e7c66]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-[#13231f] block leading-tight">
              {todaysAppts.length}
            </span>
            <span className="text-[10px] text-[#5d6f6a] block mt-0.5">
              Tokens #{todaysAppts[0]?.token || 99}–#{todaysAppts[todaysAppts.length - 1]?.token || 108}
            </span>
          </div>
        </div>

        {/* KPI 2: Consulted */}
        <div className="bg-white rounded-2xl p-3.5 border border-[#e2ebe8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5d6f6a] uppercase tracking-wide">
              Consulted
            </span>
            <div className="w-7 h-7 rounded-xl bg-[#e6f4ea] flex items-center justify-center text-[#2f9e44]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-[#2f9e44] block leading-tight">
              {completedToday.length}
            </span>
            <span className="text-[10px] text-[#5d6f6a] block mt-0.5">
              Completed Today
            </span>
          </div>
        </div>

        {/* KPI 3: Active Cases */}
        <div className="bg-white rounded-2xl p-3.5 border border-[#e2ebe8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5d6f6a] uppercase tracking-wide">
              Active Cases
            </span>
            <div className="w-7 h-7 rounded-xl bg-[#fdf3dd] flex items-center justify-center text-[#ad7205]">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-[#ad7205] block leading-tight">
              {pendingCases.length}
            </span>
            <span className="text-[10px] text-[#5d6f6a] block mt-0.5">
              Triage & Reviews
            </span>
          </div>
        </div>
      </div>

      {/* Workload / Quota Progress Bar */}
      <div className="bg-white rounded-2xl p-3.5 border border-[#e2ebe8] shadow-xs">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-bold text-[#13231f]">Today's OPD Progress</span>
          <span className="font-semibold text-[#0e7c66]">{completedToday.length} of {todaysAppts.length} Consulted ({completionRate}%)</span>
        </div>
        <div className="w-full h-2.5 bg-[#f2f6f5] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0e7c66] to-[#2f9e44] rounded-full transition-all duration-500"
            style={{ width: `${Math.max(completionRate, 8)}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-[#5d6f6a] mt-1.5">
          <span>{waitingAppts.length} patients waiting in queue</span>
          <span>Target: 25 patients</span>
        </div>
      </div>

      {/* 3. CURRENT IN CABIN / NEXT IN LINE PATIENT SPOTLIGHT CARD */}
      {nextPatient && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-[#0e7c66]/30 shadow-sm space-y-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0e7c66] animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#0e7c66]">
                Now Calling • Next In Line
              </span>
            </div>
            {/* Prominent Token Badge */}
            <span className="bg-[#0e7c66] text-white font-black text-xs px-3 py-1 rounded-full shadow-xs tracking-wide">
              TOKEN #{nextAppt?.token || 99}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#13231f]">
                {nextPatient.name}
              </h3>
              <span className="text-xs text-[#5d6f6a] font-medium">
                {nextPatient.age} yrs • {nextPatient.gender}
              </span>
            </div>
            <p className="text-xs text-[#5d6f6a]">
              ABHA: <span className="font-mono text-[11px]">{nextPatient.abhaId || '91-XXXX-XXXX'}</span> • Blood:{' '}
              <span className="font-semibold text-[#13231f]">{nextPatient.blood}</span>
            </p>
          </div>

          {/* Chief Complaint Box */}
          <div className="bg-[#f2f6f5] rounded-2xl p-3 border border-[#e2ebe8] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#5d6f6a] uppercase tracking-wide">
                Chief Complaint
              </span>
              <span className="text-[10px] text-[#0e7c66] font-bold bg-[#e3f3ef] px-2 py-0.5 rounded-md">
                {nextCase ? `${nextCase.summary.severity} Triage` : 'Moderate Triage'}
              </span>
            </div>
            <p className="text-xs font-semibold text-[#13231f]">
              {nextCase?.summary.chief || 'Acute epigastric burning pain, nausea & mild dehydration'}
            </p>
            <div className="text-[11px] text-[#5d6f6a] pt-1 flex items-center justify-between flex-wrap gap-1">
              <span>Duration: {nextCase?.summary.duration || '2 Days'}</span>
              <span>Allergies: {nextPatient.allergies.join(', ') || 'NKDA'}</span>
            </div>
          </div>

          {/* Vitals Snapshot */}
          <div className="grid grid-cols-3 gap-2 bg-[#fdfdfd] p-2.5 rounded-xl border border-[#e2ebe8] text-center text-xs">
            <div>
              <span className="text-[10px] text-[#5d6f6a] block">Blood Pressure</span>
              <span className="font-bold text-[#13231f]">{nextPatient.vitals?.bp || '114/74 mmHg'}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#5d6f6a] block">Heart Rate</span>
              <span className="font-bold text-[#13231f]">{nextPatient.vitals?.pulse || '80 bpm'}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#5d6f6a] block">Body Temp</span>
              <span className="font-bold text-[#13231f]">{nextPatient.vitals?.temp || '99.8 °F'}</span>
            </div>
          </div>

          {/* Action Buttons for Next Patient */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleStartConsultation}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#0e7c66] hover:bg-[#0a5f4e] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Consultation</span>
            </button>

            <button
              onClick={() => setSelectedPatientForRecords(nextPatient)}
              className="flex items-center gap-1 px-3 py-2.5 bg-[#e3f3ef] hover:bg-[#d0ece5] text-[#0e7c66] font-bold text-xs rounded-xl transition-colors shrink-0"
              title="View multiple past clinical records"
            >
              <History className="w-3.5 h-3.5" />
              <span>Past Records ({nextPatientRecords.length})</span>
            </button>

            {nextAppt && nextAppt.status !== 'completed' && (
              <button
                onClick={handleMarkConsulted}
                className="p-2.5 bg-[#e6f4ea] hover:bg-[#c2e7cc] text-[#2f9e44] rounded-xl transition-colors shrink-0"
                title="Mark as Consulted"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. CLINICAL ROUTING SHORTCUTS */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-[#5d6f6a] uppercase tracking-wider px-1">
          Clinical Management Shortcuts
        </h4>

        {/* Shortcut 1: Full Patient Queue & Cases */}
        <div
          onClick={() => navigate('doctor-cases')}
          className="bg-white hover:bg-[#f9fbfa] rounded-2xl p-4 border border-[#e2ebe8] shadow-xs flex items-center justify-between gap-3 cursor-pointer transition-all hover:border-[#0e7c66] group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#e3f3ef] text-[#0e7c66] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h5 className="text-sm font-bold text-[#13231f] group-hover:text-[#0e7c66] transition-colors">
                  Patient Queue & Cases
                </h5>
                <span className="text-[10px] font-bold bg-[#e3f3ef] text-[#0e7c66] px-2 py-0.5 rounded-full">
                  {waitingAppts.length} Waiting
                </span>
              </div>
              <p className="text-[11px] text-[#5d6f6a] truncate mt-0.5">
                View by Name / Case, search tokens 99+, triage sorting & full queue
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#5d6f6a] group-hover:text-[#0e7c66] shrink-0 group-hover:translate-x-0.5 transition-all" />
        </div>

        {/* Shortcut 2: Doctor Schedule & Appointments */}
        <div
          onClick={() => navigate('doctor-schedule')}
          className="bg-white hover:bg-[#f9fbfa] rounded-2xl p-4 border border-[#e2ebe8] shadow-xs flex items-center justify-between gap-3 cursor-pointer transition-all hover:border-[#0e7c66] group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#f2f6f5] text-[#13231f] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h5 className="text-sm font-bold text-[#13231f] group-hover:text-[#0e7c66] transition-colors">
                Appointments & Schedule
              </h5>
              <p className="text-[11px] text-[#5d6f6a] truncate mt-0.5">
                {todaysAppts.length} slots assigned today • View upcoming days
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#5d6f6a] group-hover:text-[#0e7c66] shrink-0 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>

      {/* 5. HIGH-PRIORITY TRIAGE ALERTS (Clean 2-item safety banner) */}
      {highRiskPatients.length > 0 && (
        <div className="bg-[#fff9ed] rounded-2xl p-4 border border-[#fae4b2] shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#ad7205]">
              <AlertTriangle className="w-4 h-4" />
              <span>High-Priority Clinical Triage Alerts</span>
            </div>
            <span className="text-[10px] font-bold text-[#ad7205] bg-white/70 px-2 py-0.5 rounded-full">
              Attention Required
            </span>
          </div>

          <div className="space-y-2">
            {highRiskPatients.map((hrPatient, idx) => {
              const hrRecords = getPatientClinicalRecords(hrPatient);
              return (
                <div
                  key={hrPatient.id}
                  className="bg-white/90 rounded-xl p-2.5 border border-[#fae4b2]/60 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-bold text-[#13231f] block truncate">
                      {hrPatient.name} ({hrPatient.age}y, {hrPatient.gender})
                    </span>
                    <span className="text-[11px] text-[#e5484d] font-semibold block truncate">
                      Alert: {hrPatient.allergies[0] || hrPatient.cond[0]}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedPatientForRecords(hrPatient)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-[#e3f3ef] hover:bg-[#d0ece5] text-[#0e7c66] font-bold text-[11px] rounded-lg shrink-0 transition-colors"
                  >
                    <History className="w-3 h-3" />
                    <span>Records ({hrRecords.length})</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Past Clinical Records Modal */}
      {selectedPatientForRecords && (
        <PatientPastRecordsModal
          patient={selectedPatientForRecords}
          onClose={() => setSelectedPatientForRecords(null)}
          onOpenCase={caseId => {
            setSelectedPatientForRecords(null);
            navigate('case-detail', { caseId, patientId: selectedPatientForRecords.id });
          }}
        />
      )}
    </div>
  );
};

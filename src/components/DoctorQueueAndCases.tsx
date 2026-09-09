import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Patient, MedicalCase, Appointment } from '../types';
import { getPatientClinicalRecords } from '../data/clinicalRecordsData';
import { PatientPastRecordsModal } from './PatientPastRecordsModal';
import {
  Search,
  Filter,
  ArrowUpDown,
  User,
  FileText,
  Activity,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Phone,
  Shield,
  Stethoscope,
  Pill,
  History,
  Sparkles,
  Eye,
  SlidersHorizontal,
  X,
  HeartPulse,
} from 'lucide-react';
import { fmtDate, today } from '../lib/utils';

export type QueueViewMode = 'name' | 'case';
export type SortOption = 'token' | 'urgency' | 'name-asc' | 'name-desc' | 'time' | 'age';
export type FilterOption = 'all' | 'today-queue' | 'pending-triage' | 'emergency' | 'completed';

interface DoctorQueueAndCasesProps {
  embeddedInProfile?: boolean;
  defaultViewMode?: QueueViewMode;
}

export const DoctorQueueAndCases: React.FC<DoctorQueueAndCasesProps> = ({ embeddedInProfile, defaultViewMode = 'name' }) => {
  const {
    patients,
    cases,
    appointments,
    currentUser,
    navigate,
    updateAppointmentStatus,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<QueueViewMode>(defaultViewMode);
  const [sortBy, setSortBy] = useState<SortOption>('token');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [selectedPatientForRecords, setSelectedPatientForRecords] = useState<Patient | null>(null);

  // Combine appointments and cases to form a unified queue representation
  const unifiedQueue = useMemo(() => {
    return patients.map((patient, index) => {
      // Find patient's appointment for today (if any)
      const appt = appointments.find(a => a.pid === patient.id && a.date === today()) ||
                   appointments.find(a => a.pid === patient.id);
      
      // Find patient's latest medical case
      const patientCases = cases.filter(c => c.pid === patient.id);
      const latestCase = patientCases[patientCases.length - 1];

      // Retrieve past clinical records
      const pastRecords = getPatientClinicalRecords(patient);

      // Determine severity / urgency
      let urgencyScore = 1; // 1 = routine, 2 = moderate, 3 = severe/emergency
      if (latestCase?.summary?.severity === 'Severe' || latestCase?.summary?.chief?.toLowerCase().includes('angina') || latestCase?.summary?.chief?.toLowerCase().includes('trauma')) {
        urgencyScore = 3;
      } else if (latestCase?.summary?.severity === 'Moderate' || (patient.vitals?.bp && patient.vitals.bp.includes('160/'))) {
        urgencyScore = 2;
      }

      const tokenNum = appt?.token ?? (99 + index);

      return {
        patient,
        appt,
        latestCase,
        pastRecords,
        urgencyScore,
        tokenNum,
      };
    });
  }, [patients, appointments, cases]);

  // Filter queue items
  const filteredQueue = useMemo(() => {
    let list = unifiedQueue;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(item => {
        const p = item.patient;
        const c = item.latestCase;
        const a = item.appt;

        return (
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          (p.phone && p.phone.includes(q)) ||
          (p.abhaId && p.abhaId.toLowerCase().includes(q)) ||
          p.cond.some(cond => cond.toLowerCase().includes(q)) ||
          (c && c.id.toLowerCase().includes(q)) ||
          (c && c.summary.chief.toLowerCase().includes(q)) ||
          (c && c.summary.severity.toLowerCase().includes(q)) ||
          (a && String(a.token).includes(q))
        );
      });
    }

    // Status filter
    if (filterBy === 'today-queue') {
      list = list.filter(item => item.appt && item.appt.date === today());
    } else if (filterBy === 'pending-triage') {
      list = list.filter(item => item.latestCase && (item.latestCase.status === 'intake' || item.latestCase.status === 'reviewed'));
    } else if (filterBy === 'emergency') {
      list = list.filter(item => item.urgencyScore === 3 || item.latestCase?.summary?.severity === 'Severe');
    } else if (filterBy === 'completed') {
      list = list.filter(item => item.appt?.status === 'completed' || item.latestCase?.status === 'completed');
    }

    // Sorting
    const sorted = [...list].sort((a, b) => {
      if (sortBy === 'token') {
        return a.tokenNum - b.tokenNum;
      }
      if (sortBy === 'urgency') {
        return b.urgencyScore - a.urgencyScore;
      }
      if (sortBy === 'name-asc') {
        return a.patient.name.localeCompare(b.patient.name);
      }
      if (sortBy === 'name-desc') {
        return b.patient.name.localeCompare(a.patient.name);
      }
      if (sortBy === 'time') {
        const timeA = a.appt?.slot || '23:59';
        const timeB = b.appt?.slot || '23:59';
        return timeA.localeCompare(timeB);
      }
      if (sortBy === 'age') {
        return b.patient.age - a.patient.age;
      }
      return 0;
    });

    return sorted;
  }, [unifiedQueue, searchQuery, filterBy, sortBy]);

  return (
    <div className="space-y-4">
      {/* Search & View Mode Header */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#5d6f6a] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by patient name, case ID, symptom, token, ABHA..."
            className="w-full pl-9 pr-9 py-2.5 bg-[#f2f6f5] border border-[#e2ebe8] focus:border-[#0e7c66] focus:bg-white rounded-xl text-xs text-[#13231f] placeholder:text-[#5d6f6a] outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5d6f6a] hover:text-[#13231f]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View By Controls & Sorting */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-start sm:items-center justify-between pt-1 border-t border-[#f2f6f5]">
          {/* View By Selector (View by Name vs View by Case) */}
          <div className="flex items-center gap-1 bg-[#f2f6f5] p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setViewMode('name')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'name'
                  ? 'bg-white text-[#0e7c66] shadow-xs'
                  : 'text-[#5d6f6a] hover:text-[#13231f]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              View by Name
            </button>
            <button
              onClick={() => setViewMode('case')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'case'
                  ? 'bg-white text-[#0e7c66] shadow-xs'
                  : 'text-[#5d6f6a] hover:text-[#13231f]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              View by Case
            </button>
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#5d6f6a] shrink-0" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="px-2.5 py-1.5 bg-[#f2f6f5] border border-[#e2ebe8] rounded-xl text-xs font-medium text-[#13231f] outline-none cursor-pointer hover:bg-[#e2ebe8] transition-colors"
            >
              <option value="token">Sort: Token / Queue #</option>
              <option value="urgency">Sort: Triage Urgency (High to Low)</option>
              <option value="name-asc">Sort: Name (A → Z)</option>
              <option value="name-desc">Sort: Name (Z → A)</option>
              <option value="time">Sort: Appointment Slot</option>
              <option value="age">Sort: Age (Seniority)</option>
            </select>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setFilterBy('all')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-colors ${
              filterBy === 'all'
                ? 'bg-[#0e7c66] text-white'
                : 'bg-[#f2f6f5] text-[#5d6f6a] hover:bg-[#e2ebe8]'
            }`}
          >
            All Patients ({unifiedQueue.length})
          </button>
          <button
            onClick={() => setFilterBy('today-queue')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-colors ${
              filterBy === 'today-queue'
                ? 'bg-[#0e7c66] text-white'
                : 'bg-[#f2f6f5] text-[#5d6f6a] hover:bg-[#e2ebe8]'
            }`}
          >
            Today's OPD Queue (
            {unifiedQueue.filter(i => i.appt && i.appt.date === today()).length}
            )
          </button>
          <button
            onClick={() => setFilterBy('pending-triage')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-colors ${
              filterBy === 'pending-triage'
                ? 'bg-[#0e7c66] text-white'
                : 'bg-[#f2f6f5] text-[#5d6f6a] hover:bg-[#e2ebe8]'
            }`}
          >
            Pending Triage (
            {
              unifiedQueue.filter(
                i =>
                  i.latestCase &&
                  (i.latestCase.status === 'intake' || i.latestCase.status === 'reviewed')
              ).length
            }
            )
          </button>
          <button
            onClick={() => setFilterBy('emergency')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-colors ${
              filterBy === 'emergency'
                ? 'bg-[#e5484d] text-white'
                : 'bg-[#fdeaea] text-[#e5484d] hover:bg-[#fbd0d0]'
            }`}
          >
            Urgent / High ({unifiedQueue.filter(i => i.urgencyScore === 3).length})
          </button>
          <button
            onClick={() => setFilterBy('completed')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-colors ${
              filterBy === 'completed'
                ? 'bg-[#2f9e44] text-white'
                : 'bg-[#e6f4e9] text-[#2f9e44] hover:bg-[#d3f9d8]'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Queue Counter and Summary */}
      <div className="flex items-center justify-between px-1 text-xs text-[#5d6f6a]">
        <span>
          Showing <strong>{filteredQueue.length}</strong> of {unifiedQueue.length}{' '}
          {viewMode === 'name' ? 'patients' : 'cases'}
        </span>
        <span className="text-[11px]">
          Mode:{' '}
          <strong className="text-[#0e7c66]">
            {viewMode === 'name' ? 'Patient-Centric' : 'Case-Centric'}
          </strong>
        </span>
      </div>

      {/* List of Patients / Cases */}
      {filteredQueue.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-[#e2ebe8] shadow-xs space-y-2">
          <Search className="w-8 h-8 text-[#5d6f6a] mx-auto opacity-40" />
          <p className="text-xs font-bold text-[#13231f]">No matching patients or cases found</p>
          <p className="text-[11px] text-[#5d6f6a]">
            Try adjusting your search query or switching filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterBy('all');
            }}
            className="mt-2 text-xs font-semibold text-[#0e7c66] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQueue.map(item => {
            const { patient, appt, latestCase, pastRecords, urgencyScore } = item;

            if (viewMode === 'name') {
              /* ============================================================
                 VIEW BY NAME (Patient-Centric Card)
                 ============================================================ */
              return (
                <div
                  key={patient.id}
                  className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs hover:border-[#0e7c66] transition-all space-y-3"
                >
                  {/* Top Row: Token, Patient Name, Urgency Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#0e7c66] text-white flex flex-col items-center justify-center font-bold shadow-xs shrink-0">
                        <span className="text-[9px] uppercase leading-none opacity-80">Token</span>
                        <span className="text-xs leading-none">
                          #{appt?.token || item.tokenNum}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm font-bold text-[#13231f]">{patient.name}</h4>
                          <span className="text-[10px] font-mono text-[#5d6f6a] bg-[#f2f6f5] px-1.5 py-0.5 rounded">
                            {patient.id}
                          </span>
                        </div>
                        <p className="text-xs text-[#5d6f6a]">
                          {patient.gender} • {patient.age} yrs • Blood Group{' '}
                          <strong className="text-[#0e7c66]">{patient.blood}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {urgencyScore === 3 ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fdeaea] text-[#e5484d]">
                          <AlertTriangle className="w-3 h-3" /> Emergency / Severe
                        </span>
                      ) : urgencyScore === 2 ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fdf3dd] text-[#ad7205]">
                          Moderate
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e3f3ef] text-[#0e7c66]">
                          Routine OPD
                        </span>
                      )}
                      {appt?.slot && (
                        <span className="text-[10px] text-[#5d6f6a] block mt-0.5">
                          Slot: {appt.slot}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Vitals Snapshot & Conditions */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#f2f6f5] p-2.5 rounded-xl">
                    <div>
                      <span className="text-[9px] font-bold text-[#5d6f6a] uppercase block">
                        Recorded Vitals
                      </span>
                      <p className="text-[#13231f] font-medium truncate">
                        BP: {patient.vitals?.bp || '120/80'} • SpO2:{' '}
                        {patient.vitals?.spo2 || '98%'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-[#5d6f6a] uppercase block">
                        Known Conditions
                      </span>
                      <p className="text-[#13231f] truncate">
                        {patient.cond.length > 0 ? patient.cond.join(', ') : 'None documented'}
                      </p>
                    </div>
                  </div>

                  {/* Active Case Complaint (if present) */}
                  {latestCase && (
                    <div className="p-2.5 bg-[#fafcfb] border border-[#e2ebe8] rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#0e7c66] uppercase flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Active Case #{latestCase.id}
                        </span>
                        <span className="text-[10px] text-[#5d6f6a]">
                          {latestCase.summary.duration}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-[#13231f]">
                        {latestCase.summary.chief}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons: Past Clinical Records & Open EHR */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#f2f6f5]">
                    {/* Past Records Trigger */}
                    <button
                      onClick={() => setSelectedPatientForRecords(patient)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#e3f3ef] hover:bg-[#d0ece5] text-[#0e7c66] font-bold text-xs rounded-xl transition-colors"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>Past Records ({pastRecords.length})</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {latestCase && (
                        <button
                          onClick={() =>
                            navigate('case-detail', {
                              caseId: latestCase.id,
                              patientId: patient.id,
                            })
                          }
                          className="px-2.5 py-1.5 bg-[#f2f6f5] hover:bg-[#e2ebe8] text-[#13231f] font-semibold text-xs rounded-xl transition-colors"
                        >
                          Review Case
                        </button>
                      )}
                      <button
                        onClick={() =>
                          navigate('patient-detail', { patientId: patient.id })
                        }
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#0e7c66] hover:bg-[#0a5f4e] text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
                      >
                        <span>EHR & Consult</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            } else {
              /* ============================================================
                 VIEW BY CASE (Case-Centric Card)
                 ============================================================ */
              const currentCase =
                latestCase || {
                  id: `CASE-T-${patient.id}`,
                  pid: patient.id,
                  status: 'intake' as const,
                  ts: today(),
                  summary: {
                    chief: patient.cond[0] || 'General Consultation & Routine OPD Check',
                    duration: 'Ongoing',
                    severity: (urgencyScore === 3
                      ? 'Severe'
                      : urgencyScore === 2
                      ? 'Moderate'
                      : 'Mild') as any,
                  },
                  notes: [],
                };

              return (
                <div
                  key={currentCase.id}
                  className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs hover:border-[#0e7c66] transition-all space-y-3"
                >
                  {/* Top Row: Case ID, Severity Badge, Token */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0e7c66] bg-[#e3f3ef] px-2 py-0.5 rounded-full">
                          Case #{currentCase.id}
                        </span>
                        <span className="text-[10px] font-bold text-[#5d6f6a] bg-[#f2f6f5] px-1.5 py-0.5 rounded">
                          Token #{appt?.token || item.tokenNum}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#13231f] mt-1">
                        {patient.name} ({patient.age}y, {patient.gender})
                      </h4>
                      <p className="text-[11px] text-[#5d6f6a]">
                        ABHA: {patient.abhaId || '91-XXXX-XXXX'} • Ph: {patient.phone}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          currentCase.summary.severity === 'Severe'
                            ? 'bg-[#fdeaea] text-[#e5484d]'
                            : currentCase.summary.severity === 'Moderate'
                            ? 'bg-[#fdf3dd] text-[#ad7205]'
                            : 'bg-[#e3f3ef] text-[#0e7c66]'
                        }`}
                      >
                        {currentCase.summary.severity} Triage
                      </span>
                      <span className="text-[10px] text-[#5d6f6a] block mt-0.5">
                        Status: {currentCase.status}
                      </span>
                    </div>
                  </div>

                  {/* Chief Complaint Details */}
                  <div className="p-3 bg-[#f2f6f5] rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-[#5d6f6a] uppercase">
                      Chief Complaint & Clinical Intake
                    </span>
                    <p className="text-xs font-bold text-[#13231f]">
                      {currentCase.summary.chief}
                    </p>
                    <p className="text-[11px] text-[#5d6f6a]">
                      Duration: {currentCase.summary.duration} • Allergies:{' '}
                      {patient.allergies.join(', ') || 'None reported'}
                    </p>
                  </div>

                  {/* Vitals & Notes count */}
                  <div className="flex items-center justify-between text-[11px] text-[#5d6f6a] px-1">
                    <span className="flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-[#0e7c66]" />
                      BP: {patient.vitals?.bp || '120/80'} | Pulse: {patient.vitals?.pulse || '72'}
                    </span>
                    <span>
                      {currentCase.notes?.length || 0} Doctor Notes • {pastRecords.length} Past Visits
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#f2f6f5]">
                    {/* View Past Records */}
                    <button
                      onClick={() => setSelectedPatientForRecords(patient)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#e3f3ef] hover:bg-[#d0ece5] text-[#0e7c66] font-bold text-xs rounded-xl transition-colors"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>Past Records ({pastRecords.length})</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          navigate('patient-detail', { patientId: patient.id })
                        }
                        className="px-2.5 py-1.5 bg-[#f2f6f5] hover:bg-[#e2ebe8] text-[#13231f] font-semibold text-xs rounded-xl transition-colors"
                      >
                        Patient EHR
                      </button>
                      <button
                        onClick={() =>
                          navigate('case-detail', {
                            caseId: currentCase.id,
                            patientId: patient.id,
                          })
                        }
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#0e7c66] hover:bg-[#0a5f4e] text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
                      >
                        <span>Open Triage Case</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}

      {/* Past Clinical Records Modal */}
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

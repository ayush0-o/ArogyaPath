import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  PlusCircle,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  Search,
  ChevronRight,
  Stethoscope,
  Activity,
  User,
  Shield,
  Phone,
} from 'lucide-react';
import { fmtDate, today } from '../lib/utils';
import { DOCTORS } from '../data/staticData';
import { DoctorQueueAndCases } from './DoctorQueueAndCases';
import { PatientPastRecordsModal } from './PatientPastRecordsModal';
import { getPatientClinicalRecords } from '../data/clinicalRecordsData';

// 1. Patient Detail Screen (Full EHR View)
export const PatientDetailScreen: React.FC = () => {
  const { patients, cases, appointments, screenParams, navigate } = useApp();
  const [showPastRecords, setShowPastRecords] = useState(false);

  const patientId = screenParams.patientId || 'P-1001';
  const patient = patients.find(p => p.id === patientId) || patients[0];

  const patientCases = cases.filter(c => c.pid === patient?.id);
  const patientAppts = appointments.filter(a => a.pid === patient?.id);
  const pastClinicalRecords = patient ? getPatientClinicalRecords(patient) : [];

  if (!patient) {
    return <div className="p-4 text-center text-xs text-[#5d6f6a]">Patient not found.</div>;
  }

  return (
    <div className="space-y-4 pb-20 pt-2 max-w-md mx-auto">
      {/* Patient Master Card */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#0e7c66] bg-[#e3f3ef] px-2 py-0.5 rounded">
              {patient.id}
            </span>
            <h2 className="text-base font-bold text-[#13231f] mt-1">{patient.name}</h2>
            <p className="text-xs text-[#5d6f6a]">
              {patient.gender}, {patient.age} yrs • Blood Group {patient.blood}
            </p>
          </div>
          <a
            href={`tel:${patient.phone}`}
            className="w-9 h-9 rounded-full bg-[#e3f3ef] text-[#0e7c66] flex items-center justify-center"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        <div className="p-2.5 bg-[#f2f6f5] rounded-xl text-xs space-y-1">
          <p className="text-[#5d6f6a]">
            Address: <span className="text-[#13231f] font-medium">{patient.addr}</span>
          </p>
          <p className="text-[#5d6f6a]">
            Emergency: <span className="text-[#13231f] font-medium">{patient.emg.name} ({patient.emg.phone})</span>
          </p>
        </div>

        {patient.allergies.length > 0 && (
          <div className="p-2 bg-[#fdeaea] rounded-xl text-xs text-[#e5484d]">
            <strong>Allergies:</strong> {patient.allergies.join(', ')}
          </div>
        )}

        {patient.cond.length > 0 && (
          <div className="p-2 bg-[#fdf3dd] rounded-xl text-xs text-[#ad7205]">
            <strong>Chronic Conditions:</strong> {patient.cond.join(', ')}
          </div>
        )}

        {/* Past Clinical Records Button */}
        <div className="pt-2 border-t border-[#e2ebe8] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#13231f] block">Longitudinal Health Records</span>
            <span className="text-[11px] text-[#5d6f6a]">{pastClinicalRecords.length} recorded clinical encounters</span>
          </div>
          <button
            onClick={() => setShowPastRecords(true)}
            className="px-3 py-1.5 bg-[#e3f3ef] hover:bg-[#d0ece5] text-[#0e7c66] text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            View Past Records ({pastClinicalRecords.length})
          </button>
        </div>
      </div>

      {/* Case History */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#5d6f6a]">
          Clinical Cases & Consults ({patientCases.length})
        </h3>
        {patientCases.map(c => (
          <div
            key={c.id}
            onClick={() => navigate('case-detail', { caseId: c.id })}
            className="p-3 rounded-xl border border-[#e2ebe8] hover:border-[#0e7c66] transition-all cursor-pointer flex justify-between items-center"
          >
            <div>
              <h4 className="text-xs font-bold text-[#13231f]">{c.complaint}</h4>
              <p className="text-[11px] text-[#5d6f6a]">{fmtDate(c.created)}</p>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#f2f6f5]">
              {c.status}
            </span>
          </div>
        ))}
      </div>

      {/* Past Clinical Records Modal */}
      {showPastRecords && (
        <PatientPastRecordsModal
          patient={patient}
          onClose={() => setShowPastRecords(false)}
        />
      )}
    </div>
  );
};

// 2. Doctor Cases List Screen
export const DoctorCasesScreen: React.FC = () => {
  return (
    <div className="space-y-4 pb-20 pt-2 max-w-md mx-auto">
      <DoctorQueueAndCases defaultViewMode="case" />
    </div>
  );
};

// 3. Doctor Schedule Screen
export const DoctorScheduleScreen: React.FC = () => {
  const { appointments, currentUser, updateAppointmentStatus, navigate } = useApp();
  const myDocId = currentUser?.did || 'd1';

  const myAppts = appointments.filter(a => a.doc === myDocId);

  return (
    <div className="space-y-4 pb-20 pt-2 max-w-md mx-auto">
      <h2 className="text-sm font-bold text-[#13231f]">
        Clinical Appointments Schedule ({myAppts.length})
      </h2>

      <div className="space-y-2.5">
        {myAppts.map(appt => (
          <div
            key={appt.id}
            className="p-3.5 bg-white rounded-2xl border border-[#e2ebe8] shadow-xs space-y-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#0e7c66] bg-[#e3f3ef] px-2 py-0.5 rounded-md">
                  {appt.token ? `Token #${appt.token}` : `Ref ${appt.reg}`}
                </span>
                <h4 className="text-xs font-bold text-[#13231f] mt-1">
                  {fmtDate(appt.date)} • Slot {appt.time} hrs
                </h4>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#e3f3ef] text-[#0e7c66]">
                {appt.status}
              </span>
            </div>

            <div className="pt-2 border-t border-[#f2f6f5] flex gap-2">
              {appt.status !== 'completed' && (
                <button
                  onClick={() => updateAppointmentStatus(appt.id, 'completed')}
                  className="flex-1 py-1.5 bg-[#0e7c66] hover:bg-[#0a5f4e] text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Mark Consult Completed
                </button>
              )}
              {appt.case && (
                <button
                  onClick={() => navigate('case-detail', { caseId: appt.case })}
                  className="px-3 py-1.5 bg-[#f2f6f5] text-[#13231f] text-xs font-semibold rounded-xl"
                >
                  Open Case
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. Worker Patients Screen
export const WorkerPatientsScreen: React.FC = () => {
  const { patients, navigate } = useApp();
  const [search, setSearch] = useState('');

  const filtered = patients.filter(
    p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.addr.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-20 pt-2 max-w-md mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-bold text-[#13231f]">Village Patients Directory</h2>
        <button
          onClick={() => navigate('register-patient')}
          className="px-3 py-1.5 bg-[#0e7c66] text-white text-xs font-semibold rounded-xl flex items-center gap-1 shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Enroll New</span>
        </button>
      </div>

      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Filter by name, mobile, address..."
        className="w-full bg-white border border-[#e2ebe8] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2f6fed]"
      />

      <div className="space-y-2">
        {filtered.map(p => (
          <div
            key={p.id}
            onClick={() => navigate('patient-detail', { patientId: p.id })}
            className="p-3 bg-white rounded-xl border border-[#e2ebe8] hover:border-[#2f6fed] transition-all cursor-pointer flex justify-between items-center"
          >
            <div>
              <h4 className="text-xs font-bold text-[#13231f]">{p.name}</h4>
              <p className="text-[11px] text-[#5d6f6a]">
                {p.gender}, {p.age}y • {p.phone} • {p.addr}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#5d6f6a]" />
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. Worker Cases (Field Records) Screen
export const WorkerCasesScreen: React.FC = () => {
  const { cases, patients, syncOfflineQueue, navigate } = useApp();
  const [syncing, setSyncing] = useState(false);

  const unsyncedCount = cases.filter(c => c.status === 'offlineSaved').length;

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncOfflineQueue();
    } finally {
      setTimeout(() => setSyncing(false), 800);
    }
  };

  return (
    <div className="space-y-4 pb-20 pt-2 max-w-md mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-bold text-[#13231f]">
          Field Intake Records ({cases.length})
        </h2>
        {unsyncedCount > 0 && (
          <button
            onClick={handleSync}
            disabled={syncing}
            className="px-3 py-1 bg-[#2f6fed] text-white text-xs font-semibold rounded-xl shadow-xs"
          >
            {syncing ? 'Syncing...' : `Sync (${unsyncedCount})`}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {cases.map(c => {
          const pat = patients.find(p => p.id === c.pid);
          return (
            <div
              key={c.id}
              onClick={() => navigate('case-detail', { caseId: c.id })}
              className="p-3 bg-white rounded-xl border border-[#e2ebe8] hover:border-[#2f6fed] transition-all cursor-pointer flex justify-between items-center"
            >
              <div>
                <span className="text-[10px] font-mono text-[#2f6fed] bg-[#e8effd] px-1 py-0.5 rounded">
                  {c.id}
                </span>
                <h4 className="text-xs font-bold text-[#13231f] mt-0.5">{c.complaint}</h4>
                <p className="text-[11px] text-[#5d6f6a]">
                  Patient: {pat?.name} • {fmtDate(c.created)}
                </p>
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  c.status === 'offlineSaved'
                    ? 'bg-[#fdf3dd] text-[#e8a013]'
                    : 'bg-[#e3f3ef] text-[#0e7c66]'
                }`}
              >
                {c.status === 'offlineSaved' ? 'Offline' : 'Synced'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

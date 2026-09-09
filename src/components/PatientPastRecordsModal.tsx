import React from 'react';
import { Patient, ClinicalRecord } from '../types';
import { getPatientClinicalRecords } from '../data/clinicalRecordsData';
import {
  X,
  Calendar,
  Building2,
  User,
  Activity,
  AlertTriangle,
  Pill,
  FileText,
  Clock,
  Printer,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
} from 'lucide-react';
import { fmtDate } from '../lib/utils';

interface PatientPastRecordsModalProps {
  patient: Patient;
  onClose: () => void;
  onOpenCase?: (caseId: string) => void;
}

export const PatientPastRecordsModal: React.FC<PatientPastRecordsModalProps> = ({
  patient,
  onClose,
  onOpenCase,
}) => {
  const records = getPatientClinicalRecords(patient);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#e2ebe8] shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#083a30] to-[#0e7c66] text-white flex items-start justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                Past Clinical EHR Records
              </span>
              <span className="text-[10px] font-mono text-[#48e5c2] font-semibold">
                {patient.id}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight">{patient.name}</h3>
            <p className="text-xs text-white/80">
              {patient.gender}, {patient.age} yrs • Blood Group{' '}
              <span className="font-bold text-[#48e5c2]">{patient.blood}</span> • ABHA:{' '}
              <span className="font-mono text-[11px]">{patient.abhaId || '91-XXXX-XXXX'}</span>
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              title="Print Clinical Records"
              className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Patient Clinical Baseline Pill Bar */}
        <div className="p-3 bg-[#f2f6f5] border-b border-[#e2ebe8] text-xs shrink-0 space-y-1.5">
          {/* Documented Allergies */}
          {patient.allergies && patient.allergies.length > 0 && (
            <div className="flex items-center gap-1.5 text-[#e5484d] bg-[#fdeaea] px-2.5 py-1 rounded-lg text-[11px] font-medium">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>
                <strong>Allergies:</strong> {patient.allergies.join(', ')}
              </span>
            </div>
          )}

          {/* Chronic Conditions */}
          {patient.cond && patient.cond.length > 0 && (
            <div className="flex items-center gap-1.5 text-[#ad7205] bg-[#fdf3dd] px-2.5 py-1 rounded-lg text-[11px] font-medium">
              <HeartPulse className="w-3.5 h-3.5 shrink-0" />
              <span>
                <strong>Chronic Conditions:</strong> {patient.cond.join(' • ')}
              </span>
            </div>
          )}

          {/* Current Maintenance Medications */}
          {patient.meds && patient.meds.length > 0 && (
            <div className="flex items-center gap-1.5 text-[#0e7c66] bg-[#e3f3ef] px-2.5 py-1 rounded-lg text-[11px]">
              <Pill className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                <strong>Active Meds:</strong> {patient.meds.join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Clinical Encounters Timeline (Scrollable) */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#13231f] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#0e7c66]" />
              Historical Encounters ({records.length} Documented)
            </h4>
            <span className="text-[10px] text-[#5d6f6a] bg-white px-2 py-0.5 rounded-full border border-[#e2ebe8]">
              NHA ABDM Federated
            </span>
          </div>

          {records.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#5d6f6a] bg-[#f2f6f5] rounded-2xl">
              No previous clinical encounters recorded for this patient.
            </div>
          ) : (
            <div className="relative pl-4 space-y-5 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#d0ece5]">
              {records.map((rec, index) => {
                const isEmergency = rec.encounterType === 'Emergency Triage';
                return (
                  <div key={rec.id} className="relative space-y-2">
                    {/* Timeline Node Bullet */}
                    <div
                      className={`absolute -left-4 top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-xs ${
                        isEmergency ? 'bg-[#e5484d]' : 'bg-[#0e7c66]'
                      }`}
                    />

                    {/* Encounter Card */}
                    <div className="bg-[#fafcfb] border border-[#e2ebe8] rounded-2xl p-4 shadow-xs space-y-3 hover:border-[#0e7c66] transition-colors">
                      {/* Top Header of Encounter */}
                      <div className="flex items-start justify-between gap-2 border-b border-[#e2ebe8] pb-2.5">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                isEmergency
                                  ? 'bg-[#fdeaea] text-[#e5484d]'
                                  : 'bg-[#e3f3ef] text-[#0e7c66]'
                              }`}
                            >
                              {rec.encounterType}
                            </span>
                            <span className="text-[11px] font-mono text-[#5d6f6a]">
                              {rec.id}
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-[#13231f] mt-1">
                            {rec.diagnosis}
                          </h5>
                          {rec.icdCode && (
                            <span className="text-[10px] text-[#5d6f6a] font-mono">
                              ICD-10: {rec.icdCode}
                            </span>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-[#13231f] block">
                            {fmtDate(rec.date)}
                          </span>
                          <span className="text-[10px] text-[#5d6f6a] flex items-center justify-end gap-1">
                            <Clock className="w-3 h-3" />
                            {rec.date}
                          </span>
                        </div>
                      </div>

                      {/* Attending Doctor & Facility */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#5d6f6a] bg-white p-2.5 rounded-xl border border-[#e2ebe8]">
                        <div className="flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-[#0e7c66] shrink-0" />
                          <span className="truncate">
                            <strong>Doctor:</strong> {rec.doctor.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-[#0e7c66] shrink-0" />
                          <span className="truncate">
                            <strong>Facility:</strong> {rec.facility}
                          </span>
                        </div>
                      </div>

                      {/* Chief Complaint */}
                      <div className="text-xs space-y-0.5">
                        <span className="text-[10px] font-bold text-[#5d6f6a] uppercase">
                          Chief Complaint
                        </span>
                        <p className="text-[#13231f] italic bg-[#f2f6f5] p-2 rounded-lg text-[11px]">
                          "{rec.chiefComplaint}"
                        </p>
                      </div>

                      {/* Encounter Vitals */}
                      {rec.vitals && Object.keys(rec.vitals).length > 0 && (
                        <div className="text-xs space-y-1">
                          <span className="text-[10px] font-bold text-[#5d6f6a] uppercase flex items-center gap-1">
                            <Activity className="w-3 h-3 text-[#0e7c66]" /> Recorded Vitals
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {rec.vitals.bp && (
                              <span className="px-2 py-0.5 bg-white border border-[#e2ebe8] rounded-md text-[10px] font-medium text-[#13231f]">
                                BP: <strong>{rec.vitals.bp}</strong>
                              </span>
                            )}
                            {rec.vitals.pulse && (
                              <span className="px-2 py-0.5 bg-white border border-[#e2ebe8] rounded-md text-[10px] font-medium text-[#13231f]">
                                Pulse: <strong>{rec.vitals.pulse}</strong>
                              </span>
                            )}
                            {rec.vitals.spo2 && (
                              <span className="px-2 py-0.5 bg-white border border-[#e2ebe8] rounded-md text-[10px] font-medium text-[#13231f]">
                                SpO2: <strong>{rec.vitals.spo2}</strong>
                              </span>
                            )}
                            {rec.vitals.temp && (
                              <span className="px-2 py-0.5 bg-white border border-[#e2ebe8] rounded-md text-[10px] font-medium text-[#13231f]">
                                Temp: <strong>{rec.vitals.temp}</strong>
                              </span>
                            )}
                            {rec.vitals.glucose && (
                              <span className="px-2 py-0.5 bg-white border border-[#e2ebe8] rounded-md text-[10px] font-medium text-[#13231f]">
                                Sugar: <strong>{rec.vitals.glucose}</strong>
                              </span>
                            )}
                            {rec.vitals.weight && (
                              <span className="px-2 py-0.5 bg-white border border-[#e2ebe8] rounded-md text-[10px] font-medium text-[#13231f]">
                                Wt: <strong>{rec.vitals.weight}</strong>
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Investigations / Labs */}
                      {rec.investigations && rec.investigations.length > 0 && (
                        <div className="text-xs space-y-1">
                          <span className="text-[10px] font-bold text-[#5d6f6a] uppercase">
                            Diagnostic Investigations & Labs
                          </span>
                          <div className="space-y-1">
                            {rec.investigations.map((inv, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between p-1.5 bg-white border border-[#e2ebe8] rounded-lg text-[11px]"
                              >
                                <span className="font-medium text-[#13231f]">{inv.testName}</span>
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`font-bold font-mono ${
                                      inv.flag === 'abnormal' || inv.flag === 'critical'
                                        ? 'text-[#e5484d]'
                                        : 'text-[#13231f]'
                                    }`}
                                  >
                                    {inv.result}
                                  </span>
                                  {inv.normalRange && (
                                    <span className="text-[9px] text-[#5d6f6a]">
                                      ({inv.normalRange})
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Prescribed Medications */}
                      {rec.medications && rec.medications.length > 0 && (
                        <div className="text-xs space-y-1">
                          <span className="text-[10px] font-bold text-[#5d6f6a] uppercase flex items-center gap-1">
                            <Pill className="w-3 h-3 text-[#0e7c66]" /> Prescriptions Issued
                          </span>
                          <div className="space-y-1">
                            {rec.medications.map((med, mIdx) => (
                              <div
                                key={mIdx}
                                className="p-2 bg-[#f2f6f5] rounded-lg border border-[#e2ebe8] text-[11px] flex justify-between items-start"
                              >
                                <div>
                                  <span className="font-bold text-[#13231f] block">
                                    {med.drug}
                                  </span>
                                  <span className="text-[#5d6f6a] text-[10px]">
                                    {med.frequency} • {med.duration}
                                  </span>
                                </div>
                                <span className="text-[10px] text-[#0e7c66] font-medium text-right max-w-[140px]">
                                  {med.instructions}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Clinical Notes & Doctor Advice */}
                      <div className="text-xs p-2.5 bg-white rounded-xl border border-[#e2ebe8] space-y-1">
                        <span className="text-[10px] font-bold text-[#5d6f6a] uppercase block">
                          Doctor's Clinical Notes
                        </span>
                        <p className="text-[11px] text-[#13231f] leading-relaxed">
                          {rec.clinicalNotes}
                        </p>
                        {rec.followUpAdvice && (
                          <p className="text-[10px] text-[#0e7c66] font-semibold pt-1 border-t border-[#f2f6f5]">
                            Follow-up Advice: {rec.followUpAdvice}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-[#fafcfb] border-t border-[#e2ebe8] flex items-center justify-between shrink-0">
          <span className="text-[10px] text-[#5d6f6a] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0e7c66]" /> Digitally signed by NMC Medical Officer
          </span>
          <button
            onClick={onClose}
            className="py-2 px-4 bg-[#0e7c66] hover:bg-[#0a5f4e] text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
          >
            Close Records
          </button>
        </div>
      </div>
    </div>
  );
};

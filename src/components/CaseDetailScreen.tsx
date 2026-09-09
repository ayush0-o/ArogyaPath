import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  User,
  Calendar,
  Clock,
  PlusCircle,
  CheckCircle,
  MessageSquare,
  ChevronRight,
  Shield,
  Stethoscope,
} from 'lucide-react';
import { fmtDate, today, addDays } from '../lib/utils';

export const CaseDetailScreen: React.FC = () => {
  const { cases, patients, currentUser, addDoctorNote, setFollowUp, screenParams, navigate } =
    useApp();

  const caseId = screenParams.caseId || cases[0]?.id;
  const currentCase = cases.find(c => c.id === caseId) || cases[0];

  const [newNote, setNewNote] = useState('');
  const [followupDate, setFollowupDate] = useState(addDays(7));
  const [followupNote, setFollowupNote] = useState('Routine review and symptom follow-up');
  const [showFollowupForm, setShowFollowupForm] = useState(false);

  if (!currentCase) {
    return (
      <div className="p-4 text-center">
        <p className="text-xs text-[#5d6f6a]">Case not found.</p>
      </div>
    );
  }

  const patient = patients.find(p => p.id === currentCase.pid);
  const isDoctor = currentUser?.role === 'doctor';
  const s = currentCase.summary;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addDoctorNote(currentCase.id, newNote.trim());
    setNewNote('');
  };

  const handleSaveFollowup = (e: React.FormEvent) => {
    e.preventDefault();
    setFollowUp(currentCase.id, followupDate, followupNote);
    setShowFollowupForm(false);
  };

  return (
    <div className="space-y-4 pb-20 pt-2 max-w-md mx-auto">
      {/* Patient header info */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0e7c66] bg-[#e3f3ef] px-2 py-0.5 rounded-full inline-block mb-1">
            Case #{currentCase.id}
          </span>
          <h3 className="text-sm font-bold text-[#13231f]">{patient?.name || 'Patient'}</h3>
          <p className="text-xs text-[#5d6f6a]">
            {patient?.gender} • {patient?.age} yrs • Blood Group {patient?.blood}
          </p>
        </div>

        <button
          onClick={() => navigate('patient-detail', { patientId: patient?.id })}
          className="px-3 py-1.5 bg-[#f2f6f5] hover:bg-[#e2ebe8] text-[#13231f] text-xs font-semibold rounded-xl transition-colors"
        >
          View EHR
        </button>
      </div>

      {/* Structured Clinical Intake Summary */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#5d6f6a]">
            Structured Case Parameters
          </h4>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              currentCase.status === 'completed'
                ? 'bg-[#e6f4e9] text-[#2f9e44]'
                : currentCase.status === 'reviewed'
                ? 'bg-[#e3f3ef] text-[#0e7c66]'
                : 'bg-[#fdf3dd] text-[#e8a013]'
            }`}
          >
            {currentCase.status}
          </span>
        </div>

        <div className="p-3 bg-[#f2f6f5] rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-[#5d6f6a] uppercase">Chief Complaint</span>
          <p className="text-xs font-bold text-[#13231f]">{s.chief}</p>
          <p className="text-[11px] text-[#5d6f6a]">
            Duration: {s.duration} • Severity: {s.severity}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-[#f2f6f5] rounded-xl">
            <span className="text-[10px] text-[#5d6f6a] block">Confirmed Symptoms</span>
            <span className="font-semibold text-[#13231f]">
              {s.symptoms.join(', ') || 'None noted'}
            </span>
          </div>
          <div className="p-2.5 bg-[#f2f6f5] rounded-xl">
            <span className="text-[10px] text-[#5d6f6a] block">Current Medications</span>
            <span className="font-semibold text-[#13231f]">{s.meds || 'None'}</span>
          </div>
        </div>

        {patient?.allergies && patient.allergies.length > 0 && (
          <div className="p-2.5 bg-[#fdeaea] rounded-xl text-xs flex items-center gap-2 text-[#e5484d]">
            <Shield className="w-4 h-4 shrink-0" />
            <span>
              <strong>Allergy Alert:</strong> {patient.allergies.join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* Original Intake Conversation Transcript */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#5d6f6a]">
          Original Patient Intake Dialogue
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {currentCase.original.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-xl text-[11px] ${
                msg.who === 'Patient'
                  ? 'bg-[#e3f3ef] text-[#0a5f4e] ml-4'
                  : 'bg-[#f2f6f5] text-[#13231f] mr-4'
              }`}
            >
              <span className="font-bold block text-[10px] uppercase">{msg.who}:</span>
              {msg.text}
            </div>
          ))}
        </div>
      </div>

      {/* Doctor Clinical Notes / Prescription */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#5d6f6a]">
            Verified Doctor Notes & Rx ({currentCase.notes.length})
          </h4>
        </div>

        {currentCase.notes.length === 0 ? (
          <p className="text-xs text-[#5d6f6a] py-2 text-center">
            No clinical notes added yet.
          </p>
        ) : (
          <div className="space-y-2">
            {currentCase.notes.map((note, i) => (
              <div key={i} className="p-3 bg-[#f2f6f5] rounded-xl text-xs space-y-1">
                <div className="flex justify-between items-center text-[10px] text-[#5d6f6a]">
                  <span className="font-bold text-[#13231f]">{note.by}</span>
                  <span>{fmtDate(note.at)}</span>
                </div>
                <p className="text-[#13231f] font-medium">{note.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Doctor add note form */}
        {isDoctor && (
          <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-[#e2ebe8]">
            <label className="text-[11px] font-bold text-[#13231f] block">
              Add Verified Doctor Observation / Rx:
            </label>
            <textarea
              rows={2}
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="e.g. Advised rest, hydration, Tab Paracetamol 650mg TDS x 3 days."
              className="w-full bg-[#f2f6f5] border border-[#e2ebe8] rounded-xl p-2.5 text-xs text-[#13231f] focus:outline-none focus:border-[#0e7c66]"
            />
            <button
              type="submit"
              disabled={!newNote.trim()}
              className="px-3 py-1.5 bg-[#0e7c66] hover:bg-[#0a5f4e] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Append Doctor Note
            </button>
          </form>
        )}
      </div>

      {/* Follow-up Section */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#5d6f6a]">
            Clinical Follow-Up
          </h4>
          {isDoctor && !showFollowupForm && (
            <button
              onClick={() => setShowFollowupForm(true)}
              className="text-xs text-[#0e7c66] font-bold hover:underline"
            >
              {currentCase.followup ? 'Reschedule' : 'Set Follow-up'}
            </button>
          )}
        </div>

        {currentCase.followup ? (
          <div className="p-3 bg-[#e3f3ef] rounded-xl text-xs space-y-0.5">
            <span className="font-bold text-[#0e7c66]">
              Follow-up scheduled on {fmtDate(currentCase.followup.date)}
            </span>
            <p className="text-[#0a5f4e]">{currentCase.followup.note}</p>
          </div>
        ) : (
          !showFollowupForm && (
            <p className="text-xs text-[#5d6f6a] py-1">No follow-up currently scheduled.</p>
          )
        )}

        {showFollowupForm && (
          <form onSubmit={handleSaveFollowup} className="space-y-2 pt-2">
            <div>
              <label className="text-[10px] text-[#5d6f6a] block">Follow-up Date</label>
              <input
                type="date"
                value={followupDate}
                onChange={e => setFollowupDate(e.target.value)}
                className="w-full bg-[#f2f6f5] border border-[#e2ebe8] rounded-xl p-2 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#5d6f6a] block">Follow-up Instruction</label>
              <input
                type="text"
                value={followupNote}
                onChange={e => setFollowupNote(e.target.value)}
                className="w-full bg-[#f2f6f5] border border-[#e2ebe8] rounded-xl p-2 text-xs"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#0e7c66] text-white rounded-xl text-xs font-bold"
              >
                Save Schedule
              </button>
              <button
                type="button"
                onClick={() => setShowFollowupForm(false)}
                className="px-3 py-1.5 bg-[#f2f6f5] text-[#5d6f6a] rounded-xl text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

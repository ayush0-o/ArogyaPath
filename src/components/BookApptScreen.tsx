import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { HOSPITALS, DOCTORS, DEPTS } from '../data/staticData';
import { today, addDays, calculateSlots } from '../lib/utils';
import confetti from 'canvas-confetti';

export const BookApptScreen: React.FC = () => {
  const { currentUser, appointments, bookAppointment, screenParams, navigate } = useApp();

  const caseId = screenParams.caseId || '';
  const initialDept = screenParams.defaultDept || 'General Medicine';

  const [selectedHosp, setSelectedHosp] = useState<string>('h1');
  const [selectedDept, setSelectedDept] = useState<string>(initialDept);
  const [selectedDoc, setSelectedDoc] = useState<string>('d1');
  const [selectedDate, setSelectedDate] = useState<string>(today());
  const [selectedTime, setSelectedTime] = useState<string>('10:00');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Filter available doctors for the chosen hospital and department
  const filteredDocs = DOCTORS.filter(
    d => d.h === selectedHosp && (selectedDept === 'all' || d.dept === selectedDept)
  );

  // Available slots for the doctor on that date, checking against real database appointments
  const bookedTimes = appointments
    .filter(a => a.doc === selectedDoc && a.date === selectedDate && a.status !== 'cancelled')
    .map(a => a.time);

  const availableSlots = calculateSlots(selectedDoc, selectedDate, bookedTimes);

  const handleConfirm = () => {
    setIsSubmitting(true);

    const docObj = DOCTORS.find(d => d.id === selectedDoc);
    const hospObj = HOSPITALS.find(h => h.id === selectedHosp);

    setTimeout(() => {
      const newAppt = bookAppointment({
        pid: currentUser?.pid || 'P-1001',
        doc: selectedDoc,
        hosp: selectedHosp,
        dept: selectedDept,
        date: selectedDate,
        time: selectedTime,
        status: 'upcoming',
        case: caseId,
        fee: docObj?.fee || '₹0',
      });

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {}

      navigate('appt-confirmed', { apptId: newAppt.id });
    }, 400);
  };

  return (
    <div className="space-y-4 pb-20 pt-2 max-w-md mx-auto">
      {/* Step 1: Hospital Choice */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#5d6f6a] block">
          1. Select Hospital / Health Center
        </label>
        <div className="space-y-2">
          {HOSPITALS.map(h => (
            <div
              key={h.id}
              onClick={() => {
                setSelectedHosp(h.id);
                // reset doctor to first in that hospital
                const first = DOCTORS.find(d => d.h === h.id);
                if (first) setSelectedDoc(first.id);
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedHosp === h.id
                  ? 'border-[#0e7c66] bg-[#e3f3ef]/40 shadow-xs'
                  : 'border-[#e2ebe8] hover:border-[#0e7c66]'
              }`}
            >
              <div>
                <h4 className="text-xs font-bold text-[#13231f]">{h.name}</h4>
                <p className="text-[11px] text-[#5d6f6a]">
                  {h.type} • {h.dist} • ★ {h.rating} ({h.beds} beds)
                </p>
              </div>
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedHosp === h.id
                    ? 'border-[#0e7c66] bg-[#0e7c66] text-white'
                    : 'border-[#e2ebe8]'
                }`}
              >
                {selectedHosp === h.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 2: Department Selection */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#5d6f6a] block">
          2. OPD Department
        </label>
        <select
          value={selectedDept}
          onChange={e => setSelectedDept(e.target.value)}
          className="w-full bg-[#f2f6f5] border border-[#e2ebe8] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#13231f] focus:outline-none focus:border-[#0e7c66]"
        >
          {DEPTS.map(dept => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Step 3: Doctor Selection */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#5d6f6a] block">
          3. Available Clinician
        </label>
        {filteredDocs.length === 0 ? (
          <p className="text-xs text-[#5d6f6a] py-2">
            No doctors directly listed for this specific department in this hospital. Defaulting to
            General Medicine OPD physician.
          </p>
        ) : (
          <div className="space-y-2">
            {filteredDocs.map(d => (
              <div
                key={d.id}
                onClick={() => setSelectedDoc(d.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedDoc === d.id
                    ? 'border-[#0e7c66] bg-[#e3f3ef]/40 shadow-xs'
                    : 'border-[#e2ebe8] hover:border-[#0e7c66]'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-[#13231f]">{d.name}</h4>
                  <p className="text-[11px] text-[#5d6f6a]">
                    {d.dept} • {d.exp} yrs exp • {d.fee}
                  </p>
                </div>
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedDoc === d.id
                      ? 'border-[#0e7c66] bg-[#0e7c66] text-white'
                      : 'border-[#e2ebe8]'
                  }`}
                >
                  {selectedDoc === d.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Step 4: Date & Slot Booking */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-[#5d6f6a] block">
          4. Appointment Date & Slot
        </label>

        {/* Date options (Today, Tomorrow, +2 days) */}
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map(n => {
            const d = addDays(n);
            const label = n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : 'Day After';
            return (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDate(d)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedDate === d
                    ? 'border-[#0e7c66] bg-[#e3f3ef] text-[#0e7c66] font-bold shadow-2xs'
                    : 'border-[#e2ebe8] bg-[#f2f6f5] text-[#5d6f6a]'
                }`}
              >
                <span className="text-[10px] block uppercase">{label}</span>
                <span className="text-xs font-semibold">{d.slice(5)}</span>
              </button>
            );
          })}
        </div>

        {/* Time slots */}
        <div className="pt-2">
          <span className="text-[11px] text-[#5d6f6a] block mb-2 font-medium">
            Select Timing Slot:
          </span>
          <div className="grid grid-cols-4 gap-2">
            {availableSlots.map(slot => (
              <button
                key={slot.time}
                type="button"
                disabled={slot.booked}
                onClick={() => setSelectedTime(slot.time)}
                className={`py-2 px-1 text-xs rounded-lg border transition-all ${
                  slot.booked
                    ? 'bg-[#f2f6f5] text-[#5d6f6a]/40 border-dashed border-[#e2ebe8] cursor-not-allowed line-through'
                    : selectedTime === slot.time
                    ? 'bg-[#0e7c66] text-white font-bold border-[#0e7c66] shadow-xs'
                    : 'bg-white text-[#13231f] border-[#e2ebe8] hover:border-[#0e7c66]'
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation CTA */}
      <button
        onClick={handleConfirm}
        disabled={isSubmitting}
        className="w-full py-3.5 bg-[#0e7c66] hover:bg-[#0a5f4e] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all mt-4"
      >
        <span>
          {isSubmitting ? 'Securing OPD Slot...' : 'Confirm Appointment & Generate QR Slip'}
        </span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

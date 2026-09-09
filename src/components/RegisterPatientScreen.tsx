import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, User, Phone, MapPin, Calendar, Heart, ShieldAlert, Pill } from 'lucide-react';
import { ageOf } from '../lib/utils';

export const RegisterPatientScreen: React.FC = () => {
  const { registerPatient, goBack } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    dob: '1995-05-15',
    phone: '',
    addr: '',
    blood: 'B+',
    emgName: '',
    emgPhone: '',
    allergies: '',
    cond: '',
    meds: '',
    pass: '',
  });

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Please provide patient name and mobile number');
      return;
    }

    const age = ageOf(formData.dob);

    registerPatient(
      {
        name: formData.name.trim(),
        gender: formData.gender,
        dob: formData.dob,
        age: age || 30,
        phone: formData.phone.trim(),
        addr: formData.addr.trim() || 'Nashik',
        blood: formData.blood,
        emg: {
          name: formData.emgName || 'Emergency Contact',
          phone: formData.emgPhone || formData.phone,
        },
        allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
        cond: formData.cond ? formData.cond.split(',').map(s => s.trim()).filter(Boolean) : [],
        meds: formData.meds ? formData.meds.split(',').map(s => s.trim()).filter(Boolean) : [],
      },
      formData.pass
    );
  };

  return (
    <div className="min-h-screen bg-[#f2f6f5] flex flex-col p-4 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-4 pt-2">
        <button
          onClick={goBack}
          className="p-2 -ml-2 text-[#13231f] hover:bg-white rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-[#13231f]">Patient Registration</h1>
          <p className="text-[11px] text-[#5d6f6a]">Creates local health record and patient login</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-[#e2ebe8] shadow-sm flex-1">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#13231f] mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Ramesh Patil"
              className="w-full bg-[#f2f6f5] border border-[#e2ebe8] rounded-xl px-3.5 py-2.5 text-sm text-[#13231f] focus:outline-none focus:border-[#0e7c66] focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#13231f] mb-1">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full bg-[#f2f6f5] border border-[#e2ebe8] rounded-xl px-3 py-2.5 text-sm text-[#13231f] focus:outline-none focus:border-[#0e7c66]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#13231f] mb-1">
                Blood Group
              </label>
              <select
                value={formData.blood}
                onChange={e => setFormData({ ...formData, blood: e.target.value })}
                className="w-full bg-[#f2f6f5] border border-[#e2ebe8] rounded-xl px-3 py-2.5 text-sm text-[#13231f] focus:outline-none focus:border-[#0e7c66]"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#13231f] mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dob}
                onChange={e => setFormData({ ...formData, dob: e.target.value })}
                className="w-full bg-[#f2f6f5] border border-[#e2ebe8] rounded-xl px-3 py-2 text-sm text-[#13231f] focus:outline-none focus:border-[#0e7c66]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#13231f] mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="10-digit number"
                className="w-full bg-[#f2f6f5] border border-[#e2ebe8] rounded-xl px-3 py-2 text-sm text-[#13231f] focus:outline-none focus:border-[#0e7c66]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#13231f] mb-1">
              Residential Address / Village
            </label>
            <input
              type="text"
              value={formData.addr}
              onChange={e => setFormData({ ...formData, addr: e.target.value })}
              placeholder="e.g. House 12, Gangapur, Nashik"
              className="w-full bg-[#f2f6f5] border border-[#e2ebe8] rounded-xl px-3 py-2 text-sm text-[#13231f] focus:outline-none focus:border-[#0e7c66]"
            />
          </div>

          <div className="pt-2 border-t border-[#e2ebe8]">
            <span className="text-xs font-bold text-[#5d6f6a] uppercase tracking-wider block mb-2">
              Clinical Background
            </span>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-[#13231f] mb-1">
                  Allergies (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={e => setFormData({ ...formData, allergies: e.target.value })}
                  placeholder="e.g. Penicillin, Sulfa, Dust"
                  className="w-full bg-[#f2f6f5] border border-[#e2ebe8] rounded-xl px-3 py-1.5 text-xs text-[#13231f]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#13231f] mb-1">
                  Chronic Conditions
                </label>
                <input
                  type="text"
                  value={formData.cond}
                  onChange={e => setFormData({ ...formData, cond: e.target.value })}
                  placeholder="e.g. Diabetes, Hypertension, Asthma"
                  className="w-full bg-[#f2f6f5] border border-[#e2ebe8] rounded-xl px-3 py-1.5 text-xs text-[#13231f]"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-[#fdeaea] border border-[#e5484d]/20 rounded-xl text-xs text-[#e5484d]">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#0e7c66] hover:bg-[#0a5f4e] text-white font-semibold text-sm rounded-xl shadow-sm transition-all mt-3"
          >
            Create Patient Health Card
          </button>
        </form>
      </div>
    </div>
  );
};

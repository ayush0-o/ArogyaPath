import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Stethoscope, Users, Building2, Lock, Mail } from 'lucide-react';
import { UserRole } from '../types';

export const RegisterStaffScreen: React.FC = () => {
  const { registerStaff, goBack } = useApp();

  const [role, setRole] = useState<UserRole>('doctor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [village, setVillage] = useState('');
  const [license, setLicense] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please provide full name and work email');
      return;
    }

    registerStaff(
      {
        name: name.trim(),
        email: email.trim(),
        village: village.trim(),
        license: license.trim(),
      },
      role
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
          <h1 className="text-lg font-bold text-[#13231f]">Healthcare Staff Registration</h1>
          <p className="text-[11px] text-[#5d6f6a]">Doctor, ASHA Worker, or Hospital Desk</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-[#e2ebe8] shadow-sm flex-1">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#13231f] mb-1.5">
              Professional Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'doctor', label: 'Doctor', icon: Stethoscope },
                { id: 'worker', label: 'Worker', icon: Users },
                { id: 'hospital', label: 'Hospital', icon: Building2 },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRole(item.id as UserRole)}
                    className={`py-2.5 px-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      role === item.id
                        ? 'border-[#0e7c66] bg-[#e3f3ef] text-[#0e7c66] font-bold'
                        : 'border-[#e2ebe8] bg-[#f2f6f5] text-[#5d6f6a]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#13231f] mb-1">
              Full Name / Facility Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={role === 'doctor' ? 'Dr. Name' : 'Full Name'}
              className="w-full bg-[#f2f6f5] border border-[#e2ebe8] rounded-xl px-3.5 py-2 text-sm text-[#13231f] focus:outline-none focus:border-[#0e7c66]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#13231f] mb-1">
              Work Email / Login Identifier *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. staff@health.gov.in"
              className="w-full bg-[#f2f6f5] border border-[#e2ebe8] rounded-xl px-3.5 py-2 text-sm text-[#13231f] focus:outline-none focus:border-[#0e7c66]"
            />
          </div>

          {role === 'worker' && (
            <div>
              <label className="block text-xs font-semibold text-[#13231f] mb-1">
                Assigned Village / PHC Cluster
              </label>
              <input
                type="text"
                value={village}
                onChange={e => setVillage(e.target.value)}
                placeholder="e.g. Gangapur, Nashik"
                className="w-full bg-[#f2f6f5] border border-[#e2ebe8] rounded-xl px-3.5 py-2 text-sm text-[#13231f] focus:outline-none focus:border-[#0e7c66]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#13231f] mb-1">
              Registration / License ID
            </label>
            <input
              type="text"
              value={license}
              onChange={e => setLicense(e.target.value)}
              placeholder="e.g. MMC-2012-4589"
              className="w-full bg-[#f2f6f5] border border-[#e2ebe8] rounded-xl px-3.5 py-2 text-sm text-[#13231f] focus:outline-none focus:border-[#0e7c66]"
            />
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
            Create Staff Profile & Access
          </button>
        </form>
      </div>
    </div>
  );
};

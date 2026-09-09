import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Stethoscope,
  HeartHandshake,
  Building2,
  Sparkles,
  KeyRound,
  CheckCircle2,
  Users,
  CreditCard,
  QrCode,
} from 'lucide-react';
import { UserRole } from '../types';

export const LoginScreen: React.FC = () => {
  const { login, navigate, goBack, patients, switchUserRole } = useApp();

  const [activeTab, setActiveTab] = useState<UserRole>('patient');
  const [patientLoginMethod, setPatientLoginMethod] = useState<'phone' | 'abha' | 'quick'>('phone');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (patientLoginMethod === 'phone' && activeTab === 'patient' && !identifier.trim()) {
      setErrorMsg('Please enter your 10-digit registered mobile number');
      return;
    }

    if (patientLoginMethod === 'abha' && activeTab === 'patient' && !identifier.trim()) {
      setErrorMsg('Please enter your 14-digit ABHA ID or @abdm address');
      return;
    }

    let searchKey = identifier.trim();
    if (activeTab === 'doctor') searchKey = 'doctor@demo.com';
    if (activeTab === 'worker') searchKey = 'worker@demo.com';
    if (activeTab === 'hospital') searchKey = 'hospital@demo.com';

    const success = login(searchKey, activeTab);
    if (!success) {
      setErrorMsg('Account not found. Select one of the quick profiles below or check credentials.');
    }
  };

  const handleQuickPatientSelect = (pid: string) => {
    const pat = patients.find(p => p.id === pid);
    if (pat) {
      login(pat.phone, 'patient');
    }
  };

  const handleQuickStaffLogin = (role: UserRole) => {
    switchUserRole(role);
  };

  return (
    <div className="min-h-screen bg-[#f2f6f5] flex flex-col p-4 max-w-md mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4 pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={goBack}
            className="p-2 -ml-2 text-[#13231f] hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#13231f]">Sign In</h1>
            <p className="text-[11px] text-[#5d6f6a]">Choose your portal & login option</p>
          </div>
        </div>
        <span className="text-[10px] font-bold bg-[#0e7c66]/10 text-[#0e7c66] px-2.5 py-1 rounded-full border border-[#0e7c66]/20 flex items-center gap-1">
          <Shield className="w-3 h-3" /> ABDM Gateway
        </span>
      </div>

      {/* Role Tabs */}
      <div className="grid grid-cols-4 gap-1.5 bg-[#e2ebe8]/60 p-1 rounded-2xl mb-4 border border-[#e2ebe8]">
        <button
          type="button"
          onClick={() => {
            setActiveTab('patient');
            setErrorMsg('');
          }}
          className={`py-2 px-1 rounded-xl text-center transition-all ${
            activeTab === 'patient'
              ? 'bg-white text-[#0e7c66] font-bold shadow-xs'
              : 'text-[#5d6f6a] font-medium hover:text-[#13231f]'
          }`}
        >
          <User className="w-4 h-4 mx-auto mb-1" />
          <span className="text-[11px] block leading-none">Patient</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('doctor');
            setErrorMsg('');
          }}
          className={`py-2 px-1 rounded-xl text-center transition-all ${
            activeTab === 'doctor'
              ? 'bg-white text-[#0e7c66] font-bold shadow-xs'
              : 'text-[#5d6f6a] font-medium hover:text-[#13231f]'
          }`}
        >
          <Stethoscope className="w-4 h-4 mx-auto mb-1" />
          <span className="text-[11px] block leading-none">Doctor</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('worker');
            setErrorMsg('');
          }}
          className={`py-2 px-1 rounded-xl text-center transition-all ${
            activeTab === 'worker'
              ? 'bg-white text-[#0e7c66] font-bold shadow-xs'
              : 'text-[#5d6f6a] font-medium hover:text-[#13231f]'
          }`}
        >
          <HeartHandshake className="w-4 h-4 mx-auto mb-1" />
          <span className="text-[11px] block leading-none">ASHA</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('hospital');
            setErrorMsg('');
          }}
          className={`py-2 px-1 rounded-xl text-center transition-all ${
            activeTab === 'hospital'
              ? 'bg-white text-[#0e7c66] font-bold shadow-xs'
              : 'text-[#5d6f6a] font-medium hover:text-[#13231f]'
          }`}
        >
          <Building2 className="w-4 h-4 mx-auto mb-1" />
          <span className="text-[11px] block leading-none">Hospital</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl p-5 border border-[#e2ebe8] shadow-sm flex-1 flex flex-col justify-between">
        {activeTab === 'patient' ? (
          <div className="space-y-4">
            {/* Patient Method Switcher */}
            <div className="flex bg-[#f2f6f5] rounded-xl p-0.5 border border-[#e2ebe8]">
              <button
                type="button"
                onClick={() => setPatientLoginMethod('phone')}
                className={`flex-1 py-1.5 text-[11px] rounded-lg font-semibold transition-all flex items-center justify-center gap-1 ${
                  patientLoginMethod === 'phone'
                    ? 'bg-white text-[#0e7c66] shadow-xs'
                    : 'text-[#5d6f6a]'
                }`}
              >
                <Phone className="w-3.5 h-3.5" /> Mobile OTP
              </button>
              <button
                type="button"
                onClick={() => setPatientLoginMethod('abha')}
                className={`flex-1 py-1.5 text-[11px] rounded-lg font-semibold transition-all flex items-center justify-center gap-1 ${
                  patientLoginMethod === 'abha'
                    ? 'bg-white text-[#0e7c66] shadow-xs'
                    : 'text-[#5d6f6a]'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" /> ABHA ID
              </button>
              <button
                type="button"
                onClick={() => setPatientLoginMethod('quick')}
                className={`flex-1 py-1.5 text-[11px] rounded-lg font-semibold transition-all flex items-center justify-center gap-1 ${
                  patientLoginMethod === 'quick'
                    ? 'bg-white text-[#0e7c66] shadow-xs'
                    : 'text-[#5d6f6a]'
                }`}
              >
                <Users className="w-3.5 h-3.5" /> Switch Patient
              </button>
            </div>

            {patientLoginMethod === 'phone' && (
              <form onSubmit={handleLogin} className="space-y-3.5 pt-1">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-[#13231f]">
                      Mobile Number
                    </label>
                    <span className="text-[10px] text-[#0e7c66] font-medium">Demo: 9876543210</span>
                  </div>
                  <div className="relative">
                    <input
                      type="tel"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-[#f2f6f5] border border-[#e2ebe8] rounded-xl px-3.5 py-2.5 text-sm text-[#13231f] focus:outline-none focus:border-[#0e7c66] focus:bg-white transition-all pl-10"
                    />
                    <Phone className="w-4 h-4 text-[#5d6f6a] absolute left-3.5 top-3" />
                  </div>
                </div>

                {otpSent ? (
                  <div>
                    <label className="block text-xs font-semibold text-[#13231f] mb-1">
                      Enter 4-Digit OTP
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={4}
                        defaultValue="8841"
                        placeholder="8841"
                        className="w-full bg-[#f2f6f5] border border-[#e2ebe8] rounded-xl px-3.5 py-2.5 text-sm font-mono tracking-widest text-center text-[#13231f] focus:outline-none focus:border-[#0e7c66] focus:bg-white transition-all"
                      />
                    </div>
                    <p className="text-[10px] text-[#0e7c66] mt-1 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Demo OTP verified automatically
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (!identifier.trim()) setIdentifier('9876543210');
                      setOtpSent(true);
                    }}
                    className="text-xs text-[#0e7c66] font-bold hover:underline block"
                  >
                    + Request One-Time Passcode (OTP)
                  </button>
                )}

                {errorMsg && (
                  <div className="p-2.5 bg-[#fdeaea] border border-[#e5484d]/20 rounded-xl text-xs text-[#e5484d]">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0e7c66] hover:bg-[#0a5f4e] text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
                >
                  Sign In with Mobile OTP
                </button>
              </form>
            )}

            {patientLoginMethod === 'abha' && (
              <form onSubmit={handleLogin} className="space-y-3.5 pt-1">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-[#13231f]">
                      ABHA Address or 14-Digit Number
                    </label>
                    <span className="text-[10px] text-[#0e7c66] font-medium">e.g. ramesh.patil@abdm</span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="91-4521-8890-1234 or ramesh.patil@abdm"
                      className="w-full bg-[#f2f6f5] border border-[#e2ebe8] rounded-xl px-3.5 py-2.5 text-sm text-[#13231f] focus:outline-none focus:border-[#0e7c66] focus:bg-white transition-all pl-10"
                    />
                    <CreditCard className="w-4 h-4 text-[#5d6f6a] absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#13231f] mb-1">
                    ABHA Passcode / Biometric Auth
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter 6-digit security PIN"
                      className="w-full bg-[#f2f6f5] border border-[#e2ebe8] rounded-xl px-3.5 py-2.5 text-sm text-[#13231f] focus:outline-none focus:border-[#0e7c66] focus:bg-white transition-all pl-10 pr-10"
                    />
                    <KeyRound className="w-4 h-4 text-[#5d6f6a] absolute left-3.5 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-[#5d6f6a] hover:text-[#13231f]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-2.5 bg-[#fdeaea] border border-[#e5484d]/20 rounded-xl text-xs text-[#e5484d]">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0e7c66] hover:bg-[#0a5f4e] text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
                >
                  Verify ABHA Health Credentials
                </button>
              </form>
            )}

            {patientLoginMethod === 'quick' && (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#13231f]">
                    Select Authentic Demo Patient ({patients.length})
                  </span>
                  <span className="text-[10px] text-[#5d6f6a]">Tap any card to sign in</span>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                  {patients.map(p => (
                    <div
                      key={p.id}
                      onClick={() => handleQuickPatientSelect(p.id)}
                      className="p-2.5 bg-[#f2f6f5] hover:bg-[#e3f3ef] border border-[#e2ebe8] hover:border-[#0e7c66]/40 rounded-xl cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#0e7c66] text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#13231f]">{p.name}</span>
                            <span className="text-[10px] text-[#5d6f6a]">({p.age}, {p.gender})</span>
                          </div>
                          <p className="text-[10px] text-[#5d6f6a] truncate max-w-[180px]">
                            {p.cond?.[0] || p.occupation || 'General Health'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#0e7c66] bg-white px-2 py-1 rounded-lg border border-[#e2ebe8]">
                        Login →
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Staff Login Profiles */
          <div className="space-y-4">
            <div className="p-3 bg-[#e3f3ef]/50 border border-[#0e7c66]/20 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-[#0e7c66]" />
                <span className="text-xs font-bold text-[#0e7c66]">
                  Institutional Portal Access
                </span>
              </div>
              <p className="text-[11px] text-[#5d6f6a]">
                {activeTab === 'doctor' &&
                  'OPD Queue, Triage Verification, Digital Prescriptions, and Consultation Notes.'}
                {activeTab === 'worker' &&
                  'ASHA Field Registry, Offline Maternal (ANC) Tracking, and Village Sync.'}
                {activeTab === 'hospital' &&
                  'Hospital Capacity, ICU Beds, Oxygen Plant, and Central Queue Management.'}
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 border border-[#e2ebe8] rounded-xl bg-[#f2f6f5]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-[#13231f]">
                    {activeTab === 'doctor' && 'Dr. Priya Sharma, MD'}
                    {activeTab === 'worker' && 'Surekha Gavde (ASHA Worker)'}
                    {activeTab === 'hospital' && 'District General Hospital, Nashik'}
                  </span>
                  <span className="text-[10px] bg-[#0e7c66] text-white px-2 py-0.5 rounded-full font-bold">
                    Active Demo
                  </span>
                </div>
                <p className="text-[11px] text-[#5d6f6a]">
                  {activeTab === 'doctor' && 'Internal Medicine • Reg: DMC-2014-8841 • Room 104'}
                  {activeTab === 'worker' && 'ASHA ID: HW-01 • Gangapur Sub-Center • 1,420 Covered'}
                  {activeTab === 'hospital' && 'Civil Hospital • 450 Beds • NABH Grade A • Level 1 Trauma'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleQuickStaffLogin(activeTab)}
                className="w-full py-3 bg-[#0e7c66] hover:bg-[#0a5f4e] text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <span>Fast Login as {activeTab === 'doctor' ? 'Doctor' : activeTab === 'worker' ? 'ASHA Worker' : 'Hospital Admin'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-5 border-t border-[#e2ebe8] text-center space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#5d6f6a]">New to ArogyaPath?</span>
            <button
              onClick={() => navigate('welcome')}
              className="text-[#0e7c66] font-semibold hover:underline text-xs"
            >
              Back to Welcome
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate('register-patient')}
              className="flex-1 py-2 px-3 bg-[#f2f6f5] hover:bg-[#e2ebe8] text-[#13231f] font-semibold text-xs rounded-xl transition-colors"
            >
              Register New Patient
            </button>
            <button
              onClick={() => navigate('register-staff')}
              className="flex-1 py-2 px-3 bg-[#f2f6f5] hover:bg-[#e2ebe8] text-[#13231f] font-semibold text-xs rounded-xl transition-colors"
            >
              Register Staff
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

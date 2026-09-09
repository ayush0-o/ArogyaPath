import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { I18N } from '../data/i18n';
import {
  User,
  Stethoscope,
  Users,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { login, settings, updateSettings, navigate } = useApp();
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | 'worker' | 'hospital'>('patient');

  const demoAccounts = [
    {
      role: 'patient' as const,
      name: 'Ramesh Patil',
      sub: 'B+ blood, Diabetic review, Nashik',
      key: '9876543210',
      icon: User,
      color: 'from-[#0e7c66] to-[#0a5f4e]',
      badge: '9876543210',
    },
    {
      role: 'doctor' as const,
      name: 'Dr. Priya Sharma',
      sub: 'MD Internal Med, Dist. Gen Hospital',
      key: 'doctor@demo.com',
      icon: Stethoscope,
      color: 'from-[#0e7c66] to-[#128a72]',
      badge: 'doctor@demo.com',
    },
    {
      role: 'worker' as const,
      name: 'Suresh Gavde (ASHA)',
      sub: 'Gangapur Rural PHC Cluster',
      key: 'worker@demo.com',
      icon: Users,
      color: 'from-[#2f6fed] to-[#1f4fad]',
      badge: 'worker@demo.com',
    },
    {
      role: 'hospital' as const,
      name: 'District General Hospital',
      sub: 'OPD Desk & Bed Coordination',
      key: 'hospital@demo.com',
      icon: Building2,
      color: 'from-[#e8a013] to-[#c28206]',
      badge: 'hospital@demo.com',
    },
  ];

  const handleQuickLogin = (key: string, role: 'patient' | 'doctor' | 'worker' | 'hospital') => {
    login(key, role);
  };

  return (
    <div className="min-h-screen bg-[#f2f6f5] flex flex-col justify-between p-4 max-w-md mx-auto">
      {/* Top Branding */}
      <div className="pt-6 pb-4 text-center">
        <button
          onClick={() => navigate('splash')}
          title="View Intro Splash Screen"
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0e7c66] to-[#0a5f4e] text-white text-2xl font-black shadow-md mb-3 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        >
          आ
        </button>
        <h1 className="text-2xl font-black text-[#13231f] tracking-tight">
          ArogyaPath <span className="text-[#0e7c66] font-normal text-xl block">आरोग्य पथ</span>
        </h1>
        <p className="text-xs text-[#5d6f6a] mt-1.5 max-w-xs mx-auto">
          Patient Case Taking, AI Clinical Triage & Integrated Hospital OPD System
        </p>

        {/* Language & Splash Controls */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="inline-flex bg-white rounded-full p-0.5 border border-[#e2ebe8] shadow-xs">
            <button
              onClick={() => updateSettings({ lang: 'en' })}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                settings.lang === 'en'
                  ? 'bg-[#0e7c66] text-white shadow-xs'
                  : 'text-[#5d6f6a] hover:text-[#13231f]'
              }`}
            >
              English
            </button>
            <button
              onClick={() => updateSettings({ lang: 'hi' })}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                settings.lang === 'hi'
                  ? 'bg-[#0e7c66] text-white shadow-xs'
                  : 'text-[#5d6f6a] hover:text-[#13231f]'
              }`}
            >
              हिंदी
            </button>
          </div>

          <button
            onClick={() => navigate('splash')}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-[#0e7c66] bg-[#e3f3ef] hover:bg-[#d0ece5] rounded-full border border-[#0e7c66]/20 shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Splash</span>
          </button>
        </div>
      </div>

      {/* Demo Portals Selection Card */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5d6f6a]">
            Instant Role Demo Login
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0e7c66] bg-[#e3f3ef] px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" /> One-Click Access
          </span>
        </div>

        <div className="space-y-2.5">
          {demoAccounts.map(acc => {
            const Icon = acc.icon;
            return (
              <button
                key={acc.role}
                onClick={() => handleQuickLogin(acc.key, acc.role)}
                className="w-full text-left p-3 rounded-xl border border-[#e2ebe8] hover:border-[#0e7c66] hover:bg-[#e3f3ef]/30 transition-all flex items-center justify-between group bg-white shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${acc.color} text-white flex items-center justify-center shrink-0 shadow-xs`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-[#13231f] group-hover:text-[#0e7c66]">
                        {acc.name}
                      </h3>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-[#f2f6f5] text-[#5d6f6a]">
                        {acc.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5d6f6a] line-clamp-1">{acc.sub}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#5d6f6a] group-hover:text-[#0e7c66] group-hover:translate-x-0.5 transition-transform" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual Login or New Patient Register */}
      <div className="pt-4 space-y-2 text-center pb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('login')}
            className="flex-1 py-2.5 px-4 bg-white border border-[#e2ebe8] text-[#13231f] font-semibold text-xs rounded-xl shadow-xs hover:bg-[#f2f6f5] transition-colors"
          >
            Custom Sign In
          </button>
          <button
            onClick={() => navigate('register-patient')}
            className="flex-1 py-2.5 px-4 bg-[#0e7c66] text-white font-semibold text-xs rounded-xl shadow-sm hover:bg-[#0a5f4e] transition-colors"
          >
            Register Patient
          </button>
        </div>

        <p className="text-[11px] text-[#5d6f6a] flex items-center justify-center gap-1 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0e7c66]" />
          Doctor-in-the-loop clinical safety & ABHA / Ayushman aligned
        </p>
      </div>
    </div>
  );
};

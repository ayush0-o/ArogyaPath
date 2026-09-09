import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  CheckCheck,
  Globe,
  Type,
  Wifi,
  Database,
  RotateCcw,
  LogOut,
  User,
  Shield,
  FileText,
  Clock,
  Printer,
  ChevronRight,
  ExternalLink,
  Heart,
  HeartHandshake,
  Activity,
  AlertTriangle,
  Stethoscope,
  Building2,
  Phone,
  Users,
  Check,
  Sliders,
  Sparkles,
  Award,
  Radio,
  Download,
  Volume2,
  Eye,
  RefreshCw,
  Edit2,
  Save,
  X,
  CreditCard,
  QrCode,
  MapPin,
  Calendar,
  Search,
  History,
} from 'lucide-react';
import { generateQrSvg, fmtDate, today } from '../lib/utils';
import { HOSPITALS, DOCTORS } from '../data/staticData';
import { UserRole, Patient } from '../types';
import { DoctorQueueAndCases } from './DoctorQueueAndCases';
import { PatientPastRecordsModal } from './PatientPastRecordsModal';
import { getPatientClinicalRecords } from '../data/clinicalRecordsData';

// ==========================================
// 1. NOTIFICATIONS SCREEN
// ==========================================
export const NotificationsScreen: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, currentUser } = useApp();

  const myNotifications = currentUser
    ? notifications.filter(
        n =>
          n.role === currentUser.role &&
          (n.uid === (currentUser.pid || currentUser.did || currentUser.wid || currentUser.hid || '') ||
            !n.uid)
      )
    : notifications;

  return (
    <div className="space-y-4 pb-20 pt-2 max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#13231f]">
            Notifications ({myNotifications.length})
          </h2>
          <p className="text-[11px] text-[#5d6f6a]">OPD tokens, triage updates, and health alerts</p>
        </div>
        <button
          onClick={markAllNotificationsRead}
          className="text-xs text-[#0e7c66] font-semibold flex items-center gap-1 hover:underline"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark all read</span>
        </button>
      </div>

      <div className="space-y-2">
        {myNotifications.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#e2ebe8]">
            <Bell className="w-8 h-8 text-[#5d6f6a]/40 mx-auto mb-2" />
            <p className="text-xs font-bold text-[#13231f]">All caught up</p>
            <p className="text-[11px] text-[#5d6f6a] mt-0.5">No new clinical notifications right now.</p>
          </div>
        ) : (
          myNotifications.map(n => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                n.read
                  ? 'bg-white border-[#e2ebe8] opacity-75'
                  : 'bg-[#e3f3ef]/30 border-[#0e7c66]/30 shadow-xs'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${n.read ? 'bg-transparent' : 'bg-[#0e7c66]'}`}
                  />
                  <h4 className="text-xs font-bold text-[#13231f]">{n.title}</h4>
                </div>
                <span className="text-[10px] text-[#5d6f6a] shrink-0">{fmtDate(n.time)}</span>
              </div>
              <p className="text-[11px] text-[#5d6f6a] mt-1 pl-4">{n.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. SETTINGS SCREEN
// ==========================================
export const SettingsScreen: React.FC = () => {
  const {
    settings,
    updateSettings,
    isOfflineMode,
    toggleOfflineMode,
    resetToSeedData,
    logout,
    currentUser,
    switchUserRole,
    syncOfflineQueue,
    patients,
    cases,
    navigate,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'privacy' | 'storage'>('general');
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const handleForceSync = async () => {
    setSyncStatusMsg('Synchronizing field queue...');
    const count = await syncOfflineQueue();
    setTimeout(() => {
      setSyncStatusMsg(count > 0 ? `Synced ${count} offline cases successfully!` : 'All clinical cases already up to date.');
      setTimeout(() => setSyncStatusMsg(null), 3000);
    }, 600);
  };

  const handleDownloadEhrJson = () => {
    const data = {
      user: currentUser,
      patients,
      cases,
      exportedAt: new Date().toISOString(),
      governance: 'Ayushman Bharat Digital Mission (ABDM) Compliant Format',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arogyapath_ehr_export_${today()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 pb-20 pt-2 max-w-md mx-auto">
      {/* Category Tabs */}
      <div className="flex bg-white rounded-2xl p-1 border border-[#e2ebe8] shadow-2xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex-1 min-w-[70px] py-1.5 px-2 text-[11px] rounded-xl font-bold transition-all text-center ${
            activeTab === 'general' ? 'bg-[#0e7c66] text-white' : 'text-[#5d6f6a] hover:text-[#13231f]'
          }`}
        >
          General
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 min-w-[70px] py-1.5 px-2 text-[11px] rounded-xl font-bold transition-all text-center ${
            activeTab === 'notifications' ? 'bg-[#0e7c66] text-white' : 'text-[#5d6f6a] hover:text-[#13231f]'
          }`}
        >
          Alerts
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex-1 min-w-[70px] py-1.5 px-2 text-[11px] rounded-xl font-bold transition-all text-center ${
            activeTab === 'privacy' ? 'bg-[#0e7c66] text-white' : 'text-[#5d6f6a] hover:text-[#13231f]'
          }`}
        >
          Privacy
        </button>
        <button
          onClick={() => setActiveTab('storage')}
          className={`flex-1 min-w-[70px] py-1.5 px-2 text-[11px] rounded-xl font-bold transition-all text-center ${
            activeTab === 'storage' ? 'bg-[#0e7c66] text-white' : 'text-[#5d6f6a] hover:text-[#13231f]'
          }`}
        >
          Storage
        </button>
      </div>

      {/* 1. General & Accessibility */}
      {activeTab === 'general' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5d6f6a]">
              Language & Regional Locales
            </h3>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-[#0e7c66]" />
                <span className="text-xs font-bold text-[#13231f]">System Display Language</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'hi', label: 'हिंदी' },
                  { code: 'mr', label: 'मराठी' },
                  { code: 'bn', label: 'বাংলা' },
                  { code: 'ta', label: 'தமிழ்' },
                  { code: 'te', label: 'తెలుగు' },
                ].map(langItem => (
                  <button
                    key={langItem.code}
                    onClick={() => updateSettings({ lang: langItem.code as any })}
                    className={`py-2 px-1 text-xs rounded-xl font-semibold border transition-all text-center ${
                      settings.lang === langItem.code
                        ? 'bg-[#0e7c66] text-white border-[#0e7c66] shadow-2xs'
                        : 'bg-[#f2f6f5] text-[#13231f] border-[#e2ebe8] hover:bg-white'
                    }`}
                  >
                    {langItem.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#f2f6f5] space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#5d6f6a]">
                Accessibility Suite
              </h4>

              {/* Big font toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-[#2f6fed]" />
                  <div>
                    <span className="text-xs font-bold text-[#13231f] block">Large Senior Font Mode</span>
                    <span className="text-[10px] text-[#5d6f6a]">Enlarges text size across all clinical cards</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.big}
                  onChange={e => updateSettings({ big: e.target.checked })}
                  className="w-5 h-5 accent-[#0e7c66] rounded cursor-pointer"
                />
              </div>

              {/* High contrast mode */}
              <div className="flex items-center justify-between pt-2 border-t border-[#f2f6f5]">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#e8a013]" />
                  <div>
                    <span className="text-xs font-bold text-[#13231f] block">High Contrast Mode</span>
                    <span className="text-[10px] text-[#5d6f6a]">Maximizes border clarity for visual comfort</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(settings.highContrast)}
                  onChange={e => updateSettings({ highContrast: e.target.checked })}
                  className="w-5 h-5 accent-[#0e7c66] rounded cursor-pointer"
                />
              </div>

              {/* Sound / Voice assistance */}
              <div className="flex items-center justify-between pt-2 border-t border-[#f2f6f5]">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[#0e7c66]" />
                  <div>
                    <span className="text-xs font-bold text-[#13231f] block">Audio & Voice Assist</span>
                    <span className="text-[10px] text-[#5d6f6a]">Audible cue for triage alerts and queue tokens</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(settings.soundAssist)}
                  onChange={e => updateSettings({ soundAssist: e.target.checked })}
                  className="w-5 h-5 accent-[#0e7c66] rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Quick Role Persona Switcher */}
          <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5d6f6a]">
              Switch Active Persona (Evaluation Mode)
            </h3>
            <p className="text-[11px] text-[#5d6f6a]">
              Instantly toggle between healthcare actors to preview workflows:
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => switchUserRole('patient')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  currentUser?.role === 'patient'
                    ? 'bg-[#e3f3ef] border-[#0e7c66] font-bold text-[#0e7c66]'
                    : 'bg-[#f2f6f5] border-[#e2ebe8] text-[#13231f] hover:bg-white'
                }`}
              >
                <span className="text-xs font-bold block">Patient</span>
                <span className="text-[10px] text-[#5d6f6a] block">Ramesh Patil</span>
              </button>

              <button
                onClick={() => switchUserRole('doctor')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  currentUser?.role === 'doctor'
                    ? 'bg-[#e3f3ef] border-[#0e7c66] font-bold text-[#0e7c66]'
                    : 'bg-[#f2f6f5] border-[#e2ebe8] text-[#13231f] hover:bg-white'
                }`}
              >
                <span className="text-xs font-bold block">Doctor</span>
                <span className="text-[10px] text-[#5d6f6a] block">Dr. Priya Sharma</span>
              </button>

              <button
                onClick={() => switchUserRole('worker')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  currentUser?.role === 'worker'
                    ? 'bg-[#e3f3ef] border-[#0e7c66] font-bold text-[#0e7c66]'
                    : 'bg-[#f2f6f5] border-[#e2ebe8] text-[#13231f] hover:bg-white'
                }`}
              >
                <span className="text-xs font-bold block">ASHA Worker</span>
                <span className="text-[10px] text-[#5d6f6a] block">Surekha Gavde</span>
              </button>

              <button
                onClick={() => switchUserRole('hospital')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  currentUser?.role === 'hospital'
                    ? 'bg-[#e3f3ef] border-[#0e7c66] font-bold text-[#0e7c66]'
                    : 'bg-[#f2f6f5] border-[#e2ebe8] text-[#13231f] hover:bg-white'
                }`}
              >
                <span className="text-xs font-bold block">Hospital Admin</span>
                <span className="text-[10px] text-[#5d6f6a] block">District Civil Hosp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Notification Channels */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#5d6f6a]">
            Notification Delivery Channels
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#13231f] block">SMS Token Notifications</span>
                <span className="text-[10px] text-[#5d6f6a]">Receive registration & token numbers via SMS</span>
              </div>
              <input
                type="checkbox"
                checked={settings.notifChannels?.sms ?? true}
                onChange={e =>
                  updateSettings({
                    notifChannels: { ...settings.notifChannels, sms: e.target.checked },
                  })
                }
                className="w-5 h-5 accent-[#0e7c66] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#f2f6f5]">
              <div>
                <span className="text-xs font-bold text-[#13231f] block">WhatsApp Queue Alerts</span>
                <span className="text-[10px] text-[#5d6f6a]">Real-time live token alerts when 2 patients remain</span>
              </div>
              <input
                type="checkbox"
                checked={settings.notifChannels?.whatsapp ?? true}
                onChange={e =>
                  updateSettings({
                    notifChannels: { ...settings.notifChannels, whatsapp: e.target.checked },
                  })
                }
                className="w-5 h-5 accent-[#0e7c66] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#f2f6f5]">
              <div>
                <span className="text-xs font-bold text-[#13231f] block">Critical Lab Result Alerts</span>
                <span className="text-[10px] text-[#5d6f6a]">Urgent flag notifications for abnormal test values</span>
              </div>
              <input
                type="checkbox"
                checked={settings.notifChannels?.labAlerts ?? true}
                onChange={e =>
                  updateSettings({
                    notifChannels: { ...settings.notifChannels, labAlerts: e.target.checked },
                  })
                }
                className="w-5 h-5 accent-[#0e7c66] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#f2f6f5]">
              <div>
                <span className="text-xs font-bold text-[#13231f] block">IVR Voice Call Reminders</span>
                <span className="text-[10px] text-[#5d6f6a]">Automated Marathi / Hindi appointment reminder calls</span>
              </div>
              <input
                type="checkbox"
                checked={settings.notifChannels?.voiceReminders ?? true}
                onChange={e =>
                  updateSettings({
                    notifChannels: { ...settings.notifChannels, voiceReminders: e.target.checked },
                  })
                }
                className="w-5 h-5 accent-[#0e7c66] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Privacy & ABHA Consent */}
      {activeTab === 'privacy' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5d6f6a]">
                ABHA Data Sharing Consents
              </h3>
              <span className="text-[10px] bg-[#0e7c66]/10 text-[#0e7c66] px-2 py-0.5 rounded-full font-bold">
                ABDM Active
              </span>
            </div>

            <p className="text-[11px] text-[#5d6f6a]">
              Control which doctors and healthcare facilities have authorization to view your electronic health records (EHR):
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 bg-[#f2f6f5] rounded-xl">
                <div>
                  <span className="text-xs font-bold text-[#13231f] block">Dr. Priya Sharma</span>
                  <span className="text-[10px] text-[#5d6f6a]">General Medicine, OPD Desk</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.abhaConsent?.drPriya ?? true}
                  onChange={e =>
                    updateSettings({
                      abhaConsent: { ...settings.abhaConsent, drPriya: e.target.checked },
                    })
                  }
                  className="w-5 h-5 accent-[#0e7c66] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#f2f6f5] rounded-xl">
                <div>
                  <span className="text-xs font-bold text-[#13231f] block">District General Hospital, Nashik</span>
                  <span className="text-[10px] text-[#5d6f6a]">Inpatient & Emergency Resuscitation records</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.abhaConsent?.distHosp ?? true}
                  onChange={e =>
                    updateSettings({
                      abhaConsent: { ...settings.abhaConsent, distHosp: e.target.checked },
                    })
                  }
                  className="w-5 h-5 accent-[#0e7c66] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#f2f6f5] rounded-xl">
                <div>
                  <span className="text-xs font-bold text-[#13231f] block">Central Pathology Diagnostic Lab</span>
                  <span className="text-[10px] text-[#5d6f6a]">Biochemical & Diagnostic panel uploads</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.abhaConsent?.centralLab ?? true}
                  onChange={e =>
                    updateSettings({
                      abhaConsent: { ...settings.abhaConsent, centralLab: e.target.checked },
                    })
                  }
                  className="w-5 h-5 accent-[#0e7c66] rounded cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={handleDownloadEhrJson}
              className="w-full py-2.5 px-3 bg-[#e3f3ef] hover:bg-[#0e7c66] hover:text-white text-[#0e7c66] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all"
            >
              <Download className="w-4 h-4" /> Download Complete Health Record (JSON)
            </button>
          </div>
        </div>
      )}

      {/* 4. Storage & Diagnostics */}
      {activeTab === 'storage' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5d6f6a]">
              Local Storage & Offline Synchronization
            </h3>

            {/* Offline toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-[#e8a013]" />
                <div>
                  <span className="text-xs font-bold text-[#13231f] block">Simulate Offline Mode</span>
                  <span className="text-[10px] text-[#5d6f6a]">Saves intake cases locally to IndexedDB/Dexie</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isOfflineMode}
                onChange={toggleOfflineMode}
                className="w-5 h-5 accent-[#e8a013] rounded cursor-pointer"
              />
            </div>

            {/* Storage stats */}
            <div className="p-3 bg-[#f2f6f5] rounded-xl text-xs space-y-1.5 border border-[#e2ebe8]">
              <div className="flex justify-between">
                <span className="text-[#5d6f6a]">IndexedDB Patients Cached:</span>
                <span className="font-bold text-[#13231f]">{patients.length} records</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5d6f6a]">Medical Cases Cached:</span>
                <span className="font-bold text-[#13231f]">{cases.length} files</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5d6f6a]">Unsynced Offline Items:</span>
                <span className="font-bold text-[#0e7c66]">
                  {cases.filter(c => c.status === 'offlineSaved').length} pending
                </span>
              </div>
            </div>

            {syncStatusMsg && (
              <p className="text-xs text-[#0e7c66] font-bold bg-[#e3f3ef] p-2 rounded-xl text-center">
                {syncStatusMsg}
              </p>
            )}

            <button
              onClick={handleForceSync}
              className="w-full py-2.5 px-3 bg-[#0e7c66] hover:bg-[#0a5f4e] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Force Sync Field Cases
            </button>
          </div>
        </div>
      )}

      {/* Account & Session Controls */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#5d6f6a]">
          Data & Session Controls
        </h3>

        <button
          onClick={() => navigate('splash')}
          className="w-full py-2.5 px-3 bg-[#e3f3ef] hover:bg-[#d0ece5] text-[#0e7c66] text-xs font-bold rounded-xl flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0e7c66]" /> Replay Launch Splash Screen
          </span>
          <ChevronRight className="w-4 h-4 text-[#0e7c66]" />
        </button>

        <button
          onClick={resetToSeedData}
          className="w-full py-2.5 px-3 bg-[#f2f6f5] hover:bg-[#e2ebe8] text-[#13231f] text-xs font-semibold rounded-xl flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-[#5d6f6a]" /> Reset All Demo Records to Authentic Baseline
          </span>
          <ChevronRight className="w-4 h-4 text-[#5d6f6a]" />
        </button>

        {currentUser && (
          <button
            onClick={logout}
            className="w-full py-2.5 px-3 bg-[#fdeaea] hover:bg-[#fbd5d5] text-[#e5484d] text-xs font-bold rounded-xl flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Sign Out from {currentUser.name}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 3. USER PROFILE SCREEN (ROLE-SPECIFIC)
// ==========================================
export const ProfileScreen: React.FC = () => {
  const {
    currentUser,
    patients,
    cases,
    appointments,
    logout,
    switchUserRole,
    updatePatientEmergencyContact,
    updateDoctorDutyStatus,
    navigate,
  } = useApp();

  const [profileTab, setProfileTab] = useState<'card' | 'vitals' | 'family' | 'ice' | 'duty'>('card');
  const [isEditingIce, setIsEditingIce] = useState(false);
  const [iceName, setIceName] = useState('');
  const [icePhone, setIcePhone] = useState('');
  const [iceRel, setIceRel] = useState('');

  // Patient resolution
  const myPid = currentUser?.pid || 'P-1001';
  const patient = patients.find(p => p.id === myPid) || patients[0];

  const handleSaveIce = () => {
    if (patient) {
      updatePatientEmergencyContact(patient.id, {
        name: iceName.trim() || patient.emg.name,
        phone: icePhone.trim() || patient.emg.phone,
        rel: iceRel.trim() || patient.emg.rel || 'Family',
      });
      setIsEditingIce(false);
    }
  };

  const startEditIce = () => {
    if (patient) {
      setIceName(patient.emg.name);
      setIcePhone(patient.emg.phone);
      setIceRel(patient.emg.rel || '');
      setIsEditingIce(true);
    }
  };

  // ----------------------------------------------------
  // DOCTOR PROFILE VIEW
  // ----------------------------------------------------
  if (currentUser?.role === 'doctor') {
    const doctor = DOCTORS.find(d => d.id === (currentUser.did || 'd1')) || DOCTORS[0];
    const hosp = HOSPITALS.find(h => h.id === doctor.h) || HOSPITALS[0];

    return (
      <div className="space-y-4 pb-20 pt-2 max-w-md mx-auto">
        {/* Doctor Identity Header */}
        <div className="bg-gradient-to-br from-[#083a30] to-[#0e7c66] rounded-2xl p-4 text-white shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 text-white text-base font-black flex items-center justify-center shrink-0 shadow-inner">
                DR
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-bold tracking-tight">{doctor.name}</h2>
                  <Award className="w-4 h-4 text-[#48e5c2]" />
                </div>
                <p className="text-xs text-white/85 font-medium">
                  {doctor.dept} • {doctor.edu}
                </p>
                <p className="text-[11px] text-white/70">
                  NMC Reg: <span className="font-mono font-bold text-[#48e5c2]">{doctor.nmcReg}</span>
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full inline-block">
                OPD Room {doctor.room}
              </span>
            </div>
          </div>

          {/* Interactive Duty Status Switcher */}
          <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs">
            <span className="text-white/80 text-[11px] font-medium">Duty Status:</span>
            <div className="flex items-center gap-1">
              {(['On Duty', 'In OT', 'Rounds', 'Off Duty'] as const).map(status => {
                const isActive = (doctor.dutyStatus || 'On Duty') === status;
                return (
                  <button
                    key={status}
                    onClick={() => updateDoctorDutyStatus(doctor.id, status)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      isActive
                        ? 'bg-white text-[#0e7c66] shadow-xs scale-105'
                        : 'bg-white/10 hover:bg-white/20 text-white/80'
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Doctor Professional Credentials & OPD Details */}
        <div className="bg-white rounded-2xl p-5 border border-[#e2ebe8] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#e2ebe8]">
            <Shield className="w-5 h-5 text-[#0e7c66]" />
            <div>
              <h3 className="text-sm font-bold text-[#13231f]">ABDM Healthcare Professional Registry (HPPR)</h3>
              <p className="text-[11px] text-[#5d6f6a]">Verified National Digital Health ID</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-[#f2f6f5] rounded-xl">
              <span className="text-[10px] text-[#5d6f6a] block">NMC Registration #</span>
              <span className="font-mono font-bold text-[#13231f]">{doctor.nmcReg}</span>
            </div>
            <div className="p-3 bg-[#f2f6f5] rounded-xl">
              <span className="text-[10px] text-[#5d6f6a] block">HPPR Health ID</span>
              <span className="font-mono font-bold text-[#0e7c66]">HP-MH-99412-DOC</span>
            </div>
            <div className="p-3 bg-[#f2f6f5] rounded-xl">
              <span className="text-[10px] text-[#5d6f6a] block">Specialty & Dept</span>
              <span className="font-bold text-[#13231f]">{doctor.dept}</span>
            </div>
            <div className="p-3 bg-[#f2f6f5] rounded-xl">
              <span className="text-[10px] text-[#5d6f6a] block">Qualifications</span>
              <span className="font-bold text-[#13231f]">{doctor.edu}</span>
            </div>
            <div className="p-3 bg-[#f2f6f5] rounded-xl">
              <span className="text-[10px] text-[#5d6f6a] block">OPD Room</span>
              <span className="font-bold text-[#13231f]">{doctor.room}</span>
            </div>
            <div className="p-3 bg-[#f2f6f5] rounded-xl">
              <span className="text-[10px] text-[#5d6f6a] block">OPD Timings</span>
              <span className="font-bold text-[#13231f]">{doctor.timings}</span>
            </div>
            <div className="p-3 bg-[#f2f6f5] rounded-xl col-span-2">
              <span className="text-[10px] text-[#5d6f6a] block">Daily OPD Allocation Quota</span>
              <span className="font-bold text-[#13231f]">{doctor.quota?.total || 40} Patients / Shift</span>
            </div>
          </div>

          <div className="p-3.5 bg-[#f2f6f5] rounded-xl text-xs space-y-1">
            <span className="font-bold text-[#13231f] block">Hospital Affiliation</span>
            <p className="text-[#0e7c66] font-bold">{hosp.name}</p>
            <p className="text-[11px] text-[#5d6f6a]">{hosp.addr}</p>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={logout}
          className="w-full py-2.5 bg-[#fdeaea] hover:bg-[#fbd5d5] text-[#e5484d] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out from Doctor Console</span>
        </button>
      </div>
    );
  }

  // ----------------------------------------------------
  // HEALTH WORKER (ASHA) PROFILE VIEW
  // ----------------------------------------------------
  if (currentUser?.role === 'worker') {
    return (
      <div className="space-y-4 pb-20 pt-2 max-w-md mx-auto">
        <div className="bg-white rounded-2xl p-5 border border-[#e2ebe8] shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-[#e2ebe8] pb-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0e7c66] text-white text-xl font-bold flex items-center justify-center shrink-0 shadow-sm">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0e7c66] bg-[#e3f3ef] px-2 py-0.5 rounded-full inline-block mb-1">
                Accredited Social Health Activist (ASHA)
              </span>
              <h2 className="text-base font-bold text-[#13231f]">Surekha Gavde</h2>
              <p className="text-xs text-[#5d6f6a]">
                Worker ID: <span className="font-mono font-bold text-[#13231f]">HW-01</span> • Gangapur
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-[#f2f6f5] rounded-xl">
              <span className="text-[10px] text-[#5d6f6a] block">Village / Panchayat</span>
              <span className="font-bold text-[#13231f]">Gangapur Sub-Center 1</span>
            </div>
            <div className="p-2.5 bg-[#f2f6f5] rounded-xl">
              <span className="text-[10px] text-[#5d6f6a] block">Population Covered</span>
              <span className="font-bold text-[#13231f]">1,420 Citizens</span>
            </div>
            <div className="p-2.5 bg-[#f2f6f5] rounded-xl">
              <span className="text-[10px] text-[#5d6f6a] block">MCH Mothers Tracked</span>
              <span className="font-bold text-[#13231f]">18 Active (ANC/PNC)</span>
            </div>
            <div className="p-2.5 bg-[#e3f3ef] rounded-xl border border-[#0e7c66]/20">
              <span className="text-[10px] text-[#0e7c66] font-semibold block">Field Sync Status</span>
              <span className="font-bold text-[#0e7c66] flex items-center gap-1">
                <Radio className="w-3 h-3 text-[#0e7c66]" /> 100% Operational
              </span>
            </div>
          </div>

          <div className="p-3 bg-[#f2f6f5] rounded-xl text-xs space-y-1">
            <span className="font-bold text-[#13231f] block">Primary Referral Center</span>
            <p className="text-[#5d6f6a]">PHC Gangapur / District Civil Hospital Nashik</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full py-2.5 bg-[#fdeaea] text-[#e5484d] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out from Field Portal</span>
        </button>
      </div>
    );
  }

  // ----------------------------------------------------
  // HOSPITAL ADMIN PROFILE VIEW
  // ----------------------------------------------------
  if (currentUser?.role === 'hospital') {
    const hosp = HOSPITALS[0];

    return (
      <div className="space-y-4 pb-20 pt-2 max-w-md mx-auto">
        <div className="bg-white rounded-2xl p-5 border border-[#e2ebe8] shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-[#e2ebe8] pb-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0e7c66] text-white text-xl font-bold flex items-center justify-center shrink-0 shadow-sm">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0e7c66] bg-[#e3f3ef] px-2 py-0.5 rounded-full inline-block mb-1">
                {hosp.nabhTier}
              </span>
              <h2 className="text-base font-bold text-[#13231f]">{hosp.name}</h2>
              <p className="text-xs text-[#5d6f6a]">{hosp.type} • Superintendent: {hosp.superintendent}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-[#f2f6f5] rounded-xl">
              <span className="text-[10px] text-[#5d6f6a] block">Total Beds</span>
              <span className="font-bold text-[#13231f]">{hosp.beds} Beds ({hosp.occupiedBeds} Inpatients)</span>
            </div>
            <div className="p-2.5 bg-[#f2f6f5] rounded-xl">
              <span className="text-[10px] text-[#5d6f6a] block">Critical Care / ICU</span>
              <span className="font-bold text-[#13231f]">{hosp.icuBeds} ICU ({hosp.icuOccupied} Occupied)</span>
            </div>
            <div className="p-2.5 bg-[#f2f6f5] rounded-xl">
              <span className="text-[10px] text-[#5d6f6a] block">Liquid Oxygen Plant</span>
              <span className="font-bold text-[#0e7c66]">{hosp.oxygenPurity}</span>
            </div>
            <div className="p-2.5 bg-[#e3f3ef] rounded-xl border border-[#0e7c66]/20">
              <span className="text-[10px] text-[#0e7c66] font-semibold block">Ayushman Mitra Desk</span>
              <span className="font-bold text-[#0e7c66]">{hosp.pmjayDesk}</span>
            </div>
          </div>

          <div className="p-3 bg-[#f2f6f5] rounded-xl text-xs space-y-1">
            <span className="font-bold text-[#13231f] block">Emergency Control Hotline</span>
            <p className="text-[#5d6f6a] font-mono">{hosp.phone} (24x7 Direct Resuscitation Line)</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full py-2.5 bg-[#fdeaea] text-[#e5484d] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out from Hospital Desk</span>
        </button>
      </div>
    );
  }

  // ----------------------------------------------------
  // PATIENT PROFILE VIEW (MULTI-SECTION & RECONSTRUCTED)
  // ----------------------------------------------------
  return (
    <div className="space-y-4 pb-20 pt-2 max-w-md mx-auto">
      {/* Profile Section Tabs */}
      <div className="flex bg-white rounded-2xl p-1 border border-[#e2ebe8] shadow-2xs overflow-x-auto">
        <button
          onClick={() => setProfileTab('card')}
          className={`flex-1 min-w-[75px] py-1.5 px-2 text-[11px] rounded-xl font-bold transition-all text-center ${
            profileTab === 'card' ? 'bg-[#0e7c66] text-white' : 'text-[#5d6f6a] hover:text-[#13231f]'
          }`}
        >
          ABHA Card
        </button>
        <button
          onClick={() => setProfileTab('vitals')}
          className={`flex-1 min-w-[75px] py-1.5 px-2 text-[11px] rounded-xl font-bold transition-all text-center ${
            profileTab === 'vitals' ? 'bg-[#0e7c66] text-white' : 'text-[#5d6f6a] hover:text-[#13231f]'
          }`}
        >
          Vitals
        </button>
        <button
          onClick={() => setProfileTab('family')}
          className={`flex-1 min-w-[75px] py-1.5 px-2 text-[11px] rounded-xl font-bold transition-all text-center ${
            profileTab === 'family' ? 'bg-[#0e7c66] text-white' : 'text-[#5d6f6a] hover:text-[#13231f]'
          }`}
        >
          Family
        </button>
        <button
          onClick={() => setProfileTab('ice')}
          className={`flex-1 min-w-[75px] py-1.5 px-2 text-[11px] rounded-xl font-bold transition-all text-center ${
            profileTab === 'ice' ? 'bg-[#0e7c66] text-white' : 'text-[#5d6f6a] hover:text-[#13231f]'
          }`}
        >
          Emergency
        </button>
      </div>

      {/* 1. Official ABDM Health Card */}
      {profileTab === 'card' && (
        <div className="space-y-3">
          <div
            id="print-area"
            className="bg-white rounded-2xl p-5 border border-[#e2ebe8] shadow-sm text-center space-y-4"
          >
            <div className="border-b border-[#e2ebe8] pb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0e7c66] bg-[#e3f3ef] px-2.5 py-0.5 rounded-full">
                  Ayushman Bharat Health Account
                </span>
                <span className="text-[10px] font-bold text-[#5d6f6a] bg-[#f2f6f5] px-2 py-0.5 rounded-full border border-[#e2ebe8]">
                  NHA Certified
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#13231f]">{patient?.name}</h2>
              <p className="text-xs text-[#5d6f6a]">
                {patient?.gender} • {patient?.age} yrs • Blood Group{' '}
                <span className="font-bold text-[#e5484d]">{patient?.blood}</span>
              </p>
              <div className="mt-1 inline-flex items-center gap-1.5 bg-[#f2f6f5] px-2.5 py-1 rounded-lg border border-[#e2ebe8]">
                <CreditCard className="w-3.5 h-3.5 text-[#0e7c66]" />
                <span className="text-xs font-mono font-bold text-[#13231f]">
                  {patient?.abhaId || '91-4521-8890-1234'}
                </span>
              </div>
            </div>

            {/* Large QR code */}
            <div className="flex justify-center py-1">
              <div
                className="p-3 border border-[#e2ebe8] rounded-2xl bg-white shadow-2xs"
                dangerouslySetInnerHTML={{
                  __html: generateQrSvg(
                    `ABHA:${patient?.abhaId || patient?.id}|NAME:${patient?.name}|BLOOD:${patient?.blood}`,
                    135
                  ),
                }}
              />
            </div>

            {/* Details */}
            <div className="bg-[#f2f6f5] rounded-xl p-3 text-xs text-left space-y-1.5 border border-[#e2ebe8]">
              <div className="flex justify-between">
                <span className="text-[#5d6f6a]">ABHA Address (@abdm)</span>
                <span className="font-mono font-bold text-[#0e7c66]">
                  {patient?.abhaAddress || `${patient?.name.toLowerCase().replace(/\s+/g, '.')}@abdm`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5d6f6a]">PM-JAY Scheme ID</span>
                <span className="font-mono font-bold text-[#13231f]">
                  {patient?.pmjayId || 'PMJAY-MH-2024-884102'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5d6f6a]">Registered Mobile</span>
                <span className="font-bold text-[#13231f]">{patient?.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5d6f6a]">District / State</span>
                <span className="font-medium text-[#13231f]">Nashik, Maharashtra</span>
              </div>
            </div>

            {patient?.allergies && patient.allergies.length > 0 && (
              <div className="p-2.5 bg-[#fdeaea] rounded-xl text-xs text-[#e5484d] flex items-center justify-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>
                  <strong>Documented Drug Allergies:</strong> {patient.allergies.join(', ')}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => window.print()}
            className="w-full py-2.5 bg-white border border-[#e2ebe8] hover:bg-[#f2f6f5] text-[#13231f] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-[#5d6f6a]" />
            <span>Print Official Health ID Card</span>
          </button>
        </div>
      )}

      {/* 2. Clinical Vitals & Baseline */}
      {profileTab === 'vitals' && (
        <div className="bg-white rounded-2xl p-5 border border-[#e2ebe8] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#e2ebe8] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#13231f]">Clinical Baseline & Vitals</h3>
              <p className="text-[11px] text-[#5d6f6a]">Last verified during OPD triage consultation</p>
            </div>
            <Activity className="w-5 h-5 text-[#0e7c66]" />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-[#f2f6f5] rounded-xl border border-[#e2ebe8]">
              <span className="text-[10px] text-[#5d6f6a] block">Blood Pressure</span>
              <span className="text-sm font-bold text-[#13231f]">{patient?.vitals?.bp || '120/80 mmHg'}</span>
            </div>
            <div className="p-3 bg-[#f2f6f5] rounded-xl border border-[#e2ebe8]">
              <span className="text-[10px] text-[#5d6f6a] block">Heart Rate / Pulse</span>
              <span className="text-sm font-bold text-[#13231f]">{patient?.vitals?.pulse || '74 bpm'}</span>
            </div>
            <div className="p-3 bg-[#f2f6f5] rounded-xl border border-[#e2ebe8]">
              <span className="text-[10px] text-[#5d6f6a] block">Oxygen Saturation (SpO2)</span>
              <span className="text-sm font-bold text-[#0e7c66]">{patient?.vitals?.spo2 || '98%'}</span>
            </div>
            <div className="p-3 bg-[#f2f6f5] rounded-xl border border-[#e2ebe8]">
              <span className="text-[10px] text-[#5d6f6a] block">Body Temp</span>
              <span className="text-sm font-bold text-[#13231f]">{patient?.vitals?.temp || '98.4 °F'}</span>
            </div>
            <div className="p-3 bg-[#f2f6f5] rounded-xl border border-[#e2ebe8]">
              <span className="text-[10px] text-[#5d6f6a] block">BMI Score</span>
              <span className="text-sm font-bold text-[#13231f]">{patient?.vitals?.bmi || '24.1'}</span>
            </div>
            <div className="p-3 bg-[#f2f6f5] rounded-xl border border-[#e2ebe8]">
              <span className="text-[10px] text-[#5d6f6a] block">Height & Weight</span>
              <span className="text-sm font-bold text-[#13231f]">
                {patient?.vitals?.height || '171 cm'} • {patient?.vitals?.weight || '70 kg'}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <span className="text-xs font-bold text-[#13231f] block mb-1">Ongoing Regular Medications</span>
              <div className="space-y-1">
                {patient?.meds && patient.meds.length > 0 ? (
                  patient.meds.map((m, idx) => (
                    <div key={idx} className="p-2 bg-[#f2f6f5] rounded-lg text-xs font-medium text-[#13231f]">
                      • {m}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#5d6f6a]">No daily maintenance medications recorded.</p>
                )}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-[#13231f] block mb-1">Chronic Diagnoses / Pre-existing</span>
              <div className="space-y-1">
                {patient?.cond && patient.cond.length > 0 ? (
                  patient.cond.map((c, idx) => (
                    <div key={idx} className="p-2 bg-[#e3f3ef] rounded-lg text-xs font-semibold text-[#0e7c66]">
                      • {c}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#5d6f6a]">No chronic illnesses documented.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Family Members / Switch Active Patient */}
      {profileTab === 'family' && (
        <div className="bg-white rounded-2xl p-5 border border-[#e2ebe8] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#e2ebe8] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#13231f]">Connected Family Members</h3>
              <p className="text-[11px] text-[#5d6f6a]">Switch active profile to manage appointments & records</p>
            </div>
            <Users className="w-5 h-5 text-[#0e7c66]" />
          </div>

          <div className="space-y-2">
            {patients.map(p => {
              const isActive = p.id === patient?.id;
              return (
                <div
                  key={p.id}
                  onClick={() => switchUserRole('patient', p.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-[#e3f3ef] border-[#0e7c66] shadow-2xs'
                      : 'bg-[#f2f6f5] border-[#e2ebe8] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center ${
                        isActive ? 'bg-[#0e7c66] text-white' : 'bg-white text-[#13231f] border border-[#e2ebe8]'
                      }`}
                    >
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#13231f]">{p.name}</span>
                        {isActive && (
                          <span className="text-[9px] bg-[#0e7c66] text-white px-1.5 py-0.5 rounded-full font-bold">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#5d6f6a]">
                        {p.gender} • {p.age} yrs • {p.cond?.[0] || 'General'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#5d6f6a]" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Emergency (ICE) Contact */}
      {profileTab === 'ice' && (
        <div className="bg-white rounded-2xl p-5 border border-[#e2ebe8] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#e2ebe8] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#13231f]">Emergency Contact (In Case of Emergency)</h3>
              <p className="text-[11px] text-[#5d6f6a]">Notified automatically during critical trauma admissions</p>
            </div>
            <Phone className="w-5 h-5 text-[#e5484d]" />
          </div>

          {!isEditingIce ? (
            <div className="space-y-3">
              <div className="p-3.5 bg-[#fdeaea]/40 border border-[#e5484d]/20 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#5d6f6a]">Primary Contact</span>
                  <span className="text-xs font-bold text-[#13231f]">
                    {patient?.emg?.name} ({patient?.emg?.rel || 'Family'})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#5d6f6a]">Emergency Mobile</span>
                  <a
                    href={`tel:${patient?.emg?.phone}`}
                    className="text-xs font-bold text-[#e5484d] hover:underline"
                  >
                    {patient?.emg?.phone}
                  </a>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={`tel:${patient?.emg?.phone}`}
                  className="flex-1 py-2.5 bg-[#e5484d] hover:bg-[#c93b40] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-4 h-4" /> Call Emergency Contact
                </a>
                <button
                  onClick={startEditIce}
                  className="py-2.5 px-3 bg-[#f2f6f5] hover:bg-[#e2ebe8] text-[#13231f] text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-[#5d6f6a]" /> Edit
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-[#13231f] mb-1">
                  Contact Full Name
                </label>
                <input
                  type="text"
                  value={iceName}
                  onChange={e => setIceName(e.target.value)}
                  placeholder="e.g. Sunita Patil"
                  className="w-full bg-[#f2f6f5] border border-[#e2ebe8] rounded-xl px-3 py-2 text-xs text-[#13231f] focus:outline-none focus:border-[#0e7c66]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#13231f] mb-1">
                  Relationship
                </label>
                <input
                  type="text"
                  value={iceRel}
                  onChange={e => setIceRel(e.target.value)}
                  placeholder="e.g. Spouse / Son / Brother"
                  className="w-full bg-[#f2f6f5] border border-[#e2ebe8] rounded-xl px-3 py-2 text-xs text-[#13231f] focus:outline-none focus:border-[#0e7c66]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#13231f] mb-1">
                  Emergency Mobile Number
                </label>
                <input
                  type="tel"
                  value={icePhone}
                  onChange={e => setIcePhone(e.target.value)}
                  placeholder="e.g. 9822011223"
                  className="w-full bg-[#f2f6f5] border border-[#e2ebe8] rounded-xl px-3 py-2 text-xs text-[#13231f] focus:outline-none focus:border-[#0e7c66]"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSaveIce}
                  className="flex-1 py-2.5 bg-[#0e7c66] hover:bg-[#0a5f4e] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Save className="w-4 h-4" /> Save Emergency Contact
                </button>
                <button
                  onClick={() => setIsEditingIce(false)}
                  className="py-2.5 px-3 bg-[#f2f6f5] hover:bg-[#e2ebe8] text-[#13231f] text-xs font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Logout button */}
      <button
        onClick={logout}
        className="w-full py-2.5 bg-[#fdeaea] text-[#e5484d] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out from Patient Account</span>
      </button>
    </div>
  );
};

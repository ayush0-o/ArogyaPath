import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  PlusCircle,
  RefreshCw,
  FolderOpen,
  WifiOff,
  Wifi,
  ChevronRight,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { fmtDate } from '../lib/utils';

export const WorkerHomeScreen: React.FC = () => {
  const {
    currentUser,
    patients,
    cases,
    isOfflineMode,
    toggleOfflineMode,
    syncOfflineQueue,
    navigate,
  } = useApp();

  const [search, setSearch] = useState('');
  const [syncing, setSyncing] = useState(false);

  const unsyncedCases = cases.filter(c => c.status === 'offlineSaved');

  const filteredPatients = patients.filter(
    p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.addr.toLowerCase().includes(search.toLowerCase())
  );

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncOfflineQueue();
    } finally {
      setTimeout(() => setSyncing(false), 800);
    }
  };

  return (
    <div className="space-y-4 pb-20 pt-2">
      {/* Worker Field Header */}
      <div className="bg-gradient-to-br from-[#2f6fed] to-[#1f4fad] rounded-2xl p-4 text-white shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md inline-block mb-1">
              Field Health Worker (ASHA / ANM)
            </span>
            <h2 className="text-lg font-bold">{currentUser?.name || 'Suresh Gavde'}</h2>
            <p className="text-xs text-white/80">Gangapur PHC Cluster • Nashik District</p>
          </div>
          <button
            onClick={toggleOfflineMode}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
              isOfflineMode
                ? 'bg-[#fdf3dd] text-[#e8a013]'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {isOfflineMode ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            <span>{isOfflineMode ? 'Offline' : 'Online'}</span>
          </button>
        </div>

        {/* Sync status card */}
        <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
          <div>
            <span className="text-xs text-white/90 font-medium block">
              {unsyncedCases.length === 0
                ? 'All field records synchronized'
                : `${unsyncedCases.length} record(s) pending sync`}
            </span>
            <span className="text-[10px] text-white/70">Local SQLite/IndexedDB active</span>
          </div>

          <button
            onClick={handleSync}
            disabled={syncing || unsyncedCases.length === 0}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              unsyncedCases.length > 0
                ? 'bg-white text-[#2f6fed] shadow-xs hover:bg-white/90'
                : 'bg-white/20 text-white/60 cursor-not-allowed'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>Sync Now</span>
          </button>
        </div>
      </div>

      {/* Field Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('worker-new-case')}
          className="bg-white border border-[#e2ebe8] hover:border-[#2f6fed] p-4 rounded-2xl shadow-xs text-left group flex flex-col justify-between h-28"
        >
          <div className="w-10 h-10 rounded-xl bg-[#e8effd] text-[#2f6fed] flex items-center justify-center group-hover:scale-105 transition-transform">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#13231f] group-hover:text-[#2f6fed]">
              Assisted Intake
            </h3>
            <p className="text-[10px] text-[#5d6f6a]">Record rural patient case</p>
          </div>
        </button>

        <button
          onClick={() => navigate('register-patient')}
          className="bg-white border border-[#e2ebe8] hover:border-[#0e7c66] p-4 rounded-2xl shadow-xs text-left group flex flex-col justify-between h-28"
        >
          <div className="w-10 h-10 rounded-xl bg-[#e3f3ef] text-[#0e7c66] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#13231f] group-hover:text-[#0e7c66]">
              Enroll Patient
            </h3>
            <p className="text-[10px] text-[#5d6f6a]">Issue health ID card</p>
          </div>
        </button>
      </div>

      {/* Patients Directory */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2ebe8] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#5d6f6a]">
            Assigned Village Registry ({filteredPatients.length})
          </h3>
          <button
            onClick={() => navigate('worker-patients')}
            className="text-xs text-[#2f6fed] font-semibold hover:underline"
          >
            Full List
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by patient name, phone, village..."
            className="w-full bg-[#f2f6f5] border border-[#e2ebe8] rounded-xl px-3 py-2 text-xs text-[#13231f] pl-8 focus:outline-none focus:border-[#2f6fed]"
          />
          <Search className="w-4 h-4 text-[#5d6f6a] absolute left-2.5 top-2.5" />
        </div>

        <div className="space-y-2">
          {filteredPatients.slice(0, 4).map(p => (
            <div
              key={p.id}
              onClick={() => navigate('patient-detail', { patientId: p.id })}
              className="p-3 rounded-xl border border-[#e2ebe8] hover:border-[#2f6fed] hover:bg-[#f2f6f5] transition-all cursor-pointer flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs font-bold text-[#13231f]">{p.name}</h4>
                <p className="text-[11px] text-[#5d6f6a]">
                  {p.gender}, {p.age} yrs • {p.phone} • {p.addr}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#5d6f6a]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

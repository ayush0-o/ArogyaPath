import React from 'react';
import { useApp } from '../context/AppContext';
import { I18N } from '../data/i18n';
import {
  ArrowLeft,
  Bell,
  Wifi,
  WifiOff,
  User as UserIcon,
  Stethoscope,
  Building2,
  Users,
  Settings,
  RefreshCw,
} from 'lucide-react';

interface TopBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  showOfflineBadge?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  showOfflineBadge = true,
}) => {
  const {
    currentUser,
    settings,
    notifications,
    isOfflineMode,
    toggleOfflineMode,
    syncOfflineQueue,
    cases,
    navigate,
    goBack,
  } = useApp();

  const [isSyncing, setIsSyncing] = React.useState(false);
  const unreadCount = currentUser
    ? notifications.filter(
        n =>
          n.role === currentUser.role &&
          n.uid === (currentUser.pid || currentUser.did || currentUser.wid || currentUser.hid || '') &&
          !n.read
      ).length
    : 0;

  const unsyncedCasesCount = cases.filter(c => c.status === 'offlineSaved').length;

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncOfflineQueue();
    } finally {
      setTimeout(() => setIsSyncing(false), 600);
    }
  };

  const getRoleIcon = () => {
    if (!currentUser) return <UserIcon className="w-4 h-4" />;
    switch (currentUser.role) {
      case 'doctor':
        return <Stethoscope className="w-4 h-4 text-[#0e7c66]" />;
      case 'worker':
        return <Users className="w-4 h-4 text-[#2f6fed]" />;
      case 'hospital':
        return <Building2 className="w-4 h-4 text-[#e8a013]" />;
      default:
        return <UserIcon className="w-4 h-4 text-[#0e7c66]" />;
    }
  };

  const roleLabel = {
    patient: 'Patient Portal',
    doctor: 'Doctor Clinic',
    worker: 'Health Worker',
    hospital: 'OPD Admin',
    admin: 'System Admin',
  }[currentUser?.role || 'patient'];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#e2ebe8] px-4 py-3 shadow-xs">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {showBack ? (
            <button
              onClick={onBack || goBack}
              className="p-1.5 -ml-1 text-[#13231f] hover:bg-[#f2f6f5] rounded-full transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div
              onClick={() => navigate('welcome')}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0e7c66] to-[#0a5f4e] flex items-center justify-center text-white font-bold text-sm shadow-xs cursor-pointer select-none shrink-0"
              title="ArogyaPath Switch Portal"
            >
              आ
            </div>
          )}

          <div className="min-w-0">
            {title ? (
              <>
                <h1 className="text-[15px] font-bold text-[#13231f] leading-tight truncate">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-[11px] text-[#5d6f6a] truncate">{subtitle}</p>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-bold text-[#13231f] truncate">
                    {currentUser ? currentUser.name : 'ArogyaPath (आरोग्य पथ)'}
                  </span>
                  {currentUser && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 bg-[#e3f3ef] text-[#0e7c66] rounded-full">
                      {getRoleIcon()}
                      {currentUser.role}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#5d6f6a] truncate">
                  {currentUser ? roleLabel : I18N[settings.lang].safetyNotice}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {showOfflineBadge && (
            <button
              onClick={toggleOfflineMode}
              title={isOfflineMode ? 'Offline Mode Active' : 'Online'}
              className={`p-1.5 rounded-full text-xs transition-colors flex items-center gap-1 ${
                isOfflineMode
                  ? 'bg-[#fdf3dd] text-[#e8a013] border border-[#e8a013]/30'
                  : 'text-[#5d6f6a] hover:bg-[#f2f6f5]'
              }`}
            >
              {isOfflineMode ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
            </button>
          )}

          {unsyncedCasesCount > 0 && (
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className={`px-2 py-1 bg-[#e3f3ef] text-[#0e7c66] hover:bg-[#d0ebd6] rounded-full text-[11px] font-medium flex items-center gap-1 transition-all ${
                isSyncing ? 'animate-pulse' : ''
              }`}
              title="Sync unsynced records"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{unsyncedCasesCount}</span>
            </button>
          )}

          {currentUser && (
            <button
              onClick={() => navigate('notifications')}
              className="relative p-1.5 text-[#5d6f6a] hover:bg-[#f2f6f5] rounded-full transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#e5484d] rounded-full ring-2 ring-white" />
              )}
            </button>
          )}

          <button
            onClick={() => navigate('settings')}
            className="p-1.5 text-[#5d6f6a] hover:bg-[#f2f6f5] rounded-full transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

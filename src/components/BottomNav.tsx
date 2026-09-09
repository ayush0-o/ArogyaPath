import React from 'react';
import { useApp } from '../context/AppContext';
import { I18N } from '../data/i18n';
import {
  Home,
  FileText,
  Calendar,
  Users,
  Building2,
  FolderOpen,
  UserCheck,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentUser, settings, activeScreen, navigate } = useApp();

  if (!currentUser) return null;

  const lang = settings.lang;
  const role = currentUser.role;

  // Render navigation tabs per role exactly matching final_kimi01.html
  const renderNavItems = () => {
    switch (role) {
      case 'patient':
        return [
          { id: 'home', label: I18N[lang].home, icon: Home, target: 'home' },
          { id: 'my-cases', label: I18N[lang].cases, icon: FileText, target: 'my-cases' },
          { id: 'my-appts', label: I18N[lang].appts, icon: Calendar, target: 'my-appts' },
          { id: 'hospitals', label: I18N[lang].hospitals, icon: Building2, target: 'hospitals' },
          { id: 'profile', label: I18N[lang].profile, icon: UserCheck, target: 'profile' },
        ];

      case 'doctor':
        return [
          { id: 'home', label: I18N[lang].home, icon: Home, target: 'home' },
          { id: 'doctor-cases', label: I18N[lang].cases, icon: FileText, target: 'doctor-cases' },
          { id: 'doctor-schedule', label: I18N[lang].appts, icon: Calendar, target: 'doctor-schedule' },
          { id: 'profile', label: I18N[lang].profile, icon: UserCheck, target: 'profile' },
        ];

      case 'worker':
        return [
          { id: 'home', label: I18N[lang].home, icon: Home, target: 'home' },
          { id: 'worker-patients', label: I18N[lang].patients, icon: Users, target: 'worker-patients' },
          { id: 'worker-cases', label: I18N[lang].records, icon: FolderOpen, target: 'worker-cases' },
          { id: 'profile', label: I18N[lang].profile, icon: UserCheck, target: 'profile' },
        ];

      case 'hospital':
        return [
          { id: 'home', label: 'OPD Queue', icon: Users, target: 'home' },
          { id: 'hospital-doctors', label: 'Doctors', icon: UserCheck, target: 'hospital-doctors' },
          { id: 'hospital-beds', label: 'Capacity', icon: Building2, target: 'hospital-beds' },
          { id: 'profile', label: I18N[lang].profile, icon: Home, target: 'profile' },
        ];

      default:
        return [];
    }
  };

  const navItems = renderNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#e2ebe8] px-2 py-1.5 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeScreen === item.target || activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.target)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all min-w-[56px] ${
                isActive
                  ? 'text-[#0e7c66] font-semibold scale-105'
                  : 'text-[#5d6f6a] hover:text-[#13231f]'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.4px]' : 'stroke-[1.8px]'}`} />
              <span className="text-[10.5px] leading-tight tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

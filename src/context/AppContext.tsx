import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Patient,
  MedicalCase,
  Appointment,
  AppNotification,
  AppSettings,
  UserRole,
  PatientEmergencyContact,
} from '../types';
import { today, addDays, uid } from '../lib/utils';
import { offlineDB } from '../lib/offlineDb';
import { getExpandedInitialSeed, DEFAULT_APP_SETTINGS } from '../data/seedData';
import { DUMMY_CLINICAL_RECORDS } from '../data/clinicalRecordsData';

interface AppContextType {
  currentUser: User | null;
  settings: AppSettings;
  patients: Patient[];
  cases: MedicalCase[];
  appointments: Appointment[];
  notifications: AppNotification[];
  isOfflineMode: boolean;
  activeScreen: string;
  screenParams: Record<string, any>;
  navigate: (screen: string, params?: Record<string, any>) => void;
  goBack: () => void;
  login: (key: string, role?: UserRole) => boolean;
  logout: () => void;
  registerPatient: (patientData: Partial<Patient>, pass: string) => Patient;
  registerStaff: (data: any, role: UserRole) => User;
  saveCase: (caseItem: MedicalCase) => void;
  bookAppointment: (appt: Omit<Appointment, 'id' | 'reg'>) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  addDoctorNote: (caseId: string, noteText: string) => void;
  setFollowUp: (caseId: string, date: string, note: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleOfflineMode: () => void;
  syncOfflineQueue: () => Promise<number>;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetToSeedData: () => void;
  switchUserRole: (role: UserRole, targetPid?: string) => void;
  updatePatientEmergencyContact: (pid: string, emg: PatientEmergencyContact) => void;
  updateDoctorDutyStatus: (did: string, status: 'On Duty' | 'In OT' | 'Rounds' | 'Off Duty') => void;
}

const LOCAL_STORAGE_KEY = 'arogyapath_fullstack_state_v3';

const getInitialSeed = () => getExpandedInitialSeed();

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeScreen, setActiveScreen] = useState<string>('splash');
  const [screenParams, setScreenParams] = useState<Record<string, any>>({});
  const [navigationStack, setNavigationStack] = useState<{ screen: string; params: any }[]>([]);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);

  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [cases, setCases] = useState<MedicalCase[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Load from local storage or initialize seed
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const rawPatients: Patient[] = parsed.patients || [];
        const enriched = rawPatients.map(p => ({
          ...p,
          clinicalRecords: (p.clinicalRecords && p.clinicalRecords.length > 0)
            ? p.clinicalRecords
            : (DUMMY_CLINICAL_RECORDS[p.id] || []),
        }));
        setPatients(enriched);
        setCases(parsed.cases || []);
        setAppointments(parsed.appointments || []);
        setNotifications(parsed.notifications || []);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.currentUser) setCurrentUser(parsed.currentUser);
      } else {
        const seed = getInitialSeed();
        setPatients(seed.patients);
        setCases(seed.cases);
        setAppointments(seed.appointments);
        setNotifications(seed.notifications);
      }
    } catch {
      const seed = getInitialSeed();
      setPatients(seed.patients);
      setCases(seed.cases);
      setAppointments(seed.appointments);
      setNotifications(seed.notifications);
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (patients.length > 0) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          patients,
          cases,
          appointments,
          notifications,
          settings,
          currentUser,
        })
      );
    }
  }, [patients, cases, appointments, notifications, settings, currentUser]);

  // Sync IndexedDB cache
  useEffect(() => {
    if (patients.length > 0) {
      offlineDB.patients.bulkPut(patients).catch(() => {});
    }
    if (cases.length > 0) {
      offlineDB.cases.bulkPut(cases).catch(() => {});
    }
  }, [patients, cases]);

  // Handle Accessibility classes
  useEffect(() => {
    if (settings.big) {
      document.body.classList.add('big-text');
    } else {
      document.body.classList.remove('big-text');
    }

    if (settings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [settings.big, settings.highContrast]);

  const navigate = (screen: string, params: Record<string, any> = {}) => {
    setNavigationStack(prev => [...prev, { screen: activeScreen, params: screenParams }]);
    setActiveScreen(screen);
    setScreenParams(params);
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (navigationStack.length > 0) {
      const prev = navigationStack[navigationStack.length - 1];
      setNavigationStack(prevStack => prevStack.slice(0, -1));
      setActiveScreen(prev.screen);
      setScreenParams(prev.params || {});
    } else {
      setActiveScreen('home');
      setScreenParams({});
    }
    window.scrollTo(0, 0);
  };

  const login = (key: string, overrideRole?: UserRole): boolean => {
    const k = key.trim().toLowerCase();

    // Built-in demo accounts
    if (k === 'doctor@demo.com' || overrideRole === 'doctor') {
      const user: User = {
        id: 'u-doc-1',
        key: 'doctor@demo.com',
        name: 'Dr. Priya Sharma',
        role: 'doctor',
        email: 'doctor@demo.com',
        did: 'd1',
      };
      setCurrentUser(user);
      setNavigationStack([]);
      setActiveScreen('home');
      return true;
    }
    if (k === 'worker@demo.com' || overrideRole === 'worker') {
      const user: User = {
        id: 'u-hw-1',
        key: 'worker@demo.com',
        name: 'Surekha Gavde (ASHA)',
        role: 'worker',
        email: 'worker@demo.com',
        wid: 'HW-01',
        village: 'Gangapur',
      };
      setCurrentUser(user);
      setNavigationStack([]);
      setActiveScreen('home');
      return true;
    }
    if (k === 'hospital@demo.com' || overrideRole === 'hospital') {
      const user: User = {
        id: 'u-hosp-1',
        key: 'hospital@demo.com',
        name: 'District General Hospital, Nashik',
        role: 'hospital',
        email: 'hospital@demo.com',
        hid: 'h1',
      };
      setCurrentUser(user);
      setNavigationStack([]);
      setActiveScreen('home');
      return true;
    }

    // Patient login by phone or ID or overrideRole
    const foundPat = patients.find(
      p => p.phone === k || p.id.toLowerCase() === k || p.name.toLowerCase().includes(k)
    );
    if (foundPat) {
      const user: User = {
        id: 'u-' + foundPat.id,
        key: foundPat.phone,
        name: foundPat.name,
        role: 'patient',
        phone: foundPat.phone,
        pid: foundPat.id,
      };
      setCurrentUser(user);
      setNavigationStack([]);
      setActiveScreen('home');
      return true;
    }

    if (overrideRole === 'patient') {
      const defaultPat = patients[0] || {
        id: 'P-1001',
        name: 'Ramesh Patil',
        phone: '9876543210',
      };
      const user: User = {
        id: 'u-' + defaultPat.id,
        key: defaultPat.phone,
        name: defaultPat.name,
        role: 'patient',
        phone: defaultPat.phone,
        pid: defaultPat.id,
      };
      setCurrentUser(user);
      setNavigationStack([]);
      setActiveScreen('home');
      return true;
    }

    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setNavigationStack([]);
    setActiveScreen('welcome');
  };

  const registerPatient = (patientData: Partial<Patient>, _pass: string): Patient => {
    const newId = 'P-' + (1000 + patients.length + 1);
    const newPat: Patient = {
      id: newId,
      name: patientData.name || 'New Patient',
      age: patientData.age || 30,
      gender: patientData.gender || 'Male',
      phone: patientData.phone || '',
      addr: patientData.addr || 'Nashik',
      dob: patientData.dob || '',
      blood: patientData.blood || 'Unknown',
      emg: patientData.emg || { name: 'Family', phone: '9800000000' },
      allergies: patientData.allergies || [],
      cond: patientData.cond || [],
      meds: patientData.meds || [],
      hist: 'Registered through ArogyaPath self-registration.',
      acct: 'patient',
    };

    setPatients(prev => [newPat, ...prev]);

    const newUser: User = {
      id: 'u-' + newId,
      key: newPat.phone,
      name: newPat.name,
      role: 'patient',
      phone: newPat.phone,
      pid: newId,
    };
    setCurrentUser(newUser);
    setNavigationStack([]);
    setActiveScreen('home');
    return newPat;
  };

  const registerStaff = (data: any, role: UserRole): User => {
    const newUser: User = {
      id: 'u-staff-' + uid(),
      key: data.email || data.name,
      name: data.name,
      role,
      email: data.email,
      village: data.village,
      did: role === 'doctor' ? 'd1' : undefined,
      wid: role === 'worker' ? 'HW-' + (patients.length + 1) : undefined,
      hid: role === 'hospital' ? 'h1' : undefined,
    };
    setCurrentUser(newUser);
    setNavigationStack([]);
    setActiveScreen('home');
    return newUser;
  };

  const saveCase = (caseItem: MedicalCase) => {
    setCases(prev => {
      const idx = prev.findIndex(c => c.id === caseItem.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = caseItem;
        return next;
      }
      return [caseItem, ...prev];
    });

    if (caseItem.status === 'offlineSaved') {
      offlineDB.syncOutbox.put({
        id: uid('SYNC-'),
        type: 'CASE',
        payload: caseItem,
        status: 'PENDING',
        createdAt: today(),
      });
    }
  };

  const bookAppointment = (apptData: Omit<Appointment, 'id' | 'reg'>): Appointment => {
    const newId = uid('A-');
    const newReg = 'AP-' + apptData.date.replace(/-/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);
    const newAppt: Appointment = {
      ...apptData,
      id: newId,
      reg: newReg,
    };

    setAppointments(prev => [newAppt, ...prev]);

    // Update the associated case if exists
    if (newAppt.case) {
      setCases(prev =>
        prev.map(c => (c.id === newAppt.case ? { ...c, status: 'submitted', doctor: newAppt.doc } : c))
      );
    }

    // Generate in-app confirmation notification
    const newNotif: AppNotification = {
      id: uid('N'),
      role: 'patient',
      uid: newAppt.pid,
      icon: 'cal',
      title: 'Appointment confirmed',
      body: `OPD Registration ${newReg} confirmed for ${newAppt.date} at ${newAppt.time} hrs.`,
      time: today(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newAppt;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev =>
      prev.map(a => {
        if (a.id === id) {
          const checkedIn = status === 'checkedIn' ? true : a.checkedIn;
          return { ...a, status, checkedIn };
        }
        return a;
      })
    );
  };

  const addDoctorNote = (caseId: string, noteText: string) => {
    setCases(prev =>
      prev.map(c => {
        if (c.id === caseId) {
          const note = {
            by: currentUser?.name || 'Consulting Physician',
            text: noteText,
            at: today(),
          };
          return { ...c, notes: [...c.notes, note] };
        }
        return c;
      })
    );
  };

  const setFollowUp = (caseId: string, date: string, note: string) => {
    setCases(prev =>
      prev.map(c => {
        if (c.id === caseId) {
          const fu = { date, note };
          return {
            ...c,
            followup: fu,
            status: c.status === 'submitted' ? 'reviewed' : c.status,
          };
        }
        return c;
      })
    );

    // Notify patient
    const foundCase = cases.find(c => c.id === caseId);
    if (foundCase) {
      const notif: AppNotification = {
        id: uid('N'),
        role: 'patient',
        uid: foundCase.pid,
        icon: 'clock',
        title: 'Follow-up scheduled',
        body: `Follow-up on ${date}: ${note}`,
        time: today(),
        read: false,
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    if (!currentUser) return;
    const myUid = currentUser.pid || currentUser.did || currentUser.wid || currentUser.hid || '';
    setNotifications(prev =>
      prev.map(n =>
        n.role === currentUser.role && n.uid === myUid ? { ...n, read: true } : n
      )
    );
  };

  const toggleOfflineMode = () => {
    setIsOfflineMode(prev => !prev);
  };

  const syncOfflineQueue = async (): Promise<number> => {
    const unsynced = cases.filter(c => c.status === 'offlineSaved');
    if (unsynced.length === 0) return 0;

    setCases(prev =>
      prev.map(c => (c.status === 'offlineSaved' ? { ...c, status: 'submitted', synced: true } : c))
    );

    if (currentUser) {
      const notif: AppNotification = {
        id: uid('N'),
        role: 'worker',
        uid: currentUser.wid || currentUser.id,
        icon: 'sync',
        title: 'Sync completed',
        body: `${unsynced.length} offline case(s) successfully synchronized to the hospital database.`,
        time: today(),
        read: false,
      };
      setNotifications(prev => [notif, ...prev]);
    }

    return unsynced.length;
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const switchUserRole = (role: UserRole, targetPid?: string) => {
    if (role === 'patient') {
      const pid = targetPid || currentUser?.pid || 'P-1001';
      const pat = patients.find(p => p.id === pid) || patients[0];
      const user: User = {
        id: 'u-' + pat.id,
        key: pat.phone,
        name: pat.name,
        role: 'patient',
        phone: pat.phone,
        pid: pat.id,
      };
      setCurrentUser(user);
    } else if (role === 'doctor') {
      setCurrentUser({
        id: 'u-doc-1',
        key: 'doctor@demo.com',
        name: 'Dr. Priya Sharma',
        role: 'doctor',
        email: 'doctor@demo.com',
        did: 'd1',
      });
    } else if (role === 'worker') {
      setCurrentUser({
        id: 'u-hw-1',
        key: 'worker@demo.com',
        name: 'Surekha Gavde (ASHA)',
        role: 'worker',
        email: 'worker@demo.com',
        wid: 'HW-01',
        village: 'Gangapur',
      });
    } else if (role === 'hospital') {
      setCurrentUser({
        id: 'u-hosp-1',
        key: 'hospital@demo.com',
        name: 'District General Hospital, Nashik',
        role: 'hospital',
        email: 'hospital@demo.com',
        hid: 'h1',
      });
    }
    setNavigationStack([]);
    setActiveScreen('home');
  };

  const updatePatientEmergencyContact = (pid: string, emg: PatientEmergencyContact) => {
    setPatients(prev =>
      prev.map(p => (p.id === pid ? { ...p, emg: { ...p.emg, ...emg } } : p))
    );
  };

  const updateDoctorDutyStatus = (did: string, status: 'On Duty' | 'In OT' | 'Rounds' | 'Off Duty') => {
    const notif: AppNotification = {
      id: uid('N'),
      role: 'doctor',
      uid: did,
      icon: 'case',
      title: `Duty status updated: ${status}`,
      body: `Your clinical status is now set to ${status}. OPD queue adjusted accordingly.`,
      time: today(),
      read: false,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const resetToSeedData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    const seed = getInitialSeed();
    setPatients(seed.patients);
    setCases(seed.cases);
    setAppointments(seed.appointments);
    setNotifications(seed.notifications);
    setSettings(DEFAULT_APP_SETTINGS);
    setCurrentUser(null);
    setNavigationStack([]);
    setActiveScreen('welcome');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        settings,
        patients,
        cases,
        appointments,
        notifications,
        isOfflineMode,
        activeScreen,
        screenParams,
        navigate,
        goBack,
        login,
        logout,
        registerPatient,
        registerStaff,
        saveCase,
        bookAppointment,
        updateAppointmentStatus,
        addDoctorNote,
        setFollowUp,
        markNotificationRead,
        markAllNotificationsRead,
        toggleOfflineMode,
        syncOfflineQueue,
        updateSettings,
        resetToSeedData,
        switchUserRole,
        updatePatientEmergencyContact,
        updateDoctorDutyStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

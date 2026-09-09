import React from 'react';
import { useApp } from './context/AppContext';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';

// Screen Views
import { SplashScreen } from './components/SplashScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LoginScreen } from './components/LoginScreen';
import { RegisterPatientScreen } from './components/RegisterPatientScreen';
import { RegisterStaffScreen } from './components/RegisterStaffScreen';
import { PatientHomeScreen } from './components/PatientHomeScreen';
import { DoctorHomeScreen } from './components/DoctorHomeScreen';
import { WorkerHomeScreen } from './components/WorkerHomeScreen';
import { HospitalHomeScreen } from './components/HospitalHomeScreen';
import { CaseTakingScreen } from './components/CaseTakingScreen';
import { CaseSummaryScreen } from './components/CaseSummaryScreen';
import { BookApptScreen } from './components/BookApptScreen';
import { ApptConfirmedScreen } from './components/ApptConfirmedScreen';
import { CaseDetailScreen } from './components/CaseDetailScreen';
import {
  MyCasesScreen,
  MyApptsScreen,
  HospitalsScreen,
  LabReportsScreen,
  EmergencyScreen,
} from './components/DirectoryScreens';
import {
  NotificationsScreen,
  SettingsScreen,
  ProfileScreen,
} from './components/SettingsAndProfileScreens';
import {
  PatientDetailScreen,
  DoctorCasesScreen,
  DoctorScheduleScreen,
  WorkerPatientsScreen,
  WorkerCasesScreen,
} from './components/RoleSpecializedScreens';

const AppContent: React.FC = () => {
  const { currentUser, activeScreen } = useApp();

  // Full-screen Splash view (no top/bottom bars)
  if (activeScreen === 'splash') {
    return <SplashScreen />;
  }

  // If user is not logged in, render entry views
  if (!currentUser) {
    switch (activeScreen) {
      case 'login':
        return <LoginScreen />;
      case 'register-patient':
        return <RegisterPatientScreen />;
      case 'register-staff':
        return <RegisterStaffScreen />;
      case 'welcome':
      default:
        return <WelcomeScreen />;
    }
  }

  // Role-based home screen mapping
  const renderRoleHome = () => {
    switch (currentUser.role) {
      case 'doctor':
        return <DoctorHomeScreen />;
      case 'worker':
        return <WorkerHomeScreen />;
      case 'hospital':
        return <HospitalHomeScreen />;
      case 'patient':
      default:
        return <PatientHomeScreen />;
    }
  };

  // Main screen routing router
  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return renderRoleHome();

      // Clinical Intake & Case Summary
      case 'case-taking':
      case 'worker-new-case':
        return <CaseTakingScreen />;
      case 'case-summary':
        return <CaseSummaryScreen />;
      case 'case-detail':
        return <CaseDetailScreen />;

      // Appointment booking & QR pass
      case 'book-appt':
        return <BookApptScreen />;
      case 'appt-confirmed':
      case 'appt-detail':
        return <ApptConfirmedScreen />;

      // Directories & Helplines
      case 'my-cases':
        return <MyCasesScreen />;
      case 'my-appts':
        return <MyApptsScreen />;
      case 'hospitals':
      case 'hospital-detail':
        return <HospitalsScreen />;
      case 'lab-reports':
        return <LabReportsScreen />;
      case 'emergency':
        return <EmergencyScreen />;

      // Doctor specialized
      case 'doctor-cases':
        return <DoctorCasesScreen />;
      case 'doctor-schedule':
        return <DoctorScheduleScreen />;

      // Worker specialized
      case 'worker-patients':
        return <WorkerPatientsScreen />;
      case 'worker-cases':
        return <WorkerCasesScreen />;

      // EHR, Notifications & Config
      case 'patient-detail':
        return <PatientDetailScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'settings':
        return <SettingsScreen />;

      // Fallback
      case 'welcome':
        return <WelcomeScreen />;
      default:
        return renderRoleHome();
    }
  };

  const getScreenTitle = () => {
    switch (activeScreen) {
      case 'case-taking':
      case 'worker-new-case':
        return 'Clinical Intake';
      case 'case-summary':
        return 'Case Summary';
      case 'case-detail':
        return 'Case Record';
      case 'book-appt':
        return 'Book OPD';
      case 'appt-confirmed':
      case 'appt-detail':
        return 'OPD Slip & Pass';
      case 'my-cases':
        return 'My Cases';
      case 'my-appts':
        return 'My Appointments';
      case 'hospitals':
      case 'hospital-detail':
        return 'Hospitals Directory';
      case 'lab-reports':
        return 'Lab Reports';
      case 'emergency':
        return 'Emergency Help';
      case 'notifications':
        return 'Notifications';
      case 'settings':
        return 'Settings';
      case 'profile':
        return 'Health ID & QR';
      case 'patient-detail':
        return 'Patient EHR';
      case 'doctor-cases':
        return 'Doctor Case Queue';
      case 'doctor-schedule':
        return 'Doctor Schedule';
      case 'worker-patients':
        return 'Village Patients';
      case 'worker-cases':
        return 'Field Records';
      default:
        return undefined;
    }
  };

  const isHome = activeScreen === 'home';

  return (
    <div className="min-h-screen bg-[#f2f6f5] flex flex-col">
      <TopBar title={getScreenTitle()} showBack={!isHome} />
      <main className="flex-1 max-w-md w-full mx-auto px-3.5">
        {renderScreen()}
      </main>
      <BottomNav />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}

export type UserRole = 'patient' | 'doctor' | 'worker' | 'hospital' | 'admin';

export interface User {
  id: string;
  key: string;
  name: string;
  role: UserRole;
  phone?: string;
  email?: string;
  pid?: string;
  did?: string;
  wid?: string;
  hid?: string;
  village?: string;
}

export interface PatientEmergencyContact {
  name: string;
  phone: string;
  rel?: string;
}

export interface PatientVitals {
  bp?: string;
  pulse?: string;
  spo2?: string;
  temp?: string;
  bmi?: string;
  height?: string;
  weight?: string;
}

export interface ClinicalVitalSigns {
  bp?: string;
  pulse?: string;
  spo2?: string;
  temp?: string;
  weight?: string;
  height?: string;
  bmi?: string;
  glucose?: string;
}

export interface ClinicalInvestigation {
  testName: string;
  result: string;
  normalRange?: string;
  flag?: 'normal' | 'abnormal' | 'critical';
}

export interface PrescribedMedication {
  drug: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface ClinicalRecord {
  id: string;
  patientId: string;
  date: string;
  encounterType: 'OPD Consultation' | 'Emergency Triage' | 'Specialist Review' | 'Inpatient Ward' | 'Tele-Consultation' | 'Health Camp';
  facility: string;
  doctor: {
    name: string;
    specialty: string;
    regNo: string;
  };
  chiefComplaint: string;
  diagnosis: string;
  icdCode?: string;
  clinicalNotes: string;
  vitals: ClinicalVitalSigns;
  investigations: ClinicalInvestigation[];
  medications: PrescribedMedication[];
  treatmentPlan: string;
  followUpAdvice: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  addr: string;
  dob?: string;
  blood: string;
  emg: PatientEmergencyContact;
  allergies: string[];
  cond: string[];
  meds: string[];
  hist?: string;
  acct?: 'patient' | null;
  abhaId?: string;
  abhaAddress?: string;
  pmjayId?: string;
  occupation?: string;
  state?: string;
  phc?: string;
  vitals?: PatientVitals;
  clinicalRecords?: ClinicalRecord[];
}

export interface CaseMessage {
  who: string;
  text: string;
}

export interface CaseSummary {
  chief: string;
  symptoms: string[];
  duration: string;
  severity: string;
  appetite: string;
  sleep: string;
  past: string;
  meds: string;
  allergies: string;
  missing: string[];
}

export interface DoctorNote {
  by: string;
  text: string;
  at: string;
}

export interface CaseFollowup {
  date: string;
  note: string;
}

export type CaseStatus = 'draft' | 'submitted' | 'reviewed' | 'completed' | 'offlineSaved';

export interface MedicalCase {
  id: string;
  pid: string;
  status: CaseStatus;
  created: string;
  doctor: string | null;
  assisted?: boolean;
  complaint: string;
  original: CaseMessage[];
  summary: CaseSummary;
  notes: DoctorNote[];
  followup: CaseFollowup | null;
  synced: boolean;
  offlineClientUuid?: string;
}

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled' | 'checkedIn';

export interface Appointment {
  id: string;
  reg: string;
  token?: number;
  pid: string;
  doc: string;
  hosp: string;
  dept: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  case?: string;
  fee: string;
  checkedIn?: boolean;
}

export interface Hospital {
  id: string;
  name: string;
  type: 'Government' | 'Private' | 'PHC';
  dist: string;
  rating: number;
  beds: number;
  phone: string;
  addr: string;
  feats: string[];
  depts: string[];
  rohiniId?: string;
  superintendent?: string;
  occupiedBeds?: number;
  icuBeds?: number;
  icuOccupied?: number;
  oxygenPurity?: string;
  nabhTier?: string;
  pmjayDesk?: string;
}

export interface Doctor {
  id: string;
  name: string;
  dept: string;
  h: string;
  exp: number;
  rating: number;
  langs: string[];
  fee: string;
  edu: string;
  about: string;
  nmcReg?: string;
  room?: string;
  timings?: string;
  dutyStatus?: 'On Duty' | 'In OT' | 'Rounds' | 'Off Duty';
  quota?: { total: number; served: number };
  email?: string;
}

export interface HealthWorkerProfile {
  id: string;
  name: string;
  ashaId: string;
  phone: string;
  phc: string;
  assignedArea: string;
  nodalDoctor: string;
  surveyStats: {
    families: number;
    pregnantMothers: number;
    infants: number;
    ncdPatients: number;
  };
  kitStatus: {
    bpCuff: string;
    pulseOx: string;
    glucoMeter: string;
    hbMeter: string;
  };
  honorariumThisCycle: string;
}

export interface AppNotification {
  id: string;
  role: UserRole;
  uid: string;
  icon: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export type AppLanguage = 'en' | 'hi' | 'mr' | 'bn' | 'ta' | 'te';

export interface NotificationChannels {
  sms: boolean;
  whatsapp: boolean;
  labAlerts: boolean;
  voiceReminders: boolean;
}

export interface AbhaConsentSettings {
  drPriya: boolean;
  distHosp: boolean;
  centralLab: boolean;
}

export interface AppSettings {
  lang: AppLanguage;
  notif: boolean;
  big: boolean;
  highContrast?: boolean;
  soundAssist?: boolean;
  notifChannels?: NotificationChannels;
  abhaConsent?: AbhaConsentSettings;
}

export interface LabReportRow {
  param: string;
  value: string;
  ref: string;
  status?: 'normal' | 'high' | 'low';
}

export interface LabReport {
  id: string;
  name: string;
  date: string;
  by: string;
  summary: string;
  rows: LabReportRow[];
}

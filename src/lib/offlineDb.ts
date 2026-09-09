import Dexie, { Table } from 'dexie';
import { Patient, MedicalCase } from '../types';

export interface SyncOutboxItem {
  id: string; // uuid
  type: 'PATIENT' | 'CASE';
  payload: any;
  status: 'PENDING' | 'SYNCED' | 'FAILED';
  createdAt: string;
}

export class ArogyaPathOfflineDB extends Dexie {
  patients!: Table<Patient, string>;
  cases!: Table<MedicalCase, string>;
  syncOutbox!: Table<SyncOutboxItem, string>;

  constructor() {
    super('ArogyaPathOffline');
    this.version(1).stores({
      patients: 'id, phone, name',
      cases: 'id, pid, status, created, synced',
      syncOutbox: 'id, type, status, createdAt',
    });
  }
}

export const offlineDB = new ArogyaPathOfflineDB();

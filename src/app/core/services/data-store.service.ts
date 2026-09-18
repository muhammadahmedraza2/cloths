import { Injectable } from '@angular/core';
import { MasterRecord } from '../models/form-config.model';
import { FormRegistryService } from './form-registry.service';

@Injectable({ providedIn: 'root' })
export class DataStoreService {
  constructor(private registry: FormRegistryService) {}

  private storageKey(formId: number): string {
    return `clothing-erp-form-${formId}`;
  }

  getRecords(formId: number): MasterRecord[] {
    const raw = localStorage.getItem(this.storageKey(formId));
    if (raw) {
      try {
        return JSON.parse(raw) as MasterRecord[];
      } catch {
        /* fall through to seed */
      }
    }
    const config = this.registry.getById(formId);
    const seed = config ? [...config.seedData] : [];
    this.saveRecords(formId, seed);
    return seed;
  }

  saveRecords(formId: number, records: MasterRecord[]): void {
    localStorage.setItem(this.storageKey(formId), JSON.stringify(records));
  }

  addRecord(formId: number, record: MasterRecord): void {
    const records = this.getRecords(formId);
    records.unshift(record);
    this.saveRecords(formId, records);
  }

  updateRecord(formId: number, record: MasterRecord): void {
    const records = this.getRecords(formId);
    const idx = records.findIndex((r) => r.id === record.id);
    if (idx > -1) {
      records[idx] = record;
      this.saveRecords(formId, records);
    }
  }

  deleteRecord(formId: number, id: string): void {
    const records = this.getRecords(formId).filter((r) => r.id !== id);
    this.saveRecords(formId, records);
  }

  resetToSeed(formId: number): void {
    const config = this.registry.getById(formId);
    this.saveRecords(formId, config ? [...config.seedData] : []);
  }
}

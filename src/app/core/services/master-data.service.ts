import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FormDefinitionApi, MasterRecordApi, MasterRecordUpsert } from '../models/master-record.model';

@Injectable({ providedIn: 'root' })
export class MasterDataService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getFormDefinition(formId: number): Observable<FormDefinitionApi> {
    return this.http.get<FormDefinitionApi>(`${this.apiUrl}/forms/${formId}`);
  }

  getRecords(formId: number, status?: 'authorized' | 'unauthorized', search?: string): Observable<MasterRecordApi[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (search) params = params.set('search', search);

    return this.http.get<MasterRecordApi[]>(`${this.apiUrl}/forms/${formId}/records`, { params });
  }

  createRecord(formId: number, dto: MasterRecordUpsert): Observable<MasterRecordApi> {
    return this.http.post<MasterRecordApi>(`${this.apiUrl}/forms/${formId}/records`, dto);
  }

  updateRecord(formId: number, id: string, dto: MasterRecordUpsert): Observable<MasterRecordApi> {
    return this.http.put<MasterRecordApi>(`${this.apiUrl}/forms/${formId}/records/${id}`, dto);
  }

  authorizeRecord(formId: number, id: string): Observable<MasterRecordApi> {
    return this.http.patch<MasterRecordApi>(`${this.apiUrl}/forms/${formId}/records/${id}/authorize`, {});
  }

  deleteRecord(formId: number, id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/forms/${formId}/records/${id}`);
  }
}
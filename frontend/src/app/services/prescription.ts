import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prescription } from '../models/prescription';

@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  private baseUrl = 'https://localhost:7106/api/prescriptions';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(this.baseUrl);
  }

  getById(id: number): Observable<Prescription> {
    return this.http.get<Prescription>(`${this.baseUrl}/${id}`);
  }

  create(prescription: Partial<Prescription>): Observable<Prescription> {
    return this.http.post<Prescription>(this.baseUrl, prescription);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
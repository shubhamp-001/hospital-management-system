import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bill } from '../models/bill';

@Injectable({ providedIn: 'root' })
export class BillService {
  private baseUrl = 'https://localhost:7106/api/bills';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Bill[]> {
    return this.http.get<Bill[]>(this.baseUrl);
  }

  getById(id: number): Observable<Bill> {
    return this.http.get<Bill>(`${this.baseUrl}/${id}`);
  }

  create(bill: Partial<Bill>): Observable<Bill> {
    return this.http.post<Bill>(this.baseUrl, bill);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Doctor {
  doctorId?: number;
  userId: number;
  departmentId: number;
  specialization: string;
  availableFrom: string;
  availableTo: string;
  user?: {
    fullName: string;
    email: string;
  };
  department?: {
    departmentId: number;
    name: string;
  };
}

export interface AvailableUser {
  userId: number;
  fullName: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'https://localhost:7106/api/doctors';

  constructor(private http: HttpClient) { }

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.apiUrl);
  }

  getAvailableUsers(): Observable<AvailableUser[]> {
    return this.http.get<AvailableUser[]>(`${this.apiUrl}/available-users`);
  }

  createDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(this.apiUrl, doctor);
  }

  deleteDoctor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
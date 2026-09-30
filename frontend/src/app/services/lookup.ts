import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Role {
  roleId: number;
  roleName: string;
}

export interface Gender {
  genderId: number;
  genderName: string;
}

export interface Department {
  departmentId: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class LookupService {
  private apiUrl = 'https://localhost:7106/api';

  constructor(private http: HttpClient) { }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/roles`);
  }

  getGenders(): Observable<Gender[]> {
    return this.http.get<Gender[]>(`${this.apiUrl}/genders`);
  }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/departments`);
  }
}
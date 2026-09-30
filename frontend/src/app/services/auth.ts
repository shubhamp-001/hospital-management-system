import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;
  userId: number;
  fullName: string;
  role: string;
}

interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  roleId: number;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'https://localhost:7106/api/auth';

  // Reactive signals for current auth state
  isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));
  fullName = signal<string | null>(localStorage.getItem('fullName'));
  role = signal<string | null>(localStorage.getItem('role'));

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          localStorage.setItem('fullName', response.fullName);
          localStorage.setItem('userId', response.userId.toString());

          this.isLoggedIn.set(true);
          this.fullName.set(response.fullName);
          this.role.set(response.role);
        })
      );
  }

  register(data: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          localStorage.setItem('fullName', response.fullName);
          localStorage.setItem('userId', response.userId.toString());

          this.isLoggedIn.set(true);
          this.fullName.set(response.fullName);
          this.role.set(response.role);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('fullName');
    localStorage.removeItem('userId');

    this.isLoggedIn.set(false);
    this.fullName.set(null);
    this.role.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return this.role();
  }

  hasRole(...roles: string[]): boolean {
    const currentRole = this.getRole();
    return !!currentRole && roles.includes(currentRole);
  }
}
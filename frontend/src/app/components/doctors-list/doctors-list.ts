import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService, Doctor, AvailableUser } from '../../services/doctor';
import { LookupService, Department } from '../../services/lookup';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-doctors-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctors-list.html',
  styleUrl: './doctors-list.css'
})
export class DoctorsList implements OnInit {
  doctors: Doctor[] = [];
  departments: Department[] = [];
  availableUsers: AvailableUser[] = [];
  showForm: boolean = false;
  errorMessage = signal('');

  searchTerm = signal('');
  openMenuId: number | null = null;

  newDoctor: Doctor = {
    userId: 0,
    departmentId: 0,
    specialization: '',
    availableFrom: '',
    availableTo: ''
  };

  constructor(
    private doctorService: DoctorService,
    private lookupService: LookupService,
    private authService: Auth
  ) { }

  ngOnInit(): void {
    this.loadDoctors();
    this.loadDepartments();
    this.loadAvailableUsers();
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
      },
      error: (err) => {
        console.error('Failed to load doctors', err);
        this.errorMessage.set('Failed to load doctors.');
      }
    });
  }

  loadDepartments(): void {
    this.lookupService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: (err) => {
        console.error('Failed to load departments', err);
      }
    });
  }

  loadAvailableUsers(): void {
    this.doctorService.getAvailableUsers().subscribe({
      next: (data) => {
        this.availableUsers = data;
      },
      error: (err) => {
        console.error('Failed to load available users', err);
      }
    });
  }

  get filteredDoctors(): Doctor[] {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.doctors;
    return this.doctors.filter(d =>
      (d.user?.fullName || '').toLowerCase().includes(term) ||
      (d.specialization || '').toLowerCase().includes(term) ||
      (d.department?.name || '').toLowerCase().includes(term)
    );
  }

  formatTime(time: string | undefined): string {
    return time ? time.slice(0, 5) : '';
  }

  toggleMenu(doctorId: number): void {
    this.openMenuId = this.openMenuId === doctorId ? null : doctorId;
  }

  closeMenu(): void {
    this.openMenuId = null;
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  addDoctor(): void {
    this.doctorService.createDoctor(this.newDoctor).subscribe({
      next: () => {
        this.loadDoctors();
        this.loadAvailableUsers();
        this.showForm = false;
        this.newDoctor = {
          userId: 0,
          departmentId: 0,
          specialization: '',
          availableFrom: '',
          availableTo: ''
        };
      },
      error: (err) => {
        console.error('Failed to add doctor', err);
        this.errorMessage.set(err.error?.message || 'Failed to add doctor.');
      }
    });
  }

  deleteDoctor(id: number): void {
    if (!confirm('Are you sure you want to delete this doctor?')) return;

    this.doctorService.deleteDoctor(id).subscribe({
      next: () => {
        this.loadDoctors();
        this.loadAvailableUsers();
        this.closeMenu();
      },
      error: (err) => {
        console.error('Failed to delete doctor', err);
        this.errorMessage.set('Failed to delete doctor.');
      }
    });
  }

  canWrite(): boolean {
    return this.authService.hasRole('SuperAdmin');
  }
}
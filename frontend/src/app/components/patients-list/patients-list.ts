import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService, Patient } from '../../services/patient';
import { LookupService, Gender } from '../../services/lookup';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patients-list.html',
  styleUrl: './patients-list.css',
})
export class PatientsList implements OnInit {
  patients: Patient[] = [];
  genders: Gender[] = [];
  showForm: boolean = false;
  errorMessage = signal('');

  searchTerm = signal('');
  openMenuId: number | null = null;

  newPatient: Patient = {
    fullName: '',
    contactNumber: '',
    address: '',
    dateOfBirth: '',
    genderId: 0,
    medicalHistory: ''
  };

  constructor(
    private patientService: PatientService,
    private lookupService: LookupService,
    private authService: Auth
  ) { }

  ngOnInit(): void {
    this.loadPatients();
    this.loadGenders();
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
      },
      error: (err) => {
        console.error('Failed to load patients', err);
        this.errorMessage.set('Failed to load patients.');
      }
    });
  }

  loadGenders(): void {
    this.lookupService.getGenders().subscribe({
      next: (data) => {
        this.genders = data;
      },
      error: (err) => {
        console.error('Failed to load genders', err);
      }
    });
  }

  getGenderName(genderId: number): string {
    const gender = this.genders.find(g => g.genderId === genderId);
    return gender ? gender.genderName : '';
  }

  get filteredPatients(): Patient[] {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.patients;
    return this.patients.filter(p =>
      p.fullName.toLowerCase().includes(term) ||
      p.contactNumber.toLowerCase().includes(term)
    );
  }

  toggleMenu(patientId: number): void {
    this.openMenuId = this.openMenuId === patientId ? null : patientId;
  }

  closeMenu(): void {
    this.openMenuId = null;
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  addPatient(): void {
    this.patientService.createPatient(this.newPatient).subscribe({
      next: () => {
        this.loadPatients();
        this.showForm = false;
        this.newPatient = {
          fullName: '',
          contactNumber: '',
          address: '',
          dateOfBirth: '',
          genderId: 0,
          medicalHistory: ''
        };
      },
      error: (err) => {
        console.error('Failed to add patient', err);
        this.errorMessage.set('Failed to add patient.');
      }
    });
  }

  deletePatient(id: number): void {
    if (!confirm('Are you sure you want to delete this patient?')) return;

    this.patientService.deletePatient(id).subscribe({
      next: () => {
        this.loadPatients();
        this.closeMenu();
      },
      error: (err) => {
        console.error('Failed to delete patient', err);
        this.errorMessage.set('Failed to delete patient.');
      }
    });
  }

  canWrite(): boolean {
    return this.authService.hasRole('SuperAdmin', 'Receptionist', 'Nurse');
  }
}
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService, Appointment } from '../../services/appointment';
import { PatientService, Patient } from '../../services/patient';
import { DoctorService, Doctor } from '../../services/doctor';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments-list.html',
  styleUrl: './appointments-list.css'
})
export class AppointmentsList implements OnInit {
  appointments: Appointment[] = [];
  patients: Patient[] = [];
  doctors: Doctor[] = [];
  showForm: boolean = false;
  errorMessage = signal('');
  successMessage = signal('');

  searchTerm = signal('');
  doctorFilter = signal(0);
  openMenuId: number | null = null;

  newAppointment: Appointment = {
    patientId: 0,
    doctorId: 0,
    appointmentDate: '',
    appointmentTime: '',
    status: 'Scheduled',
    reason: ''
  };

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private authService: Auth
  ) { }

  ngOnInit(): void {
    this.loadAppointments();
    this.loadPatients();
    this.loadDoctors();
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
      },
      error: (err) => {
        console.error('Failed to load appointments', err);
        this.errorMessage.set('Failed to load appointments.');
      }
    });
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
      },
      error: (err) => {
        console.error('Failed to load patients', err);
      }
    });
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
      },
      error: (err) => {
        console.error('Failed to load doctors', err);
      }
    });
  }

  get filteredAppointments(): Appointment[] {
    const term = this.searchTerm().toLowerCase().trim();
    const doctorId = this.doctorFilter();

    return this.appointments
      .filter(a => {
        const matchesDoctor = !doctorId || a.doctorId === doctorId;
        const matchesSearch = !term ||
          (a.patient?.fullName || '').toLowerCase().includes(term) ||
          (a.doctor?.user?.fullName || '').toLowerCase().includes(term) ||
          (a.reason || '').toLowerCase().includes(term);
        return matchesDoctor && matchesSearch;
      })
      .sort((a, b) =>
        (a.appointmentDate + a.appointmentTime).localeCompare(b.appointmentDate + b.appointmentTime)
      );
  }

  formatTime(time: string | undefined): string {
    return time ? time.slice(0, 5) : '';
  }

  statusClass(status: string | undefined): string {
    return (status || '').toLowerCase();
  }

  toggleMenu(id: number): void {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  closeMenu(): void {
    this.openMenuId = null;
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  addAppointment(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.newAppointment.appointmentDate || !this.newAppointment.appointmentTime) {
      this.errorMessage.set('Please select both date and time.');
      return;
    }

    this.appointmentService.createAppointment(this.newAppointment).subscribe({
      next: () => {
        this.successMessage.set('Appointment booked successfully.');
        this.loadAppointments();
        this.showForm = false;
        this.newAppointment = {
          patientId: 0,
          doctorId: 0,
          appointmentDate: '',
          appointmentTime: '',
          status: 'Scheduled',
          reason: ''
        };
      },
      error: (err) => {
        console.error('Failed to add appointment', err);
        if (err.status === 409) {
          this.errorMessage.set(err.error?.message || 'This doctor already has an appointment at the selected date and time.');
        } else {
          this.errorMessage.set(err.error?.message || 'Failed to book appointment.');
        }
      }
    });
  }

  deleteAppointment(id: number): void {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    this.appointmentService.deleteAppointment(id).subscribe({
      next: () => {
        this.loadAppointments();
        this.closeMenu();
      },
      error: (err) => {
        console.error('Failed to delete appointment', err);
        this.errorMessage.set('Failed to delete appointment.');
      }
    });
  }

  canWrite(): boolean {
    return this.authService.hasRole('SuperAdmin', 'Receptionist');
  }
}
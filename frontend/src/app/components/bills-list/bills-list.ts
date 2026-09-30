import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BillService } from '../../services/bill';
import { AppointmentService, Appointment } from '../../services/appointment';
import { Bill } from '../../models/bill';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-bills-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bills-list.html',
  styleUrl: './bills-list.css'
})
export class BillsList implements OnInit {
  bills = signal<Bill[]>([]);
  appointments = signal<Appointment[]>([]);
  errorMessage = signal('');
  successMessage = signal('');
  searchTerm = signal('');

  selectedAppointmentId: number | null = null;
  consultationFee: number | null = null;

  constructor(
    private billService: BillService,
    private appointmentService: AppointmentService,
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBills();
    this.loadAppointments();
  }

  loadBills(): void {
    this.billService.getAll().subscribe({
      next: (data) => this.bills.set(data),
      error: () => this.errorMessage.set('Failed to load bills.')
    });
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (data) => this.appointments.set(data),
      error: () => this.errorMessage.set('Failed to load appointments.')
    });
  }

  viewBill(id: number): void {
    this.router.navigate(['/bills', id]);
  }

  get filteredBills(): Bill[] {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.bills();
    return this.bills().filter(b => (b.patientName || '').toLowerCase().includes(term));
  }

  get totalRevenue(): number {
    return this.bills().reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  }

  generateBill(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.selectedAppointmentId) {
      this.errorMessage.set('Select an appointment first.');
      return;
    }

    if (this.consultationFee === null || this.consultationFee < 0) {
      this.errorMessage.set('Enter a consultation fee.');
      return;
    }

    this.billService.create({
      appointmentId: this.selectedAppointmentId,
      consultationFee: this.consultationFee
    }).subscribe({
      next: () => {
        this.successMessage.set('Bill generated successfully.');
        this.selectedAppointmentId = null;
        this.consultationFee = null;
        this.loadBills();
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Failed to generate bill.');
      }
    });
  }

  deleteBill(id: number): void {
    if (!confirm('Delete this bill?')) return;
    this.billService.delete(id).subscribe({
      next: () => this.loadBills(),
      error: () => this.errorMessage.set('Delete failed.')
    });
  }

  canWrite(): boolean {
    return this.authService.hasRole('SuperAdmin', 'Receptionist', 'Accountant');
  }
}
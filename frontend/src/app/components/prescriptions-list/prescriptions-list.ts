import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrescriptionService } from '../../services/prescription';
import { AppointmentService, Appointment } from '../../services/appointment';
import { MedicineService } from '../../services/medicine';
import { Prescription, PrescriptionMedicine } from '../../models/prescription';
import { Medicine } from '../../models/medicine';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-prescriptions-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prescriptions-list.html',
  styleUrl: './prescriptions-list.css'
})
export class PrescriptionsList implements OnInit {
  prescriptions = signal<Prescription[]>([]);
  appointments = signal<Appointment[]>([]);
  medicines = signal<Medicine[]>([]);
  errorMessage = signal('');

  // form state
  selectedAppointmentId: number | null = null;
  notes = '';
  selectedMedicineId: number | null = null;
  selectedQuantity = 1;
  selectedDosage = '';
  searchTerm = signal('');
  pickedMedicines: PrescriptionMedicine[] = [];

  constructor(
    private prescriptionService: PrescriptionService,
    private appointmentService: AppointmentService,
    private medicineService: MedicineService,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    this.loadPrescriptions();
    this.loadAppointments();
    this.loadMedicines();
  }

  loadPrescriptions(): void {
    this.prescriptionService.getAll().subscribe({
      next: (data) => this.prescriptions.set(data),
      error: () => this.errorMessage.set('Failed to load prescriptions.')
    });
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (data) => this.appointments.set(data),
      error: () => this.errorMessage.set('Failed to load appointments.')
    });
  }

  loadMedicines(): void {
    this.medicineService.getAll().subscribe({
      next: (data) => this.medicines.set(data),
      error: () => this.errorMessage.set('Failed to load medicines.')
    });
  }

  get filteredPrescriptions(): Prescription[] {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.prescriptions();
    return this.prescriptions().filter(p =>
      (p.patientName || '').toLowerCase().includes(term) ||
      (p.doctorName || '').toLowerCase().includes(term)
    );
  }

  addMedicineToPick(): void {
    if (!this.selectedMedicineId || this.selectedQuantity < 1) return;

    if (!this.selectedDosage.trim()) {
      this.errorMessage.set('Please enter the dosage (e.g. 1 tablet twice daily).');
      return;
    }

    const med = this.medicines().find(m => m.medicineId === this.selectedMedicineId);
    if (!med) return;

    this.errorMessage.set('');
    this.pickedMedicines.push({
      medicineId: med.medicineId,
      medicineName: med.name,
      quantity: this.selectedQuantity,
      dosage: this.selectedDosage.trim()
    });

    this.selectedMedicineId = null;
    this.selectedQuantity = 1;
    this.selectedDosage = '';
  }

  removePickedMedicine(index: number): void {
    this.pickedMedicines.splice(index, 1);
  }

  savePrescription(): void {
    this.errorMessage.set('');

    if (!this.selectedAppointmentId || this.pickedMedicines.length === 0) {
      this.errorMessage.set('Select an appointment and at least one medicine.');
      return;
    }

    const payload: Partial<Prescription> = {
      appointmentId: this.selectedAppointmentId,
      notes: this.notes,
      prescriptionMedicines: this.pickedMedicines.map(({ medicineId, quantity, dosage }) => ({
        medicineId,
        quantity,
        dosage: dosage?.trim() || ''
      }))
    };

    this.prescriptionService.create(payload).subscribe({
      next: () => {
        this.resetForm();
        this.loadPrescriptions();
        this.loadMedicines(); // refresh stock counts after deduction
      },
      error: (err) => {
        console.error('Prescription error body:', err.error);
        const validation = err?.error?.errors
          ? Object.values(err.error.errors).flat().join(' ')
          : '';
        this.errorMessage.set(err?.error?.message || validation || 'Failed to create prescription.');
      }
    });
  }

  resetForm(): void {
    this.selectedAppointmentId = null;
    this.notes = '';
    this.pickedMedicines = [];
    this.selectedMedicineId = null;
    this.selectedQuantity = 1;
    this.selectedDosage = '';
  }

  deletePrescription(id: number): void {
    if (!confirm('Are you sure you want to delete this prescription?')) return;
    this.prescriptionService.delete(id).subscribe({
      next: () => this.loadPrescriptions(),
      error: () => this.errorMessage.set('Delete failed.')
    });
  }

  canWrite(): boolean {
    return this.authService.hasRole('SuperAdmin', 'Doctor');
  }
}
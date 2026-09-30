import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../services/patient';
import { DoctorService } from '../../services/doctor';
import { AppointmentService, Appointment } from '../../services/appointment';
import { BillService } from '../../services/bill';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  totalPatients = signal(0);
  totalDoctors = signal(0);
  totalAppointments = signal(0);
  totalRevenue = signal(0);

  recentAppointments = signal<Appointment[]>([]);
  fullName;

  constructor(
    private patientService: PatientService,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private billService: BillService,
    private authService: Auth
  ) {
    this.fullName = this.authService.fullName;
  }

  ngOnInit(): void {
    this.patientService.getPatients().subscribe({
      next: (data) => this.totalPatients.set(data.length),
      error: () => {}
    });

    this.doctorService.getDoctors().subscribe({
      next: (data) => this.totalDoctors.set(data.length),
      error: () => {}
    });

    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.totalAppointments.set(data.length);
        this.recentAppointments.set(data.slice(-5).reverse());
      },
      error: () => {}
    });

    this.billService.getAll().subscribe({
      next: (data) => {
        const total = data.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
        this.totalRevenue.set(total);
      },
      error: () => {}
    });
  }
}
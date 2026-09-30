import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { PatientsList } from './components/patients-list/patients-list';
import { DoctorsList } from './components/doctors-list/doctors-list';
import { AppointmentsList } from './components/appointments-list/appointments-list';
import { MedicinesList } from './components/medicines-list/medicines-list';
import { PrescriptionsList } from './components/prescriptions-list/prescriptions-list';
import { BillsList } from './components/bills-list/bills-list';
import { BillDetail } from './components/bill-detail/bill-detail';
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'patients', component: PatientsList },
  { path: 'doctors', component: DoctorsList },
  { path: 'appointments', component: AppointmentsList },
  { path: 'medicines', component: MedicinesList },
  { path: 'prescriptions', component: PrescriptionsList },
  { path: 'bills', component: BillsList },
  { path: 'bills/:id', component: BillDetail },
  { path: 'dashboard', component: Dashboard }
];
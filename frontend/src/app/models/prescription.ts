export interface PrescriptionMedicine {
  id?: number;
  medicineId: number;
  medicineName?: string;
  quantity: number;
  dosage?: string;
}

export interface Prescription {
  prescriptionId: number;
  appointmentId: number;
  notes: string;
  patientName?: string;
  doctorName?: string;
  appointmentDate?: string;
  prescriptionMedicines: PrescriptionMedicine[];
}
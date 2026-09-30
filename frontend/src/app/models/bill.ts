export interface BillMedicineLine {
  medicineId: number;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Bill {
  billId: number;
  appointmentId: number;
  consultationFee: number;
  medicineCharges: number;
  totalAmount: number;
  patientName?: string;
  doctorName?: string;
  appointmentDate?: string;
  medicines?: BillMedicineLine[];
}
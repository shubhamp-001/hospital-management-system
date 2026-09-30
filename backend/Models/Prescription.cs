namespace Hospital_Management_System.Models
{
    public class Prescription
    {
        public int PrescriptionId { get; set; }
        public int AppointmentId { get; set; }
        public string Notes { get; set; }

        // Navigation
        public Appointment? Appointment { get; set; }
        public ICollection<PrescriptionMedicine>? PrescriptionMedicines { get; set; }
    }
}
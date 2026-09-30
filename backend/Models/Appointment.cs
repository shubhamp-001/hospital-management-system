namespace Hospital_Management_System.Models
{
    public class Appointment
    {
        public int AppointmentId { get; set; }
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public DateOnly AppointmentDate { get; set; }
        public TimeOnly AppointmentTime { get; set; }
        public string Status { get; set; } = "Scheduled";  // Scheduled / Completed / Cancelled
        public string Reason { get; set; }

        // Navigation
        public Patient? Patient { get; set; }
        public Doctor? Doctor { get; set; }
        public Prescription? Prescription { get; set; }
        public Bill? Bill { get; set; }
    }
}
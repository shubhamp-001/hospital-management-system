namespace Hospital_Management_System.Models
{
    public class Patient
    {
        public int PatientId { get; set; }
        public int? UserId { get; set; }
        public string FullName { get; set; }
        public string ContactNumber { get; set; }
        public string Address { get; set; }
        public DateTime DateOfBirth { get; set; }
        public int GenderId { get; set; }
        public string MedicalHistory { get; set; }

        // Navigation
        public User? User { get; set; }
        public Gender? Gender { get; set; }
        public ICollection<Appointment>? Appointments { get; set; }
    }
}
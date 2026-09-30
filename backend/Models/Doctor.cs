namespace Hospital_Management_System.Models
{
    public class Doctor
    {
        public int DoctorId { get; set; }
        public int UserId { get; set; }
        public int DepartmentId { get; set; }
        public string Specialization { get; set; }
        public TimeSpan AvailableFrom { get; set; }
        public TimeSpan AvailableTo { get; set; }

        // Navigation
        public User? User { get; set; }
        public Department? Department { get; set; }
        public ICollection<Appointment>? Appointments { get; set; }
    }
}
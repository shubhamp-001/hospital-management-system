namespace Hospital_Management_System.Models
{
    public class Gender
    {
        public int GenderId { get; set; }
        public string GenderName { get; set; }

        public ICollection<Patient>? Patients { get; set; }
    }
}
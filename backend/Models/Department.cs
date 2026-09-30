namespace Hospital_Management_System.Models
{
    public class Department
    {
        public int DepartmentId { get; set; }
        public string Name { get; set; }

        public ICollection<Doctor>? Doctors { get; set; }
    }
}
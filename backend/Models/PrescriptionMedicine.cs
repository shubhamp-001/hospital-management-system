namespace Hospital_Management_System.Models
{
    public class PrescriptionMedicine
    {
        public int Id { get; set; }
        public int PrescriptionId { get; set; }
        public int MedicineId { get; set; }
        public string Dosage { get; set; }
        public int Quantity { get; set; }

        // Navigation
        public Prescription? Prescription { get; set; }
        public Medicine? Medicine { get; set; }
    }
}
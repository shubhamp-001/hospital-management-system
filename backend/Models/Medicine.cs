namespace Hospital_Management_System.Models
{
    public class Medicine
    {
        public int MedicineId { get; set; }
        public string Name { get; set; }
        public int StockQuantity { get; set; }
        public decimal Price { get; set; }
        public int LowStockThreshold { get; set; }

        // Navigation
        public ICollection<PrescriptionMedicine>? PrescriptionMedicines { get; set; }
    }
}
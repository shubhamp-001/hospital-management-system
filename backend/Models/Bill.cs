namespace Hospital_Management_System.Models
{
    public class Bill
    {
        public int BillId { get; set; }
        public int AppointmentId { get; set; }
        public decimal ConsultationFee { get; set; }
        public decimal MedicineCharges { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentStatus { get; set; } = "Pending";
        public DateTime BillDate { get; set; } = DateTime.Now;

        // Navigation
        public Appointment? Appointment { get; set; }
    }
}
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hospital_Management_System.Data;
using Hospital_Management_System.Models;

namespace Hospital_Management_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "SuperAdmin,Receptionist,Accountant")]
    public class BillsController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public BillsController(HospitalDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetBills()
        {
            var bills = await _context.Bills
                .Select(b => new
                {
                    b.BillId,
                    b.AppointmentId,
                    b.ConsultationFee,
                    b.MedicineCharges,
                    b.TotalAmount,
                    PatientName = b.Appointment.Patient.FullName,
                    DoctorName = b.Appointment.Doctor.User.FullName
                })
                .ToListAsync();

            return Ok(bills);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBill(int id)
        {
            var bill = await _context.Bills
                .Where(b => b.BillId == id)
                .Select(b => new
                {
                    b.BillId,
                    b.AppointmentId,
                    b.ConsultationFee,
                    b.MedicineCharges,
                    b.TotalAmount,
                    PatientName = b.Appointment.Patient.FullName,
                    DoctorName = b.Appointment.Doctor.User.FullName,
                    AppointmentDate = b.Appointment.AppointmentDate
                })
                .FirstOrDefaultAsync();

            if (bill == null) return NotFound();

            var medicines = await _context.Prescriptions
                .Where(p => p.AppointmentId == bill.AppointmentId)
                .SelectMany(p => p.PrescriptionMedicines)
                .Select(pm => new
                {
                    pm.MedicineId,
                    MedicineName = pm.Medicine.Name,
                    pm.Quantity,
                    UnitPrice = pm.Medicine.Price,
                    LineTotal = pm.Quantity * pm.Medicine.Price
                })
                .ToListAsync();

            return Ok(new
            {
                bill.BillId,
                bill.AppointmentId,
                bill.ConsultationFee,
                bill.MedicineCharges,
                bill.TotalAmount,
                bill.PatientName,
                bill.DoctorName,
                bill.AppointmentDate,
                Medicines = medicines
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateBill(Bill bill)
        {
            bool alreadyExists = await _context.Bills.AnyAsync(b => b.AppointmentId == bill.AppointmentId);
            if (alreadyExists)
            {
                return Conflict(new { message = "A bill has already been generated for this appointment." });
            }

            var medicineCharges = await _context.Prescriptions
                .Where(p => p.AppointmentId == bill.AppointmentId)
                .SelectMany(p => p.PrescriptionMedicines)
                .SumAsync(pm => pm.Quantity * pm.Medicine.Price);

            bill.MedicineCharges = medicineCharges;
            bill.TotalAmount = bill.ConsultationFee + bill.MedicineCharges;

            _context.Bills.Add(bill);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBill), new { id = bill.BillId },
                new { bill.BillId, bill.AppointmentId, bill.ConsultationFee, bill.MedicineCharges, bill.TotalAmount });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBill(int id, Bill bill)
        {
            if (id != bill.BillId) return BadRequest();

            var medicineCharges = await _context.Prescriptions
                .Where(p => p.AppointmentId == bill.AppointmentId)
                .SelectMany(p => p.PrescriptionMedicines)
                .SumAsync(pm => pm.Quantity * pm.Medicine.Price);

            bill.MedicineCharges = medicineCharges;
            bill.TotalAmount = bill.ConsultationFee + bill.MedicineCharges;

            _context.Entry(bill).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "SuperAdmin,Accountant")]
        public async Task<IActionResult> DeleteBill(int id)
        {
            var bill = await _context.Bills.FindAsync(id);
            if (bill == null) return NotFound();
            _context.Bills.Remove(bill);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
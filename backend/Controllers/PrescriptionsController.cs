using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hospital_Management_System.Data;
using Hospital_Management_System.Models;

namespace Hospital_Management_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "SuperAdmin,Doctor")]
    public class PrescriptionsController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public PrescriptionsController(HospitalDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetPrescriptions()
        {
            var prescriptions = await _context.Prescriptions
                .Select(p => new
                {
                    p.PrescriptionId,
                    p.AppointmentId,
                    p.Notes,
                    PatientName = p.Appointment.Patient.FullName,
                    DoctorName = p.Appointment.Doctor.User.FullName,
                    AppointmentDate = p.Appointment.AppointmentDate,
                    PrescriptionMedicines = p.PrescriptionMedicines.Select(pm => new
                    {
                        pm.Id,
                        pm.MedicineId,
                        MedicineName = pm.Medicine.Name,
                        pm.Quantity,
                        pm.Dosage
                    })
                })
                .ToListAsync();

            return Ok(prescriptions);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPrescription(int id)
        {
            var prescription = await _context.Prescriptions
                .Where(p => p.PrescriptionId == id)
                .Select(p => new
                {
                    p.PrescriptionId,
                    p.AppointmentId,
                    p.Notes,
                    PatientName = p.Appointment.Patient.FullName,
                    DoctorName = p.Appointment.Doctor.User.FullName,
                    AppointmentDate = p.Appointment.AppointmentDate,
                    PrescriptionMedicines = p.PrescriptionMedicines.Select(pm => new
                    {
                        pm.Id,
                        pm.MedicineId,
                        MedicineName = pm.Medicine.Name,
                        pm.Quantity,
                        pm.Dosage
                    })
                })
                .FirstOrDefaultAsync();

            if (prescription == null) return NotFound();
            return Ok(prescription);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePrescription(Prescription prescription)
        {
            var medicineIds = prescription.PrescriptionMedicines
                .Select(pm => pm.MedicineId)
                .ToList();

            var medicines = await _context.Medicines
                .Where(m => medicineIds.Contains(m.MedicineId))
                .ToListAsync();

            foreach (var item in prescription.PrescriptionMedicines)
            {
                var medicine = medicines.FirstOrDefault(m => m.MedicineId == item.MedicineId);

                if (medicine == null)
                {
                    return BadRequest(new { message = "One of the selected medicines was not found." });
                }

                if (medicine.StockQuantity < item.Quantity)
                {
                    return BadRequest(new
                    {
                        message = $"Not enough stock for {medicine.Name}. Available: {medicine.StockQuantity}."
                    });
                }

                medicine.StockQuantity -= item.Quantity;
            }

            _context.Prescriptions.Add(prescription);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetPrescription),
                new { id = prescription.PrescriptionId },
                new { prescription.PrescriptionId, prescription.AppointmentId, prescription.Notes });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePrescription(int id, Prescription prescription)
        {
            if (id != prescription.PrescriptionId) return BadRequest();
            _context.Entry(prescription).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePrescription(int id)
        {
            var prescription = await _context.Prescriptions.FindAsync(id);
            if (prescription == null) return NotFound();
            _context.Prescriptions.Remove(prescription);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
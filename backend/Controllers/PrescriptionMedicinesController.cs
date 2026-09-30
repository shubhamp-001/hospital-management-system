using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hospital_Management_System.Data;
using Hospital_Management_System.Models;

namespace Hospital_Management_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "SuperAdmin,Doctor,Pharmacist")]
    public class PrescriptionMedicinesController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public PrescriptionMedicinesController(HospitalDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PrescriptionMedicine>>> GetPrescriptionMedicines()
        {
            return await _context.PrescriptionMedicines.Include(pm => pm.Medicine).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PrescriptionMedicine>> GetPrescriptionMedicine(int id)
        {
            var pm = await _context.PrescriptionMedicines.Include(x => x.Medicine).FirstOrDefaultAsync(x => x.Id == id);
            if (pm == null) return NotFound();
            return pm;
        }

        [HttpPost]
        public async Task<ActionResult<PrescriptionMedicine>> CreatePrescriptionMedicine(PrescriptionMedicine pm)
        {
            var medicine = await _context.Medicines.FindAsync(pm.MedicineId);
            if (medicine == null) return BadRequest(new { message = "Medicine not found." });
            if (medicine.StockQuantity < pm.Quantity) return BadRequest(new { message = "Not enough stock available for this medicine." });

            medicine.StockQuantity -= pm.Quantity;
            _context.PrescriptionMedicines.Add(pm);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPrescriptionMedicine), new { id = pm.Id }, pm);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "SuperAdmin,Pharmacist")]
        public async Task<IActionResult> DeletePrescriptionMedicine(int id)
        {
            var pm = await _context.PrescriptionMedicines.FindAsync(id);
            if (pm == null) return NotFound();
            _context.PrescriptionMedicines.Remove(pm);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hospital_Management_System.Data;
using Hospital_Management_System.Models;

namespace Hospital_Management_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MedicinesController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public MedicinesController(HospitalDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Medicine>>> GetMedicines()
        {
            return await _context.Medicines.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Medicine>> GetMedicine(int id)
        {
            var medicine = await _context.Medicines.FindAsync(id);
            if (medicine == null) return NotFound();
            return medicine;
        }

        [HttpGet("low-stock")]
        public async Task<ActionResult<IEnumerable<Medicine>>> GetLowStockMedicines()
        {
            return await _context.Medicines.Where(m => m.StockQuantity <= m.LowStockThreshold).ToListAsync();
        }

        [HttpPost]
        [Authorize(Roles = "SuperAdmin,Pharmacist")]
        public async Task<ActionResult<Medicine>> CreateMedicine(Medicine medicine)
        {
            _context.Medicines.Add(medicine);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetMedicine), new { id = medicine.MedicineId }, medicine);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "SuperAdmin,Pharmacist")]
        public async Task<IActionResult> UpdateMedicine(int id, Medicine medicine)
        {
            if (id != medicine.MedicineId) return BadRequest();
            _context.Entry(medicine).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "SuperAdmin,Pharmacist")]
        public async Task<IActionResult> DeleteMedicine(int id)
        {
            var medicine = await _context.Medicines.FindAsync(id);
            if (medicine == null) return NotFound();
            _context.Medicines.Remove(medicine);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
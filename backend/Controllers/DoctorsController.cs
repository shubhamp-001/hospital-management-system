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
    public class DoctorsController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public DoctorsController(HospitalDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetDoctors()
        {
            var doctors = await _context.Doctors
                .Select(d => new
                {
                    d.DoctorId,
                    d.UserId,
                    d.DepartmentId,
                    d.Specialization,
                    d.AvailableFrom,
                    d.AvailableTo,
                    User = d.User == null ? null : new { d.User.UserId, d.User.FullName, d.User.Email },
                    Department = d.Department == null ? null : new { d.Department.DepartmentId, d.Department.Name }
                })
                .ToListAsync();

            return Ok(doctors);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDoctor(int id)
        {
            var doctor = await _context.Doctors
                .Where(d => d.DoctorId == id)
                .Select(d => new
                {
                    d.DoctorId,
                    d.UserId,
                    d.DepartmentId,
                    d.Specialization,
                    d.AvailableFrom,
                    d.AvailableTo,
                    User = d.User == null ? null : new { d.User.UserId, d.User.FullName, d.User.Email },
                    Department = d.Department == null ? null : new { d.Department.DepartmentId, d.Department.Name }
                })
                .FirstOrDefaultAsync();

            if (doctor == null) return NotFound();
            return Ok(doctor);
        }

        [HttpPost]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<ActionResult<Doctor>> CreateDoctor(Doctor doctor)
        {
            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetDoctor), new { id = doctor.DoctorId }, doctor);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> UpdateDoctor(int id, Doctor doctor)
        {
            if (id != doctor.DoctorId) return BadRequest();
            _context.Entry(doctor).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null) return NotFound();
            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("available-users")]
        public async Task<ActionResult<IEnumerable<object>>> GetAvailableDoctorUsers()
        {
            var doctorRole = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == "Doctor");
            if (doctorRole == null)
            {
                return Ok(new List<object>());
            }

            var existingDoctorUserIds = await _context.Doctors.Select(d => d.UserId).ToListAsync();

            var availableUsers = await _context.Users
                .Where(u => u.RoleId == doctorRole.RoleId && !existingDoctorUserIds.Contains(u.UserId))
                .Select(u => new { u.UserId, u.FullName, u.Email })
                .ToListAsync();

            return Ok(availableUsers);
        }
    }
}
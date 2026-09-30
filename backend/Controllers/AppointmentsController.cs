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
    public class AppointmentsController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public AppointmentsController(HospitalDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAppointments()
        {
            var appointments = await _context.Appointments
                .Select(a => new
                {
                    a.AppointmentId,
                    a.PatientId,
                    a.DoctorId,
                    a.AppointmentDate,
                    a.AppointmentTime,
                    a.Status,
                    a.Reason,
                    Patient = a.Patient == null ? null : new
                    {
                        a.Patient.PatientId,
                        a.Patient.FullName
                    },
                    Doctor = a.Doctor == null ? null : new
                    {
                        a.Doctor.DoctorId,
                        a.Doctor.Specialization,
                        User = a.Doctor.User == null ? null : new
                        {
                            a.Doctor.User.UserId,
                            a.Doctor.User.FullName
                        }
                    }
                })
                .ToListAsync();

            return Ok(appointments);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAppointment(int id)
        {
            var appointment = await _context.Appointments
                .Where(a => a.AppointmentId == id)
                .Select(a => new
                {
                    a.AppointmentId,
                    a.PatientId,
                    a.DoctorId,
                    a.AppointmentDate,
                    a.AppointmentTime,
                    a.Status,
                    a.Reason,
                    Patient = a.Patient == null ? null : new
                    {
                        a.Patient.PatientId,
                        a.Patient.FullName
                    },
                    Doctor = a.Doctor == null ? null : new
                    {
                        a.Doctor.DoctorId,
                        a.Doctor.Specialization,
                        User = a.Doctor.User == null ? null : new
                        {
                            a.Doctor.User.UserId,
                            a.Doctor.User.FullName
                        }
                    }
                })
                .FirstOrDefaultAsync();

            if (appointment == null) return NotFound();
            return Ok(appointment);
        }

        [HttpPost]
        [Authorize(Roles = "SuperAdmin,Receptionist")]
        public async Task<ActionResult<Appointment>> CreateAppointment(Appointment appointment)
        {
            bool conflict = await _context.Appointments.AnyAsync(a =>
                a.DoctorId == appointment.DoctorId &&
                a.AppointmentDate == appointment.AppointmentDate &&
                a.AppointmentTime == appointment.AppointmentTime &&
                a.Status == "Scheduled");

            if (conflict)
            {
                return Conflict(new { message = "This doctor already has an appointment at the selected date and time." });
            }

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAppointment), new { id = appointment.AppointmentId }, appointment);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "SuperAdmin,Receptionist,Doctor,Nurse")]
        public async Task<IActionResult> UpdateAppointment(int id, Appointment appointment)
        {
            if (id != appointment.AppointmentId) return BadRequest();
            _context.Entry(appointment).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "SuperAdmin,Receptionist")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return NotFound();
            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
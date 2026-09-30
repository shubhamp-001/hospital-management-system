using Microsoft.EntityFrameworkCore;
using Hospital_Management_System.Models;

namespace Hospital_Management_System.Data
{
    public class HospitalDbContext : DbContext
    {
        public HospitalDbContext(DbContextOptions<HospitalDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<Medicine> Medicines { get; set; }
        public DbSet<PrescriptionMedicine> PrescriptionMedicines { get; set; }
        public DbSet<Bill> Bills { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Gender> Genders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Bill>().Property(b => b.ConsultationFee).HasPrecision(10, 2);
            modelBuilder.Entity<Bill>().Property(b => b.MedicineCharges).HasPrecision(10, 2);
            modelBuilder.Entity<Bill>().Property(b => b.TotalAmount).HasPrecision(10, 2);
            modelBuilder.Entity<Medicine>().Property(m => m.Price).HasPrecision(10, 2);

            modelBuilder.Entity<Role>().ToTable("m_Roles");
            modelBuilder.Entity<Gender>().ToTable("m_Genders");

            modelBuilder.Entity<Role>().HasData(
                new Role { RoleId = 1, RoleName = "SuperAdmin" },
                new Role { RoleId = 2, RoleName = "Doctor" },
                new Role { RoleId = 3, RoleName = "Nurse" },
                new Role { RoleId = 4, RoleName = "Receptionist" },
                new Role { RoleId = 5, RoleName = "Accountant" },
                new Role { RoleId = 6, RoleName = "Pharmacist" },
                new Role { RoleId = 7, RoleName = "LabTechnician" },
                new Role { RoleId = 8, RoleName = "Patient" }
            );

            modelBuilder.Entity<Gender>().HasData(
                new Gender { GenderId = 1, GenderName = "Male" },
                new Gender { GenderId = 2, GenderName = "Female" },
                new Gender { GenderId = 3, GenderName = "Other" }
            );
        }
    }
}
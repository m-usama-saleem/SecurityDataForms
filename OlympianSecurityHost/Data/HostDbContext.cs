using Microsoft.EntityFrameworkCore;
using OlympianSecurityHost.Models.AlarmResponses;
using OlympianSecurityHost.Models.Common;
using OlympianSecurityHost.Models.GeneralOccurences;
using OlympianSecurityHost.Models.LossPreventionModels;
using OlympianSecurityHost.Models.ParkingEnforcements;
using OlympianSecurityHost.Models.SecurityLogs;
using OlympianSecurityHost.Models.TressPassNotices;
using OlympianSecurityHost.Models.Users;

namespace OlympianSecurityHost.Data
{
    public class HostDbContext : DbContext
    {
        public HostDbContext(DbContextOptions<HostDbContext> options) : base(options)
        {
        }
        //protected override void OnModelCreating(ModelBuilder builder)
        //{
        //    builder.Entity<UsersModel>()
        //        .HasIndex(u => u.UserId)
        //        .IsUnique();
        //}

        public DbSet<UsersModel> Users { get; set; }
        public DbSet<UsersRole> Roles { get; set; }
        public DbSet<SecurityLogsModel> SecurityLogs { get; set; }
        public DbSet<AlarmResponsesModel> AlarmResponses { get; set; }
        public DbSet<GeneralOccurencesModel> GeneralOccurences { get; set; }
        public DbSet<ParkingEnforcementsModel> ParkingEnforcements { get; set; }
        public DbSet<TressPassNoticesModel> TressPassNotices { get; set; }
        public DbSet<OccurencesModel> Occurences { get; set; }
        public DbSet<AdultRightToCounselsModel> AdultRightToCounsels { get; set; }
        public DbSet<CivilFormsModel> CivilForms { get; set; }
        public DbSet<EmployeeTimeSheetsModel> EmployeeTimeSheets { get; set; }
        public DbSet<TresspassReportsModel> TresspassReports { get; set; }
        public DbSet<YouthRightToCounselsModel> YouthRightToCounsels { get; set; }
        public DbSet<IncidentReportsModel> IncidentReports { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UsersModel>()
                .HasIndex(p => p.UserId)
                .IsUnique(true);

            modelBuilder.Entity<OccurencesModel>()
                .HasIndex(p => p.Name)
                .IsUnique(true);
        }

    }
}

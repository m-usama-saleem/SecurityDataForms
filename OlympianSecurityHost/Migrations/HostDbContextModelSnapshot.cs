﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using OlympianSecurityHost.Data;

namespace OlympianSecurityHost.Migrations
{
    [DbContext(typeof(HostDbContext))]
    partial class HostDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.6-servicing-10079")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("OlympianSecurityHost.Models.AlarmResponses.AlarmResponsesModel", b =>
                {
                    b.Property<long>("SysSerial")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("ActionTaken")
                        .IsRequired();

                    b.Property<string>("AlarmType");

                    b.Property<string>("AlarmZone");

                    b.Property<string>("Arrival")
                        .IsRequired();

                    b.Property<long>("ClientId");

                    b.Property<string>("Comments")
                        .IsRequired();

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<DateTime>("DateReceived");

                    b.Property<string>("Departure")
                        .IsRequired();

                    b.Property<string>("DispatchRequestType");

                    b.Property<string>("FireDept");

                    b.Property<string>("IsApproved");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("KeyBox");

                    b.Property<string>("Keys")
                        .IsRequired();

                    b.Property<string>("Name");

                    b.Property<string>("Other");

                    b.Property<string>("OtherAlarmType");

                    b.Property<string>("PoliceServiceBadge");

                    b.Property<string>("ReportToClient");

                    b.Property<string>("RequestedBy")
                        .IsRequired();

                    b.Property<string>("ServiceCallNo");

                    b.Property<string>("ServiceDispatched")
                        .IsRequired();

                    b.Property<string>("SiteAddress")
                        .IsRequired();

                    b.Property<string>("Subscriber")
                        .IsRequired();

                    b.Property<string>("UpdatedBy");

                    b.Property<DateTime>("UpdatedDate");

                    b.HasKey("SysSerial");

                    b.HasIndex("ClientId");

                    b.ToTable("AlarmResponses");
                });

            modelBuilder.Entity("OlympianSecurityHost.Models.Common.OccurencesModel", b =>
                {
                    b.Property<long>("SysSerial")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Name")
                        .IsRequired();

                    b.HasKey("SysSerial");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("Occurences");
                });

            modelBuilder.Entity("OlympianSecurityHost.Models.GeneralOccurences.GeneralOccurencesModel", b =>
                {
                    b.Property<long>("SysSerial")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("AttachmentCheck");

                    b.Property<string>("Attachments");

                    b.Property<long>("ClientId");

                    b.Property<string>("ComplaintBy")
                        .IsRequired();

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<DateTime>("DateInvestigated");

                    b.Property<DateTime>("DateMadeOut");

                    b.Property<DateTime>("DateReceived");

                    b.Property<DateTime>("DiaryDate");

                    b.Property<string>("InitialInvestigationBy")
                        .IsRequired();

                    b.Property<string>("IsApproved");

                    b.Property<bool>("IsDeleted");

                    b.Property<DateTime>("OccurenceDate");

                    b.Property<string>("OccurencePlace")
                        .IsRequired();

                    b.Property<string>("OccurenceType")
                        .IsRequired();

                    b.Property<string>("OpenClosed")
                        .IsRequired();

                    b.Property<string>("PoliceDivision")
                        .IsRequired();

                    b.Property<string>("SiteAddress")
                        .IsRequired();

                    b.Property<string>("Synopsis")
                        .IsRequired();

                    b.Property<string>("UpdatedBy");

                    b.Property<DateTime>("UpdatedDate");

                    b.HasKey("SysSerial");

                    b.HasIndex("ClientId");

                    b.ToTable("GeneralOccurences");
                });

            modelBuilder.Entity("OlympianSecurityHost.Models.LossPreventionModels.AdultRightToCounselsModel", b =>
                {
                    b.Property<long>("SysSerial")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<long>("ClientId");

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<DateTime>("Date");

                    b.Property<string>("EndTime")
                        .IsRequired();

                    b.Property<string>("IsApproved");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("SiteAddress")
                        .IsRequired();

                    b.Property<string>("StartTime")
                        .IsRequired();

                    b.Property<string>("TimeDetails")
                        .IsRequired();

                    b.Property<string>("UpdatedBy");

                    b.Property<DateTime>("UpdatedDate");

                    b.HasKey("SysSerial");

                    b.HasIndex("ClientId");

                    b.ToTable("AdultRightToCounsels");
                });

            modelBuilder.Entity("OlympianSecurityHost.Models.LossPreventionModels.CivilFormsModel", b =>
                {
                    b.Property<long>("SysSerial")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<long>("ClientId");

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<DateTime>("Date");

                    b.Property<string>("EndTime")
                        .IsRequired();

                    b.Property<string>("IsApproved");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("SiteAddress")
                        .IsRequired();

                    b.Property<string>("StartTime")
                        .IsRequired();

                    b.Property<string>("TimeDetails")
                        .IsRequired();

                    b.Property<string>("UpdatedBy");

                    b.Property<DateTime>("UpdatedDate");

                    b.HasKey("SysSerial");

                    b.HasIndex("ClientId");

                    b.ToTable("CivilForms");
                });

            modelBuilder.Entity("OlympianSecurityHost.Models.LossPreventionModels.EmployeeTimeSheetsModel", b =>
                {
                    b.Property<long>("SysSerial")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<long>("ClientId");

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<DateTime>("Date");

                    b.Property<string>("EndTime")
                        .IsRequired();

                    b.Property<string>("IsApproved");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("SiteAddress")
                        .IsRequired();

                    b.Property<string>("StartTime")
                        .IsRequired();

                    b.Property<string>("TimeDetails")
                        .IsRequired();

                    b.Property<string>("UpdatedBy");

                    b.Property<DateTime>("UpdatedDate");

                    b.HasKey("SysSerial");

                    b.HasIndex("ClientId");

                    b.ToTable("EmployeeTimeSheets");
                });

            modelBuilder.Entity("OlympianSecurityHost.Models.LossPreventionModels.IncidentReportsModel", b =>
                {
                    b.Property<long>("SysSerial")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<long>("ClientId");

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<DateTime>("Date");

                    b.Property<string>("EndTime")
                        .IsRequired();

                    b.Property<string>("IsApproved");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("SiteAddress")
                        .IsRequired();

                    b.Property<string>("StartTime")
                        .IsRequired();

                    b.Property<string>("TimeDetails")
                        .IsRequired();

                    b.Property<string>("UpdatedBy");

                    b.Property<DateTime>("UpdatedDate");

                    b.HasKey("SysSerial");

                    b.HasIndex("ClientId");

                    b.ToTable("IncidentReports");
                });

            modelBuilder.Entity("OlympianSecurityHost.Models.LossPreventionModels.TresspassReportsModel", b =>
                {
                    b.Property<long>("SysSerial")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<long>("ClientId");

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<DateTime>("Date");

                    b.Property<string>("EndTime")
                        .IsRequired();

                    b.Property<string>("IsApproved");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("SiteAddress")
                        .IsRequired();

                    b.Property<string>("StartTime")
                        .IsRequired();

                    b.Property<string>("TimeDetails")
                        .IsRequired();

                    b.Property<string>("UpdatedBy");

                    b.Property<DateTime>("UpdatedDate");

                    b.HasKey("SysSerial");

                    b.HasIndex("ClientId");

                    b.ToTable("TresspassReports");
                });

            modelBuilder.Entity("OlympianSecurityHost.Models.LossPreventionModels.YouthRightToCounselsModel", b =>
                {
                    b.Property<long>("SysSerial")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<long>("ClientId");

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<DateTime>("Date");

                    b.Property<string>("EndTime")
                        .IsRequired();

                    b.Property<string>("IsApproved");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("SiteAddress")
                        .IsRequired();

                    b.Property<string>("StartTime")
                        .IsRequired();

                    b.Property<string>("TimeDetails")
                        .IsRequired();

                    b.Property<string>("UpdatedBy");

                    b.Property<DateTime>("UpdatedDate");

                    b.HasKey("SysSerial");

                    b.HasIndex("ClientId");

                    b.ToTable("YouthRightToCounsels");
                });

            modelBuilder.Entity("OlympianSecurityHost.Models.ParkingEnforcements.ParkingEnforcementsModel", b =>
                {
                    b.Property<long>("SysSerial")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Arrival")
                        .IsRequired();

                    b.Property<string>("AttachmentCheck");

                    b.Property<string>("Attachments");

                    b.Property<long>("ClientId");

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<DateTime>("DateReceived");

                    b.Property<string>("Departure")
                        .IsRequired();

                    b.Property<string>("Details")
                        .IsRequired();

                    b.Property<string>("IsApproved");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("NoOfTags")
                        .IsRequired();

                    b.Property<string>("NoOfTows")
                        .IsRequired();

                    b.Property<string>("OccurencePlace")
                        .IsRequired();

                    b.Property<string>("PoliceDivision")
                        .IsRequired();

                    b.Property<string>("SiteAddress")
                        .IsRequired();

                    b.Property<string>("TowCompany");

                    b.Property<string>("TowTrucksCalled")
                        .IsRequired();

                    b.Property<string>("TowedTo");

                    b.Property<string>("TruckLicense");

                    b.Property<string>("UpdatedBy");

                    b.Property<DateTime>("UpdatedDate");

                    b.HasKey("SysSerial");

                    b.HasIndex("ClientId");

                    b.ToTable("ParkingEnforcements");
                });

            modelBuilder.Entity("OlympianSecurityHost.Models.SecurityLogs.SecurityLogsModel", b =>
                {
                    b.Property<long>("SysSerial")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<long>("ClientId");

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<DateTime>("Date");

                    b.Property<string>("EndTime")
                        .IsRequired();

                    b.Property<string>("IsApproved");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("SiteAddress")
                        .IsRequired();

                    b.Property<string>("StartTime")
                        .IsRequired();

                    b.Property<string>("TimeDetails")
                        .IsRequired();

                    b.Property<string>("UpdatedBy");

                    b.Property<DateTime>("UpdatedDate");

                    b.HasKey("SysSerial");

                    b.HasIndex("ClientId");

                    b.ToTable("SecurityLogs");
                });

            modelBuilder.Entity("OlympianSecurityHost.Models.TressPassNotices.TressPassNoticesModel", b =>
                {
                    b.Property<long>("SysSerial")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Address")
                        .IsRequired();

                    b.Property<string>("City")
                        .IsRequired();

                    b.Property<long>("ClientId");

                    b.Property<string>("Clothing")
                        .IsRequired();

                    b.Property<string>("Complexion")
                        .IsRequired();

                    b.Property<string>("Country")
                        .IsRequired();

                    b.Property<string>("CreatedBy");

                    b.Property<DateTime>("CreatedDate");

                    b.Property<string>("DOB")
                        .IsRequired();

                    b.Property<DateTime>("Date");

                    b.Property<string>("FirstName")
                        .IsRequired();

                    b.Property<string>("Gender")
                        .IsRequired();

                    b.Property<string>("Glasses")
                        .IsRequired();

                    b.Property<string>("HairColor")
                        .IsRequired();

                    b.Property<string>("HairLength")
                        .IsRequired();

                    b.Property<string>("Height")
                        .IsRequired();

                    b.Property<string>("Initial")
                        .IsRequired();

                    b.Property<string>("IsApproved");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("IssuedAt")
                        .IsRequired();

                    b.Property<string>("LastName")
                        .IsRequired();

                    b.Property<string>("Marks")
                        .IsRequired();

                    b.Property<string>("PeriodOfTime")
                        .IsRequired();

                    b.Property<string>("Photos");

                    b.Property<string>("PostalCode")
                        .IsRequired();

                    b.Property<string>("Province")
                        .IsRequired();

                    b.Property<string>("ReasonForNotice")
                        .IsRequired();

                    b.Property<string>("Tattoos")
                        .IsRequired();

                    b.Property<string>("TresspassOffence")
                        .IsRequired();

                    b.Property<string>("UpdatedBy");

                    b.Property<DateTime>("UpdatedDate");

                    b.Property<string>("Weight")
                        .IsRequired();

                    b.HasKey("SysSerial");

                    b.HasIndex("ClientId");

                    b.ToTable("TressPassNotices");
                });

            modelBuilder.Entity("OlympianSecurityHost.Models.Users.UsersModel", b =>
                {
                    b.Property<long>("SysSerial")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<bool>("IsDeleted");

                    b.Property<byte[]>("Password")
                        .IsRequired();

                    b.Property<long>("RoleId");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.HasKey("SysSerial");

                    b.HasIndex("RoleId");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("OlympianSecurityHost.Models.Users.UsersRole", b =>
                {
                    b.Property<long>("SysSerial")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Name")
                        .IsRequired();

                    b.HasKey("SysSerial");

                    b.ToTable("Roles");
                });

            modelBuilder.Entity("OlympianSecurityHost.Models.AlarmResponses.AlarmResponsesModel", b =>
                {
                    b.HasOne("OlympianSecurityHost.Models.Users.UsersModel", "User")
                        .WithMany()
                        .HasForeignKey("ClientId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("OlympianSecurityHost.Models.GeneralOccurences.GeneralOccurencesModel", b =>
                {
                    b.HasOne("OlympianSecurityHost.Models.Users.UsersModel", "User")
                        .WithMany()
                        .HasForeignKey("ClientId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("OlympianSecurityHost.Models.LossPreventionModels.AdultRightToCounselsModel", b =>
                {
                    b.HasOne("OlympianSecurityHost.Models.Users.UsersModel", "User")
                        .WithMany()
                        .HasForeignKey("ClientId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("OlympianSecurityHost.Models.LossPreventionModels.CivilFormsModel", b =>
                {
                    b.HasOne("OlympianSecurityHost.Models.Users.UsersModel", "User")
                        .WithMany()
                        .HasForeignKey("ClientId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("OlympianSecurityHost.Models.LossPreventionModels.EmployeeTimeSheetsModel", b =>
                {
                    b.HasOne("OlympianSecurityHost.Models.Users.UsersModel", "User")
                        .WithMany()
                        .HasForeignKey("ClientId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("OlympianSecurityHost.Models.LossPreventionModels.IncidentReportsModel", b =>
                {
                    b.HasOne("OlympianSecurityHost.Models.Users.UsersModel", "User")
                        .WithMany()
                        .HasForeignKey("ClientId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("OlympianSecurityHost.Models.LossPreventionModels.TresspassReportsModel", b =>
                {
                    b.HasOne("OlympianSecurityHost.Models.Users.UsersModel", "User")
                        .WithMany()
                        .HasForeignKey("ClientId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("OlympianSecurityHost.Models.LossPreventionModels.YouthRightToCounselsModel", b =>
                {
                    b.HasOne("OlympianSecurityHost.Models.Users.UsersModel", "User")
                        .WithMany()
                        .HasForeignKey("ClientId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("OlympianSecurityHost.Models.ParkingEnforcements.ParkingEnforcementsModel", b =>
                {
                    b.HasOne("OlympianSecurityHost.Models.Users.UsersModel", "User")
                        .WithMany()
                        .HasForeignKey("ClientId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("OlympianSecurityHost.Models.SecurityLogs.SecurityLogsModel", b =>
                {
                    b.HasOne("OlympianSecurityHost.Models.Users.UsersModel", "User")
                        .WithMany()
                        .HasForeignKey("ClientId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("OlympianSecurityHost.Models.TressPassNotices.TressPassNoticesModel", b =>
                {
                    b.HasOne("OlympianSecurityHost.Models.Users.UsersModel", "User")
                        .WithMany()
                        .HasForeignKey("ClientId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("OlympianSecurityHost.Models.Users.UsersModel", b =>
                {
                    b.HasOne("OlympianSecurityHost.Models.Users.UsersRole", "UserRole")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}

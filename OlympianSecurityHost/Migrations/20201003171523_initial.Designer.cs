﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using OlympianSecurityHost.Data;

namespace OlympianSecurityHost.Migrations
{
    [DbContext(typeof(HostDbContext))]
    [Migration("20201003171523_initial")]
    partial class initial
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.6-servicing-10079")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("OlympianSecurityHost.Models.SecurityLog.SecurityLogs", b =>
                {
                    b.Property<long>("SysSerial")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<long>("ClientId");

                    b.Property<DateTime>("Date");

                    b.Property<DateTime>("EndTime");

                    b.Property<string>("SiteAddress")
                        .IsRequired();

                    b.Property<DateTime>("StartTime");

                    b.Property<string>("TimeDetails")
                        .IsRequired();

                    b.HasKey("SysSerial");

                    b.HasIndex("ClientId");

                    b.ToTable("SecurityLogs");
                });

            modelBuilder.Entity("OlympianSecurityHost.Models.Users.UsersModel", b =>
                {
                    b.Property<long>("SysSerial")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<byte[]>("Password")
                        .IsRequired();

                    b.Property<long>("RoleId");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("SysSerial");

                    b.HasIndex("RoleId");

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

            modelBuilder.Entity("OlympianSecurityHost.Models.SecurityLog.SecurityLogs", b =>
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
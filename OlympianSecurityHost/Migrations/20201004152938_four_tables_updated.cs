using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OlympianSecurityHost.Migrations
{
    public partial class four_tables_updated : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AlarmResponses",
                columns: table => new
                {
                    SysSerial = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ClientName = table.Column<long>(nullable: false),
                    SiteAddress = table.Column<string>(nullable: false),
                    DateReceived = table.Column<DateTime>(nullable: false),
                    Arrival = table.Column<DateTime>(nullable: false),
                    Departure = table.Column<DateTime>(nullable: false),
                    KeyBox = table.Column<string>(nullable: false),
                    Keys = table.Column<string>(nullable: false),
                    AlarmType = table.Column<string>(nullable: false),
                    OtherAlarmType = table.Column<string>(nullable: false),
                    DispatchRequestType = table.Column<string>(nullable: false),
                    RequestedBy = table.Column<string>(nullable: false),
                    AlarmZone = table.Column<string>(nullable: false),
                    ServiceDispatched = table.Column<bool>(nullable: false),
                    ServiceCallNo = table.Column<string>(nullable: false),
                    ActionTaken = table.Column<string>(nullable: false),
                    Comments = table.Column<string>(nullable: false),
                    Subscriber = table.Column<bool>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    FirstDept = table.Column<string>(nullable: false),
                    PoliceServiceBadge = table.Column<string>(nullable: false),
                    Other = table.Column<string>(nullable: false),
                    ReportToClient = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlarmResponses", x => x.SysSerial);
                    table.ForeignKey(
                        name: "FK_AlarmResponses_Users_ClientName",
                        column: x => x.ClientName,
                        principalTable: "Users",
                        principalColumn: "SysSerial",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GeneralOccurences",
                columns: table => new
                {
                    SysSerial = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    OccurenceType = table.Column<string>(nullable: false),
                    ClientId = table.Column<long>(nullable: false),
                    SiteAddress = table.Column<string>(nullable: false),
                    PoliceDivision = table.Column<string>(nullable: false),
                    OccurencePlace = table.Column<string>(nullable: false),
                    OccurenceDate = table.Column<DateTime>(nullable: false),
                    ComplaintBy = table.Column<string>(nullable: false),
                    DateReceived = table.Column<DateTime>(nullable: false),
                    InitialInvestigationBy = table.Column<string>(nullable: false),
                    DateInvestigated = table.Column<DateTime>(nullable: false),
                    DateMadeOut = table.Column<DateTime>(nullable: false),
                    Synopsis = table.Column<string>(nullable: false),
                    OpenClosed = table.Column<bool>(nullable: false),
                    AttachmentCheck = table.Column<string>(nullable: true),
                    DiaryDate = table.Column<DateTime>(nullable: false),
                    Attachments = table.Column<byte[]>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GeneralOccurences", x => x.SysSerial);
                    table.ForeignKey(
                        name: "FK_GeneralOccurences_Users_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Users",
                        principalColumn: "SysSerial",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ParkingEnforcements",
                columns: table => new
                {
                    SysSerial = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    DateReceived = table.Column<DateTime>(nullable: false),
                    Arrival = table.Column<DateTime>(nullable: false),
                    Departure = table.Column<DateTime>(nullable: false),
                    ClientName = table.Column<long>(nullable: false),
                    SiteAddress = table.Column<string>(nullable: false),
                    PoliceDivision = table.Column<string>(nullable: false),
                    TowTrucksCalled = table.Column<bool>(nullable: false),
                    TowCompany = table.Column<string>(nullable: true),
                    TruckLicense = table.Column<string>(nullable: true),
                    TowedTo = table.Column<string>(nullable: true),
                    OccurencePlace = table.Column<string>(nullable: false),
                    Details = table.Column<string>(nullable: false),
                    NoOfTags = table.Column<bool>(nullable: false),
                    NoOfTows = table.Column<string>(nullable: false),
                    AttachmentCheck = table.Column<string>(nullable: true),
                    Attachments = table.Column<byte[]>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParkingEnforcements", x => x.SysSerial);
                    table.ForeignKey(
                        name: "FK_ParkingEnforcements_Users_ClientName",
                        column: x => x.ClientName,
                        principalTable: "Users",
                        principalColumn: "SysSerial",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TressPassNotices",
                columns: table => new
                {
                    SysSerial = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    FirstName = table.Column<string>(nullable: false),
                    Initial = table.Column<string>(nullable: false),
                    LastName = table.Column<string>(nullable: false),
                    DOB = table.Column<string>(nullable: false),
                    Gender = table.Column<string>(nullable: false),
                    Address = table.Column<string>(nullable: false),
                    City = table.Column<string>(nullable: false),
                    Province = table.Column<string>(nullable: false),
                    PostalCode = table.Column<string>(nullable: false),
                    Country = table.Column<string>(nullable: false),
                    Complexion = table.Column<string>(nullable: false),
                    HairColor = table.Column<string>(nullable: false),
                    HairLength = table.Column<string>(nullable: false),
                    Height = table.Column<string>(nullable: false),
                    Weight = table.Column<string>(nullable: false),
                    Glasses = table.Column<string>(nullable: false),
                    Clothing = table.Column<string>(nullable: false),
                    Marks = table.Column<string>(nullable: false),
                    Tattoos = table.Column<string>(nullable: false),
                    IssuedAt = table.Column<DateTime>(nullable: false),
                    Date = table.Column<DateTime>(nullable: false),
                    PeriodOfTime = table.Column<DateTime>(nullable: false),
                    TresspassOffece = table.Column<string>(nullable: false),
                    ReasonForNotice = table.Column<string>(nullable: false),
                    ClientName = table.Column<long>(nullable: false),
                    Photos = table.Column<byte[]>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TressPassNotices", x => x.SysSerial);
                    table.ForeignKey(
                        name: "FK_TressPassNotices_Users_ClientName",
                        column: x => x.ClientName,
                        principalTable: "Users",
                        principalColumn: "SysSerial",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AlarmResponses_ClientName",
                table: "AlarmResponses",
                column: "ClientName");

            migrationBuilder.CreateIndex(
                name: "IX_GeneralOccurences_ClientId",
                table: "GeneralOccurences",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_ParkingEnforcements_ClientName",
                table: "ParkingEnforcements",
                column: "ClientName");

            migrationBuilder.CreateIndex(
                name: "IX_TressPassNotices_ClientName",
                table: "TressPassNotices",
                column: "ClientName");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AlarmResponses");

            migrationBuilder.DropTable(
                name: "GeneralOccurences");

            migrationBuilder.DropTable(
                name: "ParkingEnforcements");

            migrationBuilder.DropTable(
                name: "TressPassNotices");
        }
    }
}

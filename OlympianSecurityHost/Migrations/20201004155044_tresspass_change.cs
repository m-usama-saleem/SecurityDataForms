using Microsoft.EntityFrameworkCore.Migrations;

namespace OlympianSecurityHost.Migrations
{
    public partial class tresspass_change : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TresspassOffece",
                table: "TressPassNotices",
                newName: "TresspassOffence");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TresspassOffence",
                table: "TressPassNotices",
                newName: "TresspassOffece");
        }
    }
}

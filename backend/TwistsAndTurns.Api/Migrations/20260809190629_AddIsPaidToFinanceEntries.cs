using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TwistsAndTurns.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddIsPaidToFinanceEntries : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPaid",
                table: "FinanceEntries",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPaid",
                table: "FinanceEntries");
        }
    }
}

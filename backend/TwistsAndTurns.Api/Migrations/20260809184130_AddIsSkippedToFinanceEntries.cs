using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TwistsAndTurns.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddIsSkippedToFinanceEntries : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsSkipped",
                table: "FinanceEntries",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsSkipped",
                table: "FinanceEntries");
        }
    }
}

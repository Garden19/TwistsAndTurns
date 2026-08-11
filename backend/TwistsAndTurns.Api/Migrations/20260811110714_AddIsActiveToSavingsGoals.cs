using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TwistsAndTurns.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddIsActiveToSavingsGoals : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "SavingsGoals",
                type: "bit",
                nullable: false,
                defaultValue: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "SavingsGoals");
        }
    }
}

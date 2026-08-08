using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TwistsAndTurns.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddBankAccountToFinanceEntries : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BankAccountId",
                table: "FinanceEntries",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_FinanceEntries_BankAccountId",
                table: "FinanceEntries",
                column: "BankAccountId");

            migrationBuilder.AddForeignKey(
                name: "FK_FinanceEntries_BankAccounts_BankAccountId",
                table: "FinanceEntries",
                column: "BankAccountId",
                principalTable: "BankAccounts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FinanceEntries_BankAccounts_BankAccountId",
                table: "FinanceEntries");

            migrationBuilder.DropIndex(
                name: "IX_FinanceEntries_BankAccountId",
                table: "FinanceEntries");

            migrationBuilder.DropColumn(
                name: "BankAccountId",
                table: "FinanceEntries");
        }
    }
}

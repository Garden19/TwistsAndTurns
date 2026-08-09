using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TwistsAndTurns.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddRecurringFinanceItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RecurringFinanceItemId",
                table: "FinanceEntries",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "RecurringFinanceItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    EntryType = table.Column<int>(type: "int", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RecurrenceUnit = table.Column<int>(type: "int", nullable: false),
                    RecurrenceInterval = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    BankAccountId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecurringFinanceItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecurringFinanceItems_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RecurringFinanceItems_BankAccounts_BankAccountId",
                        column: x => x.BankAccountId,
                        principalTable: "BankAccounts",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_FinanceEntries_RecurringFinanceItemId_EntryDate",
                table: "FinanceEntries",
                columns: new[] { "RecurringFinanceItemId", "EntryDate" },
                unique: true,
                filter: "[RecurringFinanceItemId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_RecurringFinanceItems_BankAccountId",
                table: "RecurringFinanceItems",
                column: "BankAccountId");

            migrationBuilder.CreateIndex(
                name: "IX_RecurringFinanceItems_UserId",
                table: "RecurringFinanceItems",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_FinanceEntries_RecurringFinanceItems_RecurringFinanceItemId",
                table: "FinanceEntries",
                column: "RecurringFinanceItemId",
                principalTable: "RecurringFinanceItems",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FinanceEntries_RecurringFinanceItems_RecurringFinanceItemId",
                table: "FinanceEntries");

            migrationBuilder.DropTable(
                name: "RecurringFinanceItems");

            migrationBuilder.DropIndex(
                name: "IX_FinanceEntries_RecurringFinanceItemId_EntryDate",
                table: "FinanceEntries");

            migrationBuilder.DropColumn(
                name: "RecurringFinanceItemId",
                table: "FinanceEntries");
        }
    }
}

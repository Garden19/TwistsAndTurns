using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TwistsAndTurns.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddRecurringBillOccurrences : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RecurringBillOccurrences",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsPaid = table.Column<bool>(type: "bit", nullable: false),
                    PaidAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RecurringBillId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecurringBillOccurrences", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecurringBillOccurrences_RecurringBills_RecurringBillId",
                        column: x => x.RecurringBillId,
                        principalTable: "RecurringBills",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RecurringBillOccurrences_RecurringBillId_DueDate",
                table: "RecurringBillOccurrences",
                columns: new[] { "RecurringBillId", "DueDate" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RecurringBillOccurrences");
        }
    }
}

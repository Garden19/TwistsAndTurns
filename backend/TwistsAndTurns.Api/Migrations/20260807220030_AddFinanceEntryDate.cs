using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TwistsAndTurns.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddFinanceEntryDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "EntryDate",
                table: "FinanceEntries",
                type: "datetime2",
                nullable: true);

            migrationBuilder.Sql(
                "UPDATE FinanceEntries SET EntryDate = CreatedAt"
            );

            migrationBuilder.AlterColumn<DateTime>(
                name: "EntryDate",
                table: "FinanceEntries",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EntryDate",
                table: "FinanceEntries");
        }
    }
}

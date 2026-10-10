using System.Globalization;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TwistsAndTurns.Api.Data;
using TwistsAndTurns.Api.Models;

namespace TwistsAndTurns.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/finance-entries/export")]
public class FinanceExportController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _users;

    public FinanceExportController(
        ApplicationDbContext context,
        UserManager<ApplicationUser> users)
    {
        _context = context;
        _users = users;
    }

    [HttpGet]
    public async Task<IActionResult> Download()
    {
        var user = await _users.GetUserAsync(User);
        if (user is null)
        {
            return Unauthorized();
        }

        var entries = await _context.FinanceEntries
            .AsNoTracking()
            .Where(entry => entry.UserId == user.Id)
            .OrderBy(entry => entry.EntryDate)
            .ThenBy(entry => entry.Id)
            .Select(entry => new
            {
                entry.EntryDate,
                entry.EntryType,
                entry.Name,
                entry.Category,
                entry.Amount,
                Account = entry.BankAccount == null
                    ? null : entry.BankAccount.Name,
                Bank = entry.BankAccount == null
                    ? null : entry.BankAccount.BankName,
                entry.IsPaid,
                entry.IsSkipped,
                IsRecurring = entry.RecurringFinanceItemId != null
            })
            .ToListAsync();

        var csv = new StringBuilder();
        csv.AppendLine("Date,Type,Name,Category,Amount GBP,Account,Bank,Paid,Skipped,Recurring");
        foreach (var entry in entries)
        {
            csv.AppendLine(string.Join(",", new[]
            {
                CsvField(entry.EntryDate.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture)),
                CsvField(entry.EntryType == FinanceEntryType.Income ? "Income" : "Expense"),
                CsvField(entry.Name),
                CsvField(entry.Category),
                entry.Amount.ToString("F2", CultureInfo.InvariantCulture),
                CsvField(entry.Account),
                CsvField(entry.Bank),
                entry.IsPaid ? "Yes" : "No",
                entry.IsSkipped ? "Yes" : "No",
                entry.IsRecurring ? "Yes" : "No"
            }));
        }

        var bytes = Encoding.UTF8.GetPreamble()
            .Concat(Encoding.UTF8.GetBytes(csv.ToString()))
            .ToArray();

        var filename = "twistsandturns-transactions-" +
            DateTime.UtcNow.ToString("yyyyMMdd", CultureInfo.InvariantCulture) +
            ".csv";

        return File(bytes, "text/csv; charset=utf-8", filename);
    }

    // Prevent spreadsheet programs from interpreting untrusted text as formulae.
    private static string CsvField(string? value)
    {
        var safe = value ?? string.Empty;
        if (safe.TrimStart().FirstOrDefault() is '=' or '+' or '-' or '@')
        {
            safe = "'" + safe;
        }

        return "\"" + safe.Replace("\"", "\"\"") + "\"";
    }
}

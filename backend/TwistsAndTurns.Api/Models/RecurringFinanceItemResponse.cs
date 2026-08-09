namespace TwistsAndTurns.Api.Models;

public class RecurringFinanceItemResponse
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public FinanceEntryType EntryType { get; set; }

    public string Category { get; set; } = string.Empty;

    public RecurrenceUnit RecurrenceUnit { get; set; }

    public int RecurrenceInterval { get; set; }

    public DateTime StartDate { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? BankAccountId { get; set; }

    public string? BankAccountName { get; set; }

    public string? BankName { get; set; }
}
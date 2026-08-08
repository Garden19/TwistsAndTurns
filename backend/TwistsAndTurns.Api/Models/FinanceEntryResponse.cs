namespace TwistsAndTurns.Api.Models;

public class FinanceEntryResponse
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public FinanceEntryType EntryType { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime EntryDate { get; set; }
    public string Category { get; set; } = string.Empty;
    public int? BankAccountId { get; set; }
    public string? BankAccountName { get; set; }
    public string? BankName { get; set; }
}
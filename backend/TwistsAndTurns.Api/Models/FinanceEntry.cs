namespace TwistsAndTurns.Api.Models;

public enum FinanceEntryType
{
    Income,
    Expense
}

public class FinanceEntry
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public FinanceEntryType EntryType { get; set; }
    public string Category { get; set; } = string.Empty;
    public DateTime EntryDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    public int? BankAccountId { get; set; }
    public BankAccount? BankAccount { get; set; }
}
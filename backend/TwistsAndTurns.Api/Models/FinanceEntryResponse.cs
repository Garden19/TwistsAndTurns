namespace TwistsAndTurns.Api.Models;

public class FinanceEntryResponse
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public FinanceEntryType EntryType { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime EntryDate { get; set; }
}
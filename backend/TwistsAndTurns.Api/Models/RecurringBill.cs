namespace TwistsAndTurns.Api.Models;

public class RecurringBill
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string Category { get; set; } = string.Empty;

    public int DueDay { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string UserId { get; set; } = string.Empty;

    public ApplicationUser User { get; set; } = null!;

    public int? BankAccountId { get; set; }

    public BankAccount? BankAccount { get; set; }
}
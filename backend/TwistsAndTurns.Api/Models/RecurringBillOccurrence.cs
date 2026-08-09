namespace TwistsAndTurns.Api.Models;

public class RecurringBillOccurrence
{
    public int Id { get; set; }

    public decimal Amount { get; set; }

    public DateTime DueDate { get; set; }

    public bool IsPaid { get; set; }

    public DateTime? PaidAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int RecurringBillId { get; set; }

    public RecurringBill RecurringBill { get; set; } = null!;
}
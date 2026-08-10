namespace TwistsAndTurns.Api.Models;

public class SavingsGoal
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public decimal TargetAmount { get; set; }

    public decimal CurrentAmount { get; set; }

    public DateTime? TargetDate { get; set; }

    public DateTime CreatedAt { get; set; } =
        DateTime.UtcNow;

    public string UserId { get; set; } =
        string.Empty;

    public ApplicationUser User { get; set; } =
        null!;
}
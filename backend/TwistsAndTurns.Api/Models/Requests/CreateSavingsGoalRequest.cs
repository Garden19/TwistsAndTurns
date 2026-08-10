namespace TwistsAndTurns.Api.Models.Requests;

public class CreateSavingsGoalRequest
{
    public string Name { get; set; } = string.Empty;

    public decimal TargetAmount { get; set; }

    public decimal CurrentAmount { get; set; }

    public DateTime? TargetDate { get; set; }
}
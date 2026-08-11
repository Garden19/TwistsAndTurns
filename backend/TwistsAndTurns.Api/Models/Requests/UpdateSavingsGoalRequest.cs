namespace TwistsAndTurns.Api.Models.Requests;

public class UpdateSavingsGoalRequest
{
    public string Name { get; set; } =
        string.Empty;

    public decimal TargetAmount { get; set; }

    public DateTime? TargetDate { get; set; }
}
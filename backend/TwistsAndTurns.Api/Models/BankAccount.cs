namespace TwistsAndTurns.Api.Models;

public class BankAccount
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string BankName { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string UserId { get; set; } = string.Empty;

    public ApplicationUser User { get; set; } = null!;
}
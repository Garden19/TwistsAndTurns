namespace TwistsAndTurns.Api.Models;

public class BankAccountResponse
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string BankName { get; set; } = string.Empty;

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }
}
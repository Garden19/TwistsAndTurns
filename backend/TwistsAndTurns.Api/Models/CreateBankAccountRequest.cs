using System.ComponentModel.DataAnnotations;

namespace TwistsAndTurns.Api.Models;

public class CreateBankAccountRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string BankName { get; set; } = string.Empty;
}
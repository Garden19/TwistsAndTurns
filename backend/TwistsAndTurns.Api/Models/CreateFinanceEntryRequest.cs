using System.ComponentModel.DataAnnotations;

namespace TwistsAndTurns.Api.Models;

public class CreateFinanceEntryRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Range(0.01, 999999999)]
    public decimal Amount { get; set; }

    [EnumDataType(typeof(FinanceEntryType))]
    public FinanceEntryType EntryType { get; set; }
}
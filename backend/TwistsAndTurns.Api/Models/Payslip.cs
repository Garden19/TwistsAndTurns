namespace TwistsAndTurns.Api.Models;

public class Payslip
{
    public int Id { get; set; }

    public string EmployerName { get; set; } =
        string.Empty;

    public DateTime PayDate { get; set; }

    public decimal GrossPay { get; set; }

    public decimal IncomeTax { get; set; }

    public decimal NationalInsurance { get; set; }

    public decimal PensionContribution { get; set; }

    public decimal OtherDeductions { get; set; }

    public decimal NetPay { get; set; }

    public string? Notes { get; set; }

    public bool IsActive { get; set; } =
        true;

    public DateTime CreatedAt { get; set; } =
        DateTime.UtcNow;

    public string UserId { get; set; } =
        string.Empty;

    public ApplicationUser User { get; set; } =
        null!;
}
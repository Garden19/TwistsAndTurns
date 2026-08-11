namespace TwistsAndTurns.Api.Models.Requests;

public class SavePayslipRequest
{
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
}
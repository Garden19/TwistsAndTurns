using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TwistsAndTurns.Api.Data;
using TwistsAndTurns.Api.Models;
using TwistsAndTurns.Api.Models.Requests;

namespace TwistsAndTurns.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PayslipsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PayslipsController(
        ApplicationDbContext context
    )
    {
        _context = context;
    }

    [HttpGet]
    public async Task<
        ActionResult<IEnumerable<Payslip>>
    > GetPayslips()
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId == null)
        {
            return Unauthorized();
        }

        var payslips =
            await _context.Payslips
                .AsNoTracking()
                .Where(
                    payslip =>
                        payslip.UserId == userId &&
                        payslip.IsActive
                )
                .OrderByDescending(
                    payslip =>
                        payslip.PayDate
                )
                .ThenByDescending(
                    payslip =>
                        payslip.CreatedAt
                )
                .ToListAsync();

        return Ok(payslips);
    }

    [HttpPost]
    public async Task<ActionResult<Payslip>>
        CreatePayslip(
            SavePayslipRequest request
        )
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId == null)
        {
            return Unauthorized();
        }

        var validationError =
            ValidateRequest(request);

        if (validationError != null)
        {
            return BadRequest(validationError);
        }

        var payslip = new Payslip
        {
            EmployerName =
                request.EmployerName.Trim(),

            PayDate =
                request.PayDate.Date,

            GrossPay =
                request.GrossPay,

            IncomeTax =
                request.IncomeTax,

            NationalInsurance =
                request.NationalInsurance,

            PensionContribution =
                request.PensionContribution,

            OtherDeductions =
                request.OtherDeductions,

            NetPay =
                request.NetPay,

            Notes =
                NormaliseNotes(request.Notes),

            UserId = userId,
            IsActive = true
        };

        _context.Payslips.Add(payslip);

        await _context.SaveChangesAsync();

        return Ok(payslip);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<Payslip>>
        UpdatePayslip(
            int id,
            SavePayslipRequest request
        )
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId == null)
        {
            return Unauthorized();
        }

        var validationError =
            ValidateRequest(request);

        if (validationError != null)
        {
            return BadRequest(validationError);
        }

        var payslip =
            await _context.Payslips
                .FirstOrDefaultAsync(
                    existingPayslip =>
                        existingPayslip.Id == id &&
                        existingPayslip.UserId ==
                            userId &&
                        existingPayslip.IsActive
                );

        if (payslip == null)
        {
            return NotFound();
        }

        payslip.EmployerName =
            request.EmployerName.Trim();

        payslip.PayDate =
            request.PayDate.Date;

        payslip.GrossPay =
            request.GrossPay;

        payslip.IncomeTax =
            request.IncomeTax;

        payslip.NationalInsurance =
            request.NationalInsurance;

        payslip.PensionContribution =
            request.PensionContribution;

        payslip.OtherDeductions =
            request.OtherDeductions;

        payslip.NetPay =
            request.NetPay;

        payslip.Notes =
            NormaliseNotes(request.Notes);

        await _context.SaveChangesAsync();

        return Ok(payslip);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult>
        ArchivePayslip(
            int id
        )
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId == null)
        {
            return Unauthorized();
        }

        var payslip =
            await _context.Payslips
                .FirstOrDefaultAsync(
                    existingPayslip =>
                        existingPayslip.Id == id &&
                        existingPayslip.UserId ==
                            userId &&
                        existingPayslip.IsActive
                );

        if (payslip == null)
        {
            return NotFound();
        }

        payslip.IsActive = false;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static string?
        ValidateRequest(
            SavePayslipRequest request
        )
    {
        if (
            string.IsNullOrWhiteSpace(
                request.EmployerName
            )
        )
        {
            return
                "Please provide an employer name.";
        }

        if (
            request.EmployerName.Trim().Length >
                100
        )
        {
            return
                "The employer name cannot exceed 100 characters.";
        }

        if (request.PayDate == default)
        {
            return
                "Please provide a pay date.";
        }

        if (request.GrossPay <= 0)
        {
            return
                "Gross pay must be greater than zero.";
        }

        if (
            request.IncomeTax < 0 ||
            request.NationalInsurance < 0 ||
            request.PensionContribution < 0 ||
            request.OtherDeductions < 0 ||
            request.NetPay < 0
        )
        {
            return
                "Payslip amounts cannot be negative.";
        }

        if (
            request.Notes != null &&
            request.Notes.Trim().Length > 1000
        )
        {
            return
                "Notes cannot exceed 1,000 characters.";
        }

        return null;
    }

    private static string?
        NormaliseNotes(
            string? notes
        )
    {
        if (string.IsNullOrWhiteSpace(notes))
        {
            return null;
        }

        return notes.Trim();
    }
}
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TwistsAndTurns.Api.Data;
using TwistsAndTurns.Api.Models;

namespace TwistsAndTurns.Api.Controllers;

[ApiController]
[Route("api/finance-entries")]
[Authorize]
public class FinanceEntriesController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;
    private readonly UserManager<ApplicationUser> _userManager;

    public FinanceEntriesController(
        ApplicationDbContext dbContext,
        UserManager<ApplicationUser> userManager
    )
    {
        _dbContext = dbContext;
        _userManager = userManager;
    }

    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok(new
        {
            message = "Finance controller is working"
        });
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateFinanceEntryRequest request
    )
    {
        var user = await _userManager.GetUserAsync(User);

        if (user is null)
        {
            return Unauthorized(new
            {
                message = "The logged-in user could not be identified"
            });
        }

        var financeEntry = new FinanceEntry
        {
            Name = request.Name,
            Amount = request.Amount,
            EntryType = request.EntryType,
            UserId = user.Id
        };

        _dbContext.FinanceEntries.Add(financeEntry);

        await _dbContext.SaveChangesAsync();

        var response = new FinanceEntryResponse {
            Id = financeEntry.Id,
            Name = financeEntry.Name,
            Amount = financeEntry.Amount,
            EntryType = financeEntry.EntryType,
            CreatedAt = financeEntry.CreatedAt
        };
        return Ok(response);
    }
}
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TwistsAndTurns.Api.Data;
using TwistsAndTurns.Api.Models;
using Microsoft.EntityFrameworkCore;

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

        BankAccount? bankAccount = null;

        if (request.BankAccountId.HasValue)
        {
            bankAccount = await _dbContext.BankAccounts
                .FirstOrDefaultAsync(
                    account =>
                        account.Id == request.BankAccountId.Value &&
                        account.UserId == user.Id &&
                        account.IsActive
                );

            if (bankAccount is null)
            {
                return BadRequest(new
                {
                    message = "The selected bank account could not be found"
                });
            }
        }

        var financeEntry = new FinanceEntry
        {
            Name = request.Name,
            Amount = request.Amount,
            EntryType = request.EntryType,
            Category = request.Category,
            UserId = user.Id,
            EntryDate = DateTime.UtcNow,
            BankAccountId = bankAccount?.Id
        };

        _dbContext.FinanceEntries.Add(financeEntry);

        await _dbContext.SaveChangesAsync();

        var response = new FinanceEntryResponse
        {
            Id = financeEntry.Id,
            Name = financeEntry.Name,
            Amount = financeEntry.Amount,
            EntryType = financeEntry.EntryType,
            Category = financeEntry.Category,
            EntryDate = financeEntry.EntryDate,
            CreatedAt = financeEntry.CreatedAt,
            BankAccountId = financeEntry.BankAccountId,
            BankAccountName = bankAccount?.Name,
            BankName = bankAccount?.BankName
        };

        return Ok(response);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var user = await _userManager.GetUserAsync(User);

        if (user is null)
        {
            return Unauthorized(new
            {
                message = "The logged-in user could not be identified"
            });
        }

        var financeEntries = await _dbContext.FinanceEntries
            .Where(entry => entry.UserId == user.Id)
            .OrderByDescending(entry => entry.CreatedAt)
            .Select(entry => new FinanceEntryResponse
            {
                Id = entry.Id,
                Name = entry.Name,
                Amount = entry.Amount,
                EntryType = entry.EntryType,
                EntryDate = entry.EntryDate,
                CreatedAt = entry.CreatedAt,
                Category = entry.Category,
                BankAccountId = entry.BankAccountId,
                BankAccountName = entry.BankAccount == null
                    ? null
                    : entry.BankAccount.Name,
                BankName = entry.BankAccount == null
                    ? null
                    : entry.BankAccount.BankName
            })
            .ToListAsync();

        return Ok(financeEntries);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await _userManager.GetUserAsync(User);

        if (user is null)
        {
            return Unauthorized(new
            {
                message = "The logged-in user could not be identified"
            });
        }

        var financeEntry = await _dbContext.FinanceEntries
            .FirstOrDefaultAsync(
                entry =>
                    entry.Id == id &&
                    entry.UserId == user.Id
            );

        if (financeEntry is null)
        {
            return NotFound(new
            {
                message = "Finance entry could not be found"
            });
        }

        _dbContext.FinanceEntries.Remove(financeEntry);

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<FinanceEntryResponse>> Update(
        int id,
        UpdateFinanceEntryRequest request
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

        var financeEntry = await _dbContext.FinanceEntries
            .FirstOrDefaultAsync(
                entry =>
                    entry.Id == id &&
                    entry.UserId == user.Id
            );

        if (financeEntry is null)
        {
            return NotFound(new
            {
                message = "Finance entry could not be found"
            });
        }

        BankAccount? bankAccount = null;

        if (request.BankAccountId.HasValue)
        {
            bankAccount = await _dbContext.BankAccounts
                .FirstOrDefaultAsync(
                    account =>
                        account.Id == request.BankAccountId.Value &&
                        account.UserId == user.Id &&
                        account.IsActive
                );

            if (bankAccount is null)
            {
                return BadRequest(new
                {
                    message = "The selected bank account could not be found"
                });
            }
        }

        financeEntry.Name = request.Name;
        financeEntry.Amount = request.Amount;
        financeEntry.EntryType = request.EntryType;
        financeEntry.Category = request.Category;
        financeEntry.BankAccountId = bankAccount?.Id;

        await _dbContext.SaveChangesAsync();

        var response = new FinanceEntryResponse
        {
            Id = financeEntry.Id,
            Name = financeEntry.Name,
            Amount = financeEntry.Amount,
            EntryType = financeEntry.EntryType,
            Category = financeEntry.Category,
            EntryDate = financeEntry.EntryDate,
            CreatedAt = financeEntry.CreatedAt,
            BankAccountId = financeEntry.BankAccountId,
            BankAccountName = bankAccount?.Name,
            BankName = bankAccount?.BankName
        };

        return Ok(response);
    }
}
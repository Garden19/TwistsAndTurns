using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TwistsAndTurns.Api.Data;
using TwistsAndTurns.Api.Models;

namespace TwistsAndTurns.Api.Controllers;

[ApiController]
[Route("api/bank-accounts")]
[Authorize]
public class BankAccountsController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;
    private readonly UserManager<ApplicationUser> _userManager;

    public BankAccountsController(
        ApplicationDbContext dbContext,
        UserManager<ApplicationUser> userManager
    )
    {
        _dbContext = dbContext;
        _userManager = userManager;
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateBankAccountRequest request
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

        var bankAccount = new BankAccount
        {
            Name = request.Name,
            BankName = request.BankName,
            UserId = user.Id
        };

        _dbContext.BankAccounts.Add(bankAccount);

        await _dbContext.SaveChangesAsync();

        var response = new BankAccountResponse
        {
            Id = bankAccount.Id,
            Name = bankAccount.Name,
            BankName = bankAccount.BankName,
            IsActive = bankAccount.IsActive,
            CreatedAt = bankAccount.CreatedAt
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

        var bankAccounts = await _dbContext.BankAccounts
            .Where(account =>
                account.UserId == user.Id &&
                account.IsActive
            )
            .OrderBy(account => account.Name)
            .Select(account => new BankAccountResponse
            {
                Id = account.Id,
                Name = account.Name,
                BankName = account.BankName,
                IsActive = account.IsActive,
                CreatedAt = account.CreatedAt
            })
            .ToListAsync();

        return Ok(bankAccounts);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Archive(int id)
    {
        var user = await _userManager.GetUserAsync(User);

        if (user is null)
        {
            return Unauthorized(new
            {
                message = "The logged-in user could not be identified"
            });
        }

        var bankAccount = await _dbContext.BankAccounts
            .FirstOrDefaultAsync(
                account =>
                    account.Id == id &&
                    account.UserId == user.Id &&
                    account.IsActive
            );

        if (bankAccount is null)
        {
            return NotFound(new
            {
                message = "Bank account could not be found"
            });
        }

        bankAccount.IsActive = false;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}
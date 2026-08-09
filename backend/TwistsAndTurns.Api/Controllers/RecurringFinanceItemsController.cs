using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TwistsAndTurns.Api.Data;
using TwistsAndTurns.Api.Models;

namespace TwistsAndTurns.Api.Controllers;

[ApiController]
[Route("api/recurring-finance-items")]
[Authorize]
public class RecurringFinanceItemsController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;
    private readonly UserManager<ApplicationUser> _userManager;

    public RecurringFinanceItemsController(
        ApplicationDbContext dbContext,
        UserManager<ApplicationUser> userManager
    )
    {
        _dbContext = dbContext;
        _userManager = userManager;
    }

    [HttpPost]
    public async Task<ActionResult<RecurringFinanceItemResponse>> Create(
        CreateRecurringFinanceItemRequest request
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

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new
            {
                message = "A name is required"
            });
        }

        if (request.Amount <= 0)
        {
            return BadRequest(new
            {
                message = "Amount must be greater than zero"
            });
        }

        if (string.IsNullOrWhiteSpace(request.Category))
        {
            return BadRequest(new
            {
                message = "A category is required"
            });
        }

        if (
            !Enum.IsDefined(
                typeof(FinanceEntryType),
                request.EntryType
            )
        )
        {
            return BadRequest(new
            {
                message = "The finance entry type is invalid"
            });
        }

        if (
            !Enum.IsDefined(
                typeof(RecurrenceUnit),
                request.RecurrenceUnit
            )
        )
        {
            return BadRequest(new
            {
                message = "The recurrence unit is invalid"
            });
        }

        if (request.RecurrenceInterval <= 0)
        {
            return BadRequest(new
            {
                message = "Recurrence interval must be greater than zero"
            });
        }

        if (request.StartDate == default)
        {
            return BadRequest(new
            {
                message = "A start date is required"
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

        var recurringFinanceItem =
            new RecurringFinanceItem
            {
                Name = request.Name.Trim(),
                Amount = request.Amount,
                EntryType = request.EntryType,
                Category = request.Category,
                RecurrenceUnit = request.RecurrenceUnit,
                RecurrenceInterval =
                    request.RecurrenceInterval,
                StartDate = request.StartDate.Date,
                UserId = user.Id,
                BankAccountId = bankAccount?.Id
            };

        _dbContext.RecurringFinanceItems.Add(
            recurringFinanceItem
        );

        await _dbContext.SaveChangesAsync();

        var firstFinanceEntry =
            new FinanceEntry
            {
                Name = recurringFinanceItem.Name,
                Amount = recurringFinanceItem.Amount,
                EntryType = recurringFinanceItem.EntryType,
                Category = recurringFinanceItem.Category,
                EntryDate = recurringFinanceItem.StartDate,
                UserId = user.Id,
                BankAccountId =
                    recurringFinanceItem.BankAccountId,
                RecurringFinanceItemId =
                    recurringFinanceItem.Id
            };

        _dbContext.FinanceEntries.Add(
            firstFinanceEntry
        );

        await _dbContext.SaveChangesAsync();

        var response =
            new RecurringFinanceItemResponse
            {
                Id = recurringFinanceItem.Id,
                Name = recurringFinanceItem.Name,
                Amount = recurringFinanceItem.Amount,
                EntryType = recurringFinanceItem.EntryType,
                Category = recurringFinanceItem.Category,
                RecurrenceUnit =
                    recurringFinanceItem.RecurrenceUnit,
                RecurrenceInterval =
                    recurringFinanceItem.RecurrenceInterval,
                StartDate =
                    recurringFinanceItem.StartDate,
                IsActive =
                    recurringFinanceItem.IsActive,
                CreatedAt =
                    recurringFinanceItem.CreatedAt,
                BankAccountId =
                    recurringFinanceItem.BankAccountId,
                BankAccountName =
                    bankAccount?.Name,
                BankName =
                    bankAccount?.BankName
            };

        return Created(
            $"/api/recurring-finance-items/{recurringFinanceItem.Id}",
            response
        );
    }
}
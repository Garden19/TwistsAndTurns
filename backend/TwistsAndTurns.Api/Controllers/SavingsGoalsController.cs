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
public class SavingsGoalsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SavingsGoalsController(
        ApplicationDbContext context
    )
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<SavingsGoal>>
        CreateSavingsGoal(
            CreateSavingsGoalRequest request
        )
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId == null)
        {
            return Unauthorized();
        }

        if (
            string.IsNullOrWhiteSpace(request.Name) ||
            request.TargetAmount <= 0
        )
        {
            return BadRequest(
                "Please provide a name and a target amount greater than zero."
            );
        }

        if (
            request.CurrentAmount < 0 ||
            request.CurrentAmount >
                request.TargetAmount
        )
        {
            return BadRequest(
                "The current amount must be between zero and the target amount."
            );
        }

        var savingsGoal = new SavingsGoal
        {
            Name = request.Name.Trim(),
            TargetAmount =
                request.TargetAmount,
            CurrentAmount =
                request.CurrentAmount,
            TargetDate =
                request.TargetDate,
            UserId = userId,
            IsActive = true
        };

        _context.SavingsGoals.Add(
            savingsGoal
        );

        await _context.SaveChangesAsync();

        return Ok(
            savingsGoal
        );
    }

    [HttpGet]
    public async Task<
        ActionResult<IEnumerable<SavingsGoal>>
    > GetSavingsGoals()
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId == null)
        {
            return Unauthorized();
        }

        var savingsGoals =
            await _context.SavingsGoals
                .Where(
                    goal =>
                        goal.UserId == userId &&
                        goal.IsActive
                )
                .OrderBy(
                    goal =>
                        goal.CreatedAt
                )
                .ToListAsync();

        return Ok(
            savingsGoals
        );
    }

    [HttpPost("{id:int}/contributions")]
    public async Task<ActionResult<SavingsGoal>>
        AddContribution(
            int id,
            AddSavingsContributionRequest request
        )
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId == null)
        {
            return Unauthorized();
        }

        if (request.Amount <= 0)
        {
            return BadRequest(
                "Contribution amount must be greater than zero."
            );
        }

        var savingsGoal =
            await _context.SavingsGoals
                .FirstOrDefaultAsync(
                    goal =>
                        goal.Id == id &&
                        goal.UserId == userId &&
                        goal.IsActive
                );

        if (savingsGoal == null)
        {
            return NotFound();
        }

        savingsGoal.CurrentAmount +=
            request.Amount;

        await _context.SaveChangesAsync();

        return Ok(
            savingsGoal
        );
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<SavingsGoal>>
        UpdateSavingsGoal(
            int id,
            UpdateSavingsGoalRequest request
        )
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId == null)
        {
            return Unauthorized();
        }

        if (
            string.IsNullOrWhiteSpace(request.Name) ||
            request.TargetAmount <= 0
        )
        {
            return BadRequest(
                "Please provide a name and a target amount greater than zero."
            );
        }

        var savingsGoal =
            await _context.SavingsGoals
                .FirstOrDefaultAsync(
                    goal =>
                        goal.Id == id &&
                        goal.UserId == userId &&
                        goal.IsActive
                );

        if (savingsGoal == null)
        {
            return NotFound();
        }

        if (
            request.TargetAmount <
                savingsGoal.CurrentAmount
        )
        {
            return BadRequest(
                "The target amount cannot be less than the amount already saved."
            );
        }

        savingsGoal.Name =
            request.Name.Trim();

        savingsGoal.TargetAmount =
            request.TargetAmount;

        savingsGoal.TargetDate =
            request.TargetDate;

        await _context.SaveChangesAsync();

        return Ok(
            savingsGoal
        );
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult>
        ArchiveSavingsGoal(
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

        var savingsGoal =
            await _context.SavingsGoals
                .FirstOrDefaultAsync(
                    goal =>
                        goal.Id == id &&
                        goal.UserId == userId &&
                        goal.IsActive
                );

        if (savingsGoal == null)
        {
            return NotFound();
        }

        savingsGoal.IsActive = false;

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
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
    public async Task<ActionResult> CreateSavingsGoal(
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

        var savingsGoal = new SavingsGoal
        {
            Name = request.Name,
            TargetAmount = request.TargetAmount,
            CurrentAmount = request.CurrentAmount,
            TargetDate = request.TargetDate,
            UserId = userId
        };

        _context.SavingsGoals.Add(
            savingsGoal
        );

        await _context.SaveChangesAsync();

        return Ok(
            savingsGoal
        );
    }
}
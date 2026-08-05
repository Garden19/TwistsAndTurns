using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TwistsAndTurns.Api.Models;

namespace TwistsAndTurns.Api.Controllers;

[ApiController]
[Route("api/authentication")]
public class AuthenticationController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public AuthenticationController(
        UserManager<ApplicationUser> userManager
    )
    {
        _userManager = userManager;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        RegisterRequest request
    )
    {
        var user = new ApplicationUser
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            UserName = request.Email
        };

        var result = await _userManager.CreateAsync(
            user,
            request.Password
        );

        if (!result.Succeeded)
        {
            return BadRequest(new
            {
                message = "Registration failed",
                errors = result.Errors.Select(error => error.Description)
            });
        }

        return Ok(new
        {
            message = $"Thank you for signing up {user.FirstName}!",
            user = new
            {
                user.FirstName,
                user.LastName,
                user.Email
            }
        });
    }

    [HttpPost("login")]
public async Task<IActionResult> Login(
    LoginRequest request
)
{
    var user = await _userManager.FindByEmailAsync(
        request.Email
    );

    if (user is null)
    {
        return Unauthorized(new
        {
            message = "Incorrect email or password"
        });
    }

    var passwordIsCorrect =
        await _userManager.CheckPasswordAsync(
            user,
            request.Password
        );

    if (!passwordIsCorrect)
    {
        return Unauthorized(new
        {
            message = "Incorrect email or password"
        });
    }

    return Ok(new
    {
        message = "Login successful",
        user = new
        {
            user.Id,
            user.FirstName,
            user.LastName,
            user.Email
        }
        });
    }
}
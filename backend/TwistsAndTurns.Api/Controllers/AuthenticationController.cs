using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TwistsAndTurns.Api.Models;
using Microsoft.AspNetCore.Authorization;

namespace TwistsAndTurns.Api.Controllers;

[ApiController]
[Route("api/authentication")]
public class AuthenticationController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    public AuthenticationController(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager
    )
    {
        _userManager = userManager;
        _signInManager = signInManager;
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

[Authorize]
[HttpGet("me")]
public async Task<IActionResult> Me()
{
    var user = await _userManager.GetUserAsync(User);

    if (user is null)
    {
        return Unauthorized();
    }

    return Ok(new
    {
        message = "User is authenticated",
        user = new
        {
            user.Id,
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

        var result = await _signInManager.PasswordSignInAsync(
            user,
            request.Password,
            isPersistent: true,
            lockoutOnFailure: true
        );

        if (result.IsLockedOut)
        {
            return StatusCode(StatusCodes.Status429TooManyRequests, new
            {
                message = "Too many unsuccessful attempts. Try again in 15 minutes."
            });
        }

        if (!result.Succeeded)
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
    
    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();

        return Ok(new
        {
            message = "Logout successful"
        });
    }
}
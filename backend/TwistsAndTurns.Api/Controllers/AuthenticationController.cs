using Microsoft.AspNetCore.Mvc;
using TwistsAndTurns.Api.Models;

namespace TwistsAndTurns.Api.Controllers;

[ApiController]
[Route("api/authentication")]
public class AuthenticationController : ControllerBase
{
    [HttpPost("register")]
    public IActionResult Register(RegisterRequest request)
    {
        return Ok(new
        {
            message = $"Thank you for signing up {request.FirstName}!",
            user = new
            {
                request.FirstName,
                request.LastName,
                request.Email
            }
        });
    }
}
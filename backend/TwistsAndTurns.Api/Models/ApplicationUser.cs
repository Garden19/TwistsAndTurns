using Microsoft.AspNetCore.Identity;

namespace TwistsAndTurns.Api.Models;

public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;
}
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class RegisterDto
    {
    [Required]
    public required string DisplayName {get; set;} = "";

    [Required]
    [EmailAddress]
    public required string Email {get; set;} = "" ;

    [Required]
    [MinLength(4)]
    public required string Password {get; set;} = "";

    }
}
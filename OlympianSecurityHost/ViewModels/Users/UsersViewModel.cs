using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OlympianSecurityHost.ViewModels.Users
{
    public class UsersViewModel
    {
        [Required]
        public string UserId { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public long RoleId { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OlympianSecurityHost.ViewModels.Users
{
    public class ProfileViewModel
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Role { get; set; }
        public DateTime Date { get; set; }
    }
}

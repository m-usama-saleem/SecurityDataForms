using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OlympianSecurityHost.Models.Users
{
    public class UsersRole
    {
        [Required]
        [Key]
        public long SysSerial { get; set; }
        [Required]
        public string Name { get; set; }
    }
}

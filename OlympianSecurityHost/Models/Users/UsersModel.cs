using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
namespace OlympianSecurityHost.Models.Users
{
    public class UsersModel
    {
        [Required]
        [Key]
        public long SysSerial { get; set; }
        [Required]
        [StringLength(50)]
        public string UserId { get; set; }
        [Required]
        public byte[] Password { get; set; }
        [Required]
        public bool IsDeleted { get; set; }
        [ForeignKey("UserRole")]
        public long RoleId { get; set; }

        public UsersRole UserRole { get; set; }
    }
}

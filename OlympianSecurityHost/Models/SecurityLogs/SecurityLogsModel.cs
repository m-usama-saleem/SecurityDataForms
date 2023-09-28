using OlympianSecurityHost.Models.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OlympianSecurityHost.Models.SecurityLogs
{
    public class SecurityLogsModel
    {
        [Required]
        [Key]
        public long SysSerial { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public string StartTime { get; set; }

        [Required]
        public string EndTime { get; set; }

        [ForeignKey("User")]
        public long ClientId { get; set; }

        [Required]
        public string SiteAddress { get; set; }

        [Required]
        public string TimeDetails { get; set; }
        public string IsApproved { get; set; }
        public bool IsDeleted { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
        public UsersModel User { get; set; }


    }
}

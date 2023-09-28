using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OlympianSecurityHost.ViewModels.LossPreventionForms
{
    public class YouthRightToCounselViewModel
    {
        public long SysSerial { get; set; }
        [Required]
        public DateTime Date { get; set; }

        [Required]
        public string StartTime { get; set; }

        [Required]
        public string EndTime { get; set; }

        [Required]
        public long ClientId { get; set; }
        public string ClientName { get; set; }

        [Required]
        public string SiteAddress { get; set; }
        public string IsApproved { get; set; }
        public string IsDeleted { get; set; }
        [Required]
        public string TimeDetails { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}

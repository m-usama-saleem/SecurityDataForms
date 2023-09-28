using OlympianSecurityHost.Models.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OlympianSecurityHost.Models.ParkingEnforcements
{
    public class ParkingEnforcementsModel
    {
        [Required]
        [Key]
        public long SysSerial { get; set; }
        [Required]
        public DateTime DateReceived { get; set; }
        [Required]
        public string Arrival { get; set; }
        [Required]
        public string Departure { get; set; }
        [ForeignKey("User")]
        public long ClientId { get; set; }
        [Required]
        public string SiteAddress { get; set; }

        [Required]
        public string PoliceDivision { get; set; }
        [Required]
        public string TowTrucksCalled { get; set; }
        public string TowCompany { get; set; }
        public string TruckLicense { get; set; }
        public string TowedTo { get; set; }
        [Required]
        public string OccurencePlace { get; set; }
        [Required]
        public string Details { get; set; }
        [Required]
        public string NoOfTags { get; set; }
        [Required]
        public string NoOfTows { get; set; }
        public string AttachmentCheck { get; set; }
        public string Attachments { get; set; }
        public string IsApproved { get; set; }
        public bool IsDeleted { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }

        public UsersModel User { get; set; }

    }
}

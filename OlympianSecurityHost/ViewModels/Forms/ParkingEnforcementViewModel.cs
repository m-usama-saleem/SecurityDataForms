using System;
using System.ComponentModel.DataAnnotations;

namespace OlympianSecurityHost.ViewModels.Forms
{
    public class ParkingEnforcementViewModel
    {
        public long SysSerial { get; set; }
        [Required]
        public DateTime DateReceived { get; set; }
        [Required]
        public string Arrival { get; set; }
        [Required]
        public string Departure { get; set; }
        public long ClientId { get; set; }
        public string ClientName { get; set; }
        [Required]
        public string SiteAddress { get; set; }

        [Required]
        public string PoliceDivision { get; set; }
        [Required]
        public string TowTrucksCalled { get; set; }
        public string TowCompany { get; set; }
        public string TruckLic { get; set; }
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
        public string IsApproved { get; set; }
        public bool IsDeleted { get; set; }
        public string Attachments { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }

    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OlympianSecurityHost.ViewModels.Forms
{
    public class TressPassNoticeViewModel
    {
        public long SysSerial { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string Initial { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string DOB { get; set; }
        [Required]
        public string Gender { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string Province { get; set; }
        [Required]
        public string PostalCode { get; set; }
        [Required]
        public string Country { get; set; }
        [Required]
        public string Complexion { get; set; }
        [Required]
        public string HairColor { get; set; }
        [Required]
        public string HairLength { get; set; }
        [Required]
        public string Height { get; set; }
        [Required]
        public string Weight { get; set; }
        [Required]
        public string Glasses { get; set; }
        [Required]
        public string Clothing { get; set; }
        [Required]
        public string Marks { get; set; }
        [Required]
        public string Tattoos { get; set; }
        [Required]
        public string IssuedAt { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public string PeriodOfTime { get; set; }
        [Required]
        public List<string> TresspassOffence { get; set; }
        [Required]
        public string ReasonForNotice { get; set; }
        [Required]
        public long ClientId { get; set; }
        public string ClientName { get; set; }
        [Required]
        public string IsApproved { get; set; }
        public bool IsDeleted { get; set; }
        public string Photos { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}

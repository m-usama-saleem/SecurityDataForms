using OlympianSecurityHost.Models.AlarmResponses;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OlympianSecurityHost.ViewModels.Forms
{
    public class AlarmResponseViewModel
    {
        public long SysSerial { get; set; }
        public long ClientId { get; set; }
        public string ClientName { get; set; }
        [Required]
        public string SiteAddress { get; set; }
        [Required]
        public DateTime DateReceived { get; set; }
        [Required]
        public string Arrival { get; set; }
        [Required]
        public string Departure { get; set; }
        public string KeyBox { get; set; }
        [Required]
        public string Keys { get; set; }
        public List<string> AlarmType { get; set; }
        public string OtherAlarmType { get; set; }
        public List<string> DispatchRequestType { get; set; }
        [Required]
        public string RequestedBy { get; set; }
        public string AlarmZone { get; set; }
        [Required]
        public string ServiceDispatched { get; set; }
        public string ServiceCallNo { get; set; }
        [Required]
        public string ActionTaken { get; set; }
        [Required]
        public string Comments { get; set; }
        [Required]
        public string Subscriber { get; set; }
        public string Name { get; set; }
        public string FireDept { get; set; }
        public string PoliceServiceBadge { get; set; }
        public string Other { get; set; }
        [Required]
        public string IsApproved { get; set; }
        public bool IsDeleted { get; set; }
        public List<string> ReportToClient { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }

    }
}

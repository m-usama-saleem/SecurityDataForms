using OlympianSecurityHost.Models.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OlympianSecurityHost.Models.AlarmResponses
{
    public class AlarmResponsesModel
    {
        [Key]
        [Required]
        public long SysSerial { get; set; }
        [Required]
        [ForeignKey("User")]
        public long ClientId { get; set; }
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
        public string AlarmType { get; set; }
        public string OtherAlarmType { get; set; }
        public string DispatchRequestType { get; set; }
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
        public string ReportToClient { get; set; }
        public string IsApproved { get; set; }
        public bool IsDeleted { get; set; }


        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }

        public UsersModel User { get; set; }

    }
}

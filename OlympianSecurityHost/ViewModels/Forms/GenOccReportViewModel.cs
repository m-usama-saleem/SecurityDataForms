using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace OlympianSecurityHost.ViewModels.Forms
{
    public class GenOccReportViewModel
    {
        public long SysSerial { get; set; }
        [Required]
        public int OccurenceType { get; set; }
        [Required]
        public string ClientId { get; set; }
        public string ClientName { get; set; }
        [Required]
        public string SiteAddress { get; set; }
        [Required]
        public string PoliceDivision { get; set; }
        [Required]
        public string OccurencePlace { get; set; }
        [Required]
        public DateTime OccurenceDate { get; set; }
        [Required]
        public string ComplaintBy { get; set; }
        [Required]
        public DateTime DateReceived { get; set; }
        [Required]
        public string InitialInvestigationBy { get; set; }
        [Required]
        public DateTime DateInvestigated { get; set; }
        [Required]
        public DateTime DateMadeOut { get; set; }
        [Required]
        public string Synopsis { get; set; }
        [Required]
        public string OpenClosed { get; set; }
        public string AttachmentCheck { get; set; }
        public DateTime DiaryDate { get; set; }
        public string IsApproved { get; set; }
        public bool IsDeleted { get; set; }
        public string Attachments { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
    }

    public class FileUploadViewModel
    {
        public IFormFile File { get; set; }
        public string source { get; set; }
        public long Size { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public string Extension { get; set; }
    }
}

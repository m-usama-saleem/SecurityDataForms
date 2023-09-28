using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OlympianSecurityHost.Models.Common
{
    public class OccurencesModel
    {
        [Key]
        [Required]
        public long SysSerial { get; set; }
        [Required]
        public string Name { get; set; }
    }
}

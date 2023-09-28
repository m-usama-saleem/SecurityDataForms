using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using OlympianSecurityHost.Contracts.GeneralOccurences;
using OlympianSecurityHost.Data;
using OlympianSecurityHost.Models.Common;
using OlympianSecurityHost.Models.GeneralOccurences;
using OlympianSecurityHost.ViewModels.Forms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OlympianSecurityHost.Services.GeneralOccurences
{
    public class GeneralOccurencesService : IGeneralOccurencesService
    {
        private readonly HostDbContext db;
        private readonly IConfiguration Configuration;
        public GeneralOccurencesService(HostDbContext context, IConfiguration configuration)
        {
            db = context;
            Configuration = configuration;
        }
        public async Task<bool> Delete(GenOccReportViewModel model)
        {
            try
            {
                var obj = db.GeneralOccurences.FirstOrDefault(x => x.SysSerial == model.SysSerial);
                if (obj != null)
                {
                    obj.IsDeleted = true;
                    obj.UpdatedBy = model.UpdatedBy;
                    obj.UpdatedDate = model.UpdatedDate;

                    db.Entry(obj).State = EntityState.Modified;
                    await db.SaveChangesAsync();
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> Edit(GenOccReportViewModel model)
        {
            try
            {
                var obj = db.GeneralOccurences.FirstOrDefault(x => x.SysSerial == model.SysSerial);
                if (obj != null)
                {

                    obj.SysSerial = model.SysSerial;
                    obj.AttachmentCheck = model.AttachmentCheck;
                    obj.Attachments = obj.Attachments + model.Attachments;
                    obj.ClientId = Convert.ToInt64(model.ClientId);
                    obj.ComplaintBy = model.ComplaintBy;
                    obj.DateInvestigated = model.DateInvestigated;
                    obj.DateMadeOut = model.DateMadeOut;
                    obj.DateReceived = model.DateReceived;
                    obj.DiaryDate = model.DiaryDate;
                    obj.InitialInvestigationBy = model.InitialInvestigationBy;
                    obj.OccurenceDate = model.OccurenceDate;
                    obj.OccurencePlace = model.OccurencePlace;
                    obj.OccurenceType = model.OccurenceType.ToString();
                    obj.OpenClosed = model.OpenClosed;
                    obj.PoliceDivision = model.PoliceDivision;
                    obj.SiteAddress = model.SiteAddress;
                    obj.Synopsis = model.Synopsis;
                    obj.IsApproved = model.IsApproved;
                    obj.UpdatedBy = model.UpdatedBy;
                    obj.UpdatedDate = model.UpdatedDate;
                    db.Entry(obj).State = EntityState.Modified;

                    await db.SaveChangesAsync();
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<GenOccReportViewModel> Get(int id)
        {
            try
            {
                var model = await db.GeneralOccurences.FirstOrDefaultAsync(x => x.SysSerial == id);

                if (model != null)
                {
                    var clientName = db.Users.FirstOrDefault(x => x.SysSerial == model.ClientId).UserId;

                    var obj = new GenOccReportViewModel();
                    obj.SysSerial = model.SysSerial;
                    obj.AttachmentCheck = model.AttachmentCheck;
                    obj.Attachments = model.Attachments;
                    obj.ClientId = model.ClientId.ToString();
                    obj.ComplaintBy = model.ComplaintBy;
                    obj.DateInvestigated = model.DateInvestigated;
                    obj.DateMadeOut = model.DateMadeOut;
                    obj.DateReceived = model.DateReceived;
                    obj.DiaryDate = model.DiaryDate;
                    obj.InitialInvestigationBy = model.InitialInvestigationBy;
                    obj.OccurenceDate = model.OccurenceDate;
                    obj.OccurencePlace = model.OccurencePlace;
                    obj.OccurenceType = Convert.ToInt32(model.OccurenceType);
                    obj.OpenClosed = model.OpenClosed;
                    obj.PoliceDivision = model.PoliceDivision;
                    obj.SiteAddress = model.SiteAddress;
                    obj.Synopsis = model.Synopsis;
                    obj.IsApproved = model.IsApproved;
                    obj.IsDeleted = model.IsDeleted;

                    obj.CreatedBy = model.CreatedBy;
                    obj.CreatedDate = model.CreatedDate;
                    obj.UpdatedBy = model.UpdatedBy;
                    obj.UpdatedDate = model.UpdatedDate;
                    return obj;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<List<GenOccReportViewModel>> GetAll(string id = null)
        {
            try
            {
                var list = new List<GenOccReportViewModel>();
                List<GeneralOccurencesModel> obj;
                if (id != null)
                {
                    var cid = db.Users.FirstOrDefault(x => x.UserId == id);
                    obj = await db.GeneralOccurences.Where(x => x.ClientId == cid.SysSerial && x.IsDeleted == false
                    && x.IsApproved == "Yes").ToListAsync();
                }
                else
                {
                    obj = await db.GeneralOccurences.Where(x => x.IsDeleted == false).ToListAsync();
                }
                obj.ForEach(model =>
                {
                    var client = db.Users.FirstOrDefault(x => x.SysSerial == model.ClientId);

                    list.Add(new GenOccReportViewModel
                    {
                        SysSerial = model.SysSerial,
                        AttachmentCheck = model.AttachmentCheck,
                        Attachments = model.Attachments,
                        ClientId = model.ClientId.ToString(),
                        ClientName = client.UserId,
                        ComplaintBy = model.ComplaintBy,
                        DateInvestigated = model.DateInvestigated,
                        DateMadeOut = model.DateMadeOut,
                        DateReceived = model.DateReceived,
                        DiaryDate = model.DiaryDate,
                        InitialInvestigationBy = model.InitialInvestigationBy,
                        OccurenceDate = model.OccurenceDate,
                        OccurencePlace = model.OccurencePlace,
                        OccurenceType = Convert.ToInt32(model.OccurenceType),
                        OpenClosed = model.OpenClosed,
                        PoliceDivision = model.PoliceDivision,
                        SiteAddress = model.SiteAddress,
                        Synopsis = model.Synopsis,
                        IsApproved = model.IsApproved,
                        IsDeleted = model.IsDeleted,
                        CreatedBy = model.CreatedBy,
                        CreatedDate = model.CreatedDate,
                        UpdatedBy = model.UpdatedBy,
                        UpdatedDate = model.UpdatedDate
                    });
                });

                return list;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<List<OccurencesModel>> GetAllOccurences()
        {
            try
            {
                var list = new List<OccurencesModel>();
                list = await db.Occurences.ToListAsync();
                return list;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> Save(GenOccReportViewModel model)
        {
            try
            {
                var obj = new GeneralOccurencesModel();
                obj.AttachmentCheck = model.AttachmentCheck;
                obj.Attachments = model.Attachments;
                obj.ClientId = Convert.ToInt64(model.ClientId);
                obj.ComplaintBy = model.ComplaintBy;
                obj.DateInvestigated = model.DateInvestigated;
                obj.DateMadeOut = model.DateMadeOut;
                obj.DateReceived = model.DateReceived;
                obj.DiaryDate = model.DiaryDate;
                obj.InitialInvestigationBy = model.InitialInvestigationBy;
                obj.OccurenceDate = model.OccurenceDate;
                obj.OccurencePlace = model.OccurencePlace;
                obj.OccurenceType = model.OccurenceType.ToString();
                obj.OpenClosed = model.OpenClosed;
                obj.PoliceDivision = model.PoliceDivision;
                obj.SiteAddress = model.SiteAddress;
                obj.Synopsis = model.Synopsis;
                obj.IsApproved = "No";
                obj.CreatedDate = model.CreatedDate;
                obj.CreatedBy = model.CreatedBy;

                db.GeneralOccurences.Add(obj);

                await db.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}

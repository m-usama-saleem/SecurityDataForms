using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using OlympianSecurityHost.Contracts.LossPreventions;
using OlympianSecurityHost.Data;
using OlympianSecurityHost.Models.LossPreventionModels;
using OlympianSecurityHost.ViewModels.LossPreventionForms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OlympianSecurityHost.Services.LossPreventionsReports
{
    public class AdultRightToCounselsService : IAdultRightToCounselsService
    {

        private readonly HostDbContext db;
        private readonly IConfiguration Configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public AdultRightToCounselsService(HostDbContext context, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            db = context;
            Configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<bool> Save(LossPreventionsViewModel model)
        {
            try
            {
                var obj = db.AdultRightToCounsels.Add(new AdultRightToCounselsModel
                {
                    StartTime = model.StartTime,
                    EndTime = model.EndTime,
                    Date = model.Date,
                    SiteAddress = model.SiteAddress,
                    ClientId = model.ClientId,
                    TimeDetails = model.TimeDetails,
                    IsApproved = "No",
                    CreatedDate = model.CreatedDate,
                    CreatedBy = model.CreatedBy
                });

                await db.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<bool> Delete(LossPreventionsViewModel model)
        {
            try
            {
                var obj = db.AdultRightToCounsels.FirstOrDefault(x => x.SysSerial == model.SysSerial);
                if (obj != null)
                {
                    obj.IsDeleted = true;
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

        public async Task<bool> Edit(LossPreventionsViewModel model)
        {
            try
            {
                var obj = db.AdultRightToCounsels.FirstOrDefault(x => x.SysSerial == model.SysSerial);
                if (obj != null)
                {
                    obj.StartTime = model.StartTime;
                    obj.EndTime = model.EndTime;
                    obj.Date = model.Date;
                    obj.SiteAddress = model.SiteAddress;
                    obj.ClientId = model.ClientId;
                    obj.TimeDetails = model.TimeDetails;
                    obj.StartTime = model.StartTime;
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

        public async Task<LossPreventionsViewModel> Get(int id)
        {
            try
            {
                var obj = await db.AdultRightToCounsels.FirstOrDefaultAsync(x => x.SysSerial == id);
                if (obj != null)
                {
                    var clientName = db.Users.FirstOrDefault(x => x.SysSerial == obj.ClientId).UserId;

                    var model = new LossPreventionsViewModel();
                    model.SysSerial = obj.SysSerial;
                    model.StartTime = obj.StartTime;
                    model.EndTime = obj.EndTime;
                    model.Date = obj.Date;
                    model.SiteAddress = obj.SiteAddress;
                    model.ClientId = obj.ClientId;
                    model.TimeDetails = obj.TimeDetails;
                    model.IsApproved = obj.IsApproved;
                    model.CreatedBy = obj.CreatedBy;
                    model.CreatedDate = obj.CreatedDate;
                    model.UpdatedBy = obj.UpdatedBy;
                    model.UpdatedDate = obj.UpdatedDate;
                    return model;
                }

                return null;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<List<LossPreventionsViewModel>> GetAll()
        {
            try
            {
                var list = new List<LossPreventionsViewModel>();
                List<AdultRightToCounselsModel> obj;

                obj = await db.AdultRightToCounsels.Where(x => x.IsDeleted == false).ToListAsync();
                obj.ForEach(model =>
                {
                    var client = db.Users.FirstOrDefault(x => x.SysSerial == model.ClientId);

                    list.Add(new LossPreventionsViewModel
                    {
                        SysSerial = model.SysSerial,
                        StartTime = model.StartTime,
                        EndTime = model.EndTime,
                        Date = model.Date,
                        SiteAddress = model.SiteAddress,
                        ClientId = model.ClientId,
                        ClientName = client.UserId,
                        TimeDetails = model.TimeDetails,
                        IsApproved = model.IsApproved,
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
    }
}

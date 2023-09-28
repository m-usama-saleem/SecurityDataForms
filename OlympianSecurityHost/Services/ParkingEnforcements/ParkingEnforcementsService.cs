using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using OlympianSecurityHost.Contracts.ParkingEnforcements;
using OlympianSecurityHost.Data;
using OlympianSecurityHost.Models.ParkingEnforcements;
using OlympianSecurityHost.ViewModels.Forms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OlympianSecurityHost.Services.ParkingEnforcements
{
    public class ParkingEnforcementsService : IParkingEnforcementsService
    {
        private readonly HostDbContext db;
        private readonly IConfiguration Configuration;
        public ParkingEnforcementsService(HostDbContext context, IConfiguration configuration)
        {
            db = context;
            Configuration = configuration;
        }
        public async Task<bool> Delete(ParkingEnforcementViewModel model)
        {
            try
            {
                var obj = db.ParkingEnforcements.FirstOrDefault(x => x.SysSerial == model.SysSerial);
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

        public async Task<bool> Edit(ParkingEnforcementViewModel model)
        {
            try
            {
                var obj = db.ParkingEnforcements.FirstOrDefault(x => x.SysSerial == model.SysSerial);
                if (obj != null)
                {

                    obj.SysSerial = model.SysSerial;
                    obj.Arrival = model.Arrival;
                    obj.AttachmentCheck = model.AttachmentCheck;
                    obj.Attachments = obj.Attachments + model.Attachments;
                    obj.ClientId = model.ClientId;
                    obj.DateReceived = model.DateReceived;
                    obj.Departure = model.Departure;
                    obj.Details = model.Details;
                    obj.NoOfTags = model.NoOfTags;
                    obj.NoOfTows = model.NoOfTows;
                    obj.OccurencePlace = model.OccurencePlace;
                    obj.PoliceDivision = model.PoliceDivision;
                    obj.SiteAddress = model.SiteAddress;
                    obj.TowCompany = model.TowCompany;
                    obj.TowedTo = model.TowedTo;
                    obj.TowTrucksCalled = model.TowTrucksCalled;
                    obj.TruckLicense = model.TruckLic;
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

        public async Task<ParkingEnforcementViewModel> Get(int id)
        {
            try
            {
                var model = await db.ParkingEnforcements.FirstOrDefaultAsync(x => x.SysSerial == id);

                if (model != null)
                {
                    var clientName = db.Users.FirstOrDefault(x => x.SysSerial == model.ClientId).UserId;

                    var obj = new ParkingEnforcementViewModel();
                    obj.SysSerial = model.SysSerial;
                    obj.Arrival = model.Arrival;
                    obj.AttachmentCheck = model.AttachmentCheck;
                    obj.Attachments = model.Attachments;
                    obj.ClientId = model.ClientId;
                    obj.ClientName = clientName;
                    obj.DateReceived = model.DateReceived;
                    obj.Departure = model.Departure;
                    obj.Details = model.Details;
                    obj.NoOfTags = model.NoOfTags;
                    obj.NoOfTows = model.NoOfTows;
                    obj.OccurencePlace = model.OccurencePlace;
                    obj.PoliceDivision = model.PoliceDivision;
                    obj.SiteAddress = model.SiteAddress;
                    obj.TowCompany = model.TowCompany;
                    obj.TowedTo = model.TowedTo;
                    obj.TowTrucksCalled = model.TowTrucksCalled;
                    obj.TruckLic = model.TruckLicense;
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

        public async Task<List<ParkingEnforcementViewModel>> GetAll()
        {
            try
            {
                var list = new List<ParkingEnforcementViewModel>();
                var obj = await db.ParkingEnforcements.Where(x => x.IsDeleted == false).ToListAsync();

                obj.ForEach(model =>
                {
                    var clientName = db.Users.FirstOrDefault(x => x.SysSerial == model.ClientId).UserId;

                    list.Add(new ParkingEnforcementViewModel
                    {
                        SysSerial = model.SysSerial,
                        Arrival = model.Arrival,
                        AttachmentCheck = model.AttachmentCheck,
                        Attachments = model.Attachments,
                        ClientId = model.ClientId,
                        ClientName = clientName,
                        DateReceived = model.DateReceived,
                        Departure = model.Departure,
                        Details = model.Details,
                        NoOfTags = model.NoOfTags,
                        NoOfTows = model.NoOfTows,
                        OccurencePlace = model.OccurencePlace,
                        PoliceDivision = model.PoliceDivision,
                        SiteAddress = model.SiteAddress,
                        TowCompany = model.TowCompany,
                        TowedTo = model.TowedTo,
                        TowTrucksCalled = model.TowTrucksCalled,
                        TruckLic = model.TruckLicense,
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

        public async Task<bool> Save(ParkingEnforcementViewModel model)
        {
            try
            {
                var obj = new ParkingEnforcementsModel();
                obj.Arrival = model.Arrival;
                obj.AttachmentCheck = model.AttachmentCheck;
                obj.Attachments = model.Attachments;
                obj.ClientId = model.ClientId;
                obj.DateReceived = model.DateReceived;
                obj.Departure = model.Departure;
                obj.Details = model.Details;
                obj.NoOfTags = model.NoOfTags;
                obj.NoOfTows = model.NoOfTows;
                obj.OccurencePlace = model.OccurencePlace;
                obj.PoliceDivision = model.PoliceDivision;
                obj.SiteAddress = model.SiteAddress;
                obj.TowCompany = model.TowCompany;
                obj.TowedTo = model.TowedTo;
                obj.TowTrucksCalled = model.TowTrucksCalled;
                obj.TruckLicense = model.TruckLic;
                obj.IsApproved = "No";
                obj.CreatedDate = model.CreatedDate;
                obj.CreatedBy = model.CreatedBy;
                db.ParkingEnforcements.Add(obj);

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

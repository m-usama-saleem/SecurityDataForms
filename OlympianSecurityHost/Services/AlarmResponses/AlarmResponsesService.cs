using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using OlympianSecurityHost.Contracts.AlarmResponses;
using OlympianSecurityHost.Data;
using OlympianSecurityHost.Models.AlarmResponses;
using OlympianSecurityHost.ViewModels.Forms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OlympianSecurityHost.Services.AlarmResponses
{
    public class AlarmResponsesService : IAlarmResponsesService
    {
        private readonly HostDbContext db;
        private readonly IConfiguration Configuration;
        public AlarmResponsesService(HostDbContext context, IConfiguration configuration)
        {
            db = context;
            Configuration = configuration;
        }
        public async Task<bool> Delete(AlarmResponseViewModel model)
        {
            try
            {
                var obj = db.AlarmResponses.FirstOrDefault(x => x.SysSerial == model.SysSerial);
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

        public async Task<bool> Edit(AlarmResponseViewModel model)
        {
            try
            {
                var alarmType = "";
                var dispatchRequestType = "";
                var reportToClient = "";

                model.AlarmType.ForEach(x => alarmType += x + ",");
                model.DispatchRequestType.ForEach(x => dispatchRequestType += x + ",");
                model.ReportToClient.ForEach(x => reportToClient += x + ",");

                var obj = db.AlarmResponses.FirstOrDefault(x => x.SysSerial == model.SysSerial);
                if (obj != null)
                {

                    obj.ActionTaken = model.ActionTaken;
                    obj.AlarmType = alarmType;
                    obj.AlarmZone = model.AlarmZone;
                    obj.Arrival = model.Arrival;
                    obj.ClientId = model.ClientId;
                    obj.Comments = model.Comments;
                    obj.DateReceived = model.DateReceived;
                    obj.Departure = model.Departure;
                    obj.DispatchRequestType = dispatchRequestType;
                    obj.FireDept = model.FireDept;
                    obj.KeyBox = model.KeyBox;
                    obj.Keys = model.Keys;
                    obj.Name = model.Name;
                    obj.Other = model.Other;
                    obj.OtherAlarmType = model.OtherAlarmType;
                    obj.PoliceServiceBadge = model.PoliceServiceBadge;
                    obj.ReportToClient = reportToClient;
                    obj.RequestedBy = model.RequestedBy;
                    obj.ServiceCallNo = model.ServiceCallNo;
                    obj.ServiceDispatched = model.ServiceDispatched;
                    obj.SiteAddress = model.SiteAddress;
                    obj.Subscriber = model.Subscriber;
                    obj.SysSerial = model.SysSerial;
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

        public async Task<AlarmResponseViewModel> Get(int id)
        {
            try
            {
                var model = await db.AlarmResponses.FirstOrDefaultAsync(x => x.SysSerial == id);
                if (model != null)
                {
                    var clientName = db.Users.FirstOrDefault(x => x.SysSerial == model.ClientId).UserId;

                    var alarmType = model.AlarmType.Split(",").Where(x => !String.IsNullOrWhiteSpace(x)).ToList();
                    var dispatchRequestType = model.DispatchRequestType.Split(",").Where(x => !String.IsNullOrWhiteSpace(x)).ToList();
                    var reportToClient = model.ReportToClient.Split(",").Where(x => !String.IsNullOrWhiteSpace(x)).ToList();


                    var obj = new AlarmResponseViewModel();
                    obj.SysSerial = model.SysSerial;
                    obj.ActionTaken = model.ActionTaken;
                    obj.AlarmType = alarmType;
                    obj.AlarmZone = model.AlarmZone;
                    obj.Arrival = model.Arrival;
                    obj.ClientId = model.ClientId;
                    obj.ClientName = clientName;
                    obj.Comments = model.Comments;
                    obj.DateReceived = model.DateReceived;
                    obj.Departure = model.Departure;
                    obj.DispatchRequestType = dispatchRequestType;
                    obj.FireDept = model.FireDept;
                    obj.KeyBox = model.KeyBox;
                    obj.Keys = model.Keys;
                    obj.Name = model.Name;
                    obj.Other = model.Other;
                    obj.OtherAlarmType = model.OtherAlarmType;
                    obj.PoliceServiceBadge = model.PoliceServiceBadge;
                    obj.ReportToClient = reportToClient;
                    obj.RequestedBy = model.RequestedBy;
                    obj.ServiceCallNo = model.ServiceCallNo;
                    obj.ServiceDispatched = model.ServiceDispatched;
                    obj.SiteAddress = model.SiteAddress;
                    obj.Subscriber = model.Subscriber;
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

        public async Task<List<AlarmResponseViewModel>> GetAll()
        {
            try
            {
                var list = new List<AlarmResponseViewModel>();
                var obj = await db.AlarmResponses.Where(x => x.IsDeleted == false).ToListAsync();
                obj.ForEach(model =>
                {
                    var clientName = db.Users.FirstOrDefault(x => x.SysSerial == model.ClientId).UserId;

                    var alarmType = model.AlarmType.Split(",").Where(x => !String.IsNullOrWhiteSpace(x)).ToList();
                    var dispatchRequestType = model.DispatchRequestType.Split(",").Where(x => !String.IsNullOrWhiteSpace(x)).ToList();
                    var reportToClient = model.ReportToClient.Split(",").Where(x => !String.IsNullOrWhiteSpace(x)).ToList();

                    list.Add(new AlarmResponseViewModel
                    {
                        SysSerial = model.SysSerial,
                        ActionTaken = model.ActionTaken,
                        AlarmType = alarmType,
                        AlarmZone = model.AlarmZone,
                        Arrival = model.Arrival,
                        ClientId = model.ClientId,
                        ClientName = clientName,
                        Comments = model.Comments,
                        DateReceived = model.DateReceived,
                        Departure = model.Departure,
                        DispatchRequestType = dispatchRequestType,
                        FireDept = model.FireDept,
                        KeyBox = model.KeyBox,
                        Keys = model.Keys,
                        Name = model.Name,
                        Other = model.Other,
                        OtherAlarmType = model.OtherAlarmType,
                        PoliceServiceBadge = model.PoliceServiceBadge,
                        ReportToClient = reportToClient,
                        RequestedBy = model.RequestedBy,
                        ServiceCallNo = model.ServiceCallNo,
                        ServiceDispatched = model.ServiceDispatched,
                        SiteAddress = model.SiteAddress,
                        Subscriber = model.Subscriber,
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

        public async Task<bool> Save(AlarmResponseViewModel model)
        {
            try
            {
                var alarmType = "";
                var dispatchRequestType = "";
                var reportToClient = "";

                model.AlarmType.ForEach(x => alarmType += x + ",");
                model.DispatchRequestType.ForEach(x => dispatchRequestType += x + ",");
                model.ReportToClient.ForEach(x => reportToClient += x + ",");

                var obj = new AlarmResponsesModel();
                obj.ActionTaken = model.ActionTaken;
                obj.AlarmType = alarmType;
                obj.AlarmZone = model.AlarmZone;
                obj.Arrival = model.Arrival;
                obj.ClientId = model.ClientId;
                obj.Comments = model.Comments;
                obj.DateReceived = model.DateReceived;
                obj.Departure = model.Departure;
                obj.DispatchRequestType = dispatchRequestType;
                obj.FireDept = model.FireDept;
                obj.KeyBox = model.KeyBox;
                obj.Keys = model.Keys;
                obj.Name = model.Name;
                obj.Other = model.Other;
                obj.OtherAlarmType = model.OtherAlarmType;
                obj.PoliceServiceBadge = model.PoliceServiceBadge;
                obj.ReportToClient = reportToClient;
                obj.RequestedBy = model.RequestedBy;
                obj.ServiceCallNo = model.ServiceCallNo;
                obj.ServiceDispatched = model.ServiceDispatched;
                obj.SiteAddress = model.SiteAddress;
                obj.Subscriber = model.Subscriber;
                obj.IsApproved = "No";
                obj.CreatedDate = model.CreatedDate;
                obj.CreatedBy = model.CreatedBy;
                db.AlarmResponses.Add(obj);

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

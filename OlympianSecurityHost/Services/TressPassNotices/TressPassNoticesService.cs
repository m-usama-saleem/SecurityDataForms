using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using OlympianSecurityHost.Contracts.TressPassNotices;
using OlympianSecurityHost.Data;
using OlympianSecurityHost.Models.TressPassNotices;
using OlympianSecurityHost.ViewModels.Forms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OlympianSecurityHost.Services.TressPassNotices
{
    public class TressPassNoticesService : ITressPassNoticesService
    {
        private readonly HostDbContext db;
        private readonly IConfiguration Configuration;
        public TressPassNoticesService(HostDbContext context, IConfiguration configuration)
        {
            db = context;
            Configuration = configuration;
        }
        public async Task<bool> Delete(TressPassNoticeViewModel model)
        {
            try
            {
                var obj = db.TressPassNotices.FirstOrDefault(x => x.SysSerial == model.SysSerial);
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

        public async Task<bool> Edit(TressPassNoticeViewModel model)
        {
            try
            {
                var tresspassOffence = "";
                model.TresspassOffence.ForEach(x => tresspassOffence += x + ",");

                var obj = db.TressPassNotices.FirstOrDefault(x => x.SysSerial == model.SysSerial);
                if (obj != null)
                {

                    obj.SysSerial = model.SysSerial;
                    obj.ClientId = model.ClientId;
                    obj.Address = model.Address;
                    obj.City = model.City;
                    obj.Clothing = model.Clothing;
                    obj.Complexion = model.Complexion;
                    obj.Country = model.Country;
                    obj.Date = model.Date;
                    obj.DOB = model.DOB;
                    obj.FirstName = model.FirstName;
                    obj.Gender = model.Gender;
                    obj.Glasses = model.Glasses;
                    obj.HairColor = model.HairColor;
                    obj.HairLength = model.HairLength;
                    obj.Height = model.Height;
                    obj.Initial = model.Initial;
                    obj.IssuedAt = model.IssuedAt;
                    obj.LastName = model.LastName;
                    obj.Marks = model.Marks;
                    obj.PeriodOfTime = model.PeriodOfTime;
                    obj.Photos = obj.Photos + model.Photos;
                    obj.PostalCode = model.PostalCode;
                    obj.Province = model.Province;
                    obj.ReasonForNotice = model.ReasonForNotice;
                    obj.Tattoos = model.Tattoos;
                    obj.TresspassOffence = tresspassOffence;
                    obj.Weight = model.Weight;
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

        public async Task<TressPassNoticeViewModel> Get(int id)
        {
            try
            {
                var model = await db.TressPassNotices.FirstOrDefaultAsync(x => x.SysSerial == id);
                if (model != null)
                {
                    var clientName = db.Users.FirstOrDefault(x => x.SysSerial == model.ClientId).UserId;

                    var tresspassOffence = model.TresspassOffence.Split(",").Where(x => !String.IsNullOrWhiteSpace(x)).ToList();

                    var obj = new TressPassNoticeViewModel();
                    obj.SysSerial = model.SysSerial;
                    obj.ClientId = model.ClientId;
                    obj.Address = model.Address;
                    obj.City = model.City;
                    obj.Clothing = model.Clothing;
                    obj.Complexion = model.Complexion;
                    obj.Country = model.Country;
                    obj.Date = model.Date;
                    obj.DOB = model.DOB;
                    obj.FirstName = model.FirstName;
                    obj.Gender = model.Gender;
                    obj.Glasses = model.Glasses;
                    obj.HairColor = model.HairColor;
                    obj.HairLength = model.HairLength;
                    obj.Height = model.Height;
                    obj.Initial = model.Initial;
                    obj.IssuedAt = model.IssuedAt;
                    obj.LastName = model.LastName;
                    obj.Marks = model.Marks;
                    obj.PeriodOfTime = model.PeriodOfTime;
                    obj.Photos = model.Photos;
                    obj.PostalCode = model.PostalCode;
                    obj.Province = model.Province;
                    obj.ReasonForNotice = model.ReasonForNotice;
                    obj.Tattoos = model.Tattoos;
                    obj.TresspassOffence = tresspassOffence;
                    obj.Weight = model.Weight;
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

        public async Task<List<TressPassNoticeViewModel>> GetAll()
        {
            try
            {
                var list = new List<TressPassNoticeViewModel>();
                var obj = await db.TressPassNotices.Where(x => x.IsDeleted == false).ToListAsync();
                obj.ForEach(model =>
                {
                    var tresspassOffence = model.TresspassOffence.Split(",").Where(x => !String.IsNullOrWhiteSpace(x)).ToList();

                    var clientName = db.Users.FirstOrDefault(x => x.SysSerial == model.ClientId).UserId;

                    list.Add(new TressPassNoticeViewModel
                    {
                        SysSerial = model.SysSerial,
                        ClientId = model.ClientId,
                        ClientName = clientName,
                        Address = model.Address,
                        City = model.City,
                        Clothing = model.Clothing,
                        Complexion = model.Complexion,
                        Country = model.Country,
                        Date = model.Date,
                        DOB = model.DOB,
                        FirstName = model.FirstName,
                        Gender = model.Gender,
                        Glasses = model.Glasses,
                        HairColor = model.HairColor,
                        HairLength = model.HairLength,
                        Height = model.Height,
                        Initial = model.Initial,
                        IssuedAt = model.IssuedAt,
                        LastName = model.LastName,
                        Marks = model.Marks,
                        PeriodOfTime = model.PeriodOfTime,
                        Photos = model.Photos,
                        PostalCode = model.PostalCode,
                        Province = model.Province,
                        ReasonForNotice = model.ReasonForNotice,
                        Tattoos = model.Tattoos,
                        TresspassOffence = tresspassOffence,
                        Weight = model.Weight,
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

        public async Task<bool> Save(TressPassNoticeViewModel model)
        {
            try
            {
                var tresspassOffence = "";
                model.TresspassOffence.ForEach(x => tresspassOffence += x + ",");

                var obj = new TressPassNoticesModel();
                obj.ClientId = model.ClientId;
                obj.Address = model.Address;
                obj.City = model.City;
                obj.Clothing = model.Clothing;
                obj.Complexion = model.Complexion;
                obj.Country = model.Country;
                obj.Date = model.Date;
                obj.DOB = model.DOB;
                obj.FirstName = model.FirstName;
                obj.Gender = model.Gender;
                obj.Glasses = model.Glasses;
                obj.HairColor = model.HairColor;
                obj.HairLength = model.HairLength;
                obj.Height = model.Height;
                obj.Initial = model.Initial;
                obj.IssuedAt = model.IssuedAt;
                obj.LastName = model.LastName;
                obj.Marks = model.Marks;
                obj.PeriodOfTime = model.PeriodOfTime;
                obj.Photos = model.Photos;
                obj.PostalCode = model.PostalCode;
                obj.Province = model.Province;
                obj.ReasonForNotice = model.ReasonForNotice;
                obj.Tattoos = model.Tattoos;
                obj.TresspassOffence = tresspassOffence;
                obj.Weight = model.Weight;
                obj.IsApproved = "No";
                obj.CreatedDate = model.CreatedDate;
                obj.CreatedBy = model.CreatedBy;

                db.TressPassNotices.Add(obj);

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

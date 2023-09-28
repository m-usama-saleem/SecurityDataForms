using OlympianSecurityHost.ViewModels.Forms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OlympianSecurityHost.Contracts.TressPassNotices
{
    public interface ITressPassNoticesService
    {
        Task<bool> Save(TressPassNoticeViewModel userID);
        Task<bool> Edit(TressPassNoticeViewModel usersModel);
        Task<bool> Delete(TressPassNoticeViewModel id);
        Task<TressPassNoticeViewModel> Get(int id);
        Task<List<TressPassNoticeViewModel>> GetAll();
    }
}

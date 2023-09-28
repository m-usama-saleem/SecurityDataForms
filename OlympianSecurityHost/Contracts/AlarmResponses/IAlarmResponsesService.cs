using OlympianSecurityHost.ViewModels.Forms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OlympianSecurityHost.Contracts.AlarmResponses
{
    public interface IAlarmResponsesService
    {
        Task<bool> Save(AlarmResponseViewModel userID);
        Task<bool> Edit(AlarmResponseViewModel usersModel);
        Task<bool> Delete(AlarmResponseViewModel id);
        Task<AlarmResponseViewModel> Get(int id);
        Task<List<AlarmResponseViewModel>> GetAll();
    }
}

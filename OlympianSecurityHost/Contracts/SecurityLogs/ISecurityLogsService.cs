using OlympianSecurityHost.ViewModels.SecurityLogs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OlympianSecurityHost.Contracts.SecurityLogs
{
    public interface ISecurityLogsService 
    {
        Task<bool> Save(SecurityLogsViewModel userID);
        Task<bool> Edit(SecurityLogsViewModel usersModel);
        Task<bool> Delete(SecurityLogsViewModel model);
        Task<SecurityLogsViewModel> Get(int id);
        Task<List<SecurityLogsViewModel>> GetAll(string id = null);
    }
}

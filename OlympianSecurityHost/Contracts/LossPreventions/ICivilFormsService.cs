using OlympianSecurityHost.ViewModels.LossPreventionForms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OlympianSecurityHost.Contracts.LossPreventions
{
    public interface ICivilFormsService
    {
        Task<bool> Save(LossPreventionsViewModel userID);
        Task<bool> Edit(LossPreventionsViewModel usersModel);
        Task<bool> Delete(LossPreventionsViewModel model);
        Task<LossPreventionsViewModel> Get(int id);
        Task<List<LossPreventionsViewModel>> GetAll();
    }
}

using OlympianSecurityHost.ViewModels.Forms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OlympianSecurityHost.Contracts.ParkingEnforcements
{
    public interface IParkingEnforcementsService
    {
        Task<bool> Save(ParkingEnforcementViewModel userID);
        Task<bool> Edit(ParkingEnforcementViewModel usersModel);
        Task<bool> Delete(ParkingEnforcementViewModel id);
        Task<ParkingEnforcementViewModel> Get(int id);
        Task<List<ParkingEnforcementViewModel>> GetAll();
    }
}

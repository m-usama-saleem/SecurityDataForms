using OlympianSecurityHost.Models.Common;
using OlympianSecurityHost.ViewModels.Forms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OlympianSecurityHost.Contracts.GeneralOccurences
{
    public interface IGeneralOccurencesService
    {
        Task<bool> Save(GenOccReportViewModel userID);
        Task<bool> Edit(GenOccReportViewModel usersModel);
        Task<bool> Delete(GenOccReportViewModel id);
        Task<GenOccReportViewModel> Get(int id);
        Task<List<GenOccReportViewModel>> GetAll(string id = null);
        Task<List<OccurencesModel>> GetAllOccurences();
    }
}

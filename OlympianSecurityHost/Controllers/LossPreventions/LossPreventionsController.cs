using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using OlympianSecurityHost.Contracts.LossPreventions;
using OlympianSecurityHost.Models;
using OlympianSecurityHost.ViewModels.LossPreventionForms;
using System;
using System.Net;
using System.Threading.Tasks;

namespace OlympianSecurityHost.Controllers.LossPreventions
{
    [EnableCors("AllowOrigin")]
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Administrator,Employee,Client")]
    public class LossPreventionsController : ControllerBase
    {
        private IIncidentReportsService _incidentReportsService;
        private ITresspassReportsService _tresspassReportsService;
        private IEmployeeTimeSheetsService _employeeTimeSheetsService;
        private IAdultRightToCounselsService _adultRightToCounselsService;
        private IYouthRightToCounselsService _youthRightToCounselsService;
        private ICivilFormsService _civilFormsService;

        public LossPreventionsController(IIncidentReportsService s1, ITresspassReportsService s2,
            IEmployeeTimeSheetsService s3, IAdultRightToCounselsService s4,
            IYouthRightToCounselsService s5, ICivilFormsService s6)
        {
            _incidentReportsService = s1;
            _tresspassReportsService = s2;
            _employeeTimeSheetsService = s3;
            _adultRightToCounselsService = s4;
            _youthRightToCounselsService = s5;
            _civilFormsService = s6;
        }

        [HttpPost, Route("save")]
        public async Task<IActionResult> Save([FromBody]LossPreventionsViewModel model)
        {
            try
            {
                if (model == null || !ModelState.IsValid)
                {
                    return BadRequest("Invalid request data");
                }
                if (model.LossPreventionType == Enums.ReportType.IncidentReport.ToString())
                {
                    var res = await _incidentReportsService.Save(model);
                    if (res)
                    {
                        return CreatedAtAction("Save", new { id = model.SysSerial }, model);
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Save Form" };
                    }
                }
                else if (model.LossPreventionType == Enums.ReportType.TresspassReport.ToString())
                {
                    var res = await _tresspassReportsService.Save(model);
                    if (res)
                    {
                        return CreatedAtAction("Save", new { id = model.SysSerial }, model);
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Save Form" };
                    }
                }
                else if (model.LossPreventionType == Enums.ReportType.AdultRightToCounsel.ToString())
                {
                    var res = await _adultRightToCounselsService.Save(model);
                    if (res)
                    {
                        return CreatedAtAction("Save", new { id = model.SysSerial }, model);
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Save Form" };
                    }
                }
                else if (model.LossPreventionType == Enums.ReportType.YouthRightToCounsel.ToString())
                {
                    var res = await _youthRightToCounselsService.Save(model);
                    if (res)
                    {
                        return CreatedAtAction("Save", new { id = model.SysSerial }, model);
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Save Form" };
                    }
                }
                else if (model.LossPreventionType == Enums.ReportType.EmployeeTimeSheet.ToString())
                {
                    var res = await _employeeTimeSheetsService.Save(model);
                    if (res)
                    {
                        return CreatedAtAction("Save", new { id = model.SysSerial }, model);
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Save Form" };
                    }
                }
                else if (model.LossPreventionType == Enums.ReportType.CivilForms.ToString())
                {
                    var res = await _civilFormsService.Save(model);
                    if (res)
                    {
                        return CreatedAtAction("Save", new { id = model.SysSerial }, model);
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Save Form" };
                    }
                }
                return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Find Type" };

            }
            catch (Exception ex)
            {
                return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Save Form" + ex.Message };
            }
        }

        [HttpGet, Route("get")]
        public async Task<IActionResult> Get(int id, string type)
        {
            try
            {
                if (type == Enums.ReportType.IncidentReport.ToString())
                {
                    var res = await _incidentReportsService.Get(id);
                    if (res != null)
                    {
                        return CreatedAtAction("Get", res);
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.NoContent, Content = "No Form Exist" };
                    }
                }
                else if (type == Enums.ReportType.TresspassReport.ToString())
                {
                    var res = await _tresspassReportsService.Get(id);
                    if (res != null)
                    {
                        return CreatedAtAction("Get", res);
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.NoContent, Content = "No Form Exist" };
                    }
                }
                else if (type == Enums.ReportType.AdultRightToCounsel.ToString())
                {
                    var res = await _adultRightToCounselsService.Get(id);
                    if (res != null)
                    {
                        return CreatedAtAction("Get", res);
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.NoContent, Content = "No Form Exist" };
                    }
                }
                else if (type == Enums.ReportType.YouthRightToCounsel.ToString())
                {
                    var res = await _youthRightToCounselsService.Get(id);
                    if (res != null)
                    {
                        return CreatedAtAction("Get", res);
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.NoContent, Content = "No Form Exist" };
                    }
                }
                else if (type == Enums.ReportType.EmployeeTimeSheet.ToString())
                {
                    var res = await _employeeTimeSheetsService.Get(id);
                    if (res != null)
                    {
                        return CreatedAtAction("Get", res);
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.NoContent, Content = "No Form Exist" };
                    }
                }
                else if (type == Enums.ReportType.CivilForms.ToString())
                {
                    var res = await _civilFormsService.Get(id);
                    if (res != null)
                    {
                        return CreatedAtAction("Get", res);
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.NoContent, Content = "No Form Exist" };
                    }
                }
                return new ContentResult { StatusCode = (int)HttpStatusCode.NoContent, Content = "No Form Exist" };
            }
            catch (Exception ex)
            {
                return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Get Form" + ex.Message };
            }
        }

        [HttpGet, Route("getall")]
        public async Task<IActionResult> GetAll(string type)
        {
            try
            {
                if (type == Enums.ReportType.IncidentReport.ToString())
                {
                    var res = await _incidentReportsService.GetAll();
                    if (res.Count > 0)
                    {
                        return CreatedAtAction("Save", new { id = res.Count }, res);
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.NoContent, Content = "No Form Available" };
                    }
                }
                else if (type == Enums.ReportType.TresspassReport.ToString())
                {
                    var res = await _tresspassReportsService.GetAll();
                    if (res.Count > 0)
                    {
                        return CreatedAtAction("Save", new { id = res.Count }, res);
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.NoContent, Content = "No Form Available" };
                    }
                }
                else if (type == Enums.ReportType.AdultRightToCounsel.ToString())
                {
                    var res = await _adultRightToCounselsService.GetAll();
                    if (res.Count > 0)
                    {
                        return CreatedAtAction("Save", new { id = res.Count }, res);
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Get Forms" };
                    }
                }
                else if (type == Enums.ReportType.YouthRightToCounsel.ToString())
                {
                    var res = await _youthRightToCounselsService.GetAll();
                    if (res.Count > 0)
                    {
                        return CreatedAtAction("Save", new { id = res.Count }, res);
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.NoContent, Content = "No Form Available" };
                    }
                }
                else if (type == Enums.ReportType.EmployeeTimeSheet.ToString())
                {
                    var res = await _employeeTimeSheetsService.GetAll();
                    if (res.Count > 0)
                    {
                        return CreatedAtAction("Save", new { id = res.Count }, res);
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.NoContent, Content = "No Form Available" };
                    }
                }
                else if (type == Enums.ReportType.CivilForms.ToString())
                {
                    var res = await _civilFormsService.GetAll();
                    if (res.Count > 0)
                    {
                        return CreatedAtAction("Save", new { id = res.Count }, res);
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.NoContent, Content = "No Form Available" };
                    }
                }
                return new ContentResult { StatusCode = (int)HttpStatusCode.NoContent, Content = "No Form Exist" };
            }
            catch (Exception ex)
            {
                return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Get Forms" + ex.Message };
            }
        }

        [HttpPost, Route("delete")]
        public async Task<IActionResult> Delete([FromBody]LossPreventionsViewModel model)
        {
            try
            {
                if (model.LossPreventionType == Enums.ReportType.IncidentReport.ToString())
                {
                    var res = await _incidentReportsService.Delete(model);
                    if (res)
                    {
                        return CreatedAtAction("Delete", new { id = model.SysSerial }, "Deleted");
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.NoContent, Content = "Unable to Delete Form" };
                    }
                }
                else if (model.LossPreventionType == Enums.ReportType.TresspassReport.ToString())
                {
                    var res = await _tresspassReportsService.Delete(model);
                    if (res)
                    {
                        return CreatedAtAction("Delete", new { id = model.SysSerial }, "Deleted");
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.NoContent, Content = "Unable to Delete Form" };
                    }
                }
                else if (model.LossPreventionType == Enums.ReportType.AdultRightToCounsel.ToString())
                {
                    var res = await _adultRightToCounselsService.Delete(model);
                    if (res)
                    {
                        return CreatedAtAction("Delete", new { id = model.SysSerial }, "Deleted");
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.NoContent, Content = "Unable to Delete Form" };
                    }
                }
                else if (model.LossPreventionType == Enums.ReportType.YouthRightToCounsel.ToString())
                {
                    var res = await _youthRightToCounselsService.Delete(model);
                    if (res)
                    {
                        return CreatedAtAction("Delete", new { id = model.SysSerial }, "Deleted");
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.NoContent, Content = "Unable to Delete Form" };
                    }
                }
                else if (model.LossPreventionType == Enums.ReportType.EmployeeTimeSheet.ToString())
                {
                    var res = await _employeeTimeSheetsService.Delete(model);
                    if (res)
                    {
                        return CreatedAtAction("Delete", new { id = model.SysSerial }, "Deleted");
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.NoContent, Content = "Unable to Delete Form" };
                    }
                }
                else if (model.LossPreventionType == Enums.ReportType.CivilForms.ToString())
                {
                    var res = await _civilFormsService.Delete(model);
                    if (res)
                    {
                        return CreatedAtAction("Delete", new { id = model.SysSerial }, "Deleted");
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.NoContent, Content = "Unable to Delete Form" };
                    }
                }

                return new ContentResult { StatusCode = (int)HttpStatusCode.NoContent, Content = "No Form Exist" };
            }
            catch (Exception ex)
            {
                return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Delete Form" + ex.Message };
            }
        }

        [HttpPost, Route("update")]
        public async Task<IActionResult> Update([FromBody]LossPreventionsViewModel model)
        {
            try
            {
                if (model == null || !ModelState.IsValid)
                {
                    return BadRequest("Invalid request data");
                }

                if (model.LossPreventionType == Enums.ReportType.IncidentReport.ToString())
                {
                    var res = await _incidentReportsService.Edit(model);
                    if (res)
                    {
                        return CreatedAtAction("Update", new { id = model.SysSerial }, model);
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Edit Form" };
                    }
                }
                else if (model.LossPreventionType == Enums.ReportType.TresspassReport.ToString())
                {
                    var res = await _tresspassReportsService.Edit(model);
                    if (res)
                    {
                        return CreatedAtAction("Update", new { id = model.SysSerial }, model);
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Edit Form" };
                    }
                }
                else if (model.LossPreventionType == Enums.ReportType.AdultRightToCounsel.ToString())
                {
                    var res = await _adultRightToCounselsService.Edit(model);
                    if (res)
                    {
                        return CreatedAtAction("Update", new { id = model.SysSerial }, model);
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Edit Form" };
                    }
                }
                else if (model.LossPreventionType == Enums.ReportType.YouthRightToCounsel.ToString())
                {
                    var res = await _youthRightToCounselsService.Edit(model);
                    if (res)
                    {
                        return CreatedAtAction("Update", new { id = model.SysSerial }, model);
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Edit Form" };
                    }
                }
                else if (model.LossPreventionType == Enums.ReportType.EmployeeTimeSheet.ToString())
                {
                    var res = await _employeeTimeSheetsService.Edit(model);
                    if (res)
                    {
                        return CreatedAtAction("Update", new { id = model.SysSerial }, model);
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Edit Form" };
                    }
                }
                else if (model.LossPreventionType == Enums.ReportType.CivilForms.ToString())
                {
                    var res = await _civilFormsService.Edit(model);
                    if (res)
                    {
                        return CreatedAtAction("Update", new { id = model.SysSerial }, model);
                    }
                    else
                    {
                        return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Edit Form" };
                    }
                }
                return new ContentResult { StatusCode = (int)HttpStatusCode.NoContent, Content = "No Form Exist" };
            }
            catch (Exception ex)
            {
                return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Edit   Form" + ex.Message };
            }
        }
    }
}
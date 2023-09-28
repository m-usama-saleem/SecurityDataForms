using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using OlympianSecurityHost.Contracts.SecurityLogs;
using OlympianSecurityHost.ViewModels.SecurityLogs;
using System;
using System.Net;
using System.Threading.Tasks;

namespace OlympianSecurityHost.Controllers.SecurityLogs
{
    [Route("api/[controller]")]
    [EnableCors("AllowOrigin")]
    [ApiController]
    [Authorize(Roles = "Administrator,Employee,Client")]
    public class SecurityLogsController : ControllerBase
    {
        private ISecurityLogsService _securityLog;

        public SecurityLogsController(ISecurityLogsService securityLog)
        {
            _securityLog = securityLog;
        }

        [HttpPost, Route("save")]
        public async Task<IActionResult> Save([FromBody]SecurityLogsViewModel securityLogs)
        {
            try
            {
                if (securityLogs == null || !ModelState.IsValid)
                {
                    return BadRequest("Invalid request data");
                }

                var res = await _securityLog.Save(securityLogs);
                if (res)
                {
                    return CreatedAtAction("Save", new { id = securityLogs.SysSerial }, securityLogs);
                }
                else
                {
                    return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Save Form" };
                }
            }
            catch (Exception ex)
            {
                return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Save Form" + ex.Message };
            }
        }

        [HttpGet, Route("get")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var res = await _securityLog.Get(id);
                if (res != null)
                {
                    return CreatedAtAction("Get", res);
                }
                else
                {
                    return new ContentResult { StatusCode = (int)HttpStatusCode.NoContent, Content = "No Form Exist" };
                }
            }
            catch (Exception ex)
            {
                return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Get Form" + ex.Message };
            }
        }

        [HttpGet, Route("getall")]
        public async Task<IActionResult> GetAll(string id = null)
        {
            try
            {
                var res = await _securityLog.GetAll(id);
                if (res.Count > 0)
                {
                    return CreatedAtAction("Save", new { id = res.Count }, res);
                }
                else
                {
                    return new ContentResult { StatusCode = (int)HttpStatusCode.NoContent, Content = "No Form Available" };
                }
            }
            catch (Exception ex)
            {
                return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Get Forms" + ex.Message };
            }
        }

        [HttpPost, Route("delete")]
        public async Task<IActionResult> Delete([FromBody]SecurityLogsViewModel model)
        {
            try
            {
                var res = await _securityLog.Delete(model);
                if (res)
                {
                    return CreatedAtAction("Delete", new { id = model.SysSerial }, "Deleted");
                }
                else
                {
                    return new ContentResult { StatusCode = (int)HttpStatusCode.NoContent, Content = "Unable to Delete Form" };
                }
            }
            catch (Exception ex)
            {
                return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Delete Form" + ex.Message };
            }
        }

        [HttpPost, Route("update")]
        public async Task<IActionResult> Update([FromBody]SecurityLogsViewModel securityLogs)
        {
            try
            {
                if (securityLogs == null || !ModelState.IsValid)
                {
                    return BadRequest("Invalid request data");
                }

                var res = await _securityLog.Edit(securityLogs);
                if (res)
                {
                    return CreatedAtAction("Update", new { id = securityLogs.SysSerial }, securityLogs);
                }
                else
                {
                    return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Edit Form" };
                }
            }
            catch (Exception ex)
            {
                return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Edit   Form" + ex.Message };
            }
        }
    }
}
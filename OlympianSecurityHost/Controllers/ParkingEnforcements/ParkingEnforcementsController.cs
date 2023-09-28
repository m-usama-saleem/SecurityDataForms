using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OlympianSecurityHost.Contracts.ParkingEnforcements;
using OlympianSecurityHost.ViewModels.Forms;

namespace OlympianSecurityHost.Controllers.ParkingEnforcements
{
    [EnableCors("AllowOrigin")]
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Administrator,Employee,Client")]
    public class ParkingEnforcementsController : ControllerBase
    {
        private IParkingEnforcementsService _service;

        public ParkingEnforcementsController(IParkingEnforcementsService Service)
        {
            _service = Service;
        }

        [HttpPost, Route("save")]
        public async Task<IActionResult> Save([FromBody]ParkingEnforcementViewModel model)
        {
            try
            {
                if (model == null || !ModelState.IsValid)
                {
                    return BadRequest("Invalid request data");
                }

                var res = await _service.Save(model);
                if (res)
                {
                    return CreatedAtAction("Save", new { id = model.SysSerial }, model);
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
                var res = await _service.Get(id);
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
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var res = await _service.GetAll();
                if (res.Count > 0)
                {
                    return CreatedAtAction("GetAll", new { id = res.Count }, res);
                }
                else
                {
                    return new ContentResult { StatusCode = (int)HttpStatusCode.NoContent, Content = "No Form Available" };
                }
            }
            catch (Exception ex)
            {
                return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = ex.Message };
            }
        }

        [HttpPost, Route("delete")]
        public async Task<IActionResult> Delete([FromBody]ParkingEnforcementViewModel model)
        {
            try
            {
                var res = await _service.Delete(model);
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
        public async Task<IActionResult> Update([FromBody]ParkingEnforcementViewModel model)
        {
            try
            {
                if (model == null || !ModelState.IsValid)
                {
                    return BadRequest("Invalid request data");
                }

                var res = await _service.Edit(model);
                if (res)
                {
                    return CreatedAtAction("Update", new { id = model.SysSerial }, model);
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
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OlympianSecurityHost.Contracts.GeneralOccurences;
using OlympianSecurityHost.ViewModels.Forms;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading.Tasks;

namespace OlympianSecurityHost.Controllers.GeneralOccurences
{
    [EnableCors("AllowOrigin")]
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Administrator,Employee,Client")]
    public class GeneralOccurencesController : ControllerBase
    {
        private IGeneralOccurencesService _service;

        public GeneralOccurencesController(IGeneralOccurencesService Service)
        {
            _service = Service;
        }

        [HttpPost, Route("save")]
        public async Task<IActionResult> Save(GenOccReportViewModel model)
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
        public async Task<IActionResult> GetAll(string id = null)
        {
            try
            {
                var res = await _service.GetAll(id);
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
                return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Get Forms" + ex.Message };
            }
        }

        [HttpPost, Route("delete")]
        public async Task<IActionResult> Delete([FromBody]GenOccReportViewModel model)
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
        public async Task<IActionResult> Update([FromBody]GenOccReportViewModel model)
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

        [HttpGet, Route("getalloccurence")]
        public async Task<IActionResult> GetAllOccurenceType()
        {
            try
            {
                var res = await _service.GetAllOccurences();
                if (res.Count > 0)
                {
                    return CreatedAtAction("GetAllOccurenceType", new { id = res.Count }, res);
                }
                else
                {
                    return new ContentResult { StatusCode = (int)HttpStatusCode.NoContent, Content = "Unable to Get Occurence Types" };
                }
            }
            catch (Exception ex)
            {
                return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Get Occurence Types" + ex.Message };
            }
        }

        [HttpPost]
        [Route("upload")]
        public async Task<IActionResult> Upload(IFormCollection files)
        {
            try
            {
                if (files.Files.Count > 0)
                {
                    var fileNames = "";
                    foreach (var file in files.Files)
                    {
                        if (file.Length > 0)
                        {
                            var g = Guid.NewGuid();
                            var official = String.Format("{0}_{1}_{2}", DateTime.Now.ToString("yyyy-MM-dd"), g, file.FileName);

                            string folderPath = AppDomain.CurrentDomain.BaseDirectory;
                            string path = Path.Combine(folderPath, "uploadFiles");
                            if (!Directory.Exists(path))
                            {
                                //If Directory (Folder) does not exists. Create it.
                                Directory.CreateDirectory(path);
                            }
                            using (var fs = new FileStream(Path.Combine(path, official), FileMode.Create))
                            {
                                await file.CopyToAsync(fs);
                            }
                            fileNames += official + ",";
                        }
                    }
                    return new ContentResult { StatusCode = (int)HttpStatusCode.OK, Content = fileNames };
                }

                return BadRequest();
            }
            catch (Exception ex)
            {
                return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to Upload File" + ex.Message };
            }
        }
        [HttpPost]
        [Route("download")]
        public async Task<IActionResult> Download(FileData Data)
        {
            try
            {
                var filename = Data.Name;

                if (filename == null)
                {
                    return Content("filename not present");
                }

                var path = Path.Combine(
                           AppDomain.CurrentDomain.BaseDirectory,
                           "uploadFiles", filename);

                var file = new FileInfo(path);
                if (file.Exists)
                {
                    var fileContentResult = new FileContentResult(System.IO.File.ReadAllBytes(path), GetContentType(path))
                    {
                        FileDownloadName = filename
                    };
                    return fileContentResult;
                }

                return Content("filename not present");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private string GetContentType(string path)
        {
            var types = GetMimeTypes();
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return types[ext];
        }

        private Dictionary<string, string> GetMimeTypes()
        {
            return new Dictionary<string, string>
            {
                {".txt", "text/plain"},
                {".pdf", "application/pdf"},
                {".doc", "application/vnd.ms-word"},
                {".docx", "application/vnd.ms-word"},
                {".xls", "application/vnd.ms-excel"},
                {".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},
                {".png", "image/png"},
                {".jpg", "image/jpeg"},
                {".jpeg", "image/jpeg"},
                {".gif", "image/gif"},
                {".csv", "text/csv"}
            };
        }
    }
    public class FileData
    {
        public string Name { get; set; }
    }
}
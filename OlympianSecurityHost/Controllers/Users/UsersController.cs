using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using OlympianSecurityHost.Contracts.Users;
using OlympianSecurityHost.ViewModels.Users;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace OlympianSecurityHost.Controllers.Users
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private IUsersService _userService;

        [HttpGet, Route("testget")]
        public string TestGet()
        {
            return "Pass";
        }
        [HttpPost, Route("testpost")]
        public string TestPost()
        {
            return "Pass";
        }

        public UsersController(IUsersService userService)
        {
            _userService = userService;
        }

        [HttpPost, Route("register")]
        [Authorize(Roles = "Administrator")]
        [EnableCors("AllowOrigin")]
        public async Task<IActionResult> Register([FromBody]UsersViewModel userViewModel)
        {
            if (userViewModel == null || !ModelState.IsValid)
            {
                return BadRequest("Invalid request data");
            }
            if (!await _userService.IsUserExists(userViewModel.UserId))
            {
                return Conflict("Duplicate Not Allowed, User already exists");
            }
            else
            {
                var register = await _userService.Register(userViewModel);
                if (register != 0)
                {
                    return CreatedAtAction("Register", new { id = userViewModel.UserId }, userViewModel);
                }
                else
                {
                    return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to register" };
                }
            }
        }
        [HttpGet, Route("list")]
        [Authorize(Roles = "Administrator")]
        [EnableCors("AllowOrigin")]
        public async Task<List<string>> List()
        {
            return await _userService.List();
        }
        [Authorize(Roles = "Administrator, Employee, Client")]
        [HttpGet, Route("clientlist")]
        [EnableCors("AllowOrigin")]
        public async Task<List<ProfileViewModel>> ClientList()
        {
            return await _userService.ClientList();
        }
        [HttpGet, Route("employeelist")]
        [Authorize(Roles = "Administrator")]
        [EnableCors("AllowOrigin")]
        public async Task<List<ProfileViewModel>> EmployeeList()
        {
            return await _userService.EmployeeList();
        }

        [HttpPost, Route("login")]
        public async Task<ActionResult> Login([FromBody]LoginViewModel loginViewModel)
        {
            if (loginViewModel == null)
            {
                return BadRequest("Invalid request");
            }
            //loginViewModel.UserId = "ad";
            //loginViewModel.Password = "12345";
            var userProfile = await _userService.ValidateUser(loginViewModel);
            if (userProfile != null)
            {
                var tokenString = _userService.GenerateToken(userProfile);
                return Ok(new
                {
                    Token = tokenString,
                    id = userProfile.UserId,
                    roles = userProfile.Role,
                    date = userProfile.Date
                });
            }
            else
            {
                return Unauthorized();
            }
        }

        [HttpPost, Route("changepassword")]
        [Authorize(Roles = "Administrator")]
        [EnableCors("AllowOrigin")]
        public async Task<ActionResult> ChangePassword([FromBody]UsersViewModel userViewModel)
        {
            if (userViewModel != null)
            {
                var result = await _userService.ChangePassword(userViewModel);
                if (result == -1)
                {
                    return new ContentResult { StatusCode = (int)HttpStatusCode.NotModified, Content = "Not found any change in data" };
                }

                if (result > 0)
                {
                    return Ok("Password Updated");
                }
                else
                {
                    return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to change password" };
                }
            }
            else
            {
                return BadRequest("Invalid data");
            }
        }

        [HttpPost, Route("updateuser")]
        [Authorize(Roles = "Administrator")]
        [EnableCors("AllowOrigin")]
        public async Task<ActionResult> UpdateUser([FromBody]UsersViewModel userViewModel)
        {
            if (userViewModel != null)
            {
                var result = await _userService.UpdateUser(userViewModel);
                if (result != 0)
                {
                    return CreatedAtAction("User Updated", new { id = userViewModel.UserId }, userViewModel);
                }
                else
                {
                    return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to update the user" };
                }
            }
            else
            {
                return BadRequest("Invalid data");
            }
        }

        [HttpGet, Route("isuserexists")]
        public async Task<bool> IsUserExists(string userId)
        {
            return await _userService.IsUserExists(userId);
        }

        [HttpGet, Route("deleteuser")]
        [Authorize(Roles = "Administrator")]
        [EnableCors("AllowOrigin")]
        public async Task<ActionResult> DeleteUser(string userId)
        {
            if (!string.IsNullOrEmpty(userId))
            {
                var result = await _userService.DeleteUser(userId);
                if (result != 0)
                {
                    return Ok("User Deleted");
                }
                else
                {
                    return new ContentResult { StatusCode = (int)HttpStatusCode.InternalServerError, Content = "Unable to delete user" };
                }
            }
            else
            {
                return BadRequest("Invalid data");
            }
        }

        //private static ActionResult Result(HttpStatusCode statusCode, string reason) => new ContentResult
        //{
        //    StatusCode = (int)statusCode,
        //    Content = $"Status Code: {(int)statusCode}; {statusCode}; {reason}",
        //    ContentType = "text/plain",
        //};
    }
}
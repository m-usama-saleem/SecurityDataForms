using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using OlympianSecurityHost.Contracts.Users;
using OlympianSecurityHost.Data;
using OlympianSecurityHost.Models.Users;
using OlympianSecurityHost.Utills;
using OlympianSecurityHost.ViewModels.Users;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace OlympianSecurityHost.Services.Users
{
    public class UsersService : IUsersService
    {
        private readonly HostDbContext db;
        private readonly IConfiguration Configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public UsersService(HostDbContext context, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            db = context;
            Configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }
        public async Task<bool> IsUserExists(string userID)
        {
            var isFound = false;
            var user = await db.Users.Where(x => x.UserId == userID).FirstOrDefaultAsync();
            if (user == null)
            {
                isFound = true;

            }
            return isFound;
        }

        public async Task<int> Register(UsersViewModel userViewModel)
        {
            var result = 0;
            try
            {
                var user = new UsersModel();
                user.UserId = userViewModel.UserId;
                user.Password = GetPasswordHash(userViewModel.Password);
                user.RoleId = userViewModel.RoleId;
                db.Users.Add(user);
                result = await db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                result = 0;
            }
            return result;
        }

        public async Task<ProfileViewModel> ValidateUser(LoginViewModel loginViewModel)
        {

            ProfileViewModel profile = null;
            try
            {
                var user = await db.Users.Where(x => x.UserId == loginViewModel.UserId).FirstOrDefaultAsync();

                if (ComparePassword(loginViewModel.Password, user.Password))
                {
                    var role = await db.Roles.Where(x => x.SysSerial == user.RoleId).FirstOrDefaultAsync();
                    profile = new ProfileViewModel();
                    profile.UserId = user.UserId;
                    profile.Role = role.Name;
                    profile.Date = DateTime.Now;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
            return profile;
        }
        public static byte[] GetPasswordHash(string rsValue)
        {
            return OPSHash.CalculateHash(rsValue);
        }

        public static bool ComparePassword(string rsValue, byte[] robjPasswordHash)
        {
            return OPSHash.CheckHashValue(rsValue, robjPasswordHash);
        }

        public string GenerateToken(ProfileViewModel userProfile)
        {
            var tokenString = "";
            try
            {
                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["SecretKey"]));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);


                var userClaims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, userProfile.UserId),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(ClaimTypes.Role, userProfile.Role)
                };

                var token = new JwtSecurityToken(
                    issuer: Configuration["TokenIssuer"],
                    audience: Configuration["TokenAudience"],
                    claims: userClaims,
                    expires: DateTime.Now.AddDays(7),
                    signingCredentials: signinCredentials
                );

                tokenString = new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception ex)
            {
                tokenString = "";
            }
            return tokenString;
        }

        public async Task<ProfileViewModel> GetUserProfile()
        {
            ProfileViewModel profile = null;
            try
            {
                var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                var user = await db.Users.Where(x => x.UserId == userId).FirstOrDefaultAsync(); // will give the user's userId
                if (user != null)
                {
                    var role = await db.Roles.Where(x => x.SysSerial == user.RoleId).FirstOrDefaultAsync();
                    profile = new ProfileViewModel();
                    profile.UserId = user.UserId;
                    profile.Role = role.Name;
                }
            }
            catch (Exception ex)
            {
            }
            return profile;
        }

        public async Task<List<string>> List()
        {
            List<string> result = new List<string>();
            try
            {
                result = await db.Users.Select(x=>x.UserId).ToListAsync();                
            }
            catch (Exception ex)
            {
                result = null;
            }
            return result;
        }
        public async Task<List<ProfileViewModel>> ClientList()
        {
            List<ProfileViewModel> result = new List<ProfileViewModel>();
            try
            {
                var users = await db.Users.Where(x => x.RoleId == 3 && x.IsDeleted == false).ToListAsync();
                var role = await db.Roles.ToListAsync();
                foreach (UsersModel user in users)
                {
                    result.Add(new ProfileViewModel
                    {
                        UserId = user.SysSerial.ToString(),
                        UserName = user.UserId,
                        Role = role.Where(x => x.SysSerial == user.RoleId).FirstOrDefault().Name
                    });
                }
            }
            catch (Exception ex)
            {
                result = null;
            }
            return result;
        }
        public async Task<List<ProfileViewModel>> EmployeeList()
        {
            List<ProfileViewModel> result = new List<ProfileViewModel>();
            try
            {
                var users = await db.Users.Where(x => x.RoleId == 2 && x.IsDeleted == false).ToListAsync();
                var role = await db.Roles.ToListAsync();
                foreach (UsersModel user in users)
                {
                    result.Add(new ProfileViewModel
                    {
                        UserId = user.SysSerial.ToString(),
                        UserName = user.UserId,
                        Role = role.Where(x => x.SysSerial == user.RoleId).FirstOrDefault().Name
                    });
                }
            }
            catch (Exception ex)
            {
                result = null;
            }
            return result;
        }
        public async Task<int> ChangePassword(UsersViewModel usersViewModel)
        {
            var result = 0;
            try
            {
                var user = await db.Users.Where(x => x.UserId == usersViewModel.UserId).FirstOrDefaultAsync();
                if (user != null)
                {
                    user.Password = GetPasswordHash(usersViewModel.Password);
                    result = await db.SaveChangesAsync();
                    if(result == 0)
                    {
                        if (!TrackedEntities(db.ChangeTracker))
                        {
                            result = -1;
                        }
                    }                    
                }
            }
            catch (Exception ex)
            {
                result = 0;
            }
            return result;
        }
        public async Task<int> DeleteUser(string userID)
        {
            var result = 0;
            try
            {
                var user = await db.Users.Where(x => x.UserId == userID).FirstOrDefaultAsync();
                if (user != null)
                {
                    user.IsDeleted = true;
                    result = await db.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                result = 0;
            }
            return result;
        }
        public async Task<int> UpdateUser(UsersViewModel usersViewModel)
        {
            var result = 0;
            try
            {
                var user = await db.Users.Where(x => x.UserId == usersViewModel.UserId).FirstOrDefaultAsync();
                if (user != null)
                {
                    user.RoleId = usersViewModel.RoleId;
                    result = await db.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                result = 0;
            }
            return result;
        }

        private static bool TrackedEntities(ChangeTracker changeTracker)
        {
            var entries = changeTracker.Entries();
            if(entries.FirstOrDefault().State == EntityState.Unchanged)
            {
                return false;
            }
            else
            {
                return true;
            }
        }
    }
}

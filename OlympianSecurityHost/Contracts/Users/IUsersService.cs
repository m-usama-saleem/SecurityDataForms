using OlympianSecurityHost.Models.Users;
using OlympianSecurityHost.ViewModels.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OlympianSecurityHost.Contracts.Users
{
    public interface IUsersService
    {
        Task<bool> IsUserExists(string userID);
        Task<int> Register(UsersViewModel usersViewModel);
        string GenerateToken(ProfileViewModel usersModel);
        Task<ProfileViewModel> ValidateUser(LoginViewModel loginModel);
        Task<ProfileViewModel> GetUserProfile();
        Task<List<string>> List();
        Task<List<ProfileViewModel>> ClientList();
        Task<List<ProfileViewModel>> EmployeeList();
        Task<int> ChangePassword(UsersViewModel userViewModel);
        Task<int> UpdateUser(UsersViewModel userViewModel);
        Task<int> DeleteUser(string userId);
    }
}

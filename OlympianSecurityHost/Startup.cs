using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using OlympianSecurityHost.Contracts.AlarmResponses;
using OlympianSecurityHost.Contracts.GeneralOccurences;
using OlympianSecurityHost.Contracts.LossPreventions;
using OlympianSecurityHost.Contracts.ParkingEnforcements;
using OlympianSecurityHost.Contracts.SecurityLogs;
using OlympianSecurityHost.Contracts.TressPassNotices;
using OlympianSecurityHost.Contracts.Users;
using OlympianSecurityHost.Data;
using OlympianSecurityHost.Services.AlarmResponses;
using OlympianSecurityHost.Services.GeneralOccurences;
using OlympianSecurityHost.Services.LossPreventionsReports;
using OlympianSecurityHost.Services.ParkingEnforcements;
using OlympianSecurityHost.Services.SecurityLogs;
using OlympianSecurityHost.Services.TressPassNotices;
using OlympianSecurityHost.Services.Users;
using System.Text;

namespace OlympianSecurityHost
{
    public class Startup
    {
        private const string aesKey = "Ipm31iuogas6E79WRw6JTFMvvnu1XpUTyTbjRZN1/vc=";
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,

                        ValidIssuer = "saleswareltd",
                        ValidAudience = "olympiansecurity",
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(aesKey))
                    };
                }
            );
            services.AddDbContext<HostDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IUsersService, UsersService>();

            services.AddScoped<ISecurityLogsService, SecurityLogsService>();
            services.AddScoped<IAlarmResponsesService, AlarmResponsesService>();
            services.AddScoped<IGeneralOccurencesService, GeneralOccurencesService>();
            services.AddScoped<IParkingEnforcementsService, ParkingEnforcementsService>();
            services.AddScoped<ITressPassNoticesService, TressPassNoticesService>();

            services.AddScoped<IIncidentReportsService, IncidentReportsService>();
            services.AddScoped<ITresspassReportsService, TresspassReportsService>();
            services.AddScoped<IAdultRightToCounselsService, AdultRightToCounselsService>();
            services.AddScoped<IYouthRightToCounselsService, YouthRightToCounselsService>();
            services.AddScoped<IEmployeeTimeSheetsService, EmployeeTimeSheetsService>();
            services.AddScoped<ICivilFormsService, CivilFormsService>();
            //services.Configure<ForwardedHeadersOptions>(options =>
            //{
            //    options.KnownProxies.Add(IPAddress.Parse("10.0.0.100"));
            //});
            //services.AddCors(c =>
            //{
            //    //c.AddPolicy("AllowOrigin", options => options.WithOrigins("http://adminportal.saleswareltd.com"));
            //    c.AddPolicy("AllowOrigin", options => options.WithOrigins("http://116.202.66.254:82/api")); 
            //    c.AddPolicy("AllowOrigin", options => options.WithOrigins("http://116.202.66.254:85"));
            //});
            services.AddCors(options =>
            {
                options.AddPolicy("AllowOrigin",
                                  builder =>
                                  {
                                      builder.WithOrigins(
                                          "http://116.202.66.254:85",
                                          "http://116.202.66.254:82/api",
                                          "http://adminportal.saleswareltd.com"
                                                          );
                                  });
            });
            services.AddHttpContextAccessor();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseCors(options => options.WithOrigins(
                                          "http://116.202.66.254:85",
                                          "http://116.202.66.254:82/api",
                                          "http://adminportal.saleswareltd.com"
                ).AllowAnyHeader());

            //app.UseCors(options => options.WithOrigins("http://116.202.66.254:82/api").AllowAnyHeader());
            //app.UseCors(options => options.WithOrigins("http://116.202.66.254:85").AllowAnyHeader());
            //app.UseCors(options => options.WithOrigins("http://adminportal.saleswareltd.com").AllowAnyHeader());

            //app.UseForwardedHeaders(new ForwardedHeadersOptions
            //{
            //    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            //});
            app.UseAuthentication();
            app.UseMvc();
        }
    }
}

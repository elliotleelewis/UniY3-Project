// <copyright file="Startup.cs" company="Elliot Lewis">
// Copyright (c) Elliot Lewis. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
namespace Project
{
	using System;
	using System.Collections.Generic;
	using System.IdentityModel.Tokens.Jwt;
	using System.IO;
	using System.Linq;
	using System.Text;
	using Microsoft.AspNetCore.Authentication.JwtBearer;
	using Microsoft.AspNetCore.Builder;
	using Microsoft.AspNetCore.Hosting;
	using Microsoft.AspNetCore.Identity;
	using Microsoft.AspNetCore.Mvc;
	using Microsoft.AspNetCore.Routing;
	using Microsoft.AspNetCore.SpaServices.AngularCli;
	using Microsoft.Extensions.Configuration;
	using Microsoft.Extensions.DependencyInjection;
	using Microsoft.IdentityModel.Tokens;
	using MongoDB.Bson;
	using Project.Models;
	using Project.Repositories;
	using Swashbuckle.AspNetCore.Swagger;

	/// <summary>
	/// Web App entry point.
	/// </summary>
	public class Startup
	{
		private readonly IConfiguration _configuration;

		/// <summary>
		/// Initializes a new instance of the <see cref="Startup"/> class.
		/// </summary>
		/// <param name="configuration">Web App configuration.</param>
		public Startup(IConfiguration configuration)
		{
			this._configuration = configuration;
		}

		/// <summary>
		/// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		/// </summary>
		/// <param name="app">Application.</param>
		/// <param name="env">Environment.</param>
		public static void Configure(IApplicationBuilder app, IHostingEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}
			else
			{
				app.UseExceptionHandler("/error");
				app.UseHsts();
			}

			app.UseAuthentication();
			app.UseHttpsRedirection();
			app.UseResponseCaching();
			app.UseResponseCompression();
			app.UseStaticFiles();
			app.UseSpaStaticFiles();

			app.UseSwagger((o) =>
			{
				o.PreSerializeFilters.Add((document, request) =>
				{
					document.Paths = document.Paths.ToDictionary(p => p.Key.ToLowerInvariant(), p => p.Value);
				});
			});
			app.UseSwaggerUI((c) => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "UniY3 - Project"); });

			app.UseMvc((routes) =>
			{
				routes.MapRoute(
					name: "default",
					template: "{controller}/{action=Index}/{id?}");
			});

			app.UseSpa((spa) =>
			{
				// To learn more about options for serving an Angular SPA from ASP.NET Core,
				// see https://go.microsoft.com/fwlink/?linkid=864501
				spa.Options.SourcePath = "ClientApp";

				if (env.IsDevelopment())
				{
					spa.UseAngularCliServer(npmScript: "start");
				}
			});
		}

		/// <summary>
		/// This method gets called by the runtime. Use this method to add services to the container.
		/// </summary>
		/// <param name="services">ServiceCollection.</param>
		public void ConfigureServices(IServiceCollection services)
		{
			services.Configure<RouteOptions>((options) => options.LowercaseUrls = true);
			services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
			services.AddResponseCaching();
			services.AddResponseCompression();

			// In production, the Angular files will be served from this directory
			services.AddSpaStaticFiles((configuration) => { configuration.RootPath = "ClientApp/dist"; });

			services.AddSwaggerGen((c) =>
			{
				c.SwaggerDoc("v1", new Info { Title = "UniY3 - Project", Version = "v1" });
				c.IncludeXmlComments(Path.Combine(System.AppContext.BaseDirectory, "Project.xml"));
				c.AddSecurityDefinition("Bearer", new ApiKeyScheme
				{
					Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
					Name = "Authorization",
					In = "header",
					Type = "apiKey",
				});
				c.AddSecurityRequirement(new Dictionary<string, IEnumerable<string>>
				{
					{ "Bearer", Array.Empty<string>() },
				});
			});

			services.AddIdentity<ApplicationUserModel, IdentityRoleModel>((options) =>
					{
						options.Password.RequireDigit = false;
						options.Password.RequireLowercase = false;
						options.Password.RequireUppercase = false;
						options.Password.RequireNonAlphanumeric = false;
						options.Password.RequiredLength = 8;
					})
				.AddMongoDbStores<ApplicationUserModel, IdentityRoleModel, ObjectId>(
					this._configuration["MongoDB:ConnectionString"],
					this._configuration["MongoDB:Database"])
				.AddDefaultTokenProviders();

			JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear(); // => remove default claims
			services
				.AddAuthentication((options) =>
				{
					options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
					options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
					options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
				})
				.AddJwtBearer((cfg) =>
				{
					cfg.RequireHttpsMetadata = false;
					cfg.SaveToken = true;
					cfg.TokenValidationParameters = new TokenValidationParameters
					{
						ValidIssuer = this._configuration["Jwt:Issuer"],
						ValidAudience = this._configuration["Jwt:Issuer"],
						IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this._configuration["Jwt:Key"])),
						ClockSkew = TimeSpan.Zero,
					};
				});

			services.AddSingleton<DeformationsRepository>();
		}
	}
}

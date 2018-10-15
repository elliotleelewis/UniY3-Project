// <copyright file="Startup.cs" company="Elliot Lewis">
// Copyright (c) Elliot Lewis. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
namespace Project
{
	using Microsoft.AspNetCore.Builder;
	using Microsoft.AspNetCore.Hosting;
	using Microsoft.AspNetCore.Mvc;
	using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
	using Microsoft.Extensions.Configuration;
	using Microsoft.Extensions.DependencyInjection;
	using Swashbuckle.AspNetCore.Swagger;

	/// <summary>
	/// Web App entry point.
	/// </summary>
	public class Startup
	{
		/// <summary>
		/// Initializes a new instance of the <see cref="Startup"/> class.
		/// </summary>
		/// <param name="configuration">Web App configuration.</param>
		public Startup(IConfiguration configuration)
		{
			this.Configuration = configuration;
		}

		private IConfiguration Configuration { get; }

		/// <summary>
		/// This method gets called by the runtime. Use this method to add services to the container.
		/// </summary>
		/// <param name="services">ServiceCollection.</param>
		public static void ConfigureServices(IServiceCollection services)
		{
			services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
			services.AddResponseCaching();
			services.AddResponseCompression();

			// In production, the React files will be served from this directory
			services.AddSpaStaticFiles((configuration) =>
			{
				configuration.RootPath = "ClientApp/build";
			});

			services.AddSwaggerGen((c) =>
			{
				c.SwaggerDoc("v1", new Info { Title = "UniY3 - Project", Version = "v1" });
			});
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

			app.UseHttpsRedirection();
			app.UseResponseCaching();
			app.UseResponseCompression();
			app.UseStaticFiles();
			app.UseSpaStaticFiles();

			app.UseSwagger();
			app.UseSwaggerUI((c) =>
			{
				c.SwaggerEndpoint("/swagger/v1/swagger.json", "UniY3 - Project");
			});

			app.UseMvc((routes) =>
			{
				routes.MapRoute(
					name: "default",
					template: "{controller}/{action=Index}/{id?}");
			});

			app.UseSpa((spa) =>
			{
				spa.Options.SourcePath = "ClientApp";

				if (env.IsDevelopment())
				{
					spa.UseReactDevelopmentServer(npmScript: "start");
				}
			});
		}
	}
}

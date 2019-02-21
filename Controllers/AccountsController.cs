// <copyright file="AccountsController.cs" company="Elliot Lewis">
// Copyright (c) Elliot Lewis. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
namespace Project.Controllers
{
	using System;
	using System.Collections.Generic;
	using System.Globalization;
	using System.IdentityModel.Tokens.Jwt;
	using System.Linq;
	using System.Security.Claims;
	using System.Text;
	using System.Threading.Tasks;
	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Identity;
	using Microsoft.AspNetCore.Mvc;
	using Microsoft.Extensions.Configuration;
	using Microsoft.IdentityModel.Tokens;
	using Project.Models;
	using Project.Models.Dto;

	/// <inheritdoc />
	/// <summary>
	/// Controller to handle account related tasks and actions.
	/// </summary>
	[ApiController]
	[Authorize]
	[Route("api/[controller]")]
	public class AccountsController : Controller
	{
		private readonly SignInManager<ApplicationUserModel> _signInManager;
		private readonly UserManager<ApplicationUserModel> _userManager;
		private readonly IConfiguration _configuration;

		/// <summary>
		/// Initializes a new instance of the <see cref="AccountsController"/> class.
		/// </summary>
		/// <param name="userManager">Injected UserManager.</param>
		/// <param name="signInManager">Injected SignInManager.</param>
		/// <param name="configuration">Web App configuration.</param>
		public AccountsController(
			UserManager<ApplicationUserModel> userManager,
			SignInManager<ApplicationUserModel> signInManager,
			IConfiguration configuration)
		{
			this._userManager = userManager;
			this._signInManager = signInManager;
			this._configuration = configuration;
		}

		/// <summary>
		/// Gets current authenticated user.
		/// </summary>
		/// <returns>ApplicationUser.</returns>
		[HttpGet]
		public async Task<ActionResult<ApplicationUserModel>> Get()
		{
			return await this._userManager.GetUserAsync(this.HttpContext.User);
		}

		/// <summary>
		/// Attempts to login user with credentials passed in POST body.
		/// </summary>
		/// <param name="model">Credentials.</param>
		/// <returns>JWT.</returns>
		[AllowAnonymous]
		[HttpPost("[action]")]
		public async Task<ActionResult<object>> Login([FromBody] LoginRegisterDtoModel model)
		{
			var result = await this._signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);

			if (!result.Succeeded)
			{
				return this.BadRequest("INVALID_LOGIN_ATTEMPT");
			}

			var appUser = this._userManager.Users.SingleOrDefault(r => r.Email == model.Email);
			return this.GenerateJwtToken(model.Email, appUser);
		}

		/// <summary>
		/// Attempts to register and then login user with credentials passed in POST body.
		/// </summary>
		/// <param name="model">Credentials.</param>
		/// <returns>JWT.</returns>
		[AllowAnonymous]
		[HttpPost("[action]")]
		public async Task<ActionResult<object>> Register([FromBody] LoginRegisterDtoModel model)
		{
			var user = new ApplicationUserModel
			{
				UserName = model.Email,
				Email = model.Email,
			};
			var result = await this._userManager.CreateAsync(user, model.Password);

			if (!result.Succeeded)
			{
				return this.BadRequest(result.Errors);
			}

			await this._signInManager.SignInAsync(user, false);
			return this.GenerateJwtToken(model.Email, user);
		}

		private object GenerateJwtToken(string email, ApplicationUserModel user)
		{
			var claims = new List<Claim>
			{
				new Claim(JwtRegisteredClaimNames.Sub, email),
				new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
				new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
			};

			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this._configuration["Jwt:Key"]));
			var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
			var expires = DateTime.Now.AddDays(Convert.ToDouble(this._configuration["Jwt:ExpireDays"], CultureInfo.CurrentCulture));

			var token = new JwtSecurityToken(
				this._configuration["Jwt:Issuer"],
				this._configuration["Jwt:Issuer"],
				claims,
				expires: expires,
				signingCredentials: credentials);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}
	}
}

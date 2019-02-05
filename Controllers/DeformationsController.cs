// <copyright file="DeformationsController.cs" company="Elliot Lewis">
// Copyright (c) Elliot Lewis. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
namespace Project.Controllers
{
	using System;
	using System.Collections.Generic;
	using System.Threading.Tasks;
	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Identity;
	using Microsoft.AspNetCore.Mvc;
	using Project.Models;
	using Project.Models.Dto;
	using Project.Repositories;

	/// <summary>
	/// Handles CRUD for Deformations.
	/// </summary>
	[ApiController]
	[Route("api/[controller]")]
	public class DeformationsController : Controller
	{
		private readonly UserManager<ApplicationUserModel> _userManager;
		private readonly DeformationsRepository _deformationsRepository;

		/// <summary>
		/// Initializes a new instance of the <see cref="DeformationsController"/> class.
		/// </summary>
		/// <param name="userManager">Injected UserManager.</param>
		/// <param name="deformationsRepository">Injected DeformationsRepository.</param>
		public DeformationsController(
			UserManager<ApplicationUserModel> userManager,
			DeformationsRepository deformationsRepository)
		{
			this._userManager = userManager;
			this._deformationsRepository = deformationsRepository;
		}

		/// <summary>
		/// Gets all Deformations.
		/// </summary>
		/// <param name="limit">Limits number of results returned.</param>
		/// <param name="skip">Number of results to skip.</param>
		/// <returns>Array of all Deformations.</returns>
		[HttpGet]
		public async Task<ActionResult<List<DeformationModel>>> Index([FromQuery] int? limit, [FromQuery] int? skip)
		{
			return await this._deformationsRepository.SelectAll(limit, skip);
		}

		/// <summary>
		/// Creates a new Deformations.
		/// </summary>
		/// <param name="data">POST Data.</param>
		/// <returns>Created Deformations.</returns>
		[Authorize]
		[HttpPost]
		public async Task<DeformationModel> Create([FromBody] CreateDeformationDtoModel data)
		{
			var user = await this._userManager.GetUserAsync(this.HttpContext.User);
			return await this._deformationsRepository.Create(new DeformationModel
			{
				Name = data.Name,
				Data = data.Data,
				Views = 0,
				CreatedBy = user,
				CreatedAt = DateTime.Now,
			});
		}

		/// <summary>
		/// Gets a specific Deformation.
		/// </summary>
		/// <param name="id"><see cref="DeformationModel"/> Id.</param>
		/// <returns>Specific Deformations.</returns>
		[HttpGet("{id}")]
		public async Task<ActionResult<DeformationModel>> Get(string id)
		{
			return await this._deformationsRepository.Get(id);
		}
	}
}

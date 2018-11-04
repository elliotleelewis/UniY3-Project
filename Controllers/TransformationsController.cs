// <copyright file="TransformationsController.cs" company="Elliot Lewis">
// Copyright (c) Elliot Lewis. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
namespace Project.Controllers
{
	using System;
	using System.Collections.Generic;
	using System.Threading.Tasks;
	using Microsoft.AspNetCore.Mvc;
	using Project.Models;
	using Project.Repositories;

	/// <summary>
	/// Handles CRUD for Transformations.
	/// </summary>
	[ApiController]
	[Route("api/[controller]")]
	public class TransformationsController : Controller
	{
		private readonly TransformationsRepository _transformationsRepository;

		/// <summary>
		/// Initializes a new instance of the <see cref="TransformationsController"/> class.
		/// </summary>
		/// <param name="transformationsRepository">Injected TransformationsRepository.</param>
		public TransformationsController(TransformationsRepository transformationsRepository)
		{
			this._transformationsRepository = transformationsRepository;
		}

		/// <summary>
		/// Gets all Transformations.
		/// </summary>
		/// <returns>Array of all Transformations.</returns>
		[HttpGet]
		public async Task<ActionResult<List<TransformationModel>>> Index()
		{
			return await this._transformationsRepository.SelectAll();
		}

		/// <summary>
		/// Creates a new Transformation.
		/// </summary>
		/// <returns>Created Transformation.</returns>
		[HttpPost]
		public async Task<TransformationModel> Create()
		{
			return await this._transformationsRepository.Create(new TransformationModel
			{
				TransformationId = new Random().Next(1000),
			});
		}

		/// <summary>
		/// Gets all Transformations.
		/// </summary>
		/// <param name="id"><see cref="TransformationModel#Id"/>.</param>
		/// <returns>Array of all Transformations.</returns>
		[HttpGet("{id}")]
		public async Task<ActionResult<TransformationModel>> Get(int id)
		{
			return await this._transformationsRepository.Get(id);
		}
	}
}

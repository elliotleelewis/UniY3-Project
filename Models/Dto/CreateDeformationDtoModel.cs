// <copyright file="CreateDeformationDtoModel.cs" company="Elliot Lewis">
// Copyright (c) Elliot Lewis. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
namespace Project.Models.Dto
{
	using System.ComponentModel.DataAnnotations;

	/// <summary>
	/// DTO model for the CreateDeformation action.
	/// </summary>
	public class CreateDeformationDtoModel
	{
		/// <summary>
		/// Gets or sets Name.
		/// </summary>
		/// <value>The name of the deformation.</value>
		[Required]
		public string Name { get; set; }

		/// <summary>
		/// Gets or sets Data.
		/// </summary>
		/// <value>The deformation's data.</value>
		[Required]
		public float[] Data { get; set; }
	}
}

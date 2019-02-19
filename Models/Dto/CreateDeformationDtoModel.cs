// <copyright file="CreateDeformationDtoModel.cs" company="Elliot Lewis">
// Copyright (c) Elliot Lewis. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
namespace Project.Models.Dto
{
	using System.ComponentModel.DataAnnotations;

	public class CreateDeformationDtoModel
	{
		[Required]
		public string Name { get; set; }

		[Required]
		public float[] Data { get; set; }
	}
}

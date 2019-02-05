// <copyright file="LoginRegisterDtoModel.cs" company="Elliot Lewis">
// Copyright (c) Elliot Lewis. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
namespace Project.Models.Dto
{
	using System.ComponentModel.DataAnnotations;

	public class LoginRegisterDtoModel
	{
		[Required]
		public string Email { get; set; }

		[Required]
		public string Password { get; set; }
	}
}

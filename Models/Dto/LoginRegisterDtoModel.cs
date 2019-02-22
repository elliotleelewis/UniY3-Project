// <copyright file="LoginRegisterDtoModel.cs" company="Elliot Lewis">
// Copyright (c) Elliot Lewis. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
namespace Project.Models.Dto
{
	using System.ComponentModel.DataAnnotations;

	/// <summary>
	/// DTO model for the Login/Register actions.
	/// </summary>
	public class LoginRegisterDtoModel
	{
		/// <summary>
		/// Gets or sets Email.
		/// </summary>
		/// <value>Login/Register email.</value>
		[Required]
		public string Email { get; set; }

		/// <summary>
		/// Gets or sets Password.
		/// </summary>
		/// <value>Login/Register password.</value>
		[Required]
		public string Password { get; set; }
	}
}

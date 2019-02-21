// <copyright file="Error.cshtml.cs" company="Elliot Lewis">
// Copyright (c) Elliot Lewis. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
namespace Project.Pages
{
	using System.Diagnostics;
	using Microsoft.AspNetCore.Mvc;
	using Microsoft.AspNetCore.Mvc.RazorPages;

	/// <inheritdoc />
	/// <summary>
	/// Error page.
	/// </summary>
	[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
	public abstract class ErrorModel : PageModel
	{
		/// <summary>
		/// Gets or sets RequestId.
		/// </summary>
		/// <value>RequestId.</value>
		public string RequestId { get; set; }

		/// <summary>
		/// Gets a value indicating whether the RequestId should be shown.
		/// </summary>
		/// <value>RequestId should be shown.</value>
		public bool ShowRequestId => !string.IsNullOrEmpty(this.RequestId);

		/// <summary>
		/// Method run when page is requested.
		/// </summary>
		public void OnGet()
		{
			this.RequestId = Activity.Current?.Id ?? this.HttpContext.TraceIdentifier;
		}
	}
}

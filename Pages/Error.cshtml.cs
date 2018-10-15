// <copyright file="Error.cshtml.cs" company="Elliot Lewis">
// Copyright (c) Elliot Lewis. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
namespace Project.Pages
{
	using System.Diagnostics;
	using Microsoft.AspNetCore.Mvc;
	using Microsoft.AspNetCore.Mvc.RazorPages;

	[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
	public class ErrorModel : PageModel
	{
		public string RequestId { get; set; }

		public bool ShowRequestId => !string.IsNullOrEmpty(this.RequestId);

		public void OnGet()
		{
			this.RequestId = Activity.Current?.Id ?? this.HttpContext.TraceIdentifier;
		}
	}
}

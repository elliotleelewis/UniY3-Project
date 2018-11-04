// <copyright file="Program.cs" company="Elliot Lewis">
// Copyright (c) Elliot Lewis. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
namespace Project
{
	using Microsoft.AspNetCore;
	using Microsoft.AspNetCore.Hosting;

	/// <summary>
	/// Entry point for Application, contains Main method.
	/// </summary>
	public static class Program
	{
		/// <summary>
		/// Main method, runs when Application is launched.
		/// </summary>
		/// <param name="args">Program Args.</param>
		public static void Main(string[] args)
		{
			CreateWebHostBuilder(args).Build().Run();
		}

		private static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
			WebHost.CreateDefaultBuilder(args)
				.UseStartup<Startup>();
	}
}

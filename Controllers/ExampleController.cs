// <copyright file="SampleController.cs" company="Elliot Lewis">
// Copyright (c) Elliot Lewis. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
namespace Project.Controllers
{
	using System;
	using System.Collections.Generic;
	using System.Globalization;
	using System.Linq;
	using Microsoft.AspNetCore.Mvc;

	[Route("api/[controller]")]
	public class ExampleController : Controller
	{
		private static readonly string[] Summaries = new[]
		{
			"Freezing",
			"Bracing",
			"Chilly",
			"Cool",
			"Mild",
			"Warm",
			"Balmy",
			"Hot",
			"Sweltering",
			"Scorching",
		};

		[HttpGet("[action]")]
		public IEnumerable<WeatherForecast> Forecasts()
		{
			var rng = new Random();
			return Enumerable.Range(1, 5).Select((index) => new WeatherForecast
			{
				DateFormatted = DateTime.Now.AddDays(index).ToString("d", new CultureInfo("en")),
				TemperatureC = rng.Next(-20, 55),
				Summary = Summaries[rng.Next(Summaries.Length)],
			});
		}

		public class WeatherForecast
		{
			public string DateFormatted { get; set; }

			public int TemperatureC { get; set; }

			public int TemperatureF => 32 + (int)(this.TemperatureC / 0.5556);

			public string Summary { get; set; }
		}
	}
}

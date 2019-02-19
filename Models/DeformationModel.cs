// <copyright file="DeformationModel.cs" company="Elliot Lewis">
// Copyright (c) Elliot Lewis. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
namespace Project.Models
{
	using System;
	using MongoDB.Bson;

	public class DeformationModel
	{
		public ObjectId Id { get; set; }

		public string Name { get; set; }

		public float[] Data { get; set; }

		public long Views { get; set; }

		public ApplicationUserModel CreatedBy { get; set; }

		public DateTime CreatedAt { get; set; }
	}
}

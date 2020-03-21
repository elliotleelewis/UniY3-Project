// <copyright file="DeformationModel.cs" company="Elliot Lewis">
// Copyright (c) Elliot Lewis. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
namespace Project.Models
{
	using System;
	using MongoDB.Bson;
	using MongoDB.Bson.Serialization.Attributes;

	/// <summary>
	/// Deformation model.
	/// </summary>
	public class DeformationModel
	{
		/// <summary>
		/// Gets or sets Id.
		/// </summary>
		/// <value>The MongoDB Id.</value>
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }

		/// <summary>
		/// Gets or sets Name.
		/// </summary>
		/// <value>The name of the deformation.</value>
		public string Name { get; set; }

		/// <summary>
		/// Gets or sets Data.
		/// </summary>
		/// <value>The deformation's data.</value>
		public float[] Data { get; set; }

		/// <summary>
		/// Gets or sets Views.
		/// </summary>
		/// <value>The view count for the deformation.</value>
		public long Views { get; set; }

		/// <summary>
		/// Gets or sets CreatedBy.
		/// </summary>
		/// <value>The User who created the deformation.</value>
		public ApplicationUserModel CreatedBy { get; set; }

		/// <summary>
		/// Gets or sets CreatedAt.
		/// </summary>
		/// <value>The date/time that the deformation was created at.</value>
		public DateTime CreatedAt { get; set; }
	}
}

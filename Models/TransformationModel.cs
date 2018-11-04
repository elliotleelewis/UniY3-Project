// <copyright file="TransformationModel.cs" company="Elliot Lewis">
// Copyright (c) Elliot Lewis. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
namespace Project.Models
{
	using MongoDB.Bson;
	using MongoDB.Bson.Serialization.Attributes;

	public class TransformationModel
	{
		public ObjectId Id { get; set; }

		[BsonElement("TransformationId")]
		public int TransformationId { get; set; }
	}
}

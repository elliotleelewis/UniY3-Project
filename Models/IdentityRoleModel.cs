// <copyright file="IdentityRoleModel.cs" company="Elliot Lewis">
// Copyright (c) Elliot Lewis. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
namespace Project.Models
{
	using AspNetCore.Identity.MongoDbCore.Models;
	using MongoDB.Bson;

	/// <inheritdoc />
	/// <summary>
	/// Role model.
	/// </summary>
	public class IdentityRoleModel : MongoIdentityRole<ObjectId>
	{
	}
}

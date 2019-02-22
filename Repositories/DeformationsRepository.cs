// <copyright file="DeformationsRepository.cs" company="Elliot Lewis">
// Copyright (c) Elliot Lewis. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
namespace Project.Repositories
{
	using System.Collections.Generic;
	using System.Threading.Tasks;
	using Microsoft.Extensions.Configuration;
	using MongoDB.Bson;
	using MongoDB.Driver;
	using Project.Models;

	/// <summary>
	/// MongoDB repository for Deformations.
	/// </summary>
	public class DeformationsRepository
	{
		private readonly IMongoCollection<DeformationModel> _collection;

		/// <summary>
		/// Initializes a new instance of the <see cref="DeformationsRepository"/> class.
		/// </summary>
		/// <param name="configuration">Web App configuration.</param>
		public DeformationsRepository(IConfiguration configuration)
		{
			IMongoClient client = new MongoClient(configuration["MongoDB:ConnectionString"]);
			var database = client.GetDatabase(configuration["MongoDB:Database"]);
			this._collection = database.GetCollection<DeformationModel>("deformations");
		}

		/// <summary>
		/// Gets all deformations.
		/// </summary>
		/// <param name="limit">Number of results to limit to.</param>
		/// <param name="skip">Number of results to skip.</param>
		/// <returns>List of deformations.</returns>
		public async Task<List<DeformationModel>> GetAll(int? limit = null, int? skip = null)
		{
			var query = await this._collection.FindAsync(new BsonDocument(), new FindOptions<DeformationModel>
			{
				Sort = Builders<DeformationModel>.Sort.Descending("Views"),
				Limit = limit,
				Skip = skip,
			});
			return await query.ToListAsync();
		}

		/// <summary>
		/// Gets a specific deformation.
		/// </summary>
		/// <param name="id"><see cref="DeformationModel"/> Id.</param>
		/// <returns>Specific deformation.</returns>
		public async Task<DeformationModel> Get(string id)
		{
			return await this._collection.FindOneAndUpdateAsync(
				(t) => t.Id.Equals(ObjectId.Parse(id)),
				Builders<DeformationModel>.Update.Inc("Views", 1));
		}

		/// <summary>
		/// Creates a deformation.
		/// </summary>
		/// <param name="deformationModel">Deformation to create.</param>
		/// <returns>Created deformation.</returns>
		public async Task<DeformationModel> Create(DeformationModel deformationModel)
		{
			await this._collection.InsertOneAsync(deformationModel);
			return deformationModel;
		}

		/// <summary>
		/// Gets all deformations created by a specific user.
		/// </summary>
		/// <param name="user">User to query for.</param>
		/// <returns>List of deformations.</returns>
		public async Task<List<DeformationModel>> GetByUser(ApplicationUserModel user)
		{
			var query = await this._collection.FindAsync(
				new BsonDocument("CreatedBy.Email", user.Email),
				new FindOptions<DeformationModel>
			{
				Sort = Builders<DeformationModel>.Sort.Descending("Views"),
			});
			return await query.ToListAsync();
		}
	}
}

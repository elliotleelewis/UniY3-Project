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

	public class DeformationsRepository
	{
		private readonly IMongoCollection<DeformationModel> _collection;

		public DeformationsRepository(IConfiguration configuration)
		{
			IMongoClient client = new MongoClient(configuration["MongoDB:ConnectionString"]);
			var database = client.GetDatabase(configuration["MongoDB:Database"]);
			this._collection = database.GetCollection<DeformationModel>("deformations");
		}

		public async Task<List<DeformationModel>> SelectAll(int? limit = null, int? skip = null)
		{
			var query = await this._collection.FindAsync(new BsonDocument(), new FindOptions<DeformationModel>
			{
				Sort = Builders<DeformationModel>.Sort.Descending("Views"),
				Limit = limit,
				Skip = skip,
			});
			return await query.ToListAsync();
		}

		public async Task<DeformationModel> Get(string id)
		{
			return await this._collection.FindOneAndUpdateAsync(
				(t) => t.Id.Equals(ObjectId.Parse(id)),
				Builders<DeformationModel>.Update.Inc("Views", 1));
		}

		public async Task<DeformationModel> Create(DeformationModel deformationModel)
		{
			await this._collection.InsertOneAsync(deformationModel);
			return deformationModel;
		}

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

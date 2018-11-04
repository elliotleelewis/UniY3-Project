// <copyright file="TransformationsRepository.cs" company="Elliot Lewis">
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

	public class TransformationsRepository
	{
		private readonly IMongoCollection<TransformationModel> collection;

		public TransformationsRepository(IConfiguration configuration)
		{
			IMongoClient client = new MongoClient(configuration["MongoDB:ConnectionString"]);
			var database = client.GetDatabase(configuration["MongoDB:Database"]);
			this.collection = database.GetCollection<TransformationModel>("transformations");
		}

		public async Task<List<TransformationModel>> SelectAll()
		{
			var query = await this.collection.FindAsync(new BsonDocument());
			return await query.ToListAsync();
		}

		public async Task<TransformationModel> Get(int id)
		{
			var query = await this.collection.FindAsync((t) => t.TransformationId == id);
			return await query.FirstAsync();
		}

		public async Task<TransformationModel> Create(TransformationModel transformationModel)
		{
			await this.collection.InsertOneAsync(transformationModel);
			return transformationModel;
		}
	}
}

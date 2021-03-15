const db = require('./../services/db');
const mongo_db = require('../services/mongo_db');

class Users {
	constructor() {
		//this.db = db;
		this.db = mongo_db.getDb();
		//console.log(this.db);
	}

	async add_user(param) {
		console.log('add_user start');
		let is_exist = await this.check_user_exists(param.email);
		let response = {
			"status": "error"
		};
		if(is_exist) {
			response['message'] = "Email already exists."
			return response;
		}

		let result = await this.insert_user(param);
		if(result) {
			response['status'] = "success";
			response['message'] = "User registered successfully."
			
		} else {
			response['message'] = "Error in User registered."
		}
		return response;
		
	}

	hash_password(passwword) {
		
	}

	async insert_user(data) {
		let result = await this.db.collection("users").insertOne(data);
		//console.log(result);
		return result.insertedId;
	}

	async check_user_exists(email) {
		let cursor = this.db.collection('users').find({email: email});
		let result = await cursor.toArray();
		if (result) {
			//console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
			console.log(result);
			if(result.length > 0) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
			//console.log(`No listings found with the name`);
		}

	}

	async list_user() {
		//console.log(this.db);
		this.db.collection('users').find().toArray(function (err, result) {
			if (err) throw err
	
			console.log(result)
		})
		// let _db = new db();
		// let dd = _db.connect();
		// console.log(_db);
		// console.log(dd);
		// console.log(database);
		// dd.collection('users').find({name:"asdaaaas"}).toArray(function (err, result) {
		// 	if (err) throw err
	
		// 	console.log(result)
		// })


		// const cursor = this.db.collection("users").find(
		// 	{}
		// 	);
		// const results = await cursor.toArray();
		// console.log(results);
	}
}

module.exports = Users;
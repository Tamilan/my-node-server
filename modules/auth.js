const jwt = require('jsonwebtoken')
const enc = require('../modules/encryption');
const Redis = require('ioredis');
const User = require('../model/user');

class Auth {
	constructor() {
		//this.user=1;
	}

	//async login = (param) => {
	async login(param) {
		//console.log(param);
		var AWS = require('aws-sdk');
		let s3  = new AWS.S3({
			accessKeyId: param.access_key,
			secretAccessKey: param.secret_key,
			endpoint: 'https://192.168.77.32:9001' ,
			s3ForcePathStyle: true, // needed with minio?
			signatureVersion: 'v4',
			//s3DisableBodySigning: false
		});
		process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

		//console.log('456');
		let response = {
			"status": "error"
		};
		try {
			
			let data = await s3.listBuckets().promise();
			response['data'] = data;
			response['status'] = 'success';
			//console.log(rrr);
		} catch(e) {
			console.log(e);
			response['message'] = e.message;
		}
		return response;
		

		// s3.listBuckets(function(err, data) {
		// 	let response = {
		// 		"status": "error"
		// 	};
		// 	if (err) {
		// 		response['message'] = err.message;
		// 	} else {
		// 		console.log(data);
		// 		response['message'] = 'Success';
		// 	}
		// 	//cb(response);
		// 	console.log('before return');
		// 	return response;
		// });
		//console.log(rrr);

		
	}

	generate_token(payload) {
		return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' })
	}

	generate_refresh_token(payload) {
		return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET)
	}

	regenrate_token(refresh_token, cb) {
		jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
			if (err) {
				console.log(err);
				return cb(err);
			}

			var user_data = await User.findOne({ _id : user.token });

			if(!user_data) {
				return cb('invalid_user', {})
			}

			let payload = { 
				token: user.token,
				createdon: new Date().getTime()
			}

			const _access_token = this.generate_token(payload);
			const _refresh_token = this.generate_refresh_token(payload);

			const redis = new Redis({
				port: process.env.REDIS_PORT, // Redis port
				host: process.env.REDIS_HOST, // Redis host
			});
			// console.log(payload);
			// console.log(_access_token);
			//return _access_token;

			redis.sadd("refresh_tokens", _refresh_token);

			let rem = await redis.srem("refresh_tokens", refresh_token)
			console.log(rem);
			//redis.lrem("refresh_tokens", 1,"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImE1ZmNhZmZlN2RmMWQ5NTAyNGNkOGMyMTQ3M2VkM2MyLmQ5ZjgxMmM2ZjQyMGFjMzM0YTNmZjEwODk0YWQ1MzczIiwiY3JlYXRlZG9uIjoxNjE1MzgwODE4OTEzLCJpYXQiOjE2MTUzODA4MTh9.bfNgiKNZYGYfbksCLWwVaD66uQmiz79OH3ZIOYsKa_Q");
			// redis.set("foo", (err) => {
			// 	err instanceof Redis.ReplyError;
			// 	console.log(err);
			// });
			return cb(null, {access_token: _access_token, refresh_token: _refresh_token})
			//res.json({ accessToken: accessToken })
		})
	}

	authenticate_user_token(req, res, next) {
		const authHeader = req.headers['authorization']
		const token = authHeader && authHeader.split(' ')[1]
		if (token == null) return res.sendStatus(401)
		//console.log(token);
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
			console.log(err)
			if (err) return res.status(401).json({
				"status": "invalid_token",
				"message": err.message
			})
			//console.log(user);

			var user_data = await User.findOne({ _id : user.token });

			//if(user_data_  );

			if(!user_data || user_data.length==0) {
				return res.status(401).json({
					"status": "invalid_token",
					"message": "Invalid user"
				});
			}

			user_data['access_key'] = 'minioadmin';
			user_data['secret_key'] = 'minioadmin';
			//console.log(user_data);
			// let user_data = {
			// 	access_key: access_data[0],
			// 	secret_key: access_data[1],
			// }
			
			// console.log('sa');
			// console.log(process.env.access_key);

			// //config['access_key'] = access_data[0];
			// process.env.access_key = access_data[0];
			// process.env.access_key = access_data[0];
			// console.log(process.env.access_key);
			//console.log(user_data);
			req.user = user_data
			next()
		})
	}

	authenticate_token(req, res, next) {
		const authHeader = req.headers['authorization']
		const token = authHeader && authHeader.split(' ')[1]
		if (token == null) return res.sendStatus(401)
		console.log(token);
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
			console.log(err)
			if (err) return res.status(401).json({
				"status": "invalid_token",
				"message": err.message
			})
			//console.log(user);
			let dec_token = enc.decrypt(user.token);
			let access_data = dec_token.split(':');
			let user_data = {
				access_key: access_data[0],
				secret_key: access_data[1],
			}
			
			// console.log('sa');
			// console.log(process.env.access_key);

			// //config['access_key'] = access_data[0];
			// process.env.access_key = access_data[0];
			// process.env.access_key = access_data[0];
			// console.log(process.env.access_key);
			//console.log(user_data);
			req.user = user_data
			next()
		})
	}

}

module.exports = Auth;
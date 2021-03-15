const express = require('express');
const enc = require('../modules/encryption');
const Auth = require('../modules/auth');
const Redis = require('ioredis');
//const db = require('./../services/db');
const users = require('./../modules/users');

const User = require('../model/user'); 


var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.send('Hi from express...');
});

router.post('/signup', async function(req, res, next) {
	console.log(req.body);
	let params = req.body.params

	let response = {
		"status": "error",
		"message" : "Invalid request"
	};


	let newUser = new User(); 

    // Initialize newUser object with request data 
    newUser.name = params.name, 

    newUser.email = params.email,

    newUser.password = params.password

	newUser.gender = params.gender

	// Call setPassword function to hash password 
	newUser.setPassword(params.password);


	let user_data = await newUser.email_exists(params.email);
	if(user_data.length > 0) {
		return res.status(400).send({ 
			message : "Duplicate email."
		});
	} else {
		newUser.save((err, User) => { 
			if (err) { 
				console.log(err);
				return res.status(400).send({ 
					message : "Failed to add user."
				}); 
			} 
			else { 
				return res.status(201).send({ 
					message : "User added successfully."
				}); 
			} 
		}); 
	}
	// console.log(user_data);
	// console.log('exists');


	// // let exist = await newUser.email_exists(params.email, function(err, data) {
	// // 	if(err) console.log(err);
	// // 	if(data.length > 0) {
	// // 		return res.status(400).send({ 
    // //             message : "Duplicate email."
    // //         });
	// // 		return false;
	// // 	}
	// // 	console.log(data);
	// // });

	// console.log(exist);
	// console.log('eee');
    // Save newUser object to database 
    // newUser.save((err, User) => { 
    //     if (err) { 
	// 		console.log(err);
    //         return res.status(400).send({ 
    //             message : "Failed to add user."
    //         }); 
    //     } 
    //     else { 
    //         return res.status(201).send({ 
    //             message : "User added successfully."
    //         }); 
    //     } 
    // }); 

	// if(req.body.params!=undefined) {
	// 	let data = req.body.params;
	// 	let user = new users();
	// 	response = await user.add_user(data);
	// 	console.log('111');
	// }
	//res.send(response);
});

router.post('/auth', async function(req, res, next) {
	console.log(req.body);
	let response = {};

	if (req.body.email && req.body.password) {

		// Find user with requested email 
		let user = await User.findOne({ email : req.body.email });

		//console.log(user.user_data());

		//User.findOne({ email : req.body.email }, function(err, user) { 
		if (user === null) { 
			return res.status(400).send({ 
				message : "User not found."
			}); 
		} else { 
			if (user.validPassword(req.body.password)) {
				console.log(user);
				var auth = new Auth();
				// 	let tkn = req.body.access_key+':'+req.body.secret_key;
				let payload = {
					token: user._id,
					createdon: new Date().getTime()
				};
				let access_token = auth.generate_token(payload);
				let refresh_token = auth.generate_refresh_token(payload);

				response['status'] = 'success';
				response['data'] = {
					"access_token": access_token,
					"refresh_token": refresh_token,
					"authenticated": true,
					"data": user.user_data()
				}

				const redis = new Redis({
					port: process.env.REDIS_PORT, // Redis port
					host: process.env.REDIS_HOST, // Redis host
				});
				redis.sadd("refresh_tokens", refresh_token);
			


				return res.status(201).send(response);
			} else { 
				return res.status(400).send({ 
					message : "Wrong Password"
				}); 
			} 
		} 
		//}); 

		// var auth = new Auth();
		// let login_response = null;
		// login_response = await auth.login(req.body);

		// console.log('after call');

		// if(login_response['status']=='success') {

		// 	let tkn = req.body.access_key+':'+req.body.secret_key;
		// 	let payload = {
        //         token: enc.encrypt(tkn),
		// 		createdon: new Date().getTime()
        //     };
		// 	let access_token = auth.generate_token(payload);
		// 	let refresh_token = auth.generate_refresh_token(payload);

		// 	response['status'] = 'success';
		// 	response['data'] = {
		// 		"access_token": access_token,
		// 		"refresh_token": refresh_token,
		// 		"authenticated": true
		// 	}

		// 	const redis = new Redis({
		// 		port: process.env.REDIS_PORT, // Redis port
		// 		host: process.env.REDIS_HOST, // Redis host
		// 	});
		// 	redis.sadd("refresh_tokens", refresh_token);
		// } else {
		// 	response = login_response;
		// }
		// res.json(response);
    } else {
        res.sendStatus(401);
    }

	// if (req.body.access_key && req.body.secret_key) {

	// 	var auth = new Auth();
	// 	let login_response = null;
	// 	login_response = await auth.login(req.body);

	// 	console.log('after call');

	// 	if(login_response['status']=='success') {

	// 		let tkn = req.body.access_key+':'+req.body.secret_key;
	// 		let payload = {
    //             token: enc.encrypt(tkn),
	// 			createdon: new Date().getTime()
    //         };
	// 		let access_token = auth.generate_token(payload);
	// 		let refresh_token = auth.generate_refresh_token(payload);

	// 		response['status'] = 'success';
	// 		response['data'] = {
	// 			"access_token": access_token,
	// 			"refresh_token": refresh_token,
	// 			"authenticated": true
	// 		}

	// 		const redis = new Redis({
	// 			port: process.env.REDIS_PORT, // Redis port
	// 			host: process.env.REDIS_HOST, // Redis host
	// 		});
	// 		redis.sadd("refresh_tokens", refresh_token);
	// 	} else {
	// 		response = login_response;
	// 	}
	// 	res.json(response);
    // } else {
    //     res.sendStatus(401);
    // }
	
});

router.post('/auth/token', async function(req, res, next) {
	console.log(req.body);
	let response = {};
	const refresh_token = req.body.refresh_token
	if (refresh_token == null) return res.sendStatus(401)

	const redis = new Redis({
		port: process.env.REDIS_PORT, // Redis port
		host: process.env.REDIS_HOST, // Redis host
	});
	let exists = await redis.sismember("refresh_tokens", refresh_token)
	if(!exists) return res.sendStatus(401)
	// if (!refresh_tokens.includes(refresh_token)) 
	var auth = new Auth();
	auth.regenrate_token(refresh_token, (err, data) => {
		if(err) return res.sendStatus(401)
		console.log(data);
		res.status(201).json(data);
	});

});

module.exports = router;

const express = require('express');
const enc = require('../modules/encryption');
const Auth = require('../modules/auth');
const Redis = require('ioredis');
//var db = require('./../db/db');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.send('Hi from express...');
});

router.post('/signup', function(req, res, next) {
	console.log(req.body);
	let response = {
		"message" : "Invalid request"
	};
	if(req.body.params!=undefined) {
		response = req.body.params;
	}
	res.send(response);
});

router.post('/auth', async function(req, res, next) {
	console.log(req.body);
	let response = {};

	if (req.body.access_key && req.body.secret_key) {

		var auth = new Auth();
		let login_response = null;
		login_response = await auth.login(req.body);

		console.log('after call');

		if(login_response['status']=='success') {

			let tkn = req.body.access_key+':'+req.body.secret_key;
			let payload = {
                token: enc.encrypt(tkn),
				createdon: new Date().getTime()
            };
			let access_token = auth.generate_token(payload);
			let refresh_token = auth.generate_refresh_token(payload);

			response['status'] = 'success';
			response['data'] = {
				"access_token": access_token,
				"refresh_token": refresh_token,
				"authenticated": true
			}

			const redis = new Redis({
				port: process.env.REDIS_PORT, // Redis port
				host: process.env.REDIS_HOST, // Redis host
			});
			redis.sadd("refresh_tokens", refresh_token);
		} else {
			response = login_response;
		}
		res.json(response);
    } else {
        res.sendStatus(401);
    }
	
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

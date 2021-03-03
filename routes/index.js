var express = require('express');
//const { response } = require('../../../../../Users/Fonicomindia4/Desktop/node/myapp/app');
var router = express.Router();

//var db = require('./../db/db');


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

router.post('/auth', function(req, res, next) {
	console.log(req.body);
	let response = {};
	if(req.body.params!=undefined) {
		response.id = 1;
		response.email = req.body.params.user.email;
		response.name = "Tamil";
		response.role = "Admin";
		response.token = "12345678";
	} else {
		response = {
			"message" : "Invalid request"
		};
	}
	res.send(response);
});

module.exports = router;

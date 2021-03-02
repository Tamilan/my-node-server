var express = require('express');
var router = express.Router();

var {AWSS3} = require('../modules/s3');

const s3 = new AWSS3();

router.get('/add-bucket', function(req, res, next) {

	//let s3 = new AWSS3();
	//console.log(s3);
	
	s3.add_bucket({'name': "tamilan1"}, function(data) {
		console.log(data);
		res.send(data);
	});
	//res.render('index', { title: 'Express' });
	//console.log('res');
	
});

router.get('/buckets', function(req, res, next) {

	s3.list_buckets({}, function(data) {
		console.log(data);
		res.send(data);
	});
	
});

router.delete('/bucket', function(req, res, next) {
	console.log(req.query);
	if(req.query.name!=undefined) {
		s3.delete_bucket(req.query.name, function(data) {
			console.log(data);
			res.send(data);
		});
	}
	//console.log(13);
	// s3.list_buckets({}, function(data) {
	// 	console.log(data);
	// 	res.send(data);
	// });
	
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

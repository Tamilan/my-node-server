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

router.post('/bucket', function(req, res, next) {
	console.log(req.body);
	if(req.body.params!=undefined) {
		s3.add_bucket(req.body.params, function(data) {
			console.log(data);
			res.send(data);
		});
	}
});

router.get('/:bucket/objects', function(req, res, next) {
	console.log(req.params);

	let bucket = req.params.bucket;
	s3.list_objects(bucket, function(data) {
		console.log(data);
		res.send(data);
	});
	
});

router.delete('/object', function(req, res, next) {
	console.log(req.query);

	if(req.query.bucket!=undefined) {
		s3.delete_object(req.query, function(data) {
			console.log(data);
			res.send(data);
		});
	}
	
});


module.exports = router;

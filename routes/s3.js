var express = require('express');
var multer  = require('multer');
var path = require('path');
var router = express.Router();

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, 'C:\\Tamil data\\dev\\node\\my-node-server\\uploads')
	},
	filename: function (req, file, cb) {
		//cb(null, file.fieldname + '-' + Date.now())
		cb(null, file.originalname)
	}
})

var upload = multer({ 
	storage: storage
})

var {AWSS3} = require('../modules/s3');

//const s3 = new AWSS3();

router.get('/add-bucket', function(req, res, next) {

	//let s3 = new AWSS3();
	//console.log(s3);
	const s3 = new AWSS3(req.user);
	s3.add_bucket({'name': "tamilan1"}, function(data) {
		console.log(data);
		res.send(data);
	});
	//res.render('index', { title: 'Express' });
	//console.log('res');
	
});

router.get('/buckets', function(req, res, next) {

	const s3 = new AWSS3(req.user);

	s3.list_buckets({}, function(data) {
		console.log(data);
		res.send(data);
	});
	
});

router.delete('/bucket', function(req, res, next) {
	const s3 = new AWSS3(req.user);
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
	const s3 = new AWSS3(req.user);
	console.log(req.body);
	if(req.body.params!=undefined) {
		s3.add_bucket(req.body.params, function(data) {
			console.log(data);
			res.send(data);
		});
	}
});

router.get('/:bucket/objects', function(req, res, next) {
	const s3 = new AWSS3(req.user);
	console.log(req.params);

	let bucket = req.params.bucket;
	s3.list_objects(bucket, function(data) {
		console.log(data);
		res.send(data);
	});
	
});

router.delete('/object', function(req, res, next) {
	const s3 = new AWSS3(req.user);
	console.log(req.query);

	if(req.query.bucket!=undefined) {
		s3.delete_object(req.query, function(data) {
			console.log(data);
			res.send(data);
		});
	}
	
});

var _fileupload = upload.single('object');

router.post('/createobject', function(req, res, next) {
	const s3 = new AWSS3(req.user);
	_fileupload(req, res, function (err) {
		let response = {
			"status" : "error" 
		};
		if (err instanceof multer.MulterError) {
			response['message'] = 'File upload error.';
			response['err'] = err;
			res.send(response);
		} else if (err) {
			err['fname'] = '';
			if(!("typ" in err)) {
				err['err'] = 'File upload error.';
			}
			delete err.typ;
			res.json(err)
		} else {
			//console.log(req.body);
			// let _path = req.body.path+req.file.originalname;
			// _path = path.normalize(_path);
			
			s3.add_object({
				filepath: req.file.path,
				bucket: req.body.bucket,
				//path: _path,
				name: req.file.originalname

			}, function(data) {
				console.log(data);
				res.send(data);
			});
		}
		
		// console.log(req.file);
		// res.send({'err':'', 'fpath': req.file.path});
	})
	console.log(req.file);
	console.log(req.body);

	// if(req.query.bucket!=undefined) {
	// 	s3.delete_object(req.query, function(data) {
	// 		console.log(data);
	// 		res.send(data);
	// 	});
	// }
	//res.send('res');
});

router.get('/policies', async function(req, res) {
	//console.log(req.body)
	
	var mc = require('../modules/mc_admin');

	//console.log(mc);

	let result = await mc.list_policy();
	//let s3 = new AWSS3();
	//console.log(s3);
	// const s3 = new AWSS3(req.user);
	// s3.add_bucket({'name': "tamilan1"}, function(data) {
	// 	console.log(data);
	// 	res.send(data);
	// });
	res.send(result);
	//console.log('res');
	
});



router.post('/policy', async function(req, res) {
	console.log(req.body)
	//return res.send('123');
	var mc = require('../modules/mc_admin');

	console.log(mc);

	let result = await mc.add_policy(req.body);
	//let s3 = new AWSS3();
	//console.log(s3);
	// const s3 = new AWSS3(req.user);
	// s3.add_bucket({'name': "tamilan1"}, function(data) {
	// 	console.log(data);
	// 	res.send(data);
	// });
	res.send(result);
	//console.log('res');
});


router.get('/policy/:policy_name', async function(req, res) {
	console.log(req.params);
	
	var mc = require('../modules/mc_admin');

	console.log(mc);

	let result = await mc.get_policy(req.params.policy_name);

	res.send(result);
	//console.log('res');
});

module.exports = router;

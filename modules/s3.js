var AWS = require('aws-sdk');
const fs = require('fs');
var config = require('../config/data');

class AWSS3 {
	constructor(user) {
		
		process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

		this.s3  = new AWS.S3({
			accessKeyId: user.access_key,
			secretAccessKey: user.secret_key,
			endpoint: 'https://192.168.77.32:9001' ,
			s3ForcePathStyle: true, // needed with minio?
			signatureVersion: 'v4',
			//s3DisableBodySigning: false
  		});
		// console.log(11);
		// console.log(process.env.access_key);
		// console.log(22);
	}

	// init(param) {
	// 	console.log(11);
	// 	console.log(process.env.access_key);
	// 	console.log(22);
	// 	this.s3  = new AWS.S3({
	// 		accessKeyId: 'minioadmin' ,
	// 		secretAccessKey: 'minioadmin' ,
	// 		endpoint: 'https://192.168.77.32:9001' ,
	// 		s3ForcePathStyle: true, // needed with minio?
	// 		signatureVersion: 'v4',
	// 		//s3DisableBodySigning: false
  	// 	});
	// }

	add_bucket(param, cb) {
		var params = {
			Bucket: param.bucket
		};
		console.log(params);
		this.s3.createBucket(params, function(err, data) {
			let response = {
				"status": "error"
			};
			if (err) {
				console.log(err, err.stack); // an error occurred
				response['message'] = err.message;
			} else {
				response['status'] = 'success';
				response['message'] = 'Bucket added.';
				response['data'] = data;
			}
			cb(response);
		});
	}

	list_buckets(param, cb) {
		//this.init();
		this.s3.listBuckets(function(err, data) {
			// if (err) console.log(err, err.stack); // an error occurred
			// else     console.log(data);           // successful response
			let response = {
				"status": "error"
			};
			if (err) {
				console.log(err, err.stack); // an error occurred
				response['message'] = err.message;
			} else {
				response['status'] = 'success';
				//response['message'] = 'Bucket added.';
				response['data'] = data;
			}
			cb(response);
		});
	}

	delete_bucket(name, cb) {
		var params = {
			Bucket: name
		};
		this.s3.deleteBucket(params, function(err, data) {
			let response = {
				"status": "error"
			};
			if (err) {
				console.log(err, err.stack); // an error occurred
				response['message'] = err.message;
			} else {
				response['status'] = 'success';
				response['message'] = 'Bucket deleted.';
				response['data'] = data;
			}
			cb(response);
		});
	}

	// add_bucket(param, cb) {
	// 	var params = {
	// 		Bucket: param.bucket
	// 	};

		
	// 	// this.s3.waitFor('bucketExists', params, function(err, data) {
	// 	// 	if (err) console.log(err, err.stack); // an error occurred
	// 	// 	else     console.log(data);           // successful response
	// 	// 	console.log('waitfor');
	// 	// });


	// 	this.s3.createBucket(params, function(err, data) {
	// 		let response = {
	// 			"status": "error"
	// 		};
	// 		if (err) {
	// 			console.log(err, err.stack); // an error occurred
				
	// 			response['message'] = 'Error in create bucket.';

	// 			if(err.code=='BucketAlreadyOwnedByYou') {
	// 				response['message'] = 'Bucket already exists.';
	// 			}
	// 		} else {
	// 			response['status'] = 'success';
	// 			response['message'] = 'Bucket created.';
	// 			response['data'] = data;
	// 		}
	// 		console.log(12);
	// 		cb(response);
	// 	});
	// }

	list_objects(bucket, cb) {
		var params = {
			Bucket: bucket,
			MaxKeys: 1000
		};
		this.s3.listObjects(params, function(err, data) {
			// if (err) console.log(err, err.stack); // an error occurred
			// else     console.log(data);           // successful response
			let response = {
				"status": "error"
			};
			if (err) {
				console.log(err, err.stack); // an error occurred
				response['message'] = err.message;
			} else {
				response['status'] = 'success';
				//response['message'] = 'Bucket added.';
				response['data'] = data;
			}
			cb(response);
		});
	}

	delete_object(param, cb) {
		var params = {
			Bucket: param.bucket,
			Key: param.object
		};
		this.s3.deleteObject(params, function(err, data) {
			let response = {
				"status": "error"
			};
			if (err) {
				console.log(err, err.stack); // an error occurred
				response['message'] = err.message;
			} else {
				response['status'] = 'success';
				response['message'] = 'Object deleted.';
				response['data'] = data;
			}
			cb(response);
		});
	}

	add_object(param, cb) {
		console.log(param);
		var params = {
			Bucket: param.bucket,
			//Key: 'tmp/'+param.name,
			Key: param.name,
			Body: fs.readFileSync(param.filepath)
		};
		this.s3.upload(params, function(err, data) {
			let response = {
				"status": "error"
			};
			if (err) {
				console.log(err, err.stack); // an error occurred
				response['message'] = err.message;
			} else {
				response['status'] = 'success';
				response['message'] = 'Object added.';
				response['data'] = data;
			}
			cb(response);
		});
	}
}

module.exports = {AWSS3};
//module.exports.AWSS3 = AWSS3;
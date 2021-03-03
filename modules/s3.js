var AWS = require('aws-sdk');
const fs = require('fs');


// var s3  = new AWS.S3({
//           accessKeyId: 'minioadmin' ,
//           secretAccessKey: 'minioadmin' ,
//           endpoint: 'https://192.168.77.32:9001' ,
//           s3ForcePathStyle: true, // needed with minio?
//           signatureVersion: 'v4',
// 		  //s3DisableBodySigning: false
// });

// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

class AWSS3 {
	constructor() {
		this.s3  = new AWS.S3({
			accessKeyId: 'minioadmin' ,
			secretAccessKey: 'minioadmin' ,
			endpoint: 'https://192.168.77.32:9001' ,
			s3ForcePathStyle: true, // needed with minio?
			signatureVersion: 'v4',
			//s3DisableBodySigning: false
  		});
		process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
	}

	add_bucket(param, cb) {
		var params = {
			Bucket: param.name
		};
		this.s3.createBucket(params, function(err, data) {
			let response = {
				"status": "error"
			};
			if (err) {
				console.log(err, err.stack); // an error occurred
				response['message'] = 'Error in add bucket.';
			} else {
				response['status'] = 'success';
				response['message'] = 'Bucket added.';
				response['data'] = data;
			}
			cb(response);
		});
	}

	list_buckets(param, cb) {
		this.s3.listBuckets(function(err, data) {
			// if (err) console.log(err, err.stack); // an error occurred
			// else     console.log(data);           // successful response
			let response = {
				"status": "error"
			};
			if (err) {
				console.log(err, err.stack); // an error occurred
				response['message'] = 'Error in list bucket.';
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
				response['message'] = 'Error in delete bucket.';
			} else {
				response['status'] = 'success';
				response['message'] = 'Bucket deleted.';
				response['data'] = data;
			}
			cb(response);
		});
	}

	add_bucket(param, cb) {
		var params = {
			Bucket: param.bucket
		};

		
		// this.s3.waitFor('bucketExists', params, function(err, data) {
		// 	if (err) console.log(err, err.stack); // an error occurred
		// 	else     console.log(data);           // successful response
		// 	console.log('waitfor');
		// });


		this.s3.createBucket(params, function(err, data) {
			let response = {
				"status": "error"
			};
			if (err) {
				console.log(err, err.stack); // an error occurred
				
				response['message'] = 'Error in create bucket.';

				if(err.code=='BucketAlreadyOwnedByYou') {
					response['message'] = 'Bucket already exists.';
				}
			} else {
				response['status'] = 'success';
				response['message'] = 'Bucket created.';
				response['data'] = data;
			}
			console.log(12);
			cb(response);
		});
	}

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
				response['message'] = 'Error in list bucket.';
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
				response['message'] = 'Error in delete object.';
			} else {
				response['status'] = 'success';
				response['message'] = 'Object deleted.';
				response['data'] = data;
			}
			cb(response);
		});
	}
}

module.exports = {AWSS3};
//module.exports.AWSS3 = AWSS3;
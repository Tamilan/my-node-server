const express = require('express');
//const enc = require('../modules/encryption');
//const Auth = require('../modules/auth');
//const Redis = require('ioredis');
//const db = require('./../services/db');
//const users = require('./../modules/users');

const User = require('../model/user'); 
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');


var router = express.Router();

router.get('/profile', async function(req, res) {
	console.log(req.user);

	var user = await User.findOne({ _id : req.user._id });

	if(user) {
		return res.status(200).send(user.user_data());
	} else {
		return res.status(400).send({ 
			message : "Error in get Profile."
		});
	}
});

router.post('/profile', async function(req, res) {
	console.log(req.user);

	var user = await User.findOne({ _id : req.user._id });

	if(user) {
		return res.status(200).send(user.user_data());
	} else {
		return res.status(400).send({ 
			message : "Error in get Profile."
		});
	}
});

router.get('/generate-qr', async function(req, res) {
	console.log(req.user);

	console.log(`DEBUG: Received TFA setup request`);

	var user = await User.findOne({ _id : req.user._id });

    const secret = speakeasy.generateSecret({
        length: 10,
        name: user.name,
        issuer: 'TamilanAuth v0.1'
    });
    var url = speakeasy.otpauthURL({
        secret: secret.base32,
        label: user.email,
        issuer: 'TamilanAuth v0.1',
        encoding: 'base32'
    });
    QRCode.toDataURL(url, async (err, dataURL) => {
		user.temp_secret = secret.base32;
		user.mfa_url = url;

		let rr = await user.save();
		console.log(rr);
        // commons.userObject.tfa = {
        //     secret: '',
        //     tempSecret: secret.base32,
        //     dataURL,
        //     tfaURL: url
        // };
        return res.json({
            message: 'TFA Auth needs to be verified',
            tempSecret: secret.base32,
            dataURL,
            mfa_url: secret.otpauth_url
        });
    });


	// var user = await User.findOne({ _id : req.user._id });

	// if(user) {
	// 	return res.status(200).send(user.user_data());
	// } else {
	// 	return res.status(400).send({ 
	// 		message : "Error in get Profile."
	// 	});
	// }
});


router.post('/verify-mfa', async function(req, res) {
	console.log(req.user);

	console.log(`DEBUG: Received TFA Verify request`);

	var user = await User.findOne({ _id : req.user._id });
	console.log(user);

    let isVerified = speakeasy.totp.verify({
        secret: user.temp_secret,
        encoding: 'base32',
        token: req.body.token
    });

    if (isVerified) {
        console.log(`DEBUG: TFA is verified to be enabled`);

		user.mfa_secret = user.temp_secret;

		user.temp_secret = '';

		let rr = await user.save();
		console.log(rr);

        //commons.userObject.tfa.secret = commons.userObject.tfa.tempSecret;
        return res.send({
            "status": 'success',
            "message": "Two-factor Auth is enabled successfully"
        });
    }

    console.log(`ERROR: TFA is verified to be wrong`);

    return res.status(403).send({
        "status": 'error',
        "message": "Invalid Auth Code, verification failed. Please verify the system Date and Time"
    });
});


router.delete('/disable_mfa', async function(req, res) {
	console.log(req.user);

	var user = await User.findOne({ _id : req.user._id });
	console.log(user);

    if(user) {
		user.mfa_secret = '';
		let rr = await user.save();
		console.log(rr);
		return res.send({
            "status": 'success',
            "message": "Two-factor Auth is disabled successfully"
        });
	}

	return res.status(403).send({
        "status": 'error',
        "message": "Two-factor Auth is disabled failed"
    });

});


router.get('/users', async function(req, res) {
	console.log(req.user);

	var users = await User.find();
	
	let _users = [];
	if(users.length > 0) {
		users.forEach(function(u) { 
			let _user = {
				id: u._id,
				name: u.name,
				email: u.email,
				gender: u.gender,
				created_on: u.created_on,
			}
			_users.push(_user);
		});
	}
	return res.send(_users);
});

router.delete('/user', async function(req, res) {

	//console.log(req.body.query);
	console.log(req.query);
	let id= '60518944b827de54c567d8d3';
	let response = {
		'status': 'error'
	}
	try {
		var user = await User.findOne({_id: req.query.id});

		if(user) {
			console.log('in')
			let result = await User.deleteOne({_id: req.query.id});

			console.log(result.deletedCount);
		} else {
			console.log('user not found')
		}
	} catch(e) {
		console.log(e.message);


	}
	
	res.send({});
});

router.get('/user/:id', async function(req, res) {
	console.log(req.params);

	var user = await User.findOne({ _id : req.params.id });

	if(user) {
		return res.status(200).send(user.user_data());
	} else {
		return res.status(400).send({ 
			message : "Error in get Profile."
		});
	}
});


module.exports = router;

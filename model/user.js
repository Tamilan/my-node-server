// Importing modules 
const mongoose = require('mongoose'); 
var crypto = require('crypto'); 
  
// Creating user schema 
const UserSchema = mongoose.Schema({ 
    name : { 
        type : String, 
        required : true
    }, 
    email : { 
        type : String, 
        required : true,
    }, 
	// password : { 
    //     type : String, 
    //     required : true
    // }, 
	gender : { 
        type : String
    }, 
    hash : String, 
    salt : String 
}); 
  
// Method to set salt and hash the password for a user 
UserSchema.methods.setPassword = function(password) { 
     
 // Creating a unique salt for a particular user 
    this.salt = crypto.randomBytes(16).toString('hex');

	console.log(password);
	console.log(this.salt);
  
    // Hashing user's salt and password with 100 iterations, 
     
    this.hash = crypto.pbkdf2Sync(password, this.salt,  
    100, 64, `sha512`).toString(`hex`); 
}; 
  
// Method to check the entered password is correct or not 
UserSchema.methods.validPassword = function(password) { 
	console.log(password);

    var hash = crypto.pbkdf2Sync(password,  
    this.salt, 100, 64, `sha512`).toString(`hex`);
	console.log(this.salt);
	console.log(this.hash);
	console.log(hash);
    return this.hash === hash; 
};

// UserSchema.methods.email_existss = function(email, cb) {
     
// 	return mongoose.model('User').find({ email: email }, cb);	
// };

UserSchema.methods.email_exists = function(email) {
     
	return mongoose.model('User').find({ email: email });
}; 

UserSchema.methods.user_data = function() {
     
	return {
		name: this.name,
		email: this.email,
		gender: this.gender
	}
}; 

// UserSchema.pre('save', function (next) {
//     var self = this;
//     UserModel.find({name : self.name}, function (err, docs) {
//         if (!docs.length){
//             next();
//         }else{                
//             console.log('user exists: ',self.name);
//             next(new Error("User exists!"));
//         }
//     });
// }) ;
  
// Exporting module to allow it to be imported in other files 
const User = module.exports = mongoose.model('User', UserSchema); 
const MongoClient = require( 'mongodb' ).MongoClient;
const url = "mongodb://localhost:27017";

var _db;

module.exports = {

	connectToServer: function( callback ) {
		//{ useNewUrlParser: true, useUnifiedTopology: true }
		MongoClient.connect( url,  { useNewUrlParser: true, useUnifiedTopology: true }, function( err, client ) {
			_db  = client.db('s3');
			return callback( err );
		});
	},

	getDb: function() {
		return _db;
	}
};
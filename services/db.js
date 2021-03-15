//var MongoClient = require('mongodb').MongoClient;

const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017/s3";


//const MongoClient = require('mongodb').MongoClient;

var database; //global
class DB {

    constructor() {
        this.url = "mongodb://localhost:27017/s3";
        this.dbName = 's3';
    }

    connect() {
        console.log('connecting to database ' + this.dbName + ' with URL ' + this.url);
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.url, (err, client) => {
                if (err) {
                    reject(err);
                } else {
                    database = client.db(this.dbName);
                    resolve(client.db(this.dbName));
                }
            });
        })

    }
}

module.exports = DB;

// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// try {
//     var conn = client.connect();
// 	conn.db('s3');

// 	const cursor = conn.collection("users").find(
// 		{}
// 		);
// 	const results = cursor.toArray();
// 	console.log(results);

//     //await listDatabases(client);
 
// } catch (e) {
//     console.error(e);
// }


// module.exports = {
// //	dbo: dbo,
// 	client: client,
// 	conn: conn
// };





// var db = null;
// const dd = MongoClient.connect(uri, async function(err, client) {
// 	if (err) {
// 		console.log(err);
// 	}
// 	//console.log(client);
// 	//var dbo = db.db("s3");

// 	db = await client.db()

// 	// db.collection('users').find({name:"asdaaaas"}).toArray(function (err, result) {
// 	// 	if (err) throw err

// 	// 	console.log(result)
// 	// })
// });
// module.exports = {
// 	db: db,
// 	mongo: MongoClient
// };






// var mysql = require('mysql');
// var conn = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password:'Foni@123456',
//   database: 's3'
// });

// conn.connect(function(err) {
// 	if (err) throw err;
// 	console.log("Connected!");
// });

// module.exports = conn;


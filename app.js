const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
//var passport = require("passport");
//var cfg = require("./config.js");
//var auth = require("./auth.js")();

require('dotenv').config()

const Auth = require('./modules/auth');

var indexRouter = require('./routes/index');
var s3Router = require('./routes/s3');

const app = express();
const port = 3001;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(auth.initialize());

var myLogger = function (req, res, next) {
	console.log('LOGGED.')
	var i=1
	if(i==0) {
		res.send('From middle')
	} else {
		next()
	}
}

app.use(myLogger)

app.use('/', indexRouter);

var auth = new Auth();
app.use('/s3', auth.authenticate_token, s3Router);

app.use(function(req, res, next) {
	//next(createError(404));
  
	res.status(404).send("Sorry tamil can't find that!")
});


app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
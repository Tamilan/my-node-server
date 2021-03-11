var passport = require("passport");
var passportJWT = require("passport-jwt");
//var users = require("./users.js");
var cfg = require("./config.js");
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var params = {
    secretOrKey: cfg.jwtSecret,
    //jwtFromRequest: ExtractJwt.fromAuthHeader()
	//jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	done: function(error, user, info) {
		console.log(11);
	}
};

module.exports = function() {
	
    var strategy = new Strategy(params, function(payload, done) {
		console.log('Strategy');
		console.log(payload);
		let current_time = new Date().getTime()
		let diff = (current_time - payload.createdon)/1000/60;
		console.log(diff);
		if(diff > 100) {
			//return done(null, null, {"res": "User expired >10 mins."});
			//return done(new Error("User expired >10 mins."), null, 'infooo');
            return done(null, null, {
                "status": "error",
                "action": "re-auth",
                "message": "message"
            });
		}

        console.log(payload);

		return done(null, {
			
			key: payload.key,
            lastaccess: new Date().getTime()
			//authenticated: payload.authenticated
		});

		console.log(diff);
		//var difference = date1.getTime() - date2.getTime();
        // var user = users[payload.id] || null;
        // if (user) {
        //     return done(null, {
        //         id: user.id
        //     });
        // } else {
        //     return done(new Error("User not found"), null);
        // }
    });
    passport.use(strategy);
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
    return {
        initialize: function() {
            return passport.initialize();
        },
        authenticate: function() {
            return passport.authenticate("jwt", cfg.jwtSession);
        }
    };
};

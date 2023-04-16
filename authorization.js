// auth.js - This file exports a function that initializes the authentication strategy for the microservice.

//importing libraries and files
var passport = require("passport");
var passportJWT = require("passport-jwt");
var users = require("./data.js");
var cfg = require("./configuration.js");
const { Strategy, ExtractJwt } = require('passport-jwt');

// Defining the parameters for the JWT authentication.
var params = {
    secretOrKey: cfg.jwtSecret,
    jwtFromRequest: ExtractJwt.fromHeader('authorization')
};

// Export a function that initializes the authentication strategy.
module.exports = function() {
    // Define a new Strategy that verifies the JWT token and authenticates the request if it is valid.
    var strategy = new Strategy(params, function(payload, done) {
        var user = users[payload.id] || null; // retrieve user information from the database based on the ID stored in the JWT token payload
        if (user) {
            return done(null, {
                id: user.id     // if user is found, return the user's ID

            });
        } else {
            return done(new Error("User not found"), null);  // if user is not found, return an error message
        }
    });
    // Register the strategy with passport.
    passport.use(strategy);
    // Return an object with two functions: initialize and authenticate.
    return {
        // The initialize function initializes passport and returns it as middleware.
        initialize: function() {
            return passport.initialize();
        },
        // The authenticate function returns the middleware for authenticating requests using JWT.
        authenticate: function() {
            return passport.authenticate("jwt", cfg.jwtSession);
        }
    };
};
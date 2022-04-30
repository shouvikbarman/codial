const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment')


// tell passport to use google oauth
passport.use(new googleStrategy({
    clientID:env.google_clientID,
    clientSecret:env.google_clientSecret,
    callbackURL:env.google_callbackURL
},
    function(accessToken, refreshToken,profile,done){

        // find user in db
        User.findOne({email:profile.emails[0].value}).exec(function(err, user){
            if(err) {
                console.log('error in Google auth',err);
                return;
            }

            if(user){

                // if found, set user in req.user
                return done(null,user);
            }else{

                // if not found,create user and set in req.user
                User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                },function(err,user) {
                    if(err){
                        console.log('error in creating Google auth',err);
                        return;
                    }

                    return done(null,user);
                })
            }
        })
    }
));

module.exports = passport;
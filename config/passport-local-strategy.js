const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user')

// authenticate using passport

passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
},function(req,email,password,done){
    // find a user and establish identity

    User.findOne({email:email},function(err,user){
        if(err){
            req.flash('error',err);
            return done(err);
        };

        if(!user || user.password !== password){
            req.flash('error','Incorrect username or password');
            return done(null,false);
        }

        return done(null,user);
    });
}));

// serializing the user to determine which key is to be kept in cookies

passport.serializeUser(function(user,done){
    done(null,user.id);
});

// deserializing user from the key in the cookie

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log('error in finding user');
        };

        return done(null,user);
    });
});

passport.checkAuthentication = function(req,res,next){
    // if user is signed in 
    if(req.isAuthenticated()){
        return next();
    }
    // if user is not signed in 
    return res.redirect('/users/signin');
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        // req.user contains the signed in user from the session cookie and we are storing it in locals
        res.locals.user = req.user
    }
    next();
}

module.exports = passport;
const express = require('express');
const env = require('./config/environment')
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const sassMiddleware = require('node-sass-middleware');
const path = require('path');
const logger = require('morgan');
require('./config/view-helpers')(app);

//  used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJwt = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy')
const mongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customMware = require('./config/customMware')

// setup of chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);

if (env.name == 'development') {
    app.use(sassMiddleware({
        src: path.join(__dirname,env.asset_path,'scss'),
        dest: path.join(__dirname,env.asset_path,'css'),
        debug: true,
        outputStyle:'expanded',
        prefix:'/css'
    }));
}

app.use(express.urlencoded({extended: true}));
app.use(expressLayouts);
app.use(express.static(env.asset_path));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(logger(env.morgan.mode,env.morgan.options));
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);
app.set('view engine','ejs');
app.set('views','./views');

app.use(session({
    name:'codial',
    secret:env.session_cookie_key, // change secret before deployment
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store:mongoStore.create({
        mongoUrl: db._connectionString,
        autoRemove:'disabled'
    },function(err){
        if(err) {
            console.log(err);
        };
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
app.use('/',require('./routes'));



app.listen(port, function(err){
    if (err) {
        console.log(err);
    }

    console.log('server is up and running on port: ' + port);
})
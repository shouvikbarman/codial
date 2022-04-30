const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');
const logDirectory = path.join(__dirname, '../production_logs');

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log',{
    interval:'1d',
    path: logDirectory,
});


const development = {
    name:'development',
    asset_path:'./assets',
    session_cookie_key:'something',
    db:'codial_development',
    smtp:{
        service: 'gmail',
        host: 'smtp.gmail.com',
        port:  587,
        secure: false,
        auth: {
            user: process.env.user,
            pass: process.env.pass
        }
    },
    google_clientID: process.env.google_clientID,
    google_clientSecret: process.env.google_clientSecret,
    google_callbackURL:'http://localhost:8000/users/auth/google/callback',
    jwt_secretOrKey: 'secret',
    morgan:{
        mode:'dev',
        options: {stream:accessLogStream}
    }
}

const production = {
    name:'production',
    asset_path: process.env.asset_path,
    session_cookie_key: process.env.session_cookie_key,
    db:process.env.db,
    smtp:{
        service: 'gmail',
        host: 'smtp.gmail.com',
        port:  587,
        secure: false,
        auth: {
            user: process.env.user,
            pass: process.env.pass
        }
    },
    google_clientID: process.env.google_clientID,
    google_clientSecret: process.env.google_clientSecret,
    google_callbackURL:'http://localhost:8000/users/auth/google/callback',
    jwt_secretOrKey: process.env.jwt_secretOrKey,
    morgan:{
        mode:'production',
        options: {stream:accessLogStream}
    }
}

module.exports = eval(process.env.NODE_ENV) == undefined ? development : eval(process.env.NODE_ENV);
const mongoose = require('mongoose');
const env = require('../config/environment')
mongoose.connect(`mongodb://localhost/${env.db}`);
const db = mongoose.connection;
db.on('error',console.error.bind(console,'error connecting to mongoDB'));

db.once('open',function(){
    console.log('connected to mongoDB');
});

module.exports = db;
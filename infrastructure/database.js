var mongoose = require('mongoose');
var environment = process.env; 
const dbConfig = {
    host: environment.DB_HOST || 'localhost',
    port: environment.DB_PORT || 27017,
    user: environment.DB_USER || '',
    password: environment.DB_PASSWORD || '',
    database: environment.DB_DATABASE || 'sampleApp'
};

function getConnectionLink()
{
    let link = 'mongodb://';
    if(dbConfig.user)
        link += `${dbConfig.user}:${dbConfig.password}@`;
    
    link += `${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;
    return link;

}

mongoose.connect(getConnectionLink(), {
    useCreateIndex: true,
    useNewUrlParser: true
});

mongoose.Promise = global.Promise;
mongoose.set('debug', true);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('[MongoDbConnectionEvent] Mongoose default connection open');
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.error('[MongoDbConnectionEvent] Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('[MongoDbConnectionEvent] Mongoose default connection disconnected');
});

// When connections is reconnected
mongoose.connection.on('reconnected', function () {
    console.log('[MongoDbConnectionEvent] MongoDB reconnected!');
});

module.exports = mongoose;
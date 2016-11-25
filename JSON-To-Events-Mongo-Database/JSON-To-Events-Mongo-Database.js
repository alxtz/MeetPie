/* CONNECT TO DATABASE PART */
// import the mongodb native drivers
var mongodbModule = require('mongodb');
// use the 'MongoClient' interface to connect to a mongodb
var MongoClient = mongodbModule.MongoClient;
// the url where your mongodb is running
var url = 'mongodb://localhost:27017/Events-Mongo-Database';


/* READ JSON OBJECT PART */
// import fileSystemModule
var fileSystemModule = require('fs');
// read file stream
var fileStream = fileSystemModule.readFileSync("../Crawler-Result-JSON-Tagged/Crawler-Result-Tagged.json");
// parse to JSON object
var Events - JSON - Object = JSON.parse(fileStream);


/* CONNECT AND SAVE TO DATABASE PART */
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        //HURRAY!! We are connected. :)
        console.log('Connection established to', url);

        // do some work here with the database.

        //Close connection
        db.close();
    }
});

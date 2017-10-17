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
var fileStreamKKTIX = fileSystemModule.readFileSync("../Crawler-Result-JSON-Tagged/Crawler-Result-Tagged-KKTIX.json");
// var fileStreamMeetup = fileSystemModule.readFileSync("../Crawler-Result-JSON-Tagged/Crawler-Result-Tagged-Meetup.json");
// var fileStreamACCUPASS = fileSystemModule.readFileSync("../Crawler-Result-JSON-Tagged/Crawler-Result-Tagged-ACCUPASS.json");
// parse to JSON object
var eventsJsonObjectKKTIX = JSON.parse(fileStreamKKTIX);
// var eventsJsonObjectMeetup = JSON.parse(fileStreamMeetup);
// var eventsJsonObjectACCUPASS = JSON.parse(fileStreamACCUPASS);

/* CONNECT AND SAVE TO DATABASE PART */
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        //HURRAY!! We are connected. :)
        console.log('Connection established to', url);

        // Get the Events Collection
        var eventsCollection = db.collection('EventsCollection');

        var removeAllData = function(callback) {
            // remove add the data from db
            eventsCollection.remove({}, function(err, result) {
                if (err) {
                    console.log(err);
                }
                console.log(result);
                db.close();
            });
            callback();
        };

        var insertJsonObject = function(callback) {
            // Insert The Events JSON Data into db
            eventsCollection.insert(eventsJsonObjectKKTIX, function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Inserted KKTIX');
                }
                db.close();
            });
            // eventsCollection.insert(eventsJsonObjectMeetup, function(err, result) {
            //     if (err) {
            //         console.log(err);
            //     } else {
            //         console.log('Inserted Meetup');
            //     }
            //     db.close();
            // });
            // eventsCollection.insert(eventsJsonObjectACCUPASS, function(err, result) {
            //     if (err) {
            //         console.log(err);
            //     } else {
            //         console.log('Inserted ACCUPASS');
            //     }
            //     db.close();
            // });
            callback();
        };

        var showDbData = function() {
            // show the database data
            var eventsCollectionResult = eventsCollection.find({}).limit(1);

            eventsCollectionResult.toArray(function(err, result) {
                if (err) {
                    console.log('Find Err : ' + err);
                    //Close connection
                    db.close();
                } else {
                    console.log(JSON.stringify(result, null, 2));
                    console.log('The Collection Has ' + result.length + ' Items !');
                    //Close connection
                    db.close();
                }
            });
        }

        removeAllData(function() {
            insertJsonObject(function() {
                showDbData();
            })
        });

    }
});

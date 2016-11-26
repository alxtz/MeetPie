// ============================================================ (=x60)

var fileSystemModule = require('fs');
var expressModule = require('express');
var app = expressModule();

app.use(expressModule.static('../Front-End-Page'));

app.get('/', function(req, res) {
    res.sendFile('../Front-End-Page/index.html');
});

var server = app.listen(8080, "127.0.0.1", function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});

// ============================================================ (=x60)

app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080/');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// ============================================================ (=x60)

var searchModule = require('./search');

// ============================================================ (=x60)

var options = {
    host: '127.0.0.1',
    port: '4040',
    path: '/',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': 140
    }
};

app.post("/", function(req, res) {

    var JsonToSend;

    searchModule(JsonToSend, function() {
        console.log('JsonToSend is ' + JsonToSend);
        res.setHeader('Content-Type', 'application/json');
        console.log('We Send ' + JsonToSend);
        res.send(JSON.stringify(JsonToSend));
        console.log('Send Post !');
    });

});

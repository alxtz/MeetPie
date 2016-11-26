// ============================================================ (=x60)

var searchModule = require('./search')

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

// ============================================================ (=x60)

var bodyParserModule = require('body-parser');
app.use(bodyParserModule.urlencoded({
    extended: true
}));
app.use(bodyParserModule.json());

// ============================================================ (=x60)

app.post("/", function(req, res) {

    console.log('Request Body is ' + JSON.stringify(req.body, null, 2));
    console.log('Request Keyword is ' + req.body.keyword);
    console.log('Request Host is ' + req.body.host);

    searchModule.searchMongodb(function() {
        console.log('JsonToSend is ' + searchModule.outputJSON);
        res.setHeader('Content-Type', 'application/json');
        console.log('We Send ' + searchModule.outputJSON);
        res.send(JSON.stringify(searchModule.outputJSON));
        console.log('Send Post !');
    });

});;

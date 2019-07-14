/**
* app.js - Simple express server
* 
*/

/** jslint
*  browser : true,   continue  :  true,    devel   :  true,
*  indent  : 4,      maxerr    :  50,      newcap  :  true,
*  nomen   : true,   plusplus  :  true,    regexp  :  true,
*  sloppy  : true,   vars      :  false,   white   :  false,
*  */

/**global  */

'use strict'
var
    http = require('http')
    , express = require('express')
    , routes = require('./routes')
    , app = express()
    , server = http.createServer(app);

// app.use(express.logger());
// app.use(express.bodyParser());
// app.use(express.methodOverride());

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.basicAuth('user','spa'));
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
});

app.configure('development', function () {
    app.use(express.logger());
    app.use(express.errorHandler({
        dumpExceptions: true
        , showStack: true
    }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

routes.configRoutes(app, server);

server = http.createServer(app);

server.listen(3000);

console.log('Listening on port %d in %s module', server.address().port, app.settings.env);

// server = http.createServer(function (request, response) {
//     console.log('on Data:');
//     console.log(request.ondata);
//     console.log('Headers:');
//     console.log(request.headers);
//     console.log('Url:');
//     console.log(request.url);
//     console.log('method:');
//     console.log(request.method);

//     var response_text = request.url === '/test' ? 'You have hit the test page' : 'Hello World';
//     response.writeHead(200, { 'Content-Type': 'text/plain' });
//     response.end(response_text);
// }).listen(3000);


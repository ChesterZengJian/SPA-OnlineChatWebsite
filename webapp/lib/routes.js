/**
* routes.js - module to provide routing
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
var configRoutes
    , crud = require('./crud')
    , chat = require('./chat')
    , makeMongoId = crud.makeMongoId
    // , dbName = 'spa'
    // , db
    // , mongodb = require('mongodb').MongoClient
    // , url = 'mongodb://localhost/spa'
    // , dbHandle
    // , getAllObjs
    // , addObj
    // , updateObj
    // , objTypeMap = { 'user': {} };
;

// dbHandle = function (err, client) {
//     db = client.db(dbName);
//     console.log('Connected Db successfully');
// };
// mongodb.connect(url, { useNewUrlParser: true }, dbHandle);

// getAllObjs = function (obj_type, callback) {
//     const collection = db.collection(obj_type);
//     collection.find({}).toArray(function (err, map_list) {
//         // response.send(map_list);
//         callback(map_list);
//     })
// };
// addObj = function (obj_type, callback) {
//     const collection = db.collection(obj_type);
//     collection.insertMany(obj_type, function (err, result_map) {
//         console.log('insert successfully');
//         callback(result_map);
//     })
// }

configRoutes = function (app, server) {
    app.get('/', function (request, response) {
        // response.send('Hello Express');
        response.redirect('/spa.html');
    });

    app.all('/:obj_type/*?', function (request, response, next) {
        response.contentType('json');
        if (objTypeMap[request.params.obj_type]) {
            next();
        }
        else {
            response.send({ error_msg: request.params.obj_type + ' is not a valid object type' });
        }
    });

    app.get('/:obj_type/list', function (request, response) {
        crud.read(
            request.params.obj_type
            ,{}
            ,{}
            ,function(map_list){
                response.send(map_list);
            }
        );
        // getAllObjs(request.params.obj_type, function (map_list) {
        //     response.send(map_list);
        // })
    });

    app.get('/:obj_type/read/:id([0-9]+)+', function (request, response) {
        response.send({
            title: request.params.obj_type + ' with id ' + request.params.id + ' found '
        });
    });

    app.post('/:obj_type/create', function (request, response) {
        crud.construct(
            request.params.obj_type
            ,request.body
            ,function(map_list){
                response.send(map_list);
            }
        );
        // addObj(request.obj_type, function (result_map) {
        //     response.send(result_map);
        // });
    });

    app.get('/:obj_type/read/:id([0-9]+)', function (request, response) {
        response.contentType('json');
        response.send({
            title: 'user with id ' + request.params.id + ' found'
        });
    });

    app.post('/:obj_type/update:id([0-9]+)', function (request, response) {
        crud.update(
            request.params.obj_type
            ,{_id:makeMongoId(request.params.id)}
            ,request.body
            ,function(result_map){
                response.send(result_map);
            }
        );
        // response.contentType('json');
        // response.send({
        //     title: 'user with id ' + request.params.id + ' updated '
        // });
    });

    app.get('/:obj_type/delete/:id([0-9]+)', function (request, response) {
        crud.destroy(
            request.params.obj_type
            ,{_id:makeMongoId(request.params.id)}
            ,function(result_map){
                response.send(result_map);
            }
        );
        // response.contentType('json');
        // response.send({
        //     title: 'user with id ' + request.params.id + ' deleted'
        // });
    });

    chat.connect(server);
};

module.exports = { configRoutes: configRoutes };
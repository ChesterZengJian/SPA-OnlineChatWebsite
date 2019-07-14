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
var configRoutes;
configRoutes = function (app, server) {

    app.all('/user/*?', function (request, response, next) {
        response.contentType('json');
        next();
    })

    app.get('/:obj_type/read/:id([0-9]+)+', function (request, response) {
        response.send({
            title: request.params.obj_type + ' with id ' + request.params.id + ' found '
        });
    });

    app.get('/', function (request, response) {
        // response.send('Hello Express');
        response.redirect('/spa.html');
    });

    app.get('/user/list', function (request, response) {
        response.contentType('json');
        response.send({ title: 'use list' });
    });

    app.post('user/create', function (request, response) {
        response.contentType('json');
        response.send({ title: 'user created' })
    });

    app.get('/user/read/:id([0-9]+)', function (request, response) {
        response.contentType('json');
        response.send({
            title: 'user with id ' + request.params.id + ' found'
        });
    });

    app.post('/user/update:id([0-9]+)', function (request, response) {
        response.contentType('json');
        response.send({
            title: 'user with id ' + request.params.id + ' updated '
        });
    });

    app.get('/user/delete/:id([0-9]+)', function (request, response) {
        response.contentType('json');
        response.send({
            title: 'user with id ' + request.params.id + ' deleted'
        });
    });
};

module.exports = { configRoutes: configRoutes };
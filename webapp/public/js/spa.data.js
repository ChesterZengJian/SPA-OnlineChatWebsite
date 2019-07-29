/**
* spa.data.js
* Data module
*/

/** jslint
*  browser : true,   continue  :  true,    devel   :  true,
*  indent  : 4,      maxerr    :  50,      newcap  :  true,
*  nomen   : true,   plusplus  :  true,    regexp  :  true,
*  sloppy  : true,   vars      :  false,   white   :  false,
*  */
/**global $, spa */
spa.data = (function () {
    'use strict';
    // ---------- BEGIN MODULE SCOPE VARIABLES --------------
    var stateMap = { sio: null }
        , makeSio
        , getSio
        , initModule;
    // var io=require('socket.io');
    // ---------- END MODULE SCOPE VARIABLES ----------------

    // ---------- BEGIN UTILITY METHODS ---------------------
    makeSio = function () {
        // var socket = io.connect('/chat');

        return {
            emit: function (event_name, data) {
                socket.emit(event_name, data);
            }
            , on: function (event_name, callback) {
                socket.on(event_name, function () {
                    callback(arguments);
                });
            }
        };
    };

    getSio = function () {
        if (!stateMap.sio) {
            stateMap.sio = makeSio();
        }
        return stateMap.sio;
    };
    // ---------- END UTILITY METHODS -----------------------

    // ---------- BEGIN DOM METHODS -------------------------
    // ---------- END DOM METHODS ---------------------------

    // ---------- BEGIN EVENT HANDLERS ----------------------
    // ---------- END EVENT HANDLERS ------------------------

    // ---------- BEGIN PULIC METHODS -----------------------
    initModule = function () { };

    return {
        getSio: getSio
        , initModule: initModule
    };
    // ---------- END PULIC METHODS -------------------------
}());
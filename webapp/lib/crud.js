/**
* crud.js - module to provide CRUD db capabilities
* 
*/

/** jslint
*  browser : true,   continue  :  true,    devel   :  true,
*  indent  : 4,      maxerr    :  50,      newcap  :  true,
*  nomen   : true,   plusplus  :  true,    regexp  :  true,
*  sloppy  : true,   vars      :  false,   white   :  false,
*  */

/**global  */
'use strict';
// ---------- BEGIN MODULE SCOPE VARIABLES --------------
var loadSchema
    , checkSechema
    , clearIsOnline
    , checkType
    , constructObj
    , readObj
    , updateObj
    , destroyObj
    , dbName = 'spa'
    , url = 'mongodb://localhost/spa'
    , mongodb = require('mongodb').MongoClient
    , fsHandle = require('fs')
    , dbHandle
    // , mongoServer = new mongodb.Server(
    //     'localhost'
    //     , mongodb.Connection.DEFAULT
    // )
    , objTypeMap = { 'user': {} };

// ---------- END MODULE SCOPE VARIABLES ----------------

// ---------- BEGIN UTILITY METHODS ---------------------
loadSchema = function (schema_name, schema_path) {
    fsHandle.readFile(schema_path, 'utf8', function (err, data) {
        objTypeMap[schema_name] = JSON.parse(data);
    });
};
checkSechema = function (obj_type, obj_map, callback) {
    var schema_map = objTypeMap[obj_type];
    report_map = validator.validate(obj_map, schema_map);

    callback(report_map.errors);
};
clearIsOnline = function () {
    updateObj(
        'user'
        , { is_online: true }
        , { is_online: false }
        , function (response_map) {
            console.log('All users set to offline', response_map);
        }
    );
};

// ---------- END UTILITY METHODS -----------------------

// ---------- BEGIN DOM METHODS -------------------------
// ---------- END DOM METHODS ---------------------------

// ---------- BEGIN EVENT HANDLERS ----------------------
// ---------- END EVENT HANDLERS ------------------------

// ---------- BEGIN PULIC METHODS -----------------------
checkType = function (obj_type) {
    if (!objTypeMap[obj_type]) {
        return ({ error_msg: 'Object type' + obj_type + ' is not supported' });
    }
    return null;
};
constructObj = function (obj_type, obj_map, callback) {
    var type_check_map = checkType(obj_type);
    if (type_check_map) {
        callback(type_check_map);
        return;
    }

    checkSechema(
        obj_type
        , obj_map
        , function (error_list) {
            if (error_list.length === 0) {
                dbHandle.collection(
                    obj_type
                    , function (outer_error, collection) {
                        var options_map = { safe: true };

                        collection.insert(
                            obj_map
                            , options_map
                            , function (inner_error, result_map) {
                                callback(result_map);
                            }
                        );
                    }
                );
            }
            else {
                callback({
                    error_msg: 'Input document not valid'
                    , error_list: error_list
                });
            }
        }
    );
};
readObj = function (obj_type, find_map, fields_map, callback) {
    var type_check_map = checkType(obj_type);
    if (type_check_map) {
        callback(type_check_map);
        return;
    }
    dbHandle.collection(
        obj_type
        , function (outer_error, collection) {
            collection.find(find_map, fields_map).toArray(
                function (error_list, map_list) {
                    callback(map_list);
                }
            );
        }
    );
};
updateObj = function (obj_type, find_map, set_map, callback) {
    var type_check_map = checkType(obj_type);
    if (type_check_map) {
        callback(type_check_map);
        return;
    }

    checkSechema(
        obj_type
        , set_map
        , function (error_list) {
            if (error_list.length === 0) {
                dbHandle.collection(
                    obj_type
                    , function (outer_error, collection) {
                        var options_map = { safe: true, multi: true, upsert: false };
                        collection.update(
                            find_map
                            , { $set: set_map }
                            , options_map
                            , function (inner_error, update_count) {
                                callback({ update_count: update_count });
                            }
                        );
                    }
                );
            }
            else {
                callback({
                    error_msg: 'Input document not valid'
                    , error_list: error_list
                });
            }
        }
    );
};
destroyObj = function () {
    var type_check_map = checkType(obj_type);
    if (type_check_map) {
        callback(type_check_map);
        return;
    }

    dbHandle.collection(
        obj_type
        , function (outer_error, collection) {
            var options_map = { safe: true, single: true };
            collection.remove(
                find_map
                , options_map
                , function (inner_error, delete_count) {
                    callback({ delete_count: delete_count });
                }
            );
        }
    );
};

module.exports = {
    makeMongoId: mongodb.ObjectID
    , checkType: checkType
    , construct: constructObj
    , read: readObj
    , update: updateObj
    , destroy: destroyObj
};
// ---------- END PULIC METHODS -------------------------

// ---------- END MODULE INITIALIZATION -----------------
dbHandle = function (err, client) {
    db = client.db(dbName);
    console.log('Connected Db successfully');
};

mongodb.connect(url, { useNewUrlParser: true }, dbHandle);

(function () {
    var schema_name
        , schema_path;
    for (schema_name in objTypeMap) {
        if (objTypeMap.hasOwnProperty(schema_name)) {
            schema_path = _dirname + '/' + schema_name + '.json';
            loadSchema(schema_map, schema_path);
        }
    }
}());
// ---------- END MODULE INITIALIZATION -----------------
/**
* spa.model.js
* Model module
*/

/** jslint
*  browser : true,   continue  :  true,    devel   :  true,
*  indent  : 4,      maxerr    :  50,      newcap  :  true,
*  nomen   : true,   plusplus  :  true,    regexp  :  true,
*  sloppy  : true,   vars      :  false,   white   :  false,
*  */

/**global $, spa */

spa.model = (function () {
    'use strict';
    // ---------- BEGIN MODULE SCOPE VARIABLES --------------
    // Begin the people object API
    // The people object is available at spa.model.people
    // The people object provides methods and events to manage
    // a collection of person objects. Its public methods include:
    //  * get_user()
    //  * get_db()
    //  * get_by_cid(<client_id>)
    //  * login(<user_name>)
    //  * logout()
    // 
    // jQuery global custom events published by the objecct include:
    //  * 'spa-login' is published when a user login process completes. 
    // The updated user object is provided as data
    //  * 'spa-logout' is published when a logout completes.
    // The format user object is provided as data
    // 
    // Each person is represented by a person object.
    // Person objects provide the following methods:
    //  * get_is_user() - return true if object is the current user
    //  * get_is_anon() - return true if object is annoymous
    // 
    // The attributes for a person object include:
    //  * cid - string client id. This is always defined, 
    // and is only different from the id attribute if the client
    // data is not synced with the backend.
    //  * id - the unique id. This may be undefined if the object is 
    // not synced with the backend.
    //  * name - the string name of the user.
    //  * css_map - a map of attributes used for avatar presentation.
    // 
    // End the people object API

    var
        configMap = {
            anon_id: 'a0'
        }
        , stateMap = {
            anon_user: null
            , cid_serial: 0
            , people_cid_map: {}
            , people_db: TAFFY()
            , user: null
        }
        , isFakeData = true
        , personProto
        , makePerson
        , people
        , makeCid
        , clearPeopleDb
        , completeLogin
        , removePerson
        , initModule;
    // ---------- END MODULE SCOPE VARIABLES ----------------

    // ---------- BEGIN UTILITY METHODS ---------------------
    personProto = {
        get_is_user: function () {
            return this.cid === stateMap.user.cid;
        }
        , get_is_anon: function () {
            return this.cid === stateMap.anon_user.cid;
        }
    }

    makePerson = function (person_map) {
        var
            person
            , cid = person_map.cid
            , css_map = person_map.css_map
            , id = person_map.id
            , name = person_map.name;

        if (cid === undefined || !name) {
            throw 'client id and name required';
        }

        person = Object.create(personProto);
        person.cid = cid;
        person.name = name;
        person.css_map = css_map;

        if (id) {
            person.id = id;
        }

        stateMap.people_cid_map[cid] = person;

        stateMap.people_db.insert(person);
        return person;
    }

    makeCid = function () {
        return 'c' + String(stateMap.cid_serial++);
    }

    clearPeopleDb = function () {
        var user = stateMap.user;
        stateMap.people_db = TAFFY();
        stateMap.people_cid_map = {};
        if (user) {
            stateMap.people_db.insert(user);
            stateMap.people_cid_map[user.cid] = user;
        }
    }

    completeLogin = function (user_list) {
        var user_map = user_list[0];
        delete stateMap.people_cid_map[user_map.cid];
        stateMap.user.cid = user_map._id;
        stateMap.user.id = user_map._id;
        stateMap.user.css_map = user_map.css_map;
        stateMap.people_cid_map[user_map._id] = stateMap.user;

        $.gevent.publish('spa-login', [stateMap.user]);
    }

    removePerson = function (person) {
        if (!person) {
            return false;
        }
        if (person.id === configMap.anon_id) {
            return false;
        }

        stateMap.people_db({ cid: person.cid }).remove();
        if (person.id) {
            delete stateMap.people_cid_map[people.cid];
        }
        return true;
    }

    people = (function () {
        var
            get_by_cid
            , get_db
            , get_user
            , login
            , logout;

        get_by_cid = function (cid) {
            return stateMap.people_cid_map[cid];
        }

        get_db = function () {
            return stateMap.people_db;
        }

        get_user = function () {
            return stateMap.user;
        }

        login = function (name) {
            var sio = isFakeData ? spa.fake.mockSio : spa.data.getSio();

            stateMap.user = makePerson({
                cid: makeCid()
                , css_map: {
                    top: 25
                    , left: 25
                    , 'background-color': '#8f8'
                }
                , name: name
            });

            sio.on('userupdate', completeLogin);
            sio.emit('addUser', {
                cid: stateMap.user.cid
                , css_map: stateMap.user.css_map
                , name: stateMap.user.name
            });
        };

        logout = function () {
            var
                is_removed
                , user = stateMap.user;

            is_removed = removePerson(user);
            stateMap.user = stateMap.anon_user;

            $gevent.publish('spa-logout', [user]);
            return is_removed;
        }

        return {
            get_by_cid: get_by_cid
            , get_db: get_db
            , get_user: get_user
            , login: login
            , logout: logout
        };
    }());
    // ---------- END UTILITY METHODS -----------------------

    // ---------- BEGIN DOM METHODS -------------------------
    // ---------- END DOM METHODS ---------------------------

    // ---------- BEGIN EVENT HANDLERS ----------------------
    // ---------- END EVENT HANDLERS ------------------------

    // ---------- BEGIN PULIC METHODS -----------------------
    initModule = function () {
        var
            i
            , people_list
            , person_map;

        stateMap.anon_user = makePerson({
            cid: configMap.anon_id
            , id: configMap.anon_id
            , name: 'anonymous'
        });
        stateMap.user = stateMap.anon_user;

        if (isFakeData) {
            people_list = spa.fake.getPeopleList();
            for (i = 0; i < people_list.length; i++) {
                person_map = people_list[i];
                makePerson({
                    cid: person_map._id
                    , css_map: person_map.css_map
                    , id: person_map._id
                    , name: person_map.name
                });
            }
        }
    };
    return {
        initModule: initModule
        , people: people
    };
    // ---------- END PULIC METHODS -------------------------
}());

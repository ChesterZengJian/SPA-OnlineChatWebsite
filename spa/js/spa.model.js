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
    // ---------- END MODULE SCOPE VARIABLES ----------------

    // ---------- BEGIN UTILITY METHODS ---------------------
    // ---------- END UTILITY METHODS -----------------------

    // ---------- BEGIN DOM METHODS -------------------------
    // ---------- END DOM METHODS ---------------------------

    // ---------- BEGIN EVENT HANDLERS ----------------------
    // ---------- END EVENT HANDLERS ------------------------

    // ---------- BEGIN PULIC METHODS -----------------------
    return {};
    // ---------- END PULIC METHODS -------------------------
}());

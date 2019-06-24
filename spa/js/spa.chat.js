/**
* spa.chat.js
* Chat feature module for SPA
*/

/** jslint
*  browser : true,   continue  :  true,    devel   :  true,
*  indent  : 4,      maxerr    :  50,      newcap  :  true,
*  nomen   : true,   plusplus  :  true,    regexp  :  true,
*  sloppy  : true,   vars      :  false,   white   :  false,
*  */

/**global $, spa */

spa.chat = (function () {
    // ---------- BEGIN MODULE SCOPE VARIABLES --------------
    var
        configMap = {
            main_html: String()
                + '<div style="padding:1em;color:#ffffff">'
                + 'Say hello to chat'
                + '</div>'
            , settable_map: {}
        }
        , stateMap = {
            $container: null
        }
        , jqueryMap = {

        }
        , setJqueryMap, configModule, initModule;
    // ---------- END MODULE SCOPE VARIABLES ----------------

    // ---------- BEGIN UTILITY METHODS ---------------------
    // ---------- END UTILITY METHODS -----------------------

    // ---------- BEGIN DOM METHODS -------------------------
    // Begin DOM method /setJqueryMap/
    // Purpose   : 
    //  * 
    // Arguments : 
    //  * 
    // Setting   : 
    //  * 
    // Return    : boolean 
    //  * 
    // Action    : 
    //  * 
    // 
    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container
        };
    }
    // End DOM method /setJqueryMap/
    // ---------- END DOM METHODS ---------------------------

    // ---------- BEGIN EVENT HANDLERS ----------------------
    // ---------- END EVENT HANDLERS ------------------------

    // ---------- BEGIN PULIC METHODS -----------------------
    // Begin pulic method /configModule/
    // Purpose   : 
    //  * Adjust configuration of allowed keys
    // Arguments : A map of settable keys and values
    //  * color_name - color to use
    // Setting   : 
    //  * configMap.settable_map declares allowed keys
    // Return    : boolean 
    //  * true 
    // Action    : 
    //  * 
    // 
    configModule = function (input_map) {
        spa.util.setConfigMap({
            input_map: input_map
            , settable_map: configMap.settable_map
            , config_map: configMap
        });
        return true;
    }
    // End public method /configModule/

    // Begin public method /initModule/
    // Purpose   : 
    //  * Initializes module
    // Arguments : 
    //  * $container the jquery element used by this feature
    // Setting   : 
    //  * 
    // Return    : boolean 
    //  * true
    // Action    : 
    //  * 
    // 
    initModule = function ($container) {
        $container.html(configMap.main_html);
        stateMap.$container = $container;
        setJqueryMap();
        return true;
    }
    // End public method /initModule/
    return {
        configModule: configModule
        , initModule: initModule
    };
    // ---------- END PULIC METHODS -------------------------
}());
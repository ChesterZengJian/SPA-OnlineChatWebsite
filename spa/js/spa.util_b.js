/**
* spa.util_b.js
* JavaScript brower utilities
*/

/** jslint
*  browser : true,   continue  :  true,    devel   :  true,
*  indent  : 4,      maxerr    :  50,      newcap  :  true,
*  nomen   : true,   plusplus  :  true,    regexp  :  true,
*  sloppy  : true,   vars      :  false,   white   :  false,
*  */
/**global $, spa, getComputedStyle */

spa.util_b = (function () {
    'use strict';
    // ---------- BEGIN MODULE SCOPE VARIABLES --------------
    var
        configMap = {
            regex_encode_html: /[&"'><]/g
            , regex_encode_noamp: /["'><]/g
            , html_encode_map: {
                '&': '&#38;'
                , '"': '&#34;'
                , "'": '&#39;'
                , '>': '&#62;'
                , '<': '&#60;'
            }
        }
        , decodeHtml
        , encodeHtml
        , getEmSize;
    // ---------- END MODULE SCOPE VARIABLES ----------------

    // ---------- BEGIN UTILITY METHODS ---------------------
    // Begin utility method /decodeHtml/
    // Example   : 
    //  * 
    // Purpose   : 
    //  * 
    // Arguments : 
    //  * 
    // Setting   : 
    //  * 
    // Return    : 
    //  * 
    // Action    : 
    //  * 
    // Throws    : 
    //  * 
    // 
    decodeHtml = function (str) {
        return $('<div/>').html(str || '').text();
    };
    // End DOM method /decodeHtml/

    // Begin utility method /encodeHtml/
    // Example   : 
    //  * 
    // Purpose   : 
    //  * 
    // Arguments : 
    //  * 
    // Setting   : 
    //  * 
    // Return    : 
    //  * 
    // Action    : 
    //  * 
    // Throws    : 
    //  * 
    // 
    encodeHtml = function (input_arg_str, exclude_amp) {
        var
            input_str = String(input_arg_str)
            , regex
            , lookup_map;

        if (exclude_amp) {
            lookup_map = configMap.encode_noamp_map;
            regex = configMap.regex_encode_noamp;
        }
        else {
            lookup_map = configMap.html_encode_map;
            regex = configMap.regex_encode_html;
        }

        return input_str.replace(regex, function (match, name) {
            return lookup_map[match] || '';
        })
    };
    // End DOM method /encodeHtml/

    // Begin utility method /getEmSize/
    // Example   : 
    //  * 
    // Purpose   : 
    //  * 
    // Arguments : 
    //  * 
    // Setting   : 
    //  * 
    // Return    : 
    //  * 
    // Action    : 
    //  * 
    // Throws    : 
    //  * 
    // 
    getEmSize = function (elem) {
        return Number(
            getComputedStyle(elem, '').fontSize.match(/\d*\.?\d*/)[0]
        );
    }
    // End DOM method /getEmSize/
    // ---------- END UTILITY METHODS -----------------------

    // ---------- BEGIN DOM METHODS -------------------------
    // ---------- END DOM METHODS ---------------------------

    // ---------- BEGIN EVENT HANDLERS ----------------------
    // ---------- END EVENT HANDLERS ------------------------

    // ---------- BEGIN PULIC METHODS -----------------------
    return {
        decodeHtml: decodeHtml
        , encodeHtml: encodeHtml
        , getEmSize: getEmSize
    };
    // ---------- END PULIC METHODS -------------------------
}());
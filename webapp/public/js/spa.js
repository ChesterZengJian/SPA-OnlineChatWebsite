/**
 * spa.js
 * Root namespace module
 */

/** jslint
 *  browser : true,   continue  :  true,    devel   :  true,
 *  indent  : 4,      maxerr    :  50,      newcap  :  true,
 *  nomen   : true,   plusplus  :  true,    regexp  :  true,
 *  sloppy  : true,   vars      :  false,   white   :  false,
 * comma-style : last
 *  */

/**global $, spa */

// Module /sps/
//Provide chat slider capability
//
var spa = (function ($) {
    'use strict';
    // Module scope variables
    var
        // Set constants
        configMap = {
            extend_height: 434
            , extend_title: 'Click to retract'
            , retracted_height: 16
            , retracted_title: 'Click to extend'
            , template_html: '<div class="spa-slider"><\/div>'
        }
        // Declare all other module scope variables
        , $chatSlider
        , toggleSlider, onClickSlider, initModule;

    // DOM method /toggleSlider/
    // alternates slider height
    //
    toggleSlider = function () {
        var
            slider_height = $chatSlider.height();
        // extend slider if fully retracted
        if (slider_height === configMap.retracted_height) {
            $chatSlider.animate({
                height: configMap.extend_height
            }).attr('title', configMap.extend_title);
            return true;
        }

        //retract slider if fully extend
        if (slider_height === configMap.extend_height) {
            $chatSlider.animate({
                height: configMap.retracted_height
            }).attr('title', configMap.retracted_title);
            return true;
        }

        return false;
    };

    // Event handler /onClickSlider/
    // receives click event  and call toggleSlider
    //
    onClickSlider = function () {
        toggleSlider();
        return false;
    };

    // Public method /initModule/
    // sets initial state and provides feature
    //
    initModule = function ($container) {
        spa.data.initModule();
        spa.model.initModule();
        spa.shell.initModule($container);
    };

    return { initModule: initModule }
}(jQuery));


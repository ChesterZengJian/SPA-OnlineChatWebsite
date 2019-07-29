/**
* spa.avtr.js
* Avatar feature modul
*/

/** jslint
*  browser : true,   continue  :  true,    devel   :  true,
*  indent  : 4,      maxerr    :  50,      newcap  :  true,
*  nomen   : true,   plusplus  :  true,    regexp  :  true,
*  sloppy  : true,   vars      :  false,   white   :  false,
*  */
/**global $, spa */

spa.avtr = (function () {
    'use strict';
    // ---------- BEGIN MODULE SCOPE VARIABLES --------------
    var
        configMap = {
            chat_model: null
            , people_model: null
            , settable_map: {
                chat_model: true
                , people_model: true
            }
        }
        , stateMap = {
            drag_map: null
            , $drag_target: null
            , drag_bg_color: undefined
        }
        , jqueryMap = {

        }
        , getRandRgb
        , updateAvatar
        , onTapNav
        , onHeldstartNav
        , onHeldmoveNav
        , onHeldendNav
        , onSetchatee
        , onListchange
        , onLogout
        , setJqueryMap
        , configModule
        , initModule;
    // ---------- END MODULE SCOPE VARIABLES ----------------

    // ---------- BEGIN UTILITY METHODS ---------------------
    getRandRgb = function () {
        var i
            , rgb_list = [];
        for (i = 0; i < 3; i++) {
            rgb_list.push(Math.floor(Math.random() * 128) + 128);
        }
        return 'rgb(' + rgb_list.join(',') + ')';
    }
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
    setJqueryMap = function ($container) {
        jqueryMap = { $container: $container };
    };
    // End DOM method /setJqueryMap/

    // Begin DOM method /updateAvatar/
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
    updateAvatar = function ($target) {
        var css_map
            , person_id;
        css_map = {
            top: parseInt($target.css('top'), 10)
            , left: parseInt($target.css('left'), 10)
            , 'background-color': $target.css('background-color')
        };
        person_id = $target.attr('data_id');

        configMap.chat_model.update_avatar({
            person_id: person_id
            , css_map: css_map
        });
    };
    // End DOM method /updateAvatar/
    // ---------- END DOM METHODS --------------------------- b

    // ---------- BEGIN EVENT HANDLERS ----------------------


    // ---------- END EVENT HANDLERS ------------------------

    // ---------- BEGIN PULIC METHODS -----------------------
    // Begin Event method /onTapNav/
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
    onTapNav = function (event) {
        var css_map
            , $target = $(event.elem_target).closest('.spa-avtr-box');

        if ($target.length === 0) {
            return false;
        }
        $target.css({ 'background-color': getRandRgb() });
        updateAvatar($target);
    };
    // End DOM method /onTapNav/    

    onHeldstartNav = function (event) {
        var offset_target_map
            , offset_nav_map
            , $target = $(event.elem_target).closest('.spa-avtr-box');

        if ($target.length === 0) {
            return false;
        }

        stateMap.$drag_target = $target;
        offset_target_map = $target.offset();
        offset_nav_map = jqueryMap.$container.offset();

        offset_target_map.top -= offset_nav_map.top;
        offset_target_map.left -= offset_nav_map.left;

        stateMap.drag_map = offset_target_map;
        stateMap.drag_bg_color = $target.css('background-color');

        $target.addClass('spa-x-is-drag')
            .css('background-color', '');
    };

    onHeldmoveNav = function (event) {
        var drag_map = stateMap.drag_map;
        if (!drag_map) {
            return false;
        }

        drag_map.top += event.px_delta_y;
        drag_map.left += event.px_delta_x;

        stateMap.$drag_target.css({
            top: drag_map.top
            , left: drag_map.left
        });
    };

    onHeldendNav = function (event) {
        var $drag_target = stateMap.$drag_target;
        if (!$drag_target) {
            return false;
        }

        $drag_target
            .removeClass('spa-x-is-drag')
            .css('background-color', stateMap.drag_bg_color);

        stateMap.drag_bg_color = undefined;
        stateMap.$drag_target = null;
        stateMap.drag_map = null;
        updateAvatar($drag_target);
    };

    onSetchatee = function (event, arg_map) {
        var $nav = $(this)
            , new_chatee = arg_map.new_chatee
            , old_chatee = arg_map.old_chatee;

        if (old_chatee) {
            $nav
                .find('.spa-avtr-box[data_id=' + old_chatee.cid + ']')
                .removeClass('spa-x-is-chatee');
        }

        if (new_chatee) {
            $nav
                .find('.spa-avtr-box[data-id=' + new_chatee.cid + ']')
                .addClass('spa-x-is-chatee');
        }
    };

    onListchange = function (event) {
        var $nav = $(this)
            , people_db = configMap.people_model.get_db()
            , user = configMap.people_model.get_user()
            , chatee = configMap.chat_model.get_chatee() || {}
            , $box;

        $nav.empty();
        if (user.get_is_anon()) {
            return false;
        }

        people_db().each(function (person, idx) {
            var class_list;
            if (person.get_is_anon()) {
                return true;
            }
            class_list = ['spa-avtr-box'];
            if (person.id === chatee.id) {
                class_list.push('spa-x-is-chatee');
            }
            if (person.get_is_user()) {
                class_list.push('spa-x-is-user');
            }

            $box = $('<div/>')
                .addClass(class_list.join(' '))
                .css(person.css_map)
                .attr('data_id', String(person.id))
                .prop('title', spa.util_b.encodeHtml(person.name))
                .text(person.name)
                .appendTo($nav);
        });
    };

    onLogout = function (event, logout_user) {
        jqueryMap.$container.empty();
    };

    // Begin pulic method /configModule/
    // Example   : 
    //  * spa.chat.configModule({slider_open_em : 18});
    // Purpose   : 
    //  * Configure the module prior to initialization
    // Arguments : A map of settable keys and values
    //  * set_chat_anchor - a callback to modify the URI anchor to indicate opened or closed state.
    //  This callback must return false if the requested state cannot be met
    //  * chat_model      - the chat model object provides methods to interact with our instant messaging
    //  * people_model    - the peopel model object which provides methods to manage the list of people
    //  the model maintains
    //  * slider_* settings.All these are optional scalars. See mapConfig.settable_map for a full list
    //  Example: slider_open_em is the open height in em's
    // Setting   : 
    //  * configMap.settable_map declares allowed keys
    // Return    : boolean 
    //  * true 
    // Action    : 
    //  * The internal configuration data structure (configMap) is updated with provided arguments. 
    //  No other actions are taken.
    // Throws    : 
    //  * Javascript error object and stack trace on unacceptable or missing arguments
    // 
    configModule = function (input_map) {
        spa.util.setConfigMap({
            input_map: input_map
            , settable_map: configMap.settable_map
            , config_map: configMap
        });
        return true;
    };
    // End public method /configModule/

    // Begin public method /initModule/
    // Example   : spa.chat.initModule($('#div_id'))
    // Purpose   : 
    //  * Directs Chat to offer its capability to the user
    // Arguments : 
    //  * $append_target (example: $('#div_id'))
    //  A jQuery collection that should represent
    //  a single DOM container
    // Setting   : 
    //  * 
    // Return    : boolean 
    //  * true  - success
    //  * false - failure
    // Action    : 
    //  * Appends the chat slider to the provided container and fills it with HTML content. It then initializes
    //  elements, events, and handlers to provide the user with a chat-room interface
    // 
    initModule = function ($container) {
        setJqueryMap($container);

        $.gevent.subscribe($container, 'spa-setchatee', onSetchatee);
        $.gevent.subscribe($container, 'spa-listchange', onListchange);
        $.gevent.subscribe($container, 'spa-logout', onLogout);

        $container
            .bind('utap', onTapNav)
            .bind('uheldstart', onHeldstartNav)
            .bind('uheldmove', onHeldmoveNav)
            .bind('uheldend', onHeldendNav);

        return true;
    }
    // End public method /initModule/
    return {
        configModule: configModule
        , initModule: initModule
    };
    // ---------- END PULIC METHODS -------------------------
}());
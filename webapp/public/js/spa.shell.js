/**
 * spa.shell.js
 * Shell module for SPA
 */

/** jslint
 *  browser : true,   continue  :  true,    devel   :  true,
 *  indent  : 4,      maxerr    :  50,      newcap  :  true,
 *  nomen   : true,   plusplus  :  true,    regexp  :  true,
 *  sloppy  : true,   vars      :  false,   white   :  false,
 *  */

/**global $, spa */

spa.shell = (function () {
    'use strict';
    // --------- BEGIN MODULE SCOPE VARIABLES --------------
    var
        configMap = {
            main_html: String()
                + '<div class="spa-shell-head">'
                + '<div class="spa-shell-head-logo">'
                + '<h1>SPA</h1>'
                + '<p>javascript end to end</p>'
                + '</div>'
                + '<div class="spa-shell-head-acct"></div>'
                // + '<div class="spa-shell-head-search"></div>'
                + '</div>'
                + '<div class="spa-shell-main">'
                + '<div class="spa-shell-main-nav"></div>'
                + '<div class="spa-shell-main-content"></div>'
                + '</div>'
                + '<div class="spa-shell-foot"></div>'
                // + '<div class="spa-shell-chat"></div>'
                + '<div class="spa-shell-modal"></div>'
            , chat_extend_time: 1000
            , chat_retract_time: 300
            , chat_extend_height: 450
            , chat_retract_height: 15
            , chat_extended_title: 'Click to retract'
            , chat_retracted_title: 'Click to extend'
            , anchor_schema_map: {
                chat: {
                    opened: true
                    , closed: true
                }
            }
            , resize_interval: 200
        }
        , stateMap = {
            $container: undefined
            , anchor_map: {}
            , resize_idto: undefined
            // , is_chat_retracted: true
        }
        , jqueryMap = {

        }
        , setJqueryMap, setChatAnchor//, onClickChat
        , copyAnchorMap, changeAnchorPart, onHashChange
        , onResize
        , onTapAcct
        , onLogin
        , onLogout
        , initModule;
    // -------- END MODULE SCOPE VARIABLES ---------

    // -------- BEGIN UTILITY METHODS ------------
    // Returns copy of stored anchor map; minimizes overhead
    // 
    copyAnchorMap = function () {
        return $.extend(true, {}, stateMap.anchor_map);
    };
    // -------- END UTILITY METHODS -----------

    // -------- BEGIN DOM METHODS ----------
    // Begin DOM method /setJqueryMap/
    // 
    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container
            , $acct: $container.find('.spa-shell-head-acct')
            , $nav: $container.find('.spa-shell-main-nav')
            // , $chat: $container.find('.spa-shell-chat')
        };
    };
    // End DOM method /setJqueryMap/

    // Begin DOM method /toggleChat/
    // Purpose   : Extends or retracts chat slider
    // Arguments :
    //  * do_extend - if true, extends slider; if false retracts
    //  * callback - optional function to execute at  end of animation
    // Setting   :
    //  * chat_extend_time,chat_retract_time
    //  * chat_extend_height,chat_retract_height
    // Return    : boolean
    //  * true  - slider animation activated
    //  * false - slider animation not activated
    // State     : sets stateMap.is_chat_retracted
    //  * true  - slider is retracted
    //  * false - slider is extended
    // 
    // toggleChat = function (do_extentd, callback) {
    //     var
    //         px_chat_ht = jqueryMap.$chat.height()
    //         , is_open = px_chat_ht === configMap.chat_extend_height
    //         , is_closed = px_chat_ht === configMap.chat_retract_height
    //         , is_sliding = !is_open && !is_closed;

    //     // avoid race condition
    //     if (is_sliding) { return false; }

    //     // Begin extend chat slider
    //     if (do_extentd) {
    //         jqueryMap.$chat.animate(
    //             {
    //                 height: configMap.chat_extend_height
    //             }
    //             , configMap.chat_extend_time
    //             , function () {
    //                 jqueryMap.$chat.attr(
    //                     'title', configMap.chat_extended_title
    //                 );
    //                 stateMap.is_chat_retracted = false;
    //                 if (callback) {
    //                     callback(jqueryMap.$chat);
    //                 }
    //             }
    //         );
    //         return true;
    //     }
    //     // End extend chat slider

    //     // Begin retract chat slider
    //     jqueryMap.$chat.animate(
    //         {
    //             height: configMap.chat_retract_height
    //         }
    //         , configMap.chat_retract_time
    //         , function () {
    //             jqueryMap.$chat.attr(
    //                 'title', configMap.chat_retracted_title
    //             );
    //             stateMap.is_chat_retracted = true;
    //             if (callback) {
    //                 callback(jqueryMap.$chat);
    //             }
    //         }
    //     )
    //     return true;
    //     // End retract chat slider

    // };
    // End DOM method /toggleChat/

    // Begin DOM method /changeAnchorPart/
    // Purpose   : Change part of the URI anchor component
    //  * 
    // Arguments : 
    //  * arg_map - the map describing what part of the URI anchor we want change
    // Setting   : 
    //  *  
    // Return    : boolean 
    //  * true    - the Anchor portion of the URI was update
    //  * false   - the Anchor portion of the URI could not be updated
    // 

    onTapAcct = function (event) {
        var
            acct_text
            , user_name
            , user = spa.model.people.get_user();
        if (user.get_is_anon()) {
            user_name = prompt('Please sign-in');
            spa.model.people.login(user_name);
            jqueryMap.$acct.text('....processing.....');
        } else {
            spa.model.people.logout();
        }
        return false;
    }

    onLogin = function (event, login_user) {
        jqueryMap.$acct.text(login_user.name);
    }

    onLogout = function (event, logout_user) {
        jqueryMap.$acct.text('Please sign-in');
    }

    changeAnchorPart = function (arg_map) {
        var
            anchor_map_revise = copyAnchorMap()
            , bool_return = true
            , key_name
            , key_name_dep;
        KEYVAL:
        // Begin merge changes into anchor map
        for (key_name in arg_map) {
            if (arg_map.hasOwnProperty(key_name)) {
                // skip dependent keys during iteration
                if (key_name.indexOf('_') === 0) {
                    continue KEYVAL;
                }
                // update independent key value
                anchor_map_revise[key_name] = arg_map[key_name];
                // update matching dependent key
                key_name_dep = '_' + key_name;
                if (arg_map[key_name_dep]) {
                    anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
                } else {
                    delete anchor_map_revise[key_name_dep];
                    delete anchor_map_revise['_s' + key_name_dep];
                }
            }
        }
        // End marge changes into anchor map

        // Begin attempt to update URI; revert if not successful
        try {
            $.uriAnchor.setAnchor(anchor_map_revise);
        } catch (error) {
            // replace URI with existing state
            $.uriAnchor.setAnchor(stateMap.anchor_map, null, true);
            bool_return = false;
        }
        // End attempt to update URI; revert if not successful
        return bool_return;
    };
    // End DOM method /changeAnchorPart/
    // -------- END DOM METHODS ----------

    // -------- BEGIN EVENT HANDLERS ---------
    // Begin Event handler /onHashChange/
    // Purpose   : 
    //  * Handles the hashchange event
    // Arguments : 
    //  * event   - JQuery event object
    // Setting   : 
    //  * none
    // Return    : boolean 
    //  * false
    // Action    : 
    //  * Parses the URI anchor component
    //  * Compares proposed application state with current
    //  * Adjust the application only where proposed state differs from existing
    // 
    onHashChange = function (event) {
        var
            anchor_map_previous = copyAnchorMap()
            , anchor_map_proposed
            , _s_chat_previous
            , _s_chat_proposed
            , s_chat_proposed
            , is_ok = true;

        // attemptto parse anchor
        try {
            anchor_map_proposed = $.uriAnchor.makeAnchorMap();
        } catch (error) {
            $.uriAnchor.setAnchor(anchor_map_previous, null, true);
            return false;
        }
        stateMap.anchor_map = anchor_map_proposed;

        // convenience vars
        _s_chat_previous = anchor_map_previous._s_chat;
        _s_chat_proposed = anchor_map_proposed._s_chat;

        // Begin adjust chat component if changed
        if (!anchor_map_previous || _s_chat_previous !== _s_chat_proposed) {
            s_chat_proposed = anchor_map_proposed.chat;
            switch (s_chat_proposed) {
                case 'opened':
                    is_ok = spa.chat.setSliderPosition('opened');
                    // toggleChat(true);
                    break;
                case 'closed':
                    is_ok = spa.chat.setSliderPosition('closed');
                    // toggleChat(false);
                    break;
                default:
                    // toggleChat(false);
                    spa.chat.setSliderPosition('closed');
                    delete anchor_map_proposed.chat;
                    $.uriAnchor.setAnchor(anchor_map_proposed, null, true);
            }
        }
        // End adjust chat component if changed

        // Begin revert anchor if slider change denied
        if (!is_ok) {
            if (anchor_map_previous) {
                $.uriAnchor.setAnchor(anchor_map_previous, null, true);
                stateMap.anchor_map = anchor_map_previous;
            } else {
                delete anchor_map_proposed.chat;
                $.uriAnchor.setAnchor(anchor_map_proposed, null, true);
            }
        }
        // End revert anchor if slider change denied
        return false;
    };
    // End DOM method /onHashChange/

    // Begin Event handler /onResize/
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
    onResize = function () {
        if (stateMap.resize_idto) {
            return true;
        }

        spa.chat.handleResize();
        stateMap.resize_idto = setTimeout(
            function () {
                stateMap.resize_idto = undefined;
            }
            , configMap.resize_interval
        );
    };
    // End DOM method /onResize/

    // Begin Event handler /onClickChat/
    // onClickChat = function (event) {
    //     changeAnchorPart({
    //         chat: (stateMap.is_chat_retracted) ? 'opened' : 'closed'
    //     });
    //     return false;
    // };
    // End Event handler /onClickChat/
    // -------- END EVENT HANDLERS ---------

    // -------- BEGIN CALLBACK METHOD ------
    // Begin callback method /setChatAnchor/
    // Example   : 
    //  * setChatAnchor('closed')
    // Purpose   : 
    //  * Change the Chat component of the anchor
    // Arguments : 
    //  * position_type - may be 'closed' or 'opened'
    // Setting   : 
    //  * 
    // Return    : 
    //  * true  - requested anchor part was updated
    //  * false - requested anchor part was not updated
    // Action    : 
    //  * Changes the URI anchor parameter 'chat' to the requested
    // Throws    : 
    //  * none
    // 
    setChatAnchor = function (position_type) {
        return changeAnchorPart({ chat: position_type });
    }
    // End DOM method /setChatAnchor/
    // -------- END CALLBACK METHOD --------

    // -------- BEGIN PULIC METHODS --------
    // Begin public method /initModule/
    // Example   : 
    //  * spa.shell.initModule($('#app_div_id'))
    // Purpose   : 
    //  * Directs the shell to offer its capability to the user
    // Arguments : 
    //  * $container (example:$('#app_div_id'))
    //    A jQuery collection that should represent a single DOM container
    // Setting   : 
    //  * none
    // Return    : 
    //  * Populates $container with the shell of the UI and then configures and initializes feature modules.
    //  * The shell is also responsible for browser-wide issues such as URI anchor and cookie management
    // Action    : 
    //  * none
    // Throws    : 
    //  * none
    // 

    // End DOM method /initModule/
    initModule = function ($container) {
        // load HTML and map JQuery collections
        stateMap.$container = $container;
        $container.html(configMap.main_html);
        setJqueryMap();

        $.gevent.subscribe($container, 'spa-login', onLogin);
        $.gevent.subscribe($container, 'spa-logout', onLogout);

        jqueryMap.$acct.text('Please sign-in').bind('utap', onTapAcct);

        // initialize chat slider and bind click handler
        // stateMap.is_chat_retracted = true;
        // jqueryMap.$chat.attr(
        //     'title', configMap.chat_retracted_title
        // ).click(onClickChat);

        // configure uriAnchor to use our schema
        $.uriAnchor.configModule({
            schema_map: configMap.anchor_schema_map
        });

        // configure and initialize feature modules
        spa.chat.configModule({
            set_chat_anchor: setChatAnchor
            , chat_model: spa.model.chat
            , people_model: spa.model.people
        });
        spa.chat.initModule(jqueryMap.$container);

        // Handle URI anchor change event
        $(window)
            .bind('resize', onResize)
            .bind('hashchange', onHashChange).trigger('hashchange');
        // test toggleChat
        // setTimeout(() => {
        //     toggleChat(true);
        // }, 3000);
        // setTimeout(() => {
        //     toggleChat(false);
        // }, 8000);
    };
    // End pulic method /initModule/

    return { initModule: initModule };
    // -------- END PULIC METHODS --------


}());
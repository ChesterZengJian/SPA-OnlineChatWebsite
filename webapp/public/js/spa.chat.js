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
            main_html: String() +
                '<div class="spa-chat">' +
                '<div class="spa-chat-head">' +
                '<div class="spa-chat-head-toggle">+</div>' +
                '<div class="spa-chat-head-title">Chat</div>' +
                '</div>' +
                '<div class="spa-chat-closer">x</div>' +
                '<div class="spa-chat-sizer">' +
                '<div class="spa-chat-msgs"></div>' +
                '<div class="spa-chat-box">' +
                '<input type="text">' +
                '<div>send</div>' +
                '</div>' +
                '</div>' +
                '</div>'
            , settable_map: {
                slider_open_time: true
                , slider_close_time: true
                , slider_opened_em: true
                , slider_closed_em: true
                , slider_opened_title: true
                , slider_closed_title: true

                , chat_model: true
                , people_model: true
                , set_chat_anchor: true
            }
            , slider_open_time: 250
            , slider_close_time: 250
            , slider_opened_em: 18
            , slider_closed_em: 2
            , slider_opened_title: 'Click to close'
            , slider_closed_title: 'Click to open'
            , slider_opened_min_em: 10
            , window_height_min_em: 20

            , chat_model: null
            , people_model: null
            , set_chat_anchor: null
        }
        , stateMap = {
            $append_target: null
            , position_type: 'closed'
            , px_per_em: 0
            , slider_hidden_px: 0
            , slider_closed_px: 0
            , slider_opened_px: 0
        }
        , jqueryMap = {

        }
        , setJqueryMap
        , getEmSize
        , setPxSizes
        , setSliderPosition
        , removeSlider
        , handleResize
        , onClickToggle
        , configModule
        , initModule;
    // ---------- END MODULE SCOPE VARIABLES ----------------

    // ---------- BEGIN UTILITY METHODS ---------------------
    getEmSize = function (elem) {
        return Number(
            getComputedStyle(elem, '').fontSize.match(/\d*\.?\d*/)[0]
        );
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
    setJqueryMap = function () {
        var
            $append_target = stateMap.$append_target
            , $slider = $append_target.find('.spa-chat');
        jqueryMap = {
            $slider: $slider
            , $head: $slider.find('.spa-chat-head')
            , $toggle: $slider.find('.spa-chat-head-toggle')
            , $title: $slider.find('.spa-chat-head-title')
            , $sizer: $slider.find('.spa-chat-sizer')
            , $msgs: $slider.find('.spa-chat-msgs')
            , $box: $slider.find('.spa-chat-box')
            , $input: $slider.find('.spa-chat-input input[type=text]')
        };
    };
    // End DOM method /setJqueryMap/

    // Begin DOM method /setPxSizes/
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
    setPxSizes = function () {
        var px_per_em, opened_height_em, window_height_em;
        px_per_em = getEmSize(jqueryMap.$slider.get(0));
        window_height_em = Math.floor(
            ($(window).height() / px_per_em) + 0.5
        );

        opened_height_em = window_height_em > configMap.window_height_min_em
            ? configMap.slider_opened_em
            : configMap.slider_opened_min_em;

        stateMap.px_per_em = px_per_em;
        stateMap.slider_closed_px = configMap.slider_closed_em * px_per_em;
        stateMap.slider_opened_px = opened_height_em   * px_per_em;

        jqueryMap.$sizer.css({
            height: (opened_height_em - 2) * px_per_em
        });
    };
    // End DOM method /setPxSizes/
    // ---------- END DOM METHODS --------------------------- b

    // ---------- BEGIN EVENT HANDLERS ----------------------
    // Begin Event handler /onClickToggle/
    // Example   : 
    //  * 
    // Purpose   : 
    //  * 
    // Arguments : 
    //  * 
    // Setting   : 
    //  * 
     //  * 
    // Action    : 
    //  * 
    // Throws    : 
    //  * 
    // 
    onClickToggle = function (event) {
        var set_chat_anchor = configMap.set_chat_anchor;
        if (stateMap.position_type === 'opened') {
            set_chat_anchor('closed');
        } else if (stateMap.position_type === 'closed') {
            set_chat_anchor('opened');
        }
        return false;
    }
    // End DOM method /onClickToggle/
    // ---------- END EVENT HANDLERS ------------------------

    // ---------- BEGIN PULIC METHODS -----------------------
    // Begin pulbic method /setSliderPosition/
    // Example   : 
    //  * spa.chat.setSliderPosition('closed');
    // Purpose   : 
    //  * Ensure chat slider is in the requested state
    // Arguments : 
    //  * position_type - enum('closed', 'opened', or 'hidden')
    //  * callback      - optional callback at end of animation. (callback receives slider DOM element as argument)
    // Setting   : 
    //  * 
    // Return    : 
    //  * true   - requested state achieved
    //  * false  - requested state not achieved
    // Action    : 
    //  * Leaves slider in current state if it matches requested, otherwise animate to requested state
    // Throws    : 
    //  * none
    // 
    setSliderPosition = function (position_type, callback) {
        var
            height_px, animate_time, slider_title, toggle_text;

        // return true if slider already in requested position
        if (stateMap.position_type === position_type) {
            return true;
        }

        // prepare animate parameters
        switch (position_type) {
            case 'opened':
                height_px = stateMap.slider_opened_px;
                animate_time = configMap.slider_open_time;
                slider_title = configMap.slider_opened_title;
                toggle_text = '=';
                break;
            case 'closed':
                height_px = stateMap.slider_closed_px;
                animate_time = configMap.slider_close_time;
                slider_title = configMap.slider_closed_title;
                toggle_text = '+';
                break;
            case 'hidden':
                height_px = 0;
                animate_time = configMap.slider_open_time;
                slider_title = '';
                toggle_text = '+';
                break;
            default:
                return false;
        }

        // animate slider position change
        stateMap.position_type = '';
        jqueryMap.$slider.animate(
            { height: height_px }
            , animate_time
            , function () {
                jqueryMap.$toggle.prop('title', slider_title);
                jqueryMap.$toggle.text(toggle_text);
                stateMap.position_type = position_type;
                if (callback) {
                    callback(jqueryMap.$slider);
                }
            }
        );
        return true;
    }
    // End DOM method /setSliderPosition/ 

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

    // Begin public method /removeSlider/
    // Example   : 
    //  * 
    // Purpose   : 
    //  * Remove chatSlider DOM element
    //  * Reverts to initial state
    //  * Removes pointers to callbacks and other data
    // Arguments : 
    //  * none
    // Setting   : 
    //  * none
    // Return    : 
    //  * true
    // Action    : 
    //  * none
    // Throws    : 
    //  * none
    // 
    removeSlider = function () {
        if (jqueryMap.$slider) {
            jqueryMap.$slider.remove();
            jqueryMap = {};
        }
        stateMap.$append_target = null;
        stateMap.position_type = 'closed';

        configMap.chat_model = null;
        configMap.people_model = null;
        configMap.set_chat_anchor = null;

        return true;
    }
    // End DOM method /removeSlider/

    // Begin public method /handleResize/
    // Example   : 
    //  * 
    // Purpose   : 
    //  * Given a window resize event, adjust the presentation provided by this module if needed
    // Arguments : 
    //  * none
    // Setting   : 
    //  * none
    // Return    : 
    //  * false - resize not considered
    //  * true  - resize considered
    // Action    : 
    //  * none
    // Throws    : 
    //  * none
    // 
    handleResize = function () {
        if (!jqueryMap.$slider) {
            return false
        }

        setPxSizes(0);
        if (stateMap.position_type === 'opened') {
            jqueryMap.$slider.css({ height: stateMap.slider_opened_px });
        }
        return true;
    };
    // End DOM method /handleResize/

    // Begin pulbic method //
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

    // End DOM method //

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
    initModule = function ($append_target) {
        $append_target.append(configMap.main_html);
        stateMap.$append_target = $append_target;
        setJqueryMap();
        setPxSizes();

        // initialize chat slider to default title and state
        jqueryMap.$toggle.prop('title', configMap.slider_closed_title);
        jqueryMap.$head.click(onClickToggle);
        stateMap.position_type = 'closed';

        return true;
    }
    // End public method /initModule/
    return {
        configModule: configModule
        , setSliderPosition: setSliderPosition
        , initModule: initModule
        , removeSlider: removeSlider
        , handleResize: handleResize
    };
    // ---------- END PULIC METHODS -------------------------
}());
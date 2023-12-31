import Blockly from 'blockly';


const BlocklyGames = () => {

    const LANGUAGE_NAME_ = {
        //  'ace': 'بهسا اچيه',  // RTL
        //  'af': 'Afrikaans',
        'am': 'አማርኛ',
        'ar': 'العربية',  // RTL
        //  'az': 'Azərbaycanca',
        'be': 'беларускі',
        'be-tarask': 'Taraškievica',
        'bg': 'български език',
        'bn': 'বাংলা',
        'br': 'Brezhoneg',
        'ca': 'Català',
        //  'cdo': '閩東語',
        'cs': 'Česky',
        'da': 'Dansk',
        'de': 'Deutsch',
        'el': 'Ελληνικά',
        'en': 'English',
        'eo': 'Esperanto',
        'es': 'Español',
        'eu': 'Euskara',
        'fa': 'فارسی',  // RTL
        'fi': 'Suomi',
        'fo': 'Føroyskt',
        'fr': 'Français',
        //  'frr': 'Frasch',
        'gl': 'Galego',
        'ha': 'Hausa',
        //  'hak': '客家話',
        'he': 'עברית',  // RTL
        'hi': 'हिन्दी',
        'hr': 'Hrvatski',
        //  'hrx': 'Hunsrik',
        'hu': 'Magyar',
        'hy': 'հայերէն',
        'ia': 'Interlingua',
        'id': 'Bahasa Indonesia',
        'ig': 'Asụsụ Igbo',
        'is': 'Íslenska',
        'it': 'Italiano',
        'ja': '日本語',
        //  'ka': 'ქართული',
        'kab': 'Taqbaylit',
        //  'km': 'ភាសាខ្មែរ',
        'kn': 'ಕನ್ನಡ',
        'ko': '한국어',
        //  'ksh': 'Ripoarėsch',
        //  'ky': 'Кыргызча',
        //  'la': 'Latine',
        //  'lb': 'Lëtzebuergesch',
        'lt': 'Lietuvių',
        'lv': 'Latviešu',
        //  'mg': 'Malagasy',
        //  'ml': 'മലയാളം',
        //  'mk': 'Македонски',
        //  'mr': 'मराठी',
        'ms': 'Bahasa Melayu',
        'my': 'မြန်မာစာ',
        //  'mzn': 'مازِرونی',  // RTL
        'nb': 'Norsk (bokmål)',
        'nl': 'Nederlands, Vlaams',
        //  'oc': 'Lenga d\'òc',
        //  'pa': 'पंजाबी',
        'pl': 'Polski',
        'pms': 'Piemontèis',
        //  'ps': 'پښتو',  // RTL
        'pt': 'Português',
        'pt-br': 'Português Brasileiro',
        'ro': 'Română',
        'ru': 'Русский',
        'sc': 'Sardu',
        //  'sco': 'Scots',
        //  'si': 'සිංහල',
        'sk': 'Slovenčina',
        'sl': 'Slovenščina',
        //  'smn': 'Anarâškielâ',
        'sq': 'Shqip',
        'sr': 'Српски',
        'sr-latn': 'Srpski',
        'sv': 'Svenska',
        //  'sw': 'Kishwahili',
        //  'ta': 'தமிழ்',
        'th': 'ภาษาไทย',
        'ti': 'ትግርኛ',
        //  'tl': 'Tagalog',
        'tr': 'Türkçe',
        'uk': 'Українська',
        'ur': 'اُردُو‬',  // RTL
        'vi': 'Tiếng Việt',
        'yo': 'Èdè Yorùbá',
        'zh-hans': '简体中文',
        'zh-hant': '正體中文',
    };


    const LANGUAGE_RTL_ = [/*'ace',*/ 'ar', 'fa', 'he', /*'mzn', 'ps',*/ 'ur'];

    const LANG = window['BlocklyGamesLang'];

    const LANGUAGES_ = window['BlocklyGamesLanguages'];

    const IS_RTL = LANGUAGE_RTL_.includes(LANG);

    const IS_HTML = /\.html$/.test(window.location.pathname);

    const GamesName = {
        "desc": "The project name.",
        "msg": "Blockly Games"
    }

    const getElementById = document.getElementById.bind(document);




    const errorReporter_ = (event) => {
        try {
            //if (Math.random() > 0.5) return;
            // 3rd party script errors (likely plugins) have no useful info.
            if (!event.lineno && !event.colno) return;
            // Rate-limit the reports to once every 10 seconds.
            const now = Date.now();
            if (errorReporter_.lastHit_ + 10 * 1000 > now) return;
            errorReporter_.lastHit_ = now;
            const req = new XMLHttpRequest();
            // Try to use the experimental 'event.error.stack',
            // otherwise, use standard properties.
            const report = (event.error && event.error.stack) ||
                `${event.message} ${event.filename} ${event.lineno}:${event.colno}`;
            const params = "error=" + encodeURIComponent(report) +
                '&amp;url=' + encodeURIComponent(window.location);
            req.open("POST", "/errorReporter");
            req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            req.send(params);
            console.log('Error reported.');
        } catch (e) {
            // Error in error reporter.  Do NOT recursively call the error reporter.
            console.log(event.error);
        }
    };

    errorReporter_.lastHit_ = 0;
    if (!IS_HTML) {
        window.addEventListener('error', errorReporter_);
    }

    /**
     * Extracts a parameter from the URL.
     * If the parameter is absent default_value is returned.
     * @param {string} name The name of the parameter.
     * @param {string} defaultValue Value to return if parameter not found.
     * @returns {string} The parameter value or the default value if not found.
     */
    const getStringParamFromUrl = (name, defaultValue) => {
        const val =
            window.location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
        return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue;
    };

    /**
     * Extracts an integer parameter from the URL.
     * If the parameter is absent or less than min_value, min_value is
     * returned.  If it is greater than max_value, max_value is returned.
     * @param {string} name The name of the parameter.
     * @param {number} minValue The minimum legal value.
     * @param {number} maxValue The maximum legal value.
     * @returns {number} A number in the range [min_value, max_value].
     */
    const getIntegerParamFromUrl = function (name, minValue, maxValue) {
        const val = Math.floor(Number(getStringParamFromUrl(name, 'NaN')));
        return isNaN(val) ? minValue : Math.max(minValue, Math.min(val, maxValue));
    };


    const storageName = null

    const LEVEL =
        getIntegerParamFromUrl('level', 1, 10);

    /**
     * Common startup tasks for all apps.
     * @param {string} title Text for the page title.
     */
    const init = (title) => {
        document.title = getMsg(GamesName, false) +
            (title && ' : ') + title;

        // Set the HTML's language and direction.
        document.dir = IS_RTL ? 'rtl' : 'ltr';
        document.head.parentElement.setAttribute('lang', LANG);

        // Populate the language selection menu.
        const languageMenu = getElementById('languageMenu');
        if (languageMenu) {
            // Sort languages alphabetically.
            const languages = [];
            for (const lang of LANGUAGES_) {
                languages.push([LANGUAGE_NAME_[lang], lang]);
            }
            const comp = function (a, b) {
                // Sort based on first argument ('English', 'Русский', '简体字', etc).
                if (a[0] > b[0]) return 1;
                if (a[0] < b[0]) return -1;
                return 0;
            };
            languages.sort(comp);
            languageMenu.options.length = 0;
            for (const [name, iso639] of languages) {
                const option = new Option(name, iso639);
                if (iso639 === LANG) {
                    option.selected = true;
                }
                languageMenu.options.add(option);
            }
            if (languageMenu.options.length <= 1) {
                // No choices.  Hide the language menu.
                languageMenu.style.display = 'none';
            }
        }

        // Highlight levels that have been completed.
        for (let i = 1; i <= 10; i++) {
            const link = getElementById('level' + i);
            const done = !!loadFromLocalStorage(storageName, i);
            if (link && done) {
                link.className += ' level_done';
            }
        }

        // Fixes viewport for small screens.
        const viewport = document.querySelector('meta[name="viewport"]');
    

        // Lazy-load Google Analytics.
        if (!IS_HTML) {
            setTimeout(importAnalytics3_, 1);
        }
    };

    /**
     * Once the page is fully loaded, move the messages to their expected locations,
     * then call the game's init function.
     * @param {!Function} init Initialization function to call.
     */
    const callWhenLoaded = (init) => {
        function go() {
            if (!window['BlocklyGamesMsg']) {
                // Messages haven't arrived yet.  Try again later.
                setTimeout(go, 99);
                return;
            }
            if (window['BlocklyMsg']) {
                Blockly.Msg = window['BlocklyMsg'];
            }
            init();
        }

        window.addEventListener('load', go);
    };

    /**
     * Reload with a different language.
     */
    const changeLanguage = () => {
        const languageMenu = getElementById('languageMenu');
        const newLang = encodeURIComponent(
            languageMenu.options[languageMenu.selectedIndex].value);
        let search = window.location.search;
        if (search.length <= 1) {
            search = '?lang=' + newLang;
        } else if (/[?&]lang=[^&]*/.test(search)) {
            search = search.replace(/([?&]lang=)[^&]*/, '$1' + newLang);
        } else {
            search = search.replace(/\?/, '?lang=' + newLang + '&');
        }

        window.location = window.location.protocol + '//' +
            window.location.host + window.location.pathname + search;
    };

    /**
     * Attempt to fetch the saved blocks for a level.
     * May be used to simply determine if a level is complete.
     * @param {string} name Name of app (maze, bird, ...).
     * @param {number} level Level (1-10).
     * @returns {string|undefined} Serialized XML, or undefined.
     */
    const loadFromLocalStorage = (name, level) => {
        let xml;
        try {
            xml = window.localStorage[name + level];
        } catch (e) {
            // Firefox sometimes throws a SecurityError when accessing localStorage.
            // Restarting Firefox fixes this, so it looks like a bug.
        }
        return xml;
    };

    /**
     * Bind a function to a button's click event.
     * On touch-enabled browsers, ontouchend is treated as equivalent to onclick.
     * @param {Element|string} el Button element or ID thereof.
     * @param {!Function} func Event handler to bind.
     */
    const bindClick = (el, func) => {
        if (!el) {
            throw TypeError('Element not found: ' + el);
        }
        if (typeof el === 'string') {
            el = getElementById(el);
        }
        el.addEventListener('click', func, true);
        function touchFunc(e) {
            // Prevent code from being executed twice on touchscreens.
            e.preventDefault();
            func(e);
        }
        el.addEventListener('touchend', touchFunc, true);
    };

    /**
     * Normalizes an angle to be in range [0-360]. Angles outside this range will
     * be normalized to be the equivalent angle with that range.
     * @param {number} angle Angle in degrees.
     * @returns {number} Standardized angle.
     */
    const normalizeAngle = (angle) => {
        angle %= 360;
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    };

    function getMsg (name, escape) {
        let msg = window['BlocklyGamesMsg'][name];
        if (msg === undefined) {
            msg = '[Unknown message: ${name}]';
        }
        return escape ? esc(msg) : msg;
    };

    /**
     * Escape HTML to make the text safe.
     * @param {string} text Unsafe text, possibly with HTML tags.
     * @returns {string} Safe text, with <>&'" escaped.
     */
    const esc = (text) => {
        return text.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };

    /**
     * Load Google Analytics 3 (UA).
     * Delete this on July 1, 2023.
     * @private
     */
    const importAnalytics3_ = () => {
        const gaName = 'GoogleAnalyticsFunction';
        window['GoogleAnalyticsObject'] = gaName;
        /**
         * Load command onto Google Analytics queue.
         * @param {...string} var_args Commands.
         */
        class gaObject {
            constructor(var_args) {
                (gaObject['q'] = gaObject['q'] || []).push(arguments);
            }
        }
        window[gaName] = gaObject;
        gaObject['l'] = 1 * new Date();
        const script = document.createElement('script');
        script.async = 1;
        script.src = '//www.google-analytics.com/analytics.js';
        document.head.appendChild(script);

        gaObject('create', 'UA-50448074-1', 'auto');
        gaObject('send', 'pageview');
    };
};

export default BlocklyGames;



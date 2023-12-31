import Blockly from 'blockly';
import BlocklyGames from './lib-games';
import BlocklyStorage from './lib-storage';

const BlocklyInterface = () => {

    const workspace = null;

    const editor = null;

    const blocksDisabled = false;

    const executedCode = '';

    const nextLevelParam = '';

    const init = function (title) {
        BlocklyGames.init(title);

        // Disable the link button if page isn't backed by App Engine storage.
        const linkButton = BlocklyGames.getElementById('linkButton');
        if (linkButton) {
            if (!BlocklyGames.IS_HTML) {
                BlocklyStorage.getCode = getCode;
                BlocklyStorage.setCode = setCode;
                BlocklyGames.bindClick(linkButton, BlocklyStorage.link);
            } else {
                linkButton.style.display = 'none';
            }
        }

        const languageMenu = BlocklyGames.getElementById('languageMenu');
        if (languageMenu) {
            languageMenu.addEventListener('change',
                changeLanguage, true);
        }
    };

    const loadBlocks = function (defaultXml, inherit) {
        if (!BlocklyGames.IS_HTML && window.location.hash.length > 1) {
            // An href with #key triggers an AJAX call to retrieve saved blocks.
            BlocklyStorage.retrieveXml(window.location.hash.substring(1));
            return;
        }

        // Language switching stores the blocks during the reload.
        let loadOnce;
        try {
            loadOnce = window.sessionStorage.loadOnceBlocks;
        } catch (e) {
            // Firefox sometimes throws a SecurityError when accessing sessionStorage.
            // Restarting Firefox fixes this, so it looks like a bug.
        }
        if (loadOnce) {
            delete window.sessionStorage.loadOnceBlocks;
        }

        const savedLevel =
            BlocklyGames.loadFromLocalStorage(BlocklyGames.storageName,
                BlocklyGames.LEVEL);
        let inherited = inherit &&
            BlocklyGames.loadFromLocalStorage(BlocklyGames.storageName,
                BlocklyGames.LEVEL - 1);
        if (inherited && typeof inherit === 'function') {
            inherited = inherit(inherited);
        }

        const restore = loadOnce || savedLevel || inherited || defaultXml;
        if (restore) {
            setCode(restore);
        }
    };

    const setCode = function (code) {
        if (editor) {
            // Text editor.
            editor['setValue'](code, -1);
        } else {
            // Blockly editor.
            const xml = Blockly.Xml.textToDom(code);
            // Clear the workspace to avoid merge.
            workspace.clear();
            Blockly.Xml.domToWorkspace(xml, workspace);
            workspace.clearUndo();
        }
    };


    const getCode = function () {
        let text;
        if (blocksDisabled) {
            // Text editor.
            text = editor['getValue']();
        } else {
            // Blockly editor.
            const xml = Blockly.Xml.workspaceToDom(workspace, true);
            // Remove x/y coordinates from XML if there's only one block stack.
            // There's no reason to store this, removing it helps with anonymity.
            if (workspace.getTopBlocks(false).length === 1 &&
                xml.querySelector) {
                const block = xml.querySelector('block');
                if (block) {
                    block.removeAttribute('x');
                    block.removeAttribute('y');
                }
            }
            text = Blockly.Xml.domToText(xml);
        }
        return text;
    };

    /**
     * Monitor the block or JS editor.  If a change is made that changes the code,
     * clear the key from the URL.
     */
    const codeChanged = function () {
        if (BlocklyStorage.startCode !== null &&
            BlocklyStorage.startCode !== getCode()) {
            window.location.hash = '';
            BlocklyStorage.startCode = null;
        }
    };


    const injectBlockly = function (options) {
        const toolbox = BlocklyGames.getElementById('toolbox');
        if (toolbox) {
            options['toolbox'] = toolbox;
        }
        
        workspace = Blockly.inject('blockly', options);
        workspace.addChangeListener(codeChanged);
    };

    /**
     * Save the blocks/JS for this level to persistent client-side storage.
     */
    const saveToLocalStorage = function () {
        // MSIE 11 does not support localStorage on file:// URLs.
        if (!window.localStorage) {
            return;
        }
        const name = BlocklyGames.storageName + BlocklyGames.LEVEL;
        window.localStorage[name] = executedCode;
    };

    /**
     * Go to the index page.
     */
    const indexPage = function () {
        window.location = (BlocklyGames.IS_HTML ? 'index.html' : './') +
            '?lang=' + BlocklyGames.LANG;
    };

    /**
     * Save the blocks/code for a one-time reload.
     */
    const saveToSessionStorage = function () {
        // Store the blocks for the duration of the reload.
        // MSIE 11 does not support sessionStorage on file:// URLs.
        if (window.sessionStorage) {
            window.sessionStorage.loadOnceBlocks = getCode();
        }
    };

    /**
     * Save the blocks and reload with a different language.
     */
    const changeLanguage = function () {
        saveToSessionStorage();
        BlocklyGames.changeLanguage();
    };

    /**
     * Go to the next level.
     */
    const nextLevel = function () {
        if (BlocklyGames.LEVEL < BlocklyGames.MAX_LEVEL) {
            const location = location.protocol + '//' + location.host + location.pathname +
                '?lang=' + BlocklyGames.LANG + '&level=' + (BlocklyGames.LEVEL + 1) +
                nextLevelParam;
        } else {
            indexPage();
        }
    };


    const injectReadonly = function (id, xml) {
        const div = BlocklyGames.getElementById(id);
        if (!div.firstChild) {
            const workspace =
                Blockly.inject(div, { 'rtl': BlocklyGames.IS_RTL, 'readOnly': true });
            if (typeof xml !== 'string') {
                xml = xml.join('');
            }
            Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace);
        }
    };


    class eventSpam {
        constructor(e) {
            // Touch screens can generate 'touchend' followed shortly thereafter by
            // 'click'.  For now, just look for this very specific combination.
            // Some devices have both mice and touch, but assume the two won't occur
            // within two seconds of each other.
            const touchMouseTime = 2000;
            if (e.type === 'click' &&
                eventSpam.previousType_ === 'touchend' &&
                eventSpam.previousDate_ + touchMouseTime > Date.now()) {
                e.preventDefault();
                e.stopPropagation();
                return true;
            }
            // Users double-click or double-tap accidentally.
            const doubleClickTime = 400;
            if (eventSpam.previousType_ === e.type &&
                eventSpam.previousDate_ + doubleClickTime > Date.now()) {
                e.preventDefault();
                e.stopPropagation();
                return true;
            }
            eventSpam.previousType_ = e.type;
            eventSpam.previousDate_ = Date.now();
            return false;
        }
    }

    eventSpam.previousType_ = null;
    eventSpam.previousDate_ = 0;
};
export default BlocklyInterface;
import Blockly from 'blockly';
import BlocklyGames from './lib-games';
import BlocklyInterface from './lib-interface';


const BlocklyDialogs = () => {

    const isDialogVisible_ = false;

    const dialogOrigin_ = null;

    const dialogDispose_ = null;

    const dialogMouseDownWrapper_ = null;

    const dialogMouseUpWrapper_ = null;

    const dialogMouseMoveWrapper_ = null;


    const showDialog = function (content, origin, animate, modal, style,
        disposeFunc) {
        if (!content) {
            throw TypeError('Content not found: ' + content);
        }
        const buttons = content.getElementsByClassName('addHideHandler');
        var button;
        while ((button = buttons[0])) {
            button.addEventListener('click', hideDialog, true);
            button.addEventListener('touchend', hideDialog, true);
            button.classList.remove('addHideHandler');
        }
        if (isDialogVisible_) {
            hideDialog(false);
        }
        if (Blockly.getMainWorkspace()) {
            // Some levels have an editor instead of Blockly.
            Blockly.hideChaff(true);
        }
        isDialogVisible_ = true;
        dialogOrigin_ = origin;
        dialogDispose_ = disposeFunc;
        const dialog = BlocklyGames.getElementById('dialog');
        const shadow = BlocklyGames.getElementById('dialogShadow');
        const border = BlocklyGames.getElementById('dialogBorder');

        // Copy all the specified styles to the dialog.
        for (const name in style) {
            dialog.style[name] = style[name];
        }
        if (modal) {
            shadow.style.visibility = 'visible';
            shadow.style.opacity = 0.3;
            shadow.style.zIndex = 9;
            const header = document.createElement('div');
            header.id = 'dialogHeader';
            dialog.appendChild(header);
            dialogMouseDownWrapper_ =
                Blockly.browserEvents.bind(header, 'mousedown', null,
                    dialogMouseDown_);
        }
        dialog.appendChild(content);
        content.classList.remove('dialogHiddenContent');

        function endResult() {
            // Check that the dialog wasn't closed during opening.
            if (!isDialogVisible_) {
                return;
            }
            dialog.style.visibility = 'visible';
            dialog.style.zIndex = 10;
            border.style.visibility = 'hidden';

            // Focus on the dialog's most important button.
            let buttons = content.getElementsByClassName('primary');
            if (!buttons.length) {
                buttons = content.getElementsByClassName('secondary');
                if (!buttons.length) {
                    buttons = content.getElementsByTagName('button');
                }
            }
            if (buttons.length) {
                buttons[0].focus();
            }
        }
        // The origin (if it exists) might be a button we should lose focus on.
        try {
            origin.blur();
        } catch (e) { }

        if (animate && origin) {
            matchBorder_(origin, false, 0.2);
            matchBorder_(dialog, true, 0.8);
            // In 175ms show the dialog and hide the animated border.
            setTimeout(endResult, 175);
        } else {
            // No animation.  Just set the final state.
            endResult();
        }
    };

    /**
     * Horizontal start coordinate of dialog drag.
     */
    const dialogStartX_ = 0;

    /**
     * Vertical start coordinate of dialog drag.
     */
    const dialogStartY_ = 0;

    /**
     * Handle start of drag of dialog.
     * @param {!Event} e Mouse down event.
     * @private
     */
    const dialogMouseDown_ = function (e) {
        dialogUnbindDragEvents_();
        if (Blockly.utils.isRightButton(e)) {
            // Right-click.
            return;
        }
        // Left click (or middle click).
        // Record the starting offset between the current location and the mouse.
        const dialog = BlocklyGames.getElementById('dialog');
        dialogStartX_ = dialog.offsetLeft - e.clientX;
        dialogStartY_ = dialog.offsetTop - e.clientY;

        dialogMouseUpWrapper_ = Blockly.browserEvents.bind(document,
            'mouseup', null, BlocklyDialogs.dialogUnbindDragEvents_);
        dialogMouseMoveWrapper_ = Blockly.browserEvents.bind(document,
            'mousemove', null, dialogMouseMove_);
        // This event has been handled.  No need to bubble up to the document.
        e.stopPropagation();
    };


    const dialogMouseMove_ = function (e) {
        const dialog = BlocklyGames.getElementById('dialog');
        let dialogLeft = dialogStartX_ + e.clientX;
        let dialogTop = dialogStartY_ + e.clientY;
        dialogTop = Math.max(dialogTop, 0);
        dialogTop = Math.min(dialogTop, window.innerHeight - dialog.offsetHeight);
        dialogLeft = Math.max(dialogLeft, 0);
        dialogLeft = Math.min(dialogLeft, window.innerWidth - dialog.offsetWidth);
        dialog.style.left = dialogLeft + 'px';
        dialog.style.top = dialogTop + 'px';
    };


    const dialogUnbindDragEvents_ = function () {
        if (dialogMouseUpWrapper_) {
            Blockly.browserEvents.unbind(dialogMouseUpWrapper_);
            dialogMouseUpWrapper_ = null;
        }
        if (dialogMouseMoveWrapper_) {
            Blockly.browserEvents.unbind(dialogMouseMoveWrapper_);
            dialogMouseMoveWrapper_ = null;
        }
    };


    const hideDialog = function (opt_animate = true) {
        if (!isDialogVisible_) {
            return;
        }
        dialogUnbindDragEvents_();
        if (dialogMouseDownWrapper_) {
            Blockly.browserEvents.unbind(dialogMouseDownWrapper_);
            dialogMouseDownWrapper_ = null;
        }

        isDialogVisible_ = false;
        dialogDispose_ && dialogDispose_();
        dialogDispose_ = null;
        const origin = opt_animate ? dialogOrigin_ : null;
        const dialog = BlocklyGames.getElementById('dialog');
        const shadow = BlocklyGames.getElementById('dialogShadow');

        shadow.style.opacity = 0;

        function endResult() {
            shadow.style.zIndex = -1;
            shadow.style.visibility = 'hidden';
            const border = BlocklyGames.getElementById('dialogBorder');
            border.style.visibility = 'hidden';
        }
        if (origin && dialog) {
            matchBorder_(dialog, false, 0.8);
            matchBorder_(origin, true, 0.2);
            // In 175ms hide both the shadow and the animated border.
            setTimeout(endResult, 175);
        } else {
            // No animation.  Just set the final state.
            endResult();
        }
        dialog.style.visibility = 'hidden';
        dialog.style.zIndex = -1;
        const header = BlocklyGames.getElementById('dialogHeader');
        if (header) {
            header.parentNode.removeChild(header);
        }
        while (dialog.firstChild) {
            const content = dialog.firstChild;
            content.classList.add('dialogHiddenContent');
            document.body.appendChild(content);
        }
    };

    /**
     * Match the animated border to the a element's size and location.
     * @param {!Element} element Element to match.
     * @param {boolean} animate Animate to the new location.
     * @param {number} opacity Opacity of border.
     * @private
     */
    const matchBorder_ = function (element, animate, opacity) {
        if (!element) {
            return;
        }
        const border = BlocklyGames.getElementById('dialogBorder');
        const bBox = getBBox(element);
        function change() {
            border.style.width = bBox.width + 'px';
            border.style.height = bBox.height + 'px';
            border.style.left = bBox.x + 'px';
            border.style.top = bBox.y + 'px';
            border.style.opacity = opacity;
        }
        if (animate) {
            border.className = 'dialogAnimate';
            setTimeout(change, 1);
        } else {
            border.className = '';
            change();
        }
        border.style.visibility = 'visible';
    };


    const getBBox = function (element) {
        const xy = Blockly.utils.style.getPageOffset(element);
        const box = {
            x: xy.x,
            y: xy.y,
        };
        if (element.getBBox) {
            // SVG element.
            const bBox = element.getBBox();
            box.height = bBox.height;
            box.width = bBox.width;
        } else {
            // HTML element.
            box.height = element.offsetHeight;
            box.width = element.offsetWidth;
        }
        return box;
    };

    const storageAlert = function (origin, message) {
        const container = BlocklyGames.getElementById('containerStorage');
        container.textContent = '';
        const lines = message.split('\n');
        for (const line of lines) {
            const p = document.createElement('p');
            p.appendChild(document.createTextNode(line));
            container.appendChild(p);
        }

        const content = BlocklyGames.getElementById('dialogStorage');
        const style = {
            width: '50%',
            left: '25%',
            top: '5em',
        };
        showDialog(content, origin, true, true, style,
            stopDialogKeyDown);
        startDialogKeyDown();
    };

    /**
     * Display a dialog suggesting that the user give up.
     */
    const abortOffer = function () {
        // If the user has solved the level, all is well.
        if (BlocklyGames.loadFromLocalStorage(BlocklyGames.storageName,
            BlocklyGames.LEVEL)) {
            return;
        }
        // Don't override an existing dialog, or interrupt a drag.
        if (isDialogVisible_ ||
            BlocklyInterface.workspace.isDragging()) {
            setTimeout(abortOffer, 15 * 1000);
            return;
        }

        const content = BlocklyGames.getElementById('dialogAbort');
        const style = {
            width: '40%',
            left: '30%',
            top: '3em',
        };

        const ok = BlocklyGames.getElementById('abortOk');
        ok.addEventListener('click', BlocklyInterface.indexPage, true);
        ok.addEventListener('touchend', BlocklyInterface.indexPage, true);

        showDialog(content, null, false, true, style,
            function () {
                document.body.removeEventListener('keydown',
                    abortKeyDown_, true);
            });
        document.body.addEventListener('keydown', abortKeyDown_, true);
    };


    const dialogKeyDown = function (e) {
        if (isDialogVisible_) {
            if (e.keyCode === 13 || e.keyCode === 27 || e.keyCode === 32) {
                hideDialog(true);
                e.stopPropagation();
                e.preventDefault();
            }
        }
    };

    /**
     * Start listening for BlocklyDialogs.dialogKeyDown.
     */
    const startDialogKeyDown = function () {
        document.body.addEventListener('keydown',
            dialogKeyDown, true);
    };

    /**
     * Stop listening for BlocklyDialogs.dialogKeyDown.
     */
    const stopDialogKeyDown = function () {
        document.body.removeEventListener('keydown',
            dialogKeyDown, true);
    };

    /**
     * If the user presses enter, escape, or space, hide the dialog.
     * Enter and space move to the index page, escape does not.
     * @param {!Event} e Keyboard event.
     * @private
     */
    const abortKeyDown_ = function (e) {
        BlocklyDialogs.dialogKeyDown(e);
        if (e.keyCode === 13 || e.keyCode === 32) {
            BlocklyInterface.indexPage();
        }
    };

    // Export symbols that would otherwise be renamed by Closure compiler.
    window['BlocklyDialogs'] = BlocklyDialogs;
};
export default BlocklyDialogs;
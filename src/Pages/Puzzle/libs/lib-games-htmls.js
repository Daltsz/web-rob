import Blockly from 'blockly';
import BlocklyGames from './lib-games';

const BlocklyGamesHtml = () => {

    const headerBar = function (ij, appName, levelLinkSuffix,
        hasLinkButton, hasHelpButton, farLeftHtml) {
        let linkButton = '';
        if (hasLinkButton) {
            linkButton = `
&nbsp;
<button id="linkButton" title="${BlocklyGames.getMsg('Games.linkTooltip', true)}">
  <img src="common/1x1.gif" class="link icon21">
</button>
`;
        }
        let helpButton = '';
        if (hasHelpButton) {
            helpButton = `
&nbsp;
<button id="helpButton">${BlocklyGames.getMsg('Games.help', true)}</button>
`;
        }
        if (farLeftHtml) {
            farLeftHtml = ' &nbsp; ' + farLeftHtml;
        }
        return `
<table width="100%">
  <tr>
    <td>
      <h1>
        ${titleSpan_(ij, appName)}
        ${ij.level ? levelLinks_(ij, levelLinkSuffix) : ''}
      </h1>
    </td>
    <td id="header_cta" class="farSide">
      <select id="languageMenu"></select>
      ${linkButton}
      ${helpButton}
      ${farLeftHtml}
    </td>
  </tr>
</table>
`;
    };

    /**
     * Print the title span (Blockly Games : AppName).
     * @param {!Object} ij Injected options.
     * @param {string} appName Name of application.
     * @returns {string} HTML.
     * @private
     */
    const titleSpan_ = function (ij, appName) {
        return `
<span id="title">
  <a href="${ij.html ? 'index.html' : './'}?lang=${ij.lang}">${BlocklyGames.getMsg('Games.name', true)}</a> : ${appName}
</span>
`;
    };

    /**
     * List of links to other levels.
     * @param {!Object} ij Injected options.
     * @param {string} suffix Any extra parameters for links.
     * @returns {string} HTML.
     * @private
     */
    const levelLinks_ = function (ij, suffix) {
        let html = ' &nbsp ';
        for (let i = 1; i <= ij.maxLevel; i++) {
            let url = `?lang=${ij.lang}&level=${i}`;
            if (suffix) {
                url += '&' + suffix;
            }
            html += ' ';
            if (i === ij.level) {
                html += `<span class="level_number level_done" id="level${i}">${i}</span>`;
            } else if (i === ij.maxLevel) {
                html += `<a class="level_number" id="level${i}" href="${url}">${i}</a>`;
            } else {
                html += `<a class="level_dot" id="level${i}" href="${url}"></a>`;
            }
        }
        return html;
    };

    /**
     * Dialogs.
     * @returns {string} HTML.
     */
    const dialog = function () {
        return `
<div id="dialogShadow" class="dialogAnimate"></div>
<div id="dialogBorder"></div>
<div id="dialog"></div>
`;
    };

    /**
     * Done dialog.
     * @returns {string} HTML.
     */
    const doneDialog = function () {
        return `
<div id="dialogDone" class="dialogHiddenContent">
  <div style="font-size: large; margin: 1em;">${BlocklyGames.getMsg('Games.congratulations', true)}</div>
  <div id="dialogLinesText" style="font-size: large; margin: 1em;"></div>
  <pre id="containerCode"></pre>
  <div id="dialogDoneText" style="font-size: large; margin: 1em;"></div>
  <div id="dialogDoneButtons" class="farSide" style="padding: 1ex 3ex 0">
    <button class="addHideHandler">${BlocklyGames.esc(Blockly.Msg['DIALOG_CANCEL'])}</button>
    <button id="doneOk" class="secondary">${BlocklyGames.esc(Blockly.Msg['DIALOG_OK'])}</button>
  </div>
</div>
`;
    };

    /**
     * Abort dialog.
     * @returns {string} HTML.
     */
    const abortDialog = function () {
        return `
<div id="dialogAbort" class="dialogHiddenContent">
  ${BlocklyGames.getMsg('Games.helpAbort', true)}
  <div class="farSide" style="padding: 1ex 3ex 0">
    <button class="addHideHandler">${BlocklyGames.esc(Blockly.Msg['DIALOG_CANCEL'])}</button>
    <button id="abortOk" class="secondary">${BlocklyGames.esc(Blockly.Msg['DIALOG_OK'])}</button>
  </div>
</div>
`;
    };

    /**
     * Storage dialog.
     * @returns {string} HTML.
     */
    const storageDialog = function () {
        return `
<div id="dialogStorage" class="dialogHiddenContent">
  <div id="containerStorage"></div>
  ${ok()}
</div>
`;
    };

    /**
     * OK button for dialogs.
     * @returns {string} HTML.
     */
    const ok = function () {
        return `
<div class="farSide" style="padding: 1ex 3ex 0">
  <button class="secondary addHideHandler">${BlocklyGames.esc(Blockly.Msg['DIALOG_OK'])}</button>
</div>
`;
    };
};
export default BlocklyGamesHtml;
import BlocklyGames from "./libs/lib-games";
import messages from './message.json'
import BlocklyGamesHtml from "./libs/lib-games-htmls";

const start = (ij) => {
  return `
${BlocklyGamesHtml.headerBar(ij, BlocklyGames.getMsg(messages['Games.puzzle'], true), '', false, true,
    `<button id="checkButton" class="primary">${BlocklyGames.getMsg(messages['Puzzle.checkAnswers'], true)}</button>`)}

<div id="blockly"></div>

${BlocklyGamesHtml.dialog()}
<div id="help" class="dialogHiddenContent">
  <div style="padding-bottom: 0.7ex">${BlocklyGames.getMsg(messages['Puzzle.helpText'], true)}</div>
  <div id="sample" class="readonly"></div>
  ${BlocklyGamesHtml.ok()}
</div>
<div id="answers" class="dialogHiddenContent">
  <div id="answerMessage">
  </div>
  <div id="graph"><div id="graphValue"></div></div>
  ${BlocklyGamesHtml.ok()}
</div>
`;
};

export default start;
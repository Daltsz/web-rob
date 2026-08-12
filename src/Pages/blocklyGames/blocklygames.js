import React, { useEffect } from "react";
import "./css/index.css"
import IndexBlocklyGames from './index.js';

const BlocklyGamesComponent = () => {
  useEffect(() => {
    document.body.classList.add('blockly-games-page-active');

    return () => {
      document.body.classList.remove('blockly-games-page-active');
    };
  }, []);

  return (
    <div className="blockly-games-page">
      <IndexBlocklyGames />
    </div>
  );
};

export default BlocklyGamesComponent;

import Blockly from 'blockly/blocks';
import "./blocks.js";

import React, { useEffect } from "react";
import "./index.css"
import Puzzle from './main.js';

const PuzzleComponent = () => {
  useEffect(() => {
    document.body.classList.add('puzzle-page-active');

    return () => {
      document.body.classList.remove('puzzle-page-active');
    };
  }, []);

  return (
    <div className="puzzle-page">
      <Puzzle />
    </div>
  );
};

export default PuzzleComponent;

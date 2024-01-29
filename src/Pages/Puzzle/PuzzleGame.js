import Blockly from 'blockly/blocks';
import "./blocks.js";

import React, { useRef, useState } from "react";
import "./index.css"
import Puzzle from './main.js';

const PuzzleComponent = () => {
  

  return<>
      <div>
          <Puzzle/>
      </div>
  </>
};

export default PuzzleComponent;

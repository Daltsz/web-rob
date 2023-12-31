import Blockly from 'blockly/blocks';
import "./blocks.js";

import React, { useRef, useState } from "react";
import { BlocklyWorkspace, useBlocklyWorkspace} from "react-blockly";
import {javascriptGenerator} from 'blockly/javascript';
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

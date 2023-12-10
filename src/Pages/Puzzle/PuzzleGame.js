import Blockly from 'blockly/blocks';
import "./blocks.js";
import { getPuzzleData } from "./data.js";
import { DEFAULT_GAME } from "./workspace.js";
import React, { useRef, useState } from "react";
import { BlocklyWorkspace, useBlocklyWorkspace} from "react-blockly";
import {javascriptGenerator} from 'blockly/javascript';
import "./index.css"

const PuzzleComponent = () => {
  const toolbox = getPuzzleData();
  const [workspaceCode, setWorkspaceCode] = useState('');
  const blocklyRef = useRef(null);
  const { workspace } = useBlocklyWorkspace({
    toolboxConfiguration: toolbox,
    workspaceConfiguration: DEFAULT_GAME,
    ref: blocklyRef,
  });

  return<>
      <div id="blocklyDiv">
        <div  className="fill-height" ref={workspace}>
          <BlocklyWorkspace/>
        </div>
          
        <div className="code">{workspaceCode}</div>
      </div>
  </>
};

export default PuzzleComponent;

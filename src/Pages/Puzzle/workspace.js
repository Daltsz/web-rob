/* TODO: Change toolbox XML ID if necessary. Can export toolbox XML from Workspace Factory. */
import Blockly from 'blockly/blocks';

var toolbox = {
    "kind": "flyoutToolbox",
    "contents": [
      {
        "kind": "block",
        "type": "controls_if"
      },
      {
        "kind": "block",
        "type": "controls_whileUntil"
      }
    ]
  };

export const DEFAULT_GAME = {
	toolbox : toolbox, 
	collapse : false, 
	comments : false, 
	disable : false, 
	maxBlocks : 100, 
	trashcan : false, 
	horizontalLayout : false, 
	toolboxPosition : 'start', 
	css : false, 
	media : 'https://blockly-demo.appspot.com/static/media/', 
	rtl : false, 
	scrollbars : false, 
	sounds : false, 
	oneBasedIndex : false
};

/* Inject your workspace */ 
var workspace = Blockly.inject('blocklyDiv', {toolbox: toolbox});

/* Load Workspace Blocks from XML to workspace. Remove all code below if no blocks to load */

// /* TODO: Change workspace blocks XML ID if necessary. Can export workspace blocks XML from Workspace Factory. */
var workspaceBlocks = document.getElementById("workspaceBlocks"); 

// /* Load blocks to workspace. */
Blockly.Xml.domToWorkspace(workspaceBlocks, workspace);


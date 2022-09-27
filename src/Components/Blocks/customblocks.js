
import * as Blockly from 'blockly/core';

Blockly.Blocks['led_blink'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("BlinkLed"), "Blink_Led ");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};



Blockly.Blocks['Para_Frente'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("Para_Frente"), "Para_Frente ");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(70);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};


Blockly.Blocks['Para_Tras'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("Para_Tras"), "Para_Tras ");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(70);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};



Blockly.Blocks['Esquerda'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("Esquerda"), "Esquerda ");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(70);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};


Blockly.Blocks['Direita'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("Direita"), "Direita ");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(70);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
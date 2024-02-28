import Blockly from 'blockly';
import 'blockly/javascript';
import {javascriptGenerator} from 'blockly/javascript';

Blockly.Blocks['esperar'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("espere")
          .appendField(new Blockly.FieldDropdown([["1","Um segundo"], ["2","Dois segundos"], ["3","Três segundos"], ["4","Quatro segundos"], ["5","Cinco segundos"]]), "1")
          .appendField("segundo(s)");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(330);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };
  
  Blockly.Blocks['rotaciona'] = {
    init: function() {
      this.appendEndRowInput()
          .appendField("rotacionar")
          .appendField(new Blockly.FieldDropdown([["1 segundo","Um segundo"], ["2 segundos","Dois segundos"], ["3 segundos","Três segundos"], ["4 segundos","Quatro segundos"], ["5 segundos","Cinco segundos"]]), "1")
          .appendField("para")
          .appendField(new Blockly.FieldDropdown([["direita","Para Direita"], ["esquerda","Para Esquerda"]]), "direita");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };
  
  Blockly.Blocks['movimentacao'] = {
    init: function() {
      this.appendEndRowInput()
          .appendField("move")
          .appendField(new Blockly.FieldDropdown([["avançar","Para Frente"], ["recuar","Para Trás"]]), "avançar")
          .appendField("tempo")
          .appendField(new Blockly.FieldDropdown([["1 segundo","1"], ["2 segundos","2"], ["3 segundos","3"], ["4 segundos","4"], ["5 segundos","5"]]), "time")
          .appendField("velocidade")
          .appendField(new Blockly.FieldDropdown([["devagar","Devagar"], ["rápido","Rápido"], ["médio","Médio"]]), "devagar");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };
  
  Blockly.Blocks['repeticao'] = {
    init: function() {
      this.appendEndRowInput()
          .appendField("repita")
          .appendField(new Blockly.FieldDropdown([["1","1"], ["2","2"], ["3","3"]]), "repetir")
          .appendField("vezes");
      this.appendStatementInput("faz")
          .setCheck(null)
          .appendField("e faça");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(20);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };

  javascriptGenerator.forBlock['esperar'] = function(block, generator) {
    var dropdown_1 = block.getFieldValue('1');
    var code = 'esperar\n';
    return code;
  };
  
  javascriptGenerator.forBlock['rotaciona'] = function(block, generator) {
    var dropdown_30_ = block.getFieldValue('1 segundo');
    var dropdown_direita = block.getFieldValue('direita');
    var statements_faz = generator.statementToCode(block, 'faz');
    // TODO: Assemble javascript into code variable.
    // var code = `led.blink(1000);board.wait(${10000},async()=>{led.off().stop();res.writeContinue();});`;
    var code = 'rotacionar\n';
    return code;
  };
  
  javascriptGenerator.forBlock['movimentacao'] = function(block, generator) {
    var dropdown_avan_ar = block.getFieldValue('avançar');
    var dropdown_time = block.getFieldValue('time');
    var dropdown_devagar = block.getFieldValue('devagar');


    var code = `motors.reverse(${dropdown_avan_ar});board.wait(${dropdown_time * 1000},async()=>{motor.off().stop();res.writeContinue();});`;
    console.log(code);
    return code;
  };
  
  javascriptGenerator.forBlock['repeticao'] = function(block, generator) {
    var dropdown_1 = block.getFieldValue('repetir');
    var statements_faz = generator.statementToCode(block, 'faz');
    // TODO: Assemble javascript into code variable.
    var code = `for(int i = 0, i < ${dropdown_1}, i++){${statements_faz}}`;
    return code;
  };
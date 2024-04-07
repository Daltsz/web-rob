import Blockly from 'blockly';
import 'blockly/javascript';
import {javascriptGenerator} from 'blockly/javascript';


  Blockly.Blocks['Para_Frente'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Para_Frente");
      this.setOutput(true, "String");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(70);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };


  javascriptGenerator.forBlock['Para_Frente'] = function() {
    const code = 'Para_Frente '
    return [code]
  };

  
  Blockly.Blocks['Para_Tras'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Para_Tras");
      this.setOutput(true, "String");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(70);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };
  
  
  javascriptGenerator.forBlock['Para_Tras'] = function() {
    const code = 'Para_Tras '
    return [code]
  };
  
  
  Blockly.Blocks['Esquerda'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Esquerda");
      this.setOutput(true, "String");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(70);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };

  javascriptGenerator.forBlock['Esquerda'] = function() {
    const code = 'Esquerda '
    return code
  };
  
  
  
  Blockly.Blocks['Direita'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Direita");
      this.setOutput(true, "String"); 
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(100);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };

  javascriptGenerator.forBlock['Direita'] = function() {
    const code = 'Direita '
    return code
  };


  // Blockly.Blocks['Concatenar_Strings'] = {
  //   init: function() {
  //     this.appendDummyInput()
  //         .appendField("Concatenar Strings");
  //     this.setOutput(true, "Array");
  //     this.setColour(70);
  //     this.setTooltip("");
  //     this.setHelpUrl("");
  //   }
  // };
  
  // Blockly.JavaScript['Concatenar_Strings'] = function(block) {
  //   // Crie um array para armazenar as strings
  //   var lista = [];
    
  //   // Coletar as saídas dos blocos de string e adicioná-las ao array
  //   for (var i = 0; i < block.inputList.length; i++) {
  //     var input = block.inputList[i];
  //     if (input.connection && input.connection.targetBlock()) {
  //       var stringValue = Blockly.JavaScript.valueToCode(block, 'STRING' + i, Blockly.JavaScript.ORDER_NONE);
  //       lista.push(stringValue);
  //     }
  //   }
    
  //   // Retorne o array como um array Blockly
  //   return [JSON.stringify(lista)];
  // };
  
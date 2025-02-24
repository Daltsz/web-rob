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
  const code = `
motor1_pin1 = machine.Pin(0, machine.Pin.OUT)
motor1_pin2 = machine.Pin(14, machine.Pin.OUT)
motor2_pin1 = machine.Pin(12, machine.Pin.OUT)
motor2_pin2 = machine.Pin(13, machine.Pin.OUT)
motor1_pin1.value(1)
motor1_pin2.value(0)
motor2_pin1.value(1)
motor2_pin2.value(0)
time.sleep(2)
motor1_pin1.value(0)
motor1_pin2.value(0)
motor2_pin1.value(0)
motor2_pin2.value(0)`
  return code
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
  const code = `
motor1_pin1 = machine.Pin(0, machine.Pin.OUT)
motor1_pin2 = machine.Pin(14, machine.Pin.OUT)
motor2_pin1 = machine.Pin(12, machine.Pin.OUT)
motor2_pin2 = machine.Pin(13, machine.Pin.OUT)
motor1_pin1.value(0)
motor1_pin2.value(1)
motor2_pin1.value(0)
motor2_pin2.value(1)
time.sleep(2)
motor1_pin1.value(0)
motor1_pin2.value(0)
motor2_pin1.value(0)
motor2_pin2.value(0)`
  return code
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
  const code = `
motor1_pin1 = machine.Pin(0, machine.Pin.OUT)
motor1_pin2 = machine.Pin(14, machine.Pin.OUT)
motor2_pin1 = machine.Pin(12, machine.Pin.OUT)
motor2_pin2 = machine.Pin(13, machine.Pin.OUT)
motor1_pin1.value(0)
motor1_pin2.value(1) 
motor2_pin1.value(1)
motor2_pin2.value(0)
time.sleep(2)
motor1_pin1.value(0)
motor1_pin2.value(0)
motor2_pin1.value(0)
motor2_pin2.value(0)`
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
  const code = `
motor1_pin1 = machine.Pin(0, machine.Pin.OUT)
motor1_pin2 = machine.Pin(14, machine.Pin.OUT)
motor2_pin1 = machine.Pin(12, machine.Pin.OUT)
motor2_pin2 = machine.Pin(13, machine.Pin.OUT)
motor1_pin1.value(1)
motor1_pin2.value(0) 
motor2_pin1.value(0)
motor2_pin2.value(1)
time.sleep(2)
motor1_pin1.value(0)
motor1_pin2.value(0)
motor2_pin1.value(0)
motor2_pin2.value(0)`
  return code
};



  
Blockly.Blocks['piscarLed'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("piscar Led");
    this.setOutput(true, "String");
    this.setPreviousStatement(true, null);
    this.setColour(70);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};
// javascriptGenerator.forBlock['piscarLed'] = function() {
//   const code = "led.blink(1000);board.wait(10000,async()=>{led.off().stop();res.writeContinue();}); "
//   return code
// };
javascriptGenerator.forBlock['piscarLed'] = function() {
const code = `
pin = machine.Pin(2,machine.Pin.OUT)
on = False

while True:
  on = not on
  pin.value(on)
  time.sleep(0.5)`
    // const code = "var on=false;var pin=D2;setInterval(function(){on=!on;digitalWrite(pin,on);},500)"
    // const code ="var on=true;var pin3=0;var pin5=14;pinMode(pin5,'output');pinMode(pin3,'output');digitalWrite(pin5, on);digitalWrite(pin3,!on);setTimeout(function(){digitalWrite(pin5,!on);digitalWrite(pin3,!on);},5000)"
  return code
};


Blockly.Blocks['mexerMotor'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("mexer motor");
    this.setOutput(true, "String");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(70);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};


javascriptGenerator.forBlock['mexerMotor'] = function() {
  //const code ="var on=true;var pin3=0;var pin5=14;pinMode(pin5,'output');pinMode(pin3,'output');digitalWrite(pin5, on);digitalWrite(pin3,!on);setTimeout(function(){digitalWrite(pin5,!on);digitalWrite(pin3,!on);},5000)"
  const code = `
motor_pin1 = machine.Pin(0, machine.Pin.OUT)
motor_pin2 = machine.Pin(14, machine.Pin.OUT)
motor_pin1.value(1)
motor_pin2.value(0)
time.sleep(5)
motor_pin1.value(0)
motor_pin2.value(0)`
  return code
};


   
Blockly.Blocks['piscarLed2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("piscar Led 2");
    this.setOutput(true, "String");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(70);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};
// javascriptGenerator.forBlock['piscarLed'] = function() {
//   const code = "led.blink(1000);board.wait(10000,async()=>{led.off().stop();res.writeContinue();}); "
//   return code
// };
javascriptGenerator.forBlock['piscarLed2'] = function() {
  //const code = "var on=false;var pin=D2;var duration=5000;var interval=500;var intervalID=setInterval(function(){on=!on;digitalWrite(pin,on);},interval);setTimeout(function(){clearInterval(intervalID);digitalWrite(pin,true);},duration)"
  // const code ="var on=true;var pin3=0;var pin5=14;pinMode(pin5,'output');pinMode(pin3,'output');digitalWrite(pin5, on);digitalWrite(pin3,!on);setTimeout(function(){digitalWrite(pin5,!on);digitalWrite(pin3,!on);},5000)"
const code = `
pin = machine.Pin(2, machine.Pin.OUT)
duration = 5
interval = 0.5
start_time = time.time()
while True:
  pin.value(not pin.value())
  time.sleep(interval)
  if time.time() - start_time >= duration:
    pin.value(1)
    break`
  return code
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


javascriptGenerator.forBlock['repeticao'] = function(block, generator) {
var dropdown_1 = block.getFieldValue('repetir');
var statements_faz = generator.statementToCode(block, 'faz');
// TODO: Assemble javascript into code variable.
// var code = `for(var i=0;i<${dropdown_1};i++){${statements_faz}};`;
var code = `
for i in range(${dropdown_1}):
  ${statements_faz}`;
return code;
};


Blockly.Blocks['INICIO'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("INICIO");
    this.setOutput(true, "String");
    this.setNextStatement(true, null);
    this.setColour(70);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};

javascriptGenerator.forBlock['INICIO'] = function() {
const code = `
import machine
import time`
return code;
};




//================   Codigo para proximas atualizações =============================



// Blockly.Blocks['TOPICO'] = {
//   init: function() {
//     this.appendDummyInput()
//         .appendField("TOPICO");
//     this.setOutput(true, "String");
//     this.setPreviousStatement(true, null);
//     this.setColour(70);
//     this.setTooltip("");
//     this.setHelpUrl("");
//   }
// };



// javascriptGenerator.forBlock['piscarLed'] = function() {
//   const code = "led.blink(1000);board.wait(10000,async()=>{led.off().stop();res.writeContinue();}); "
//   return code
// };
// javascriptGenerator.forBlock['TOPICO'] = function() {
// const code = `setFixedTopic/charmander`
//     // const code = "var on=false;var pin=D2;setInterval(function(){on=!on;digitalWrite(pin,on);},500)"
//     // const code ="var on=true;var pin3=0;var pin5=14;pinMode(pin5,'output');pinMode(pin3,'output');digitalWrite(pin5, on);digitalWrite(pin3,!on);setTimeout(function(){digitalWrite(pin5,!on);digitalWrite(pin3,!on);},5000)"
//   return code
// };


// ===============================================================================================================================================================

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
  
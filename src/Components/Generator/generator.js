
import * as Blockly from 'blockly/core';
import 'blockly/javascript';


Blockly.JavaScript['led_blink'] = function(block) {
    var led_blink = block.getField('Blink_Led ').name;
    var code = led_blink;
    return code;
};


Blockly.JavaScript['Para_Frente'] = function(block) {
    var forward = block.getField('Para_Frente ').name;
    var code = forward;
    return code;
};

Blockly.JavaScript['Para_Tras'] = function(block) {
    var reverse = block.getField('Para_Tras ').name;
    var code = reverse;
    return code;
};


Blockly.JavaScript['Esquerda'] = function(block) {
    var left = block.getField('Esquerda ').name;
    var code = left;
    return code;
};



Blockly.JavaScript['Direita'] = function(block) {
    var right = block.getField('Direita ').name;
    var code = right;
    return code;
};
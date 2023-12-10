import Blockly from 'blockly';
import getPuzzleData from '../Puzzle/data.js';


Blockly.legs = function() {
  const data = getPuzzleData(); //mudar a referencia dessa funcao
  const padding = '\xa0\xa0';
  const list = [[Blockly.getMsg('Puzzle.legsChoose', false), '0']];
  for (let i = 0; i < data.length; i++) {
    list[i + 1] = [padding + data[i].legs + padding, String(i + 1)];
  }
  // Sort numerically.
  list.sort(function(a, b) {return a[0] - b[0];});
  return list;
};

Blockly.Blocks['animal'] = {
  init: function() {
    this.setColour(120);
    this.appendDummyInput()
        .appendField('', 'NAME');
    this.appendValueInput('PIC')
        .appendField(Blockly.getMsg('Puzzle.picture', false));
    this.appendDummyInput()
        .appendField(Blockly.getMsg('Puzzle.legs', false))
        .appendField(new Blockly.FieldDropdown(Blockly.legs), 'LEGS');
    this.appendStatementInput('TRAITS')
        .appendField(Blockly.getMsg('Puzzle.traits', false));
    this.setInputsInline(false);
  },
  
  mutationToDom: function() {
    const container = document.createElement('mutation');
    container.setAttribute('animal', this.animal);
    return container;
  },
  
  domToMutation: function(xmlElement) {
    this.populate(parseInt(xmlElement.getAttribute('animal')));
  },
  animal: 0,
  
  populate: function(n) {
    const data = getPuzzleData(); //trocar a referência dessa funcao
    this.animal = n;
    this.setFieldValue(data[n - 1].name, 'NAME');
    this.helpUrl = data[n - 1].helpUrl;
  },
  
  isCorrect: function() {
    return Number(this.getFieldValue('LEGS')) === this.animal;
  }
};

Blockly.Blocks['picture'] = {
  init: function() {
    this.setColour(30);
    this.appendDummyInput('PIC');
    this.setOutput(true);
    this.setTooltip('');
  },
  mutationToDom: Blockly.Blocks['animal'].mutationToDom,
  domToMutation: Blockly.Blocks['animal'].domToMutation,
  animal: 0,
 
  populate: function(n) {
    this.animal = n;
    const data = getPuzzleData(); //mudar a referência dessa funcao
    const pic = 'puzzle/' + data[n - 1].pic;
    const picHeight = data[n - 1].picHeight;
    const picWidth = data[n - 1].picWidth;
    this.getInput('PIC')
        .appendField(new Blockly.FieldImage(pic, picWidth, picHeight));
  },

  isCorrect: function() {
    const parent = this.getParent();
    return parent && (parent.animal === this.animal);
  }
};

Blockly.Blocks['trait'] = {
 
  init: function() {
    this.setColour(290);
    this.appendDummyInput().appendField('', 'NAME');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  },
  
  mutationToDom: function() {
    const container = document.createElement('mutation');
    container.setAttribute('animal', this.animal);
    container.setAttribute('trait', this.trait);
    return container;
  },
  
  domToMutation: function(xmlElement) {
    this.populate(parseInt(xmlElement.getAttribute('animal')),
                  parseInt(xmlElement.getAttribute('trait')));
  },
  animal: 0,
  trait: 0,
  
  populate: function(n, m) {
    this.animal = n;
    this.trait = m;
    // Set the trait name.
    const data = getPuzzleData(); //mudar a referencia desssa funcao
    this.setFieldValue(data[n - 1].traits[m - 1], 'NAME');
  },
 
  isCorrect: function() {
    const parent = this.getSurroundParent();
    return parent && (parent.animal === this.animal);
  }
};
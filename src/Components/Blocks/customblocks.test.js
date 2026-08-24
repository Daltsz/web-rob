import Blockly from 'blockly';
import { pythonGenerator } from 'blockly/python';
import './customblocks';

describe('geradores Blockly -> MicroPython', () => {
  test('INICIO inclui os imports necessários', () => {
    const code = pythonGenerator.forBlock.INICIO();

    expect(code).toContain('import machine');
    expect(code).toContain('import time');
  });

  test('Para_Frente gera configuração dos motores e temporização', () => {
    const code = pythonGenerator.forBlock.Para_Frente();

    expect(code).toContain('machine.Pin(5, machine.Pin.OUT)');
    expect(code).toContain('in1.value(1)');
    expect(code).toContain('in2.value(0)');
    expect(code).toContain('time.sleep(2)');
  });

  test('Direita gera sentidos opostos entre os motores', () => {
    const code = pythonGenerator.forBlock.Direita();

    expect(code).toContain('in1.value(1)');
    expect(code).toContain('in2.value(0)');
    expect(code).toContain('in3.value(0)');
    expect(code).toContain('in4.value(1)');
  });

  test('repeticao gera um laço com a quantidade e o corpo informados', () => {
    const block = {
      getFieldValue: jest.fn().mockReturnValue('3'),
    };
    const generator = {
      statementToCode: jest.fn().mockReturnValue('  mover_robo()\n'),
    };

    const code = pythonGenerator.forBlock.repeticao(block, generator);

    expect(block.getFieldValue).toHaveBeenCalledWith('repetir');
    expect(generator.statementToCode).toHaveBeenCalledWith(block, 'faz');
    expect(code).toContain('for i in range(3):');
    expect(code).toContain('mover_robo()');
  });

  test('repeticao vazia gera pass e continua sendo Python válido', () => {
    const block = {
      getFieldValue: jest.fn().mockReturnValue('2'),
    };
    const generator = {
      INDENT: '  ',
      statementToCode: jest.fn().mockReturnValue(''),
    };

    const code = pythonGenerator.forBlock.repeticao(block, generator);

    expect(code).toContain('for i in range(2):');
    expect(code).toContain('  pass');
  });

  test('workspace real INICIO -> Para_Frente gera MicroPython executável', () => {
    const workspace = new Blockly.Workspace();
    const startBlock = workspace.newBlock('INICIO');
    const forwardBlock = workspace.newBlock('Para_Frente');

    startBlock.nextConnection.connect(forwardBlock.previousConnection);

    const code = pythonGenerator.workspaceToCode(workspace);

    expect(code).toContain('import machine');
    expect(code).toContain('import time');
    expect(code).toContain('machine.Pin(5, machine.Pin.OUT)');
    expect(code).toContain('time.sleep(2)');
    expect(code).not.toContain('function');
    expect(code).not.toContain('=>');

    workspace.dispose();
  });

  test('repeticao com movimento mantém indentação Python no workspace real', () => {
    const workspace = new Blockly.Workspace();
    const startBlock = workspace.newBlock('INICIO');
    const repeatBlock = workspace.newBlock('repeticao');
    const forwardBlock = workspace.newBlock('Para_Frente');

    repeatBlock.setFieldValue('2', 'repetir');
    startBlock.nextConnection.connect(repeatBlock.previousConnection);
    repeatBlock.getInput('faz').connection.connect(forwardBlock.previousConnection);

    const code = pythonGenerator.workspaceToCode(workspace);

    expect(code).toContain('for i in range(2):');
    expect(code).toMatch(/for i in range\(2\):\n\s+in1 = machine\.Pin/);
    expect(code).not.toContain('for (');

    workspace.dispose();
  });

  test('blocos padrão do toolbox também geram Python, não JavaScript', () => {
    const workspace = new Blockly.Workspace();
    workspace.newBlock('INICIO');
    const roundBlock = workspace.newBlock('math_round');
    const numberBlock = workspace.newBlock('math_number');

    numberBlock.setFieldValue(5, 'NUM');
    roundBlock.getInput('NUM').connection.connect(numberBlock.outputConnection);

    const code = pythonGenerator.workspaceToCode(workspace);

    expect(code).toContain('import machine');
    expect(code).toContain('import time');
    expect(code).toContain('round(5)');
    expect(code).not.toContain('Math.round');
    expect(code).not.toContain('const ');
    expect(code).not.toContain('let ');
    expect(code).not.toContain('var ');

    workspace.dispose();
  });

});

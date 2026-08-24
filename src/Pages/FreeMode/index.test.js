import React from 'react';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import FreeMode from './index';
import { sendRobotCommand } from '../../Services/robots';
import { getMyRobots } from '../../Services/pairing';
import { pythonGenerator } from 'blockly/python';

jest.mock('../../Components/Header', () => function HeaderMock() {
  return <div data-testid="header-mock" />;
});

jest.mock('../../Components/Pair/pairRobotModal', () => function PairRobotModalMock({ onClose, onPaired }) {
  const pair = () => {
    onPaired({
      id: 7,
      mac: '40F52028DDC7',
      status: 'PAIRED',
      topic: 'users/2/robots/7',
    });
    onClose();
  };

  return (
    <div data-testid="pair-modal-mock">
      <button type="button" onClick={pair}>Simular pareamento</button>
      <button type="button" onClick={onClose}>Fechar pareamento</button>
    </div>
  );
});

const mockWorkspaceListeners = [];
const mockWorkspace = {
  id: 'workspace-test',
  addChangeListener: jest.fn((listener) => {
    mockWorkspaceListeners.push(listener);
  }),
  removeChangeListener: jest.fn((listener) => {
    const index = mockWorkspaceListeners.indexOf(listener);
    if (index >= 0) {
      mockWorkspaceListeners.splice(index, 1);
    }
  }),
};

const emitWorkspaceChange = (event) => {
  mockWorkspaceListeners.forEach((listener) => listener(event));
};

jest.mock('react-blockly', () => ({
  BlocklyWorkspace: () => <div data-testid="blockly-workspace-mock" />,
  useBlocklyWorkspace: () => ({ workspace: mockWorkspace }),
}));

jest.mock('blockly/python', () => ({
  pythonGenerator: {
    forBlock: {},
    workspaceToCode: jest.fn(),
  },
}));

jest.mock('../../Services/robots', () => ({
  sendRobotCommand: jest.fn(),
}));

jest.mock('../../Services/pairing', () => ({
  getMyRobots: jest.fn(),
}));

describe('FreeMode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWorkspaceListeners.splice(0, mockWorkspaceListeners.length);
    mockWorkspace.addChangeListener.mockImplementation((listener) => {
      mockWorkspaceListeners.push(listener);
    });
    mockWorkspace.removeChangeListener.mockImplementation((listener) => {
      const index = mockWorkspaceListeners.indexOf(listener);
      if (index >= 0) {
        mockWorkspaceListeners.splice(index, 1);
      }
    });
    window.alert = jest.fn();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
    window.URL.createObjectURL = jest.fn(() => 'blob:logicaleduc-code');
    window.URL.revokeObjectURL = jest.fn();
    getMyRobots.mockResolvedValue([]);
  });

  test('mostra loading e estado vazio sem abrir pareamento automaticamente', async () => {
    let resolveRobots;
    getMyRobots.mockImplementation(() => new Promise((resolve) => {
      resolveRobots = resolve;
    }));

    render(<FreeMode />);

    expect(screen.getByTestId('blockly-workspace-mock')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Carregando robôs vinculados...');
    expect(screen.queryByTestId('pair-modal-mock')).not.toBeInTheDocument();

    resolveRobots([]);

    expect(await screen.findByText('Nenhum robô vinculado.')).toBeInTheDocument();
    expect(screen.getByText('Pareie seu primeiro robô para começar a programar.')).toBeInTheDocument();
    expect(screen.queryByTestId('pair-modal-mock')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Parear novo robô' }));
    expect(screen.getByTestId('pair-modal-mock')).toBeInTheDocument();
  });

  test('seleciona automaticamente quando existe apenas um robô pareado', async () => {
    getMyRobots.mockResolvedValue([
      {
        id: 3,
        mac: 'AABBCCDDEEFF',
        status: 'PAIRED',
        topic: 'users/2/robots/3',
      },
    ]);

    render(<FreeMode />);

    expect(await screen.findByText(/Robô selecionado:/i)).toBeInTheDocument();
    const selectedRobotCard = screen.getByRole('region', { name: 'Robô selecionado' });
    expect(selectedRobotCard).toHaveTextContent('AABBCCDDEEFF');
    expect(selectedRobotCard).toHaveTextContent('users/2/robots/3');
    expect(selectedRobotCard).toHaveTextContent('Vinculado');
    expect(screen.queryByRole('radiogroup', { name: 'Robôs vinculados' })).not.toBeInTheDocument();
    expect(screen.getByText('1 robô vinculado')).toBeInTheDocument();
    expect(screen.queryByTestId('pair-modal-mock')).not.toBeInTheDocument();
  });

  test('mantém Controlar desabilitado enquanto não existe código compilado', async () => {
    getMyRobots.mockResolvedValue([
      {
        id: 3,
        mac: 'AABBCCDDEEFF',
        status: 'PAIRED',
        topic: 'users/2/robots/3',
      },
    ]);
    pythonGenerator.workspaceToCode.mockReturnValue('import machine\n');

    render(<FreeMode />);

    await screen.findByText(/Robô selecionado:/i);
    const controlButton = screen.getByRole('button', { name: 'Controlar' });

    expect(controlButton).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Compilar' }));

    expect(controlButton).toBeEnabled();
  });

  test('mostra feedback inline de sucesso ao compilar sem usar alert', async () => {
    getMyRobots.mockResolvedValue([
      {
        id: 3,
        mac: 'AABBCCDDEEFF',
        status: 'PAIRED',
        topic: 'users/2/robots/3',
      },
    ]);
    pythonGenerator.workspaceToCode.mockReturnValue('import machine\n');

    render(<FreeMode />);

    await screen.findByText(/Robô selecionado:/i);
    fireEvent.click(screen.getByRole('button', { name: 'Compilar' }));

    const compileStatus = screen.getByRole('status');
    expect(compileStatus).toHaveClass('free-mode-feedback', 'free-mode-feedback-success');
    expect(compileStatus).toHaveTextContent('Compilação concluída!');
    expect(compileStatus).toHaveTextContent('Seu código está pronto para ser enviado ao robô.');
    expect(screen.getByRole('button', { name: '✓ Compilado' })).toBeInTheDocument();
    expect(screen.getByText('import machine')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Controlar' })).toBeEnabled();
    expect(window.alert).not.toHaveBeenCalled();
  });

  test('abre o código compilado em uma janela expandida e fecha pelo botão', async () => {
    getMyRobots.mockResolvedValue([
      {
        id: 3,
        mac: 'AABBCCDDEEFF',
        status: 'PAIRED',
        topic: 'users/2/robots/3',
      },
    ]);
    pythonGenerator.workspaceToCode.mockReturnValue(
      'import machine\nimport time\n\nin1 = machine.Pin(5, machine.Pin.OUT)\ntime.sleep(2)\n'
    );

    render(<FreeMode />);

    await screen.findByText(/Robô selecionado:/i);
    const expandButton = screen.getByRole('button', { name: 'Expandir código' });
    expect(expandButton).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Compilar' }));
    expect(expandButton).toBeEnabled();

    fireEvent.click(expandButton);

    const dialog = screen.getByRole('dialog', { name: 'Código compilado' });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(/Visualize todo o código Python\/MicroPython/)).toBeInTheDocument();
    expect(within(dialog).getByText('MicroPython')).toBeInTheDocument();
    expect(within(dialog).getByText('Código compilado', { selector: 'span' })).toBeInTheDocument();
    expect(within(dialog).getByText('5 linhas')).toBeInTheDocument();
    expect(within(dialog).getByLabelText('Código MicroPython compilado')).toBeInTheDocument();
    expect(dialog).toHaveTextContent('machine.Pin(5, machine.Pin.OUT)');

    const lineNumbers = dialog.querySelectorAll('.free-mode-code-line-number');
    expect(lineNumbers).toHaveLength(5);
    expect(Array.from(lineNumbers).map((item) => item.textContent.trim())).toEqual(['1', '2', '3', '4', '5']);
    expect(screen.getByRole('button', { name: 'Fechar código expandido' })).toHaveFocus();

    fireEvent.click(screen.getByRole('button', { name: 'Fechar código expandido' }));

    expect(screen.queryByRole('dialog', { name: 'Código compilado' })).not.toBeInTheDocument();
    expect(expandButton).toHaveFocus();
  });

  test('mostra contagem singular de linha na visualização expandida', async () => {
    getMyRobots.mockResolvedValue([
      {
        id: 3,
        mac: 'AABBCCDDEEFF',
        status: 'PAIRED',
        topic: 'users/2/robots/3',
      },
    ]);
    pythonGenerator.workspaceToCode.mockReturnValue('print(1)\n');

    render(<FreeMode />);

    await screen.findByText(/Robô selecionado:/i);
    fireEvent.click(screen.getByRole('button', { name: 'Compilar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Expandir código' }));

    const dialog = screen.getByRole('dialog', { name: 'Código compilado' });
    expect(within(dialog).getByText('1 linha')).toBeInTheDocument();
    expect(dialog.querySelectorAll('.free-mode-code-line-number')).toHaveLength(1);
  });

  test('copia somente o MicroPython limpo e mostra feedback de código copiado', async () => {
    getMyRobots.mockResolvedValue([
      {
        id: 3,
        mac: 'AABBCCDDEEFF',
        status: 'PAIRED',
        topic: 'users/2/robots/3',
      },
    ]);
    const compiledCode = 'import machine\n\nprint("ok")';
    pythonGenerator.workspaceToCode.mockReturnValue(`${compiledCode}\n`);

    render(<FreeMode />);

    await screen.findByText(/Robô selecionado:/i);
    fireEvent.click(screen.getByRole('button', { name: 'Compilar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Expandir código' }));

    fireEvent.click(screen.getByRole('button', { name: 'Copiar código compilado' }));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(compiledCode);
      expect(screen.getByRole('button', { name: 'Código copiado' })).toBeInTheDocument();
    });
    const dialog = screen.getByRole('dialog', { name: 'Código compilado' });
    expect(within(dialog).getByRole('status')).toHaveTextContent('Código copiado para a área de transferência.');
    expect(navigator.clipboard.writeText.mock.calls[0][0]).not.toMatch(/^1\s|\n2\s/);
  });

  test('mostra erro acessível quando a cópia para a área de transferência falha', async () => {
    getMyRobots.mockResolvedValue([
      {
        id: 3,
        mac: 'AABBCCDDEEFF',
        status: 'PAIRED',
        topic: 'users/2/robots/3',
      },
    ]);
    pythonGenerator.workspaceToCode.mockReturnValue('print(1)\n');
    navigator.clipboard.writeText.mockRejectedValueOnce(new Error('clipboard indisponível'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<FreeMode />);

    await screen.findByText(/Robô selecionado:/i);
    fireEvent.click(screen.getByRole('button', { name: 'Compilar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Expandir código' }));
    fireEvent.click(screen.getByRole('button', { name: 'Copiar código compilado' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível copiar. Tente novamente.');
    expect(screen.getByRole('button', { name: 'Copiar código compilado' })).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  test('baixa o código compilado como arquivo .py sem números de linha', async () => {
    getMyRobots.mockResolvedValue([
      {
        id: 3,
        mac: 'AABBCCDDEEFF',
        status: 'PAIRED',
        topic: 'users/2/robots/3',
      },
    ]);
    const compiledCode = 'import machine\nprint("robô")';
    pythonGenerator.workspaceToCode.mockReturnValue(`${compiledCode}\n`);
    let clickedDownload = '';
    let clickedHref = '';
    const anchorClickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function click() {
      clickedDownload = this.download;
      clickedHref = this.href;
    });

    render(<FreeMode />);

    await screen.findByText(/Robô selecionado:/i);
    fireEvent.click(screen.getByRole('button', { name: 'Compilar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Expandir código' }));
    fireEvent.click(screen.getByRole('button', { name: 'Baixar código compilado como arquivo Python' }));

    expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1);
    const downloadedBlob = window.URL.createObjectURL.mock.calls[0][0];
    expect(downloadedBlob).toBeInstanceOf(Blob);
    expect(downloadedBlob.type).toBe('text/x-python;charset=utf-8');
    const downloadedText = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(downloadedBlob);
    });
    expect(downloadedText).toBe(compiledCode);
    expect(clickedDownload).toBe('logicaleduc_codigo.py');
    expect(clickedHref).toBe('blob:logicaleduc-code');
    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:logicaleduc-code');

    anchorClickSpy.mockRestore();
  });

  test('fecha o código expandido com Escape e ao invalidar a compilação', async () => {
    getMyRobots.mockResolvedValue([
      {
        id: 3,
        mac: 'AABBCCDDEEFF',
        status: 'PAIRED',
        topic: 'users/2/robots/3',
      },
    ]);
    pythonGenerator.workspaceToCode.mockReturnValue('import machine\n');

    render(<FreeMode />);

    await screen.findByText(/Robô selecionado:/i);
    fireEvent.click(screen.getByRole('button', { name: 'Compilar' }));

    const expandButton = screen.getByRole('button', { name: 'Expandir código' });
    fireEvent.click(expandButton);
    expect(screen.getByRole('dialog', { name: 'Código compilado' })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: 'Código compilado' })).not.toBeInTheDocument();

    fireEvent.click(expandButton);
    expect(screen.getByRole('dialog', { name: 'Código compilado' })).toBeInTheDocument();

    act(() => {
      emitWorkspaceChange({ type: 'delete', isUiEvent: false });
    });

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Código compilado' })).not.toBeInTheDocument();
      expect(expandButton).toBeDisabled();
    });
  });

  test('mantém o estado Compilado após o destaque de sucesso desaparecer', async () => {
    jest.useFakeTimers();
    getMyRobots.mockResolvedValue([
      {
        id: 3,
        mac: 'AABBCCDDEEFF',
        status: 'PAIRED',
        topic: 'users/2/robots/3',
      },
    ]);
    pythonGenerator.workspaceToCode.mockReturnValue('import machine\n');

    render(<FreeMode />);

    await act(async () => {
      await Promise.resolve();
    });
    await screen.findByText(/Robô selecionado:/i);
    fireEvent.click(screen.getByRole('button', { name: 'Compilar' }));

    expect(screen.getByText('Compilação concluída!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '✓ Compilado' })).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(4500);
    });

    expect(screen.queryByText('Compilação concluída!')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '✓ Compilado' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Controlar' })).toBeEnabled();

    jest.useRealTimers();
  });

  test('mostra feedback inline de erro quando a compilação falha e mantém Controlar bloqueado', async () => {
    getMyRobots.mockResolvedValue([
      {
        id: 3,
        mac: 'AABBCCDDEEFF',
        status: 'PAIRED',
        topic: 'users/2/robots/3',
      },
    ]);
    pythonGenerator.workspaceToCode.mockImplementation(() => {
      throw new Error('Falha ao gerar código');
    });
    const consoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(<FreeMode />);

    await screen.findByText(/Robô selecionado:/i);
    fireEvent.click(screen.getByRole('button', { name: 'Compilar' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível compilar');
    expect(screen.getByRole('alert')).toHaveTextContent('Verifique os blocos e tente novamente.');
    expect(screen.getByRole('button', { name: 'Controlar' })).toBeDisabled();
    expect(window.alert).not.toHaveBeenCalled();

    consoleLog.mockRestore();
  });


  test('invalida o código compilado quando os blocos do workspace são alterados', async () => {
    getMyRobots.mockResolvedValue([
      {
        id: 3,
        mac: 'AABBCCDDEEFF',
        status: 'PAIRED',
        topic: 'users/2/robots/3',
      },
    ]);
    pythonGenerator.workspaceToCode.mockReturnValue('import machine\n');

    render(<FreeMode />);

    await screen.findByText(/Robô selecionado:/i);
    const controlButton = screen.getByRole('button', { name: 'Controlar' });

    fireEvent.click(screen.getByRole('button', { name: 'Compilar' }));
    expect(controlButton).toBeEnabled();
    expect(screen.getByText('import machine')).toBeInTheDocument();
    expect(screen.getByText('Compilação concluída!')).toBeInTheDocument();
    act(() => {
      emitWorkspaceChange({ type: 'delete', isUiEvent: false });
    });

    await waitFor(() => {
      expect(controlButton).toBeDisabled();
      expect(screen.queryByText('import machine')).not.toBeInTheDocument();
      expect(screen.queryByText('Compilação concluída!')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Compilar' })).toBeInTheDocument();
    });
  });

  test('não invalida o código compilado em eventos apenas visuais do Blockly', async () => {
    getMyRobots.mockResolvedValue([
      {
        id: 3,
        mac: 'AABBCCDDEEFF',
        status: 'PAIRED',
        topic: 'users/2/robots/3',
      },
    ]);
    pythonGenerator.workspaceToCode.mockReturnValue('import machine\n');

    render(<FreeMode />);

    await screen.findByText(/Robô selecionado:/i);
    const controlButton = screen.getByRole('button', { name: 'Controlar' });

    fireEvent.click(screen.getByRole('button', { name: 'Compilar' }));
    expect(controlButton).toBeEnabled();

    act(() => {
      emitWorkspaceChange({ type: 'selected', isUiEvent: true });
    });

    expect(controlButton).toBeEnabled();
    expect(screen.getByText('import machine')).toBeInTheDocument();
  });

  test('mostra Enviando e mantém Controlar bloqueado enquanto o comando está em andamento', async () => {
    getMyRobots.mockResolvedValue([
      {
        id: 3,
        mac: 'AABBCCDDEEFF',
        status: 'PAIRED',
        topic: 'users/2/robots/3',
      },
    ]);
    pythonGenerator.workspaceToCode.mockReturnValue('import machine\n');

    let resolveCommand;
    sendRobotCommand.mockImplementation(() => new Promise((resolve) => {
      resolveCommand = resolve;
    }));

    render(<FreeMode />);

    await screen.findByText(/Robô selecionado:/i);
    fireEvent.click(screen.getByRole('button', { name: 'Compilar' }));

    const controlButton = screen.getByRole('button', { name: 'Controlar' });
    fireEvent.click(controlButton);

    const sendingButton = screen.getByRole('button', { name: 'Enviando...' });
    expect(sendingButton).toBeDisabled();
    expect(sendingButton).toHaveAttribute('aria-busy', 'true');
    const sendingStatus = screen.getByRole('status');
    expect(sendingStatus).toHaveClass('free-mode-feedback', 'free-mode-feedback-info');
    expect(sendingStatus).toHaveTextContent('Enviando comando...');
    expect(sendingStatus).toHaveTextContent('Aguarde enquanto o código é encaminhado pelo sistema.');
    expect(sendRobotCommand).toHaveBeenCalledTimes(1);
    expect(sendRobotCommand).toHaveBeenCalledWith(3, 'import machine');

    act(() => {
      resolveCommand({ data: { ok: true } });
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Controlar' })).toBeEnabled();
    });
    expect(screen.getByRole('button', { name: 'Controlar' })).toHaveAttribute('aria-busy', 'false');
  });

  test('impede envio duplicado em cliques consecutivos enquanto o primeiro comando está pendente', async () => {
    getMyRobots.mockResolvedValue([
      {
        id: 3,
        mac: 'AABBCCDDEEFF',
        status: 'PAIRED',
        topic: 'users/2/robots/3',
      },
    ]);
    pythonGenerator.workspaceToCode.mockReturnValue('import machine\n');

    let resolveCommand;
    sendRobotCommand.mockImplementation(() => new Promise((resolve) => {
      resolveCommand = resolve;
    }));

    render(<FreeMode />);

    await screen.findByText(/Robô selecionado:/i);
    fireEvent.click(screen.getByRole('button', { name: 'Compilar' }));

    const controlButton = screen.getByRole('button', { name: 'Controlar' });
    fireEvent.click(controlButton);
    fireEvent.click(controlButton);

    expect(sendRobotCommand).toHaveBeenCalledTimes(1);

    act(() => {
      resolveCommand({ data: { ok: true } });
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Controlar' })).toBeEnabled();
    });
  });

  test('limpa o feedback de envio quando o workspace é alterado', async () => {
    getMyRobots.mockResolvedValue([
      {
        id: 3,
        mac: 'AABBCCDDEEFF',
        status: 'PAIRED',
        topic: 'users/2/robots/3',
      },
    ]);
    pythonGenerator.workspaceToCode.mockReturnValue('import machine\n');
    sendRobotCommand.mockResolvedValue({ data: { ok: true } });

    render(<FreeMode />);

    await screen.findByText(/Robô selecionado:/i);
    fireEvent.click(screen.getByRole('button', { name: 'Compilar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Controlar' }));

    expect(await screen.findByText('Código enviado com sucesso!')).toBeInTheDocument();

    act(() => {
      emitWorkspaceChange({ type: 'delete', isUiEvent: false });
    });

    await waitFor(() => {
      expect(screen.queryByText('Código enviado com sucesso!')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Controlar' })).toBeDisabled();
    });
  });

  test('oculta o sucesso do envio após alguns segundos mantendo o código compilado', async () => {
    jest.useFakeTimers();
    getMyRobots.mockResolvedValue([
      {
        id: 3,
        mac: 'AABBCCDDEEFF',
        status: 'PAIRED',
        topic: 'users/2/robots/3',
      },
    ]);
    pythonGenerator.workspaceToCode.mockReturnValue('import machine\n');
    sendRobotCommand.mockResolvedValue({ data: { ok: true } });

    render(<FreeMode />);

    await act(async () => {
      await Promise.resolve();
    });
    await screen.findByText(/Robô selecionado:/i);
    fireEvent.click(screen.getByRole('button', { name: 'Compilar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Controlar' }));

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByText('Código enviado com sucesso!')).toBeInTheDocument();
    expect(screen.getByText('O comando foi encaminhado pelo sistema.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '✓ Compilado' })).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(4500);
    });

    expect(screen.queryByText('Código enviado com sucesso!')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '✓ Compilado' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Controlar' })).toBeEnabled();

    jest.useRealTimers();
  });

  test('restaura o botão Controlar depois de erro no envio', async () => {
    getMyRobots.mockResolvedValue([
      {
        id: 3,
        mac: 'AABBCCDDEEFF',
        status: 'PAIRED',
        topic: 'users/2/robots/3',
      },
    ]);
    pythonGenerator.workspaceToCode.mockReturnValue('import machine\n');
    sendRobotCommand.mockRejectedValue(new Error('Falha no envio'));
    const consoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(<FreeMode />);

    await screen.findByText(/Robô selecionado:/i);
    fireEvent.click(screen.getByRole('button', { name: 'Compilar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Controlar' }));

    expect(screen.getByRole('button', { name: 'Enviando...' })).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveClass('free-mode-feedback', 'free-mode-feedback-error');
      expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível enviar');
      expect(screen.getByRole('alert')).toHaveTextContent('Tente novamente em alguns instantes.');
      expect(screen.getByRole('button', { name: 'Controlar' })).toBeEnabled();
    });
    expect(window.alert).not.toHaveBeenCalledWith('Erro ao enviar comando');

    consoleLog.mockRestore();
  });

  test('mantém Controlar desabilitado sem robô selecionado mesmo com código compilado', async () => {
    getMyRobots.mockResolvedValue([
      {
        id: 4,
        mac: 'AAAAAAAAAAAA',
        status: 'PAIRED',
        topic: 'users/2/robots/4',
      },
      {
        id: 9,
        mac: 'BBBBBBBBBBBB',
        status: 'PAIRED',
        topic: 'users/2/robots/9',
      },
    ]);
    pythonGenerator.workspaceToCode.mockReturnValue('import machine\n');

    render(<FreeMode />);

    await screen.findByRole('radiogroup', { name: 'Robôs vinculados' });
    expect(screen.getByRole('radio', { name: 'Selecionar AAAAAAAAAAAA' })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('radio', { name: 'Selecionar BBBBBBBBBBBB' })).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(screen.getByRole('button', { name: 'Compilar' }));

    expect(screen.getByRole('button', { name: 'Controlar' })).toBeDisabled();
    expect(sendRobotCommand).not.toHaveBeenCalled();
  });

  test('exige seleção explícita quando existem vários robôs e envia para o selecionado', async () => {
    getMyRobots.mockResolvedValue([
      {
        id: 4,
        mac: 'AAAAAAAAAAAA',
        status: 'PAIRED',
        topic: 'users/2/robots/4',
      },
      {
        id: 9,
        mac: 'BBBBBBBBBBBB',
        status: 'PAIRED',
        topic: 'users/2/robots/9',
      },
    ]);
    pythonGenerator.workspaceToCode.mockReturnValue('import machine\n');
    sendRobotCommand.mockResolvedValue({ data: { ok: true } });

    render(<FreeMode />);

    const picker = await screen.findByRole('radiogroup', { name: 'Robôs vinculados' });
    const firstRobotOption = screen.getByRole('radio', { name: 'Selecionar AAAAAAAAAAAA' });
    const secondRobotOption = screen.getByRole('radio', { name: 'Selecionar BBBBBBBBBBBB' });
    const controlButton = screen.getByRole('button', { name: 'Controlar' });

    expect(picker).toBeInTheDocument();
    expect(screen.getByText('2 robôs vinculados')).toBeInTheDocument();
    expect(screen.getByText('Escolha qual robô receberá os comandos')).toBeInTheDocument();
    expect(screen.getByText('Seleção necessária')).toBeInTheDocument();
    expect(firstRobotOption).toHaveAttribute('aria-checked', 'false');
    expect(secondRobotOption).toHaveAttribute('aria-checked', 'false');
    expect(controlButton).toBeDisabled();
    expect(screen.getByRole('region', { name: 'Nenhum robô selecionado' })).toHaveTextContent(
      'Escolha um robô na lista para continuar.'
    );

    fireEvent.click(secondRobotOption);
    expect(firstRobotOption).toHaveAttribute('aria-checked', 'false');
    expect(secondRobotOption).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('Robô escolhido')).toBeInTheDocument();
    const selectedRobotCard = screen.getByRole('region', { name: 'Robô selecionado' });
    expect(selectedRobotCard).toHaveTextContent('BBBBBBBBBBBB');
    expect(selectedRobotCard).toHaveTextContent('users/2/robots/9');
    expect(selectedRobotCard).toHaveTextContent('Vinculado');
    expect(controlButton).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Compilar' }));
    expect(controlButton).toBeEnabled();
    fireEvent.click(controlButton);

    await waitFor(() => {
      expect(sendRobotCommand).toHaveBeenCalledWith(9, 'import machine');
      expect(screen.getByRole('status')).toHaveTextContent('Código enviado com sucesso!');
    });
    expect(window.alert).not.toHaveBeenCalledWith('Código enviado com sucesso!');
  });

  test('integra o robô recém-pareado e usa seu id para controlar', async () => {
    pythonGenerator.workspaceToCode.mockReturnValue('import machine\n');
    sendRobotCommand.mockResolvedValue({ data: { ok: true } });

    render(<FreeMode />);

    fireEvent.click(await screen.findByRole('button', { name: 'Parear novo robô' }));
    fireEvent.click(screen.getByRole('button', { name: 'Simular pareamento' }));

    await waitFor(() => {
      expect(screen.getByText(/Robô selecionado:/i)).toBeInTheDocument();
      expect(screen.getByText('users/2/robots/7')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Compilar' }));

    expect(pythonGenerator.workspaceToCode).toHaveBeenCalledWith(mockWorkspace);
    expect(screen.getByText('import machine')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Controlar' }));

    await waitFor(() => {
      expect(sendRobotCommand).toHaveBeenCalledWith(7, 'import machine');
      expect(screen.getByRole('status')).toHaveTextContent('Código enviado com sucesso!');
    });
    expect(window.alert).not.toHaveBeenCalledWith('Código enviado com sucesso!');
  });

  test('mostra erro de carregamento sem abrir automaticamente o pareamento', async () => {
    getMyRobots.mockRejectedValue(new Error('API indisponível'));
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<FreeMode />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível carregar seus robôs. Tente novamente.'
    );
    expect(screen.queryByTestId('pair-modal-mock')).not.toBeInTheDocument();

    consoleError.mockRestore();
  });

  test('tenta carregar os robôs novamente após erro da API', async () => {
    getMyRobots
      .mockRejectedValueOnce(new Error('API indisponível'))
      .mockResolvedValueOnce([
        {
          id: 12,
          mac: 'CCCCCCCCCCCC',
          status: 'PAIRED',
          topic: 'users/2/robots/12',
        },
      ]);
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<FreeMode />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível carregar seus robôs. Tente novamente.'
    );

    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(screen.getByRole('status')).toHaveTextContent('Carregando robôs vinculados...');

    await waitFor(() => {
      expect(getMyRobots).toHaveBeenCalledTimes(2);
      expect(screen.queryByRole('radiogroup', { name: 'Robôs vinculados' })).not.toBeInTheDocument();
      expect(screen.getByRole('region', { name: 'Robô selecionado' })).toHaveTextContent('CCCCCCCCCCCC');
      expect(screen.getByText('users/2/robots/12')).toBeInTheDocument();
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    consoleError.mockRestore();
  });

  test('expõe regiões nomeadas e ações com semântica acessível', async () => {
    getMyRobots.mockResolvedValue([
      {
        id: 3,
        mac: 'AABBCCDDEEFF',
        status: 'PAIRED',
        topic: 'users/2/robots/3',
      },
    ]);

    render(<FreeMode />);

    await screen.findByRole('region', { name: 'Robô selecionado' });

    expect(screen.getByRole('region', { name: 'Área de programação por blocos' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Código compilado' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Compilar' })).toHaveAttribute('type', 'button');
    expect(screen.getByRole('button', { name: 'Controlar' })).toHaveAttribute('type', 'button');
  });

  test('permite navegar e selecionar robôs com setas, Home e End', async () => {
    getMyRobots.mockResolvedValue([
      {
        id: 4,
        mac: 'AAAAAAAAAAAA',
        status: 'PAIRED',
        topic: 'users/2/robots/4',
      },
      {
        id: 9,
        mac: 'BBBBBBBBBBBB',
        status: 'PAIRED',
        topic: 'users/2/robots/9',
      },
      {
        id: 12,
        mac: 'CCCCCCCCCCCC',
        status: 'PAIRED',
        topic: 'users/2/robots/12',
      },
    ]);

    render(<FreeMode />);

    const group = await screen.findByRole('radiogroup', { name: 'Robôs vinculados' });
    const first = screen.getByRole('radio', { name: 'Selecionar AAAAAAAAAAAA' });
    const second = screen.getByRole('radio', { name: 'Selecionar BBBBBBBBBBBB' });
    const third = screen.getByRole('radio', { name: 'Selecionar CCCCCCCCCCCC' });

    expect(group).toHaveAttribute('aria-describedby', 'free-mode-robot-picker-help');
    expect(first).toHaveAttribute('tabindex', '0');
    expect(second).toHaveAttribute('tabindex', '-1');
    expect(third).toHaveAttribute('tabindex', '-1');

    first.focus();
    expect(first).toHaveFocus();

    fireEvent.keyDown(first, { key: 'ArrowDown' });
    expect(second).toHaveFocus();
    expect(second).toHaveAttribute('aria-checked', 'true');
    expect(second).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('region', { name: 'Robô selecionado' })).toHaveTextContent('BBBBBBBBBBBB');

    fireEvent.keyDown(second, { key: 'End' });
    expect(third).toHaveFocus();
    expect(third).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('region', { name: 'Robô selecionado' })).toHaveTextContent('CCCCCCCCCCCC');

    fireEvent.keyDown(third, { key: 'Home' });
    expect(first).toHaveFocus();
    expect(first).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('region', { name: 'Robô selecionado' })).toHaveTextContent('AAAAAAAAAAAA');
  });

});

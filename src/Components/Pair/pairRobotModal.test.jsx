import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PairRobotModal from './pairRobotModal';
import { getMyRobots, pairRobot } from '../../Services/pairing';

jest.mock('../../Services/pairing', () => ({
  getMyRobots: jest.fn(),
  pairRobot: jest.fn(),
}));

describe('PairRobotModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('valida o MAC antes de chamar a API', () => {
    render(<PairRobotModal onClose={jest.fn()} onPaired={jest.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('Código/MAC do Robô'), {
      target: { value: '123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Parear' }));

    expect(screen.getByText('MAC inválido. Verifique o código digitado.')).toBeInTheDocument();
    expect(pairRobot).not.toHaveBeenCalled();
  });

  test('normaliza o MAC, encontra o robô pareado e o devolve ao FreeMode', async () => {
    const onPaired = jest.fn();
    const pairedRobot = {
      id: 7,
      mac: '40F52028DDC7',
      status: 'PAIRED',
      topic: 'users/2/robots/7',
    };

    pairRobot.mockResolvedValue({ status: 'challenge_sent' });
    getMyRobots.mockResolvedValue([pairedRobot]);

    render(<PairRobotModal onClose={jest.fn()} onPaired={onPaired} />);

    fireEvent.change(screen.getByPlaceholderText('Código/MAC do Robô'), {
      target: { value: '40:f5:20:28:dd:c7' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Parear' }));

    await waitFor(() => {
      expect(pairRobot).toHaveBeenCalledWith('40F52028DDC7');
      expect(getMyRobots).toHaveBeenCalledTimes(1);
      expect(onPaired).toHaveBeenCalledWith(pairedRobot);
    });

    expect(localStorage.getItem('robotTopic')).toBe('users/2/robots/7');
  });

  test('permite fechar o modal durante o polling', async () => {
    const onClose = jest.fn();

    pairRobot.mockResolvedValue({ status: 'challenge_sent' });
    getMyRobots.mockResolvedValue([]);

    render(<PairRobotModal onClose={onClose} onPaired={jest.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('Código/MAC do Robô'), {
      target: { value: '40F52028DDC7' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Parear' }));

    await screen.findByText('Aguardando o robô responder ao pareamento...');
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

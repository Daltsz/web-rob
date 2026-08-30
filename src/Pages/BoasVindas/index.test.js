import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import BoasVindas from './index';

function renderLanding() {
  return render(
    <MemoryRouter>
      <BoasVindas />
    </MemoryRouter>
  );
}

describe('BoasVindas landing page', () => {
  test('oferece acesso por Entrar e Criar conta sem CTA falso de Google', () => {
    renderLanding();

    const loginLinks = screen.getAllByRole('link', { name: 'Entrar' });
    const registerLinks = screen.getAllByRole('link', { name: 'Criar conta' });

    expect(loginLinks.some((link) => link.getAttribute('href') === '/login')).toBe(true);
    expect(registerLinks.some((link) => link.getAttribute('href') === '/register')).toBe(true);
    expect(screen.queryByText('Entrar com Google')).not.toBeInTheDocument();
  });

  test('mantem a pagina institucional separada do dashboard e mostra as secoes principais', () => {
    renderLanding();

    expect(screen.getByRole('heading', { name: /lógica de programação que sai da tela/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Da lógica visual à robótica' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Um ambiente para experimentar lógica e robótica' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Para aprender, ensinar e experimentar' })).toBeInTheDocument();
  });

  test('abre e fecha o menu mobile mantendo aria-expanded sincronizado', () => {
    renderLanding();

    const menuButton = screen.getByRole('button', { name: 'Abrir menu' });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(menuButton);
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute('aria-expanded', 'false');
  });

  test('permite mover os blocos demonstrativos dentro do mockup', () => {
    renderLanding();

    const block = screen.getByRole('button', { name: /Bloco INÍCIO/i });
    const canvas = block.closest('.landing-mockup-canvas');

    Object.defineProperty(canvas, 'clientWidth', { configurable: true, value: 520 });
    Object.defineProperty(canvas, 'clientHeight', { configurable: true, value: 230 });
    Object.defineProperty(block, 'offsetWidth', { configurable: true, value: 70 });
    Object.defineProperty(block, 'offsetHeight', { configurable: true, value: 38 });

    canvas.getBoundingClientRect = () => ({
      left: 100, top: 100, right: 620, bottom: 330, width: 520, height: 230, x: 100, y: 100, toJSON() {},
    });
    block.getBoundingClientRect = () => ({
      left: 124, top: 124, right: 194, bottom: 162, width: 70, height: 38, x: 124, y: 124, toJSON() {},
    });

    const dispatchPointer = (type, { clientX, clientY }) => {
      const event = new MouseEvent(type, { bubbles: true, button: 0, clientX, clientY });
      Object.defineProperties(event, {
        pointerId: { value: 1 },
        pointerType: { value: 'mouse' },
      });
      fireEvent(block, event);
    };

    dispatchPointer('pointerdown', { clientX: 130, clientY: 130 });
    dispatchPointer('pointermove', { clientX: 230, clientY: 180 });
    dispatchPointer('pointerup', { clientX: 230, clientY: 180 });

    expect(block).toHaveStyle({ left: '124px', top: '74px' });

    fireEvent.keyDown(block, { key: 'ArrowRight' });
    expect(block).toHaveStyle({ left: '132px', top: '74px' });

    for (let index = 0; index < 30; index += 1) {
      fireEvent.keyDown(block, { key: 'ArrowRight', shiftKey: true });
      fireEvent.keyDown(block, { key: 'ArrowDown', shiftKey: true });
    }
    expect(block).toHaveStyle({ left: '442px', top: '184px' });

    fireEvent(window, new Event('resize'));
    expect(block.style.left).toBe('');
    expect(block.style.top).toBe('');
  });

  test('mantem as conexoes curvas ligadas aos blocos quando eles mudam de posicao', () => {
    const { container } = renderLanding();

    const canvas = container.querySelector('.landing-mockup-canvas');
    const startBlock = screen.getByRole('button', { name: /Bloco INÍCIO/i });
    const forwardBlock = screen.getByRole('button', { name: /Bloco Para frente/i });
    const repeatBlock = screen.getByRole('button', { name: /Bloco Repetir 3x/i });

    Object.defineProperty(canvas, 'clientWidth', { configurable: true, value: 520 });
    Object.defineProperty(canvas, 'clientHeight', { configurable: true, value: 230 });

    const setBlockLayout = (block, left, top, width) => {
      Object.defineProperty(block, 'offsetLeft', { configurable: true, value: left });
      Object.defineProperty(block, 'offsetTop', { configurable: true, value: top });
      Object.defineProperty(block, 'offsetWidth', { configurable: true, value: width });
      Object.defineProperty(block, 'offsetHeight', { configurable: true, value: 38 });
    };

    setBlockLayout(startBlock, 24, 24, 70);
    setBlockLayout(forwardBlock, 44, 78, 94);
    setBlockLayout(repeatBlock, 24, 132, 92);
    fireEvent(window, new Event('resize'));

    const firstConnection = container.querySelector('[data-mock-connection="start-forward"]');
    const secondConnection = container.querySelector('[data-mock-connection="forward-repeat"]');

    expect(firstConnection).toBeInTheDocument();
    expect(secondConnection).toBeInTheDocument();
    expect(firstConnection.getAttribute('d')).toContain('C ');

    const originalPath = firstConnection.getAttribute('d');
    fireEvent.keyDown(forwardBlock, { key: 'ArrowRight', shiftKey: true });
    fireEvent.keyDown(forwardBlock, { key: 'ArrowDown', shiftKey: true });

    expect(firstConnection.getAttribute('d')).not.toBe(originalPath);
    expect(firstConnection.getAttribute('d')).toContain('C ');
    expect(secondConnection.getAttribute('d')).toContain('C ');
  });

  test('Compilar percorre a sequencia logica fixa mesmo depois de reposicionar os blocos', () => {
    jest.useFakeTimers();
    const { container } = renderLanding();

    const canvas = container.querySelector('.landing-mockup-canvas');
    const startBlock = screen.getByRole('button', { name: /Bloco INÍCIO/i });
    const forwardBlock = screen.getByRole('button', { name: /Bloco Para frente/i });
    const repeatBlock = screen.getByRole('button', { name: /Bloco Repetir 3x/i });

    Object.defineProperty(canvas, 'clientWidth', { configurable: true, value: 520 });
    Object.defineProperty(canvas, 'clientHeight', { configurable: true, value: 230 });
    [
      [startBlock, 24, 24, 70],
      [forwardBlock, 44, 78, 94],
      [repeatBlock, 24, 132, 92],
    ].forEach(([block, left, top, width]) => {
      Object.defineProperty(block, 'offsetLeft', { configurable: true, value: left });
      Object.defineProperty(block, 'offsetTop', { configurable: true, value: top });
      Object.defineProperty(block, 'offsetWidth', { configurable: true, value: width });
      Object.defineProperty(block, 'offsetHeight', { configurable: true, value: 38 });
    });
    fireEvent(window, new Event('resize'));

    fireEvent.keyDown(repeatBlock, { key: 'ArrowUp', shiftKey: true });
    fireEvent.keyDown(repeatBlock, { key: 'ArrowUp', shiftKey: true });

    const compileButton = screen.getByRole('button', { name: 'Compilar' });
    fireEvent.click(compileButton);

    expect(screen.getByRole('button', { name: 'Compilando...' })).toBeDisabled();
    expect(container.querySelector('[data-mock-block="start"]')).toHaveClass('is-compile-active');
    expect(container.querySelector('[data-mock-block="forward"]')).not.toHaveClass('is-compile-active');
    expect(container.querySelector('[data-mock-block="repeat"]')).not.toHaveClass('is-compile-active');

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(container.querySelector('[data-mock-connection="start-forward"]')).toHaveClass('is-compile-active');

    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(container.querySelector('[data-mock-block="forward"]')).toHaveClass('is-compile-active');
    expect(container.querySelector('[data-mock-block="start"]')).not.toHaveClass('is-compile-active');

    act(() => {
      jest.advanceTimersByTime(750);
    });
    expect(container.querySelector('[data-mock-block="repeat"]')).toHaveClass('is-compile-active');
    expect(container.querySelector('[data-mock-block="forward"]')).not.toHaveClass('is-compile-active');

    act(() => {
      jest.advanceTimersByTime(600);
    });
    expect(screen.getByRole('button', { name: 'Compilar' })).toBeEnabled();
    expect(container.querySelector('.landing-mini-block.is-compile-active')).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  test('executa a simulacao visual do robo e retorna ao estado inicial', () => {
    jest.useFakeTimers();
    renderLanding();

    const demoButton = screen.getByRole('button', { name: 'Executar sequência' });
    fireEvent.click(demoButton);
    expect(screen.getByRole('button', { name: 'Executando...' })).toBeDisabled();
    expect(document.querySelector('[data-demo-step="start"]')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1500);
    });
    expect(document.querySelector('[data-demo-step="forward-3"]')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(700);
    });
    expect(document.querySelector('[data-demo-step="led"]')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1200);
    });
    expect(screen.getByRole('button', { name: 'Executar sequência' })).toBeEnabled();
    expect(document.querySelector('[data-demo-step="idle"]')).toBeInTheDocument();

    jest.useRealTimers();
  });

});

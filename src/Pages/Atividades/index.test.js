import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Atividades from './index';

jest.mock('../../Components/Header', () => function HeaderMock() {
  return <div data-testid="header-mock" />;
});

describe('Atividades', () => {
  function renderActivities() {
    return render(
      <MemoryRouter initialEntries={['/atividades']}>
        <Routes>
          <Route path="/atividades" element={<Atividades />} />
          <Route path="/inicio" element={<div>Destino Início</div>} />
        </Routes>
      </MemoryRouter>
    );
  }

  test('renderiza as quatro atividades previstas na versão atual', () => {
    renderActivities();

    expect(screen.getByRole('heading', { name: 'Atividades' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Primeiros passos' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Lógica e movimentos' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Repetições' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Desafios com robô' })).toBeInTheDocument();
    expect(screen.getByText('4 atividades')).toBeInTheDocument();
  });

  test('volta para o início pelo botão da página', () => {
    renderActivities();

    fireEvent.click(screen.getByRole('button', { name: /voltar ao início/i }));

    expect(screen.getByText('Destino Início')).toBeInTheDocument();
  });
});

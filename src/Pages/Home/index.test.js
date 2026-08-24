import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Home from './index';

jest.mock('../../Components/Header', () => function HeaderMock() {
  return <div data-testid="header-mock" />;
});

describe('Dashboard / Início', () => {
  function renderHome() {
    return render(
      <MemoryRouter initialEntries={['/inicio']}>
        <Routes>
          <Route path="/inicio" element={<Home />} />
          <Route path="/FreeMode" element={<div>Destino Modo Livre</div>} />
          <Route path="/atividades" element={<div>Destino Atividades</div>} />
        </Routes>
      </MemoryRouter>
    );
  }

  test('renderiza as experiências e recursos principais', () => {
    renderHome();

    expect(screen.getByRole('heading', { name: /olá/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir Modo Livre' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir Atividades' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir Campanhas' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir Meus Robôs' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir Tutoriais' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir Manuais' })).toBeInTheDocument();
  });

  test('navega para o Modo Livre pelo card do dashboard', () => {
    renderHome();

    fireEvent.click(screen.getByRole('button', { name: 'Abrir Modo Livre' }));

    expect(screen.getByText('Destino Modo Livre')).toBeInTheDocument();
  });

  test('navega para Atividades pelo card do dashboard', () => {
    renderHome();

    fireEvent.click(screen.getByRole('button', { name: 'Abrir Atividades' }));

    expect(screen.getByText('Destino Atividades')).toBeInTheDocument();
  });
});

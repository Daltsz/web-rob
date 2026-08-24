import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Campaing from './index';

jest.mock('../../Components/Header', () => function HeaderMock() {
  return <div data-testid="header-mock" />;
});

describe('Campaing', () => {
  function renderCampaing() {
    return render(
      <MemoryRouter initialEntries={['/Campaing']}>
        <Routes>
          <Route path="/Campaing" element={<Campaing />} />
          <Route path="/Puzzle" element={<div>Destino Puzzle</div>} />
          <Route path="/blocklyGames" element={<div>Destino BlocklyGames</div>} />
        </Routes>
      </MemoryRouter>
    );
  }

  test('navega para Puzzle pelo botão Puzzles', () => {
    renderCampaing();

    fireEvent.click(screen.getByRole('button', { name: 'Puzzles' }));

    expect(screen.getByText('Destino Puzzle')).toBeInTheDocument();
  });

  test('usa o mesmo container de layout nos quatro atalhos', () => {
    const { container } = renderCampaing();

    expect(container.querySelectorAll('.btnsCampanha')).toHaveLength(4);
  });
});

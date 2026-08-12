import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import './index.css';

const dashboardSections = [
  {
    title: 'Principais experiências',
    description: 'Escolha como você quer aprender, praticar e explorar a LogicalEduc.',
    cards: [
      {
        title: 'Modo Livre',
        description: 'Monte seus blocos, gere o código e experimente livremente com seu robô.',
        icon: '🤖',
        path: '/FreeMode',
      },
      {
        title: 'Atividades',
        description: 'Pratique lógica e programação por meio das atividades disponíveis na plataforma.',
        icon: '🧩',
        path: '/atividades',
      },
      {
        title: 'Campanhas',
        description: 'Avance por desafios e experiências criadas para colocar seu aprendizado em prática.',
        icon: '🎮',
        path: '/Campaing',
      },
    ],
  },
  {
    title: 'Seus recursos',
    description: 'Acesse os robôs vinculados à sua conta e continue sua experiência.',
    cards: [
      {
        title: 'Meus Robôs',
        description: 'Consulte os robôs já vinculados à sua conta e veja o status de pareamento.',
        icon: '⚙',
        path: '/meus-robos',
      },
    ],
  },
  {
    title: 'Aprenda e consulte',
    description: 'Encontre ajuda rápida para começar ou consultar quando surgir alguma dúvida.',
    cards: [
      {
        title: 'Tutoriais',
        description: 'Siga conteúdos guiados para aprender a utilizar a plataforma e programar seu robô.',
        icon: '▶',
        path: '/tutoriais',
      },
      {
        title: 'Manuais',
        description: 'Consulte orientações, referências e informações técnicas da LogicalEduc.',
        icon: '📖',
        path: '/manuais',
      },
    ],
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <Header />

      <main className="dashboard-main">
        <section className="dashboard-hero" aria-labelledby="dashboard-title">
          <div className="dashboard-hero-copy">
            <span className="dashboard-eyebrow">Bem-vindo à LogicalEduc</span>
            <h1 id="dashboard-title">Olá! <span aria-hidden="true">👋</span></h1>
            <p>
              Aprenda programação colocando a lógica em prática com robótica e desafios interativos.
              Escolha uma experiência abaixo para começar.
            </p>
          </div>

          <div className="dashboard-hero-brand" aria-hidden="true">
            <div className="dashboard-brand-halo" />
            <img
              src="/assets/LogicalEducLogosemescrita_semfundo.svg"
              alt=""
              className="dashboard-robot-logo"
            />
          </div>
        </section>

        {dashboardSections.map((section) => (
          <section className="dashboard-section" key={section.title}>
            <div className="dashboard-section-heading">
              <h2>{section.title}</h2>
              <p>{section.description}</p>
            </div>

            <div className={`dashboard-grid dashboard-grid-${section.cards.length}`}>
              {section.cards.map((card) => (
                <button
                  type="button"
                  className="dashboard-card"
                  key={card.title}
                  onClick={() => navigate(card.path)}
                  aria-label={`Abrir ${card.title}`}
                >
                  <span className="dashboard-card-icon" aria-hidden="true">{card.icon}</span>
                  <span className="dashboard-card-content">
                    <strong>{card.title}</strong>
                    <span>{card.description}</span>
                  </span>
                  <span className="dashboard-card-arrow" aria-hidden="true">→</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

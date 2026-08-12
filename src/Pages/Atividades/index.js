import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import '../Home/index.css';
import '../Tutoriais/support.css';
import './index.css';

const activities = [
  {
    title: 'Primeiros passos',
    description: 'Conheça os conceitos iniciais de lógica e aprenda como organizar uma sequência de comandos.',
    icon: '🚀',
    level: 'Iniciante',
  },
  {
    title: 'Lógica e movimentos',
    description: 'Pratique direção, sequência e tomada de decisão utilizando movimentos do robô.',
    icon: '🧭',
    level: 'Iniciante',
  },
  {
    title: 'Repetições',
    description: 'Descubra como repetir comandos e construir soluções mais simples com blocos de programação.',
    icon: '🔁',
    level: 'Intermediário',
  },
  {
    title: 'Desafios com robô',
    description: 'Coloque a programação em prática em desafios que conectam os blocos ao robô LogicalEduc.',
    icon: '🤖',
    level: 'Em desenvolvimento',
  },
];

export default function Atividades() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <Header />

      <main className="support-main activities-main">
        <button type="button" className="support-back" onClick={() => navigate('/inicio')}>
          ← Voltar ao início
        </button>

        <section className="support-hero activities-hero">
          <div>
            <span className="dashboard-eyebrow">Aprenda praticando</span>
            <h1>Atividades</h1>
            <p>
              Pratique lógica e programação com atividades preparadas para evoluir passo a passo,
              dos primeiros comandos aos desafios com o robô.
            </p>
          </div>

          <div className="activities-hero-icon" aria-hidden="true">🧩</div>
        </section>

        <section className="activities-section" aria-labelledby="activities-title">
          <div className="activities-heading">
            <div>
              <h2 id="activities-title">Escolha uma atividade</h2>
              <p>Novas experiências serão liberadas conforme a área de atividades evoluir.</p>
            </div>
            <span className="activities-count">{activities.length} atividades</span>
          </div>

          <div className="activities-grid">
            {activities.map((activity, index) => (
              <article className="activity-card" key={activity.title}>
                <div className="activity-card-top">
                  <span className="activity-icon" aria-hidden="true">{activity.icon}</span>
                  <span className="activity-number">{String(index + 1).padStart(2, '0')}</span>
                </div>

                <h3>{activity.title}</h3>
                <p>{activity.description}</p>

                <div className="activity-card-footer">
                  <span className="activity-level">{activity.level}</span>
                  <span className="activity-status">Em breve</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

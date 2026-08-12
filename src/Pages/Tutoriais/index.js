import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import '../Home/index.css';
import './support.css';

const topics = [
  'Primeiros passos na LogicalEduc',
  'Conhecendo seu robô',
  'Como parear o robô',
  'Introdução à programação em blocos',
  'Criando seu primeiro programa',
  'Executando o código no robô',
];

export default function Tutoriais() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <Header />
      <main className="support-main">
        <button type="button" className="support-back" onClick={() => navigate('/inicio')}>
          ← Voltar ao início
        </button>

        <section className="support-hero">
          <span className="dashboard-eyebrow">Aprenda passo a passo</span>
          <h1>Tutoriais</h1>
          <p>Uma área preparada para reunir conteúdos guiados sobre a plataforma, programação e robótica.</p>
        </section>

        <div className="support-grid">
          {topics.map((topic, index) => (
            <article className="support-card" key={topic}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h2>{topic}</h2>
              <p>Conteúdo em preparação.</p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

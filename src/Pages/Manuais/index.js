import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import '../Home/index.css';
import '../Tutoriais/support.css';

const manuals = [
  'Manual do robô LogicalEduc',
  'Componentes e montagem',
  'Bateria e carregamento',
  'Blocos de programação',
  'Conectividade e pareamento',
  'Solução de problemas e FAQ',
];

export default function Manuais() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <Header />
      <main className="support-main">
        <button type="button" className="support-back" onClick={() => navigate('/inicio')}>
          ← Voltar ao início
        </button>

        <section className="support-hero">
          <span className="dashboard-eyebrow">Consulte quando precisar</span>
          <h1>Manuais</h1>
          <p>Uma área preparada para centralizar referências, orientações e documentação da LogicalEduc.</p>
        </section>

        <div className="support-grid">
          {manuals.map((manual, index) => (
            <article className="support-card" key={manual}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h2>{manual}</h2>
              <p>Material em preparação.</p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import { getMyRobots } from '../../Services/pairing';
import '../Home/index.css';
import '../Tutoriais/support.css';
import './index.css';

export default function MeusRobos() {
  const navigate = useNavigate();
  const [robots, setRobots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadRobots() {
      try {
        const data = await getMyRobots();
        if (active) setRobots(data);
      } catch (requestError) {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadRobots();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="dashboard-page">
      <Header />
      <main className="support-main">
        <button type="button" className="support-back" onClick={() => navigate('/inicio')}>
          ← Voltar ao início
        </button>

        <section className="support-hero">
          <span className="dashboard-eyebrow">Seus dispositivos</span>
          <h1>Meus Robôs</h1>
          <p>Consulte os robôs vinculados à sua conta LogicalEduc.</p>
        </section>

        {loading && <p className="robots-message">Carregando seus robôs...</p>}

        {!loading && error && (
          <div className="robots-empty">
            <h2>Não foi possível carregar seus robôs.</h2>
            <p>Verifique sua conexão e tente novamente.</p>
          </div>
        )}

        {!loading && !error && robots.length === 0 && (
          <div className="robots-empty">
            <h2>Nenhum robô vinculado ainda.</h2>
            <p>Você pode iniciar o pareamento pelo Modo Livre.</p>
            <button type="button" onClick={() => navigate('/FreeMode')}>Ir para o Modo Livre</button>
          </div>
        )}

        {!loading && !error && robots.length > 0 && (
          <div className="robots-grid">
            {robots.map((robot) => (
              <article className="robot-card" key={robot.id || robot.mac || robot.topic}>
                <div className="robot-card-icon" aria-hidden="true">🤖</div>
                <div>
                  <h2>{robot.name || `Robô ${robot.id || ''}`.trim()}</h2>
                  {robot.mac && <p><strong>MAC:</strong> {robot.mac}</p>}
                  <p>
                    <strong>Status:</strong>{' '}
                    <span className={`robot-status robot-status-${String(robot.status || '').toLowerCase()}`}>
                      {robot.status || 'Vinculado'}
                    </span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

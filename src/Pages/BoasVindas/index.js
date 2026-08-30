import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const benefits = [
  {
    icon: 'blocks',
    title: 'Programação visual',
    description: 'Monte sequências e repetições com blocos antes de enviar o código para o robô.',
  },
  {
    icon: 'robot',
    title: 'Robótica na prática',
    description: 'Conecte lógica e movimento usando o robô LogicalEduc vinculado à sua conta.',
  },
  {
    icon: 'code',
    title: 'Código visível',
    description: 'Compile os blocos, visualize o MicroPython gerado, copie o conteúdo ou baixe o arquivo .py.',
  },
  {
    icon: 'devices',
    title: 'Seus robôs organizados',
    description: 'Consulte os dispositivos vinculados e escolha explicitamente qual robô receberá os comandos.',
  },
  {
    icon: 'account',
    title: 'Acesso simples',
    description: 'Entre com sua conta LogicalEduc ou use a opção de login com Google disponível na tela de acesso.',
  },
  {
    icon: 'learn',
    title: 'Experiências em evolução',
    description: 'Modo Livre, campanhas, atividades, tutoriais e manuais ficam reunidos em uma única plataforma.',
  },
];

function Icon({ name }) {
  const commonProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  switch (name) {
    case 'blocks':
      return (
        <svg {...commonProps}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <path d="M14 17.5h7M17.5 14v7" />
        </svg>
      );
    case 'robot':
      return (
        <svg {...commonProps}>
          <rect x="5" y="8" width="14" height="10" rx="2" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2M8 13h.01M16 13h.01M9 18v2M15 18v2" />
        </svg>
      );
    case 'code':
      return (
        <svg {...commonProps}>
          <path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" />
        </svg>
      );
    case 'devices':
      return (
        <svg {...commonProps}>
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20h8M12 16v4" />
        </svg>
      );
    case 'account':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );
    case 'learn':
      return (
        <svg {...commonProps}>
          <path d="M4 19.5V6a2 2 0 0 1 2-2h12v14H6a2 2 0 0 0 0 4h14" />
        </svg>
      );
    case 'check':
      return (
        <svg {...commonProps} strokeWidth={2.4}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      );
    case 'arrow':
      return (
        <svg {...commonProps}>
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      );
    case 'down':
      return (
        <svg {...commonProps}>
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      );
    case 'menu':
      return (
        <svg {...commonProps}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case 'close':
      return (
        <svg {...commonProps}>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case 'play':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      );
    default:
      return null;
  }
}


const MOCK_BLOCK_MARGIN = 8;
const MOCK_LOGIC_SEQUENCE = ['start', 'forward', 'repeat'];
const MOCK_CONNECTIONS = [
  { id: 'start-forward', from: 'start', to: 'forward' },
  { id: 'forward-repeat', from: 'forward', to: 'repeat' },
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function createConnectionPath(source, target) {
  if (!source || !target) return '';

  const sourceCenterY = source.top + source.height / 2;
  const targetCenterY = target.top + target.height / 2;
  const targetIsBelow = targetCenterY >= sourceCenterY;
  const direction = targetIsBelow ? 1 : -1;

  const start = {
    x: source.left + source.width / 2,
    y: targetIsBelow ? source.top + source.height : source.top,
  };
  const end = {
    x: target.left + target.width / 2,
    y: targetIsBelow ? target.top : target.top + target.height,
  };

  const horizontalDistance = Math.abs(end.x - start.x);
  const verticalDistance = Math.abs(end.y - start.y);
  const curve = clamp(verticalDistance * 0.55 + horizontalDistance * 0.18, 28, 92);

  const controlOne = { x: start.x, y: start.y + curve * direction };
  const controlTwo = { x: end.x, y: end.y - curve * direction };

  return [
    `M ${start.x.toFixed(1)} ${start.y.toFixed(1)}`,
    `C ${controlOne.x.toFixed(1)} ${controlOne.y.toFixed(1)},`,
    `${controlTwo.x.toFixed(1)} ${controlTwo.y.toFixed(1)},`,
    `${end.x.toFixed(1)} ${end.y.toFixed(1)}`,
  ].join(' ');
}

function DraggableMockBlock({
  blockId,
  children,
  className,
  canvasRef,
  onGeometryChange,
  isCompileActive = false,
}) {
  const [position, setPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [layoutVersion, setLayoutVersion] = useState(0);
  const dragStateRef = useRef(null);
  const blockRef = useRef(null);

  const reportGeometry = useCallback(() => {
    const block = blockRef.current;
    if (!block || !canvasRef.current) return;

    onGeometryChange(blockId, {
      left: position?.left ?? block.offsetLeft,
      top: position?.top ?? block.offsetTop,
      width: block.offsetWidth,
      height: block.offsetHeight,
    });
  }, [blockId, canvasRef, onGeometryChange, position]);

  useLayoutEffect(() => {
    reportGeometry();
  }, [layoutVersion, reportGeometry]);

  useEffect(() => {
    const resetPositionOnResize = () => {
      dragStateRef.current = null;
      setIsDragging(false);
      setPosition(null);
      setLayoutVersion((current) => current + 1);
    };

    window.addEventListener('resize', resetPositionOnResize);
    return () => window.removeEventListener('resize', resetPositionOnResize);
  }, [blockId, onGeometryChange]);

  const getBoundedPosition = (target, left, top) => {
    const canvas = canvasRef.current;
    if (!canvas) return { left, top };

    const maxLeft = Math.max(MOCK_BLOCK_MARGIN, canvas.clientWidth - target.offsetWidth - MOCK_BLOCK_MARGIN);
    const maxTop = Math.max(MOCK_BLOCK_MARGIN, canvas.clientHeight - target.offsetHeight - MOCK_BLOCK_MARGIN);

    return {
      left: clamp(left, MOCK_BLOCK_MARGIN, maxLeft),
      top: clamp(top, MOCK_BLOCK_MARGIN, maxTop),
    };
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const block = event.currentTarget;
    const canvasRect = canvas.getBoundingClientRect();
    const blockRect = block.getBoundingClientRect();

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: blockRect.left - canvasRect.left,
      startTop: blockRect.top - canvasRect.top,
    };

    block.setPointerCapture?.(event.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (event) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    const nextLeft = dragState.startLeft + event.clientX - dragState.startX;
    const nextTop = dragState.startTop + event.clientY - dragState.startY;
    setPosition(getBoundedPosition(event.currentTarget, nextLeft, nextTop));
  };

  const finishDrag = (event) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    event.currentTarget.releasePointerCapture?.(event.pointerId);
    dragStateRef.current = null;
    setIsDragging(false);
  };

  const handleKeyDown = (event) => {
    const direction = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    }[event.key];

    if (!direction) return;

    const block = event.currentTarget;
    const step = event.shiftKey ? 16 : 8;
    const currentLeft = position?.left ?? block.offsetLeft;
    const currentTop = position?.top ?? block.offsetTop;

    setPosition(
      getBoundedPosition(
        block,
        currentLeft + direction[0] * step,
        currentTop + direction[1] * step
      )
    );
    event.preventDefault();
  };

  const stateClasses = [
    className,
    isDragging ? 'is-dragging' : '',
    isCompileActive ? 'is-compile-active' : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={blockRef}
      type="button"
      className={stateClasses}
      data-mock-block={blockId}
      style={position ? { left: `${position.left}px`, top: `${position.top}px` } : undefined}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onKeyDown={handleKeyDown}
      aria-label={`Bloco ${children}. Arraste ou use as setas para mover.`}
      aria-current={isCompileActive ? 'step' : undefined}
      title="Arraste para mover"
    >
      {children}
    </button>
  );
}

function Brand() {
  return (
    <a href="#top" className="landing-brand" aria-label="LogicalEduc - voltar ao início da página">
      <img
        src="/assets/LogicalEducLogosemescrita_semfundo.svg"
        alt=""
        className="landing-logo-icon"
        aria-hidden="true"
      />
      <span>LogicalEduc</span>
    </a>
  );
}

function RobotIllustration({ large = false, ledOn = false }) {
  const className = [
    'landing-robot',
    large ? 'landing-robot--large' : '',
    ledOn ? 'landing-robot--led-on' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={className} aria-hidden="true">
      <div className="landing-robot-antenna" />
      <div className="landing-robot-head">
        <span className="landing-robot-eye" />
        <span className="landing-robot-eye" />
      </div>
      <div className="landing-robot-body">
        <span className="landing-chip landing-chip--orange" />
        <span className="landing-chip landing-chip--blue" />
        <span className="landing-chip landing-chip--coral" />
      </div>
    </div>
  );
}

export default function BoasVindas() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [robotDemoStep, setRobotDemoStep] = useState('idle');
  const [isRobotDemoRunning, setIsRobotDemoRunning] = useState(false);
  const [mockBlockGeometry, setMockBlockGeometry] = useState({});
  const [mockCompileStep, setMockCompileStep] = useState('idle');
  const [isMockCompiling, setIsMockCompiling] = useState(false);
  const pageRef = useRef(null);
  const mockupCanvasRef = useRef(null);
  const robotDemoTimersRef = useRef([]);
  const mockCompileTimersRef = useRef([]);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return undefined;

    const revealElements = page.querySelectorAll('.landing-reveal');
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    if (prefersReduced || !('IntersectionObserver' in window)) {
      revealElements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  useEffect(() => () => {
    robotDemoTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    robotDemoTimersRef.current = [];
    mockCompileTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    mockCompileTimersRef.current = [];
  }, []);

  const handleMockBlockGeometryChange = useCallback((blockId, geometry) => {
    setMockBlockGeometry((current) => {
      const previous = current[blockId];
      if (
        previous
        && previous.left === geometry.left
        && previous.top === geometry.top
        && previous.width === geometry.width
        && previous.height === geometry.height
      ) {
        return current;
      }

      return { ...current, [blockId]: geometry };
    });
  }, []);

  const startMockCompilation = () => {
    if (isMockCompiling) return;

    mockCompileTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    mockCompileTimersRef.current = [];
    setIsMockCompiling(true);
    setMockCompileStep('start');

    const scheduleStep = (delay, step) => {
      const timerId = window.setTimeout(() => setMockCompileStep(step), delay);
      mockCompileTimersRef.current.push(timerId);
    };

    scheduleStep(500, 'connection-start-forward');
    scheduleStep(750, 'forward');
    scheduleStep(1250, 'connection-forward-repeat');
    scheduleStep(1500, 'repeat');

    const finishTimerId = window.setTimeout(() => {
      setMockCompileStep('idle');
      setIsMockCompiling(false);
      mockCompileTimersRef.current = [];
    }, 2100);
    mockCompileTimersRef.current.push(finishTimerId);
  };

  const startRobotDemo = () => {
    if (isRobotDemoRunning) return;

    robotDemoTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    robotDemoTimersRef.current = [];

    setIsRobotDemoRunning(true);
    setRobotDemoStep('start');

    const scheduleStep = (delay, step) => {
      const timerId = window.setTimeout(() => setRobotDemoStep(step), delay);
      robotDemoTimersRef.current.push(timerId);
    };

    scheduleStep(350, 'forward-1');
    scheduleStep(900, 'forward-2');
    scheduleStep(1450, 'forward-3');
    scheduleStep(2050, 'led');
    scheduleStep(2850, 'return');

    const finishTimerId = window.setTimeout(() => {
      setRobotDemoStep('idle');
      setIsRobotDemoRunning(false);
      robotDemoTimersRef.current = [];
    }, 3350);
    robotDemoTimersRef.current.push(finishTimerId);
  };

  const isForwardDemoStep = ['forward-1', 'forward-2', 'forward-3'].includes(robotDemoStep);
  const mockCompileActiveBlock = MOCK_LOGIC_SEQUENCE.includes(mockCompileStep) ? mockCompileStep : null;
  const mockCompileStatus = {
    idle: 'Demonstração pronta para compilar.',
    start: 'Compilando: bloco INÍCIO.',
    'connection-start-forward': 'Seguindo a conexão entre INÍCIO e Para frente.',
    forward: 'Compilando: bloco Para frente.',
    'connection-forward-repeat': 'Seguindo a conexão entre Para frente e Repetir 3x.',
    repeat: 'Compilando: bloco Repetir 3x.',
  }[mockCompileStep];
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="landing-page" id="top" ref={pageRef}>
      <header className="landing-header">
        <nav className="landing-wrap landing-nav" aria-label="Navegação principal">
          <Brand />

          <div className="landing-nav-links" aria-label="Seções da página">
            <a href="#como-funciona">Como funciona</a>
            <a href="#ferramentas">Ferramentas</a>
            <a href="#experiencias">Experiências</a>
            <a href="#para-quem">Para quem</a>
          </div>

          <div className="landing-nav-actions">
            <Link className="landing-btn landing-btn--login landing-desktop-auth" to="/login">
              Entrar
            </Link>
            <Link className="landing-btn landing-btn--primary landing-desktop-auth" to="/register">
              Criar conta
            </Link>
            <button
              type="button"
              className="landing-menu-button"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              aria-controls="landing-mobile-menu"
              onClick={() => setMenuOpen((current) => !current)}
            >
              <Icon name={menuOpen ? 'close' : 'menu'} />
            </button>
          </div>
        </nav>

        <div
          id="landing-mobile-menu"
          className={`landing-mobile-panel${menuOpen ? ' is-open' : ''}`}
        >
          <a href="#como-funciona" onClick={closeMenu}>Como funciona</a>
          <a href="#ferramentas" onClick={closeMenu}>Ferramentas</a>
          <a href="#experiencias" onClick={closeMenu}>Experiências</a>
          <a href="#para-quem" onClick={closeMenu}>Para quem</a>
          <div className="landing-mobile-auth">
            <Link className="landing-btn landing-btn--login" to="/login" onClick={closeMenu}>
              Entrar
            </Link>
            <Link className="landing-btn landing-btn--primary" to="/register" onClick={closeMenu}>
              Criar conta
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="landing-hero" aria-labelledby="landing-title">
          <div className="landing-wrap landing-hero-grid">
            <div className="landing-hero-copy">
              <span className="landing-eyebrow">
                <Icon name="blocks" />
                Pensamento computacional na prática
              </span>
              <h1 id="landing-title">
                Lógica de programação que sai da tela e{' '}
                <span>ganha o mundo real.</span>
              </h1>
              <p className="landing-lead">
                LogicalEduc une programação visual em blocos e robótica educacional para transformar
                lógica em experiências práticas — do editor ao robô.
              </p>

              <div className="landing-hero-actions">
                <Link className="landing-btn landing-btn--primary landing-btn--large" to="/register">
                  Criar conta
                </Link>
                <a className="landing-btn landing-btn--ghost landing-btn--large" href="#como-funciona">
                  Ver como funciona
                  <Icon name="down" />
                </a>
              </div>
              <p className="landing-hero-note">
                Já possui uma conta? <Link to="/login">Entre na plataforma</Link> e continue de onde parou.
              </p>
            </div>

            <div className="landing-hero-visual landing-reveal">
              <div className="landing-block-chain" aria-hidden="true">
                <div className={`landing-code-block landing-code-block--blue${robotDemoStep === 'start' ? ' is-demo-active' : ''}`}>
                  INÍCIO
                </div>
                <div className="landing-wire" />
                <div className={`landing-code-block landing-code-block--orange${isForwardDemoStep ? ' is-demo-active' : ''}`}>
                  Para frente
                </div>
                <div className="landing-wire" />
                <div className={`landing-code-block landing-code-block--coral${isForwardDemoStep ? ' is-demo-active' : ''}`}>
                  Repetir 3x
                </div>
                <div className="landing-wire" />
                <div className={`landing-code-block landing-code-block--navy${robotDemoStep === 'led' ? ' is-demo-active' : ''}`}>
                  Acender LED
                </div>
              </div>

              <div className="landing-demo-robot-zone">
                <div className="landing-wire landing-wire--down" aria-hidden="true" />
                <div
                  className={`landing-demo-robot-motion landing-demo-robot-motion--${robotDemoStep}`}
                  data-demo-step={robotDemoStep}
                  aria-hidden="true"
                >
                  <RobotIllustration ledOn={robotDemoStep === 'led'} />
                </div>
                <button
                  type="button"
                  className="landing-demo-button"
                  onClick={startRobotDemo}
                  disabled={isRobotDemoRunning}
                >
                  <Icon name="play" />
                  {isRobotDemoRunning ? 'Executando...' : 'Executar sequência'}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section" id="como-funciona">
          <div className="landing-wrap">
            <div className="landing-section-heading landing-section-heading--center landing-reveal">
              <span className="landing-eyebrow">Como funciona</span>
              <h2>Da lógica visual à robótica</h2>
              <p className="landing-lead">
                A criança organiza ideias com blocos, transforma esses blocos em código e pode enviar
                comandos ao robô LogicalEduc vinculado à sua conta.
              </p>
            </div>

            <div className="landing-track-grid">
              <article className="landing-track-card landing-reveal">
                <div className="landing-track-icon landing-track-icon--blue">
                  <Icon name="blocks" />
                </div>
                <h3>Programação visual</h3>
                <p>
                  No Modo Livre, os blocos ajudam a montar sequências, movimentos e repetições de forma
                  visual. A plataforma compila o workspace para Python/MicroPython.
                </p>
                <div className="landing-tag-row">
                  <span className="landing-tag">Editor de blocos</span>
                  <span className="landing-tag">Modo Livre</span>
                  <span className="landing-tag">MicroPython</span>
                </div>
              </article>

              <article className="landing-track-card landing-reveal">
                <div className="landing-track-icon landing-track-icon--orange">
                  <Icon name="robot" />
                </div>
                <h3>Robótica educacional</h3>
                <p>
                  O robô LogicalEduc pode ser pareado à conta e selecionado para receber os comandos
                  produzidos no editor, aproximando programação e experiência prática.
                </p>
                <div className="landing-tag-row">
                  <span className="landing-tag">Pareamento</span>
                  <span className="landing-tag">Movimentos</span>
                  <span className="landing-tag">LEDs</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="landing-section landing-section--tint" id="ferramentas">
          <div className="landing-wrap">
            <div className="landing-section-heading landing-reveal">
              <span className="landing-eyebrow">Ferramentas da plataforma</span>
              <h2>Um ambiente para experimentar lógica e robótica</h2>
            </div>

            <div className="landing-tool-row">
              <div className="landing-tool-copy landing-reveal">
                <span className="landing-eyebrow">Ferramenta 01</span>
                <h3>Editor de blocos para construir a lógica visualmente</h3>
                <p>
                  Monte comandos arrastando blocos e compile o resultado quando estiver pronto. Se os
                  blocos forem alterados, a plataforma pede uma nova compilação antes do envio.
                </p>
                <ul className="landing-tool-list">
                  <li><Icon name="check" />Interface visual por blocos</li>
                  <li><Icon name="check" />Geração de Python/MicroPython</li>
                  <li><Icon name="check" />Visualização, cópia e download do código .py</li>
                </ul>
              </div>

              <div className="landing-tool-visual landing-reveal">
                <div className="landing-editor-mockup">
                  <div className="landing-mockup-bar">
                    <span /><span /><span />
                    <strong>Editor de blocos — LogicalEduc</strong>
                  </div>
                  <div
                    className="landing-mockup-canvas"
                    ref={mockupCanvasRef}
                    role="group"
                    aria-label="Demonstração interativa do editor de blocos"
                  >
                    <svg
                      className="landing-mockup-connections"
                      width="100%"
                      height="100%"
                      viewBox={`0 0 ${mockupCanvasRef.current?.clientWidth || 1} ${mockupCanvasRef.current?.clientHeight || 1}`}
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      {MOCK_CONNECTIONS.map((connection) => {
                        const path = createConnectionPath(
                          mockBlockGeometry[connection.from],
                          mockBlockGeometry[connection.to]
                        );
                        if (!path) return null;

                        const isActive = mockCompileStep === `connection-${connection.id}`;
                        return (
                          <path
                            key={connection.id}
                            data-mock-connection={connection.id}
                            className={`landing-mockup-connection${isActive ? ' is-compile-active' : ''}`}
                            d={path}
                          />
                        );
                      })}
                    </svg>

                    <DraggableMockBlock
                      blockId="start"
                      className="landing-mini-block landing-mini-block--one"
                      canvasRef={mockupCanvasRef}
                      onGeometryChange={handleMockBlockGeometryChange}
                      isCompileActive={mockCompileActiveBlock === 'start'}
                    >
                      INÍCIO
                    </DraggableMockBlock>
                    <DraggableMockBlock
                      blockId="forward"
                      className="landing-mini-block landing-mini-block--two"
                      canvasRef={mockupCanvasRef}
                      onGeometryChange={handleMockBlockGeometryChange}
                      isCompileActive={mockCompileActiveBlock === 'forward'}
                    >
                      Para frente
                    </DraggableMockBlock>
                    <DraggableMockBlock
                      blockId="repeat"
                      className="landing-mini-block landing-mini-block--three"
                      canvasRef={mockupCanvasRef}
                      onGeometryChange={handleMockBlockGeometryChange}
                      isCompileActive={mockCompileActiveBlock === 'repeat'}
                    >
                      Repetir 3x
                    </DraggableMockBlock>

                    <button
                      type="button"
                      className="landing-mockup-action"
                      onClick={startMockCompilation}
                      disabled={isMockCompiling}
                    >
                      <Icon name="play" />
                      {isMockCompiling ? 'Compilando...' : 'Compilar'}
                    </button>
                    <span className="landing-visually-hidden" role="status" aria-live="polite">
                      {mockCompileStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="landing-tool-row landing-tool-row--flip">
              <div className="landing-tool-copy landing-reveal">
                <span className="landing-eyebrow">Ferramenta 02</span>
                <h3>Um robô que transforma blocos em ações</h3>
                <p>
                  Depois de vinculado à conta, o robô pode ser escolhido no Modo Livre para receber o
                  código encaminhado pela plataforma.
                </p>
                <ul className="landing-tool-list">
                  <li><Icon name="check" />Pareamento de dispositivos pela plataforma</li>
                  <li><Icon name="check" />Comandos de movimento e LEDs</li>
                  <li><Icon name="check" />Seleção explícita quando houver mais de um robô</li>
                </ul>
              </div>

              <div className="landing-tool-visual landing-reveal">
                <div className="landing-robot-showcase">
                  <div className="landing-robot-stage">
                    <RobotIllustration large />
                  </div>
                  <div className="landing-spec-row">
                    <span className="landing-spec-pill">Pareamento</span>
                    <span className="landing-spec-pill">Motores</span>
                    <span className="landing-spec-pill">LEDs</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="landing-tool-row" id="experiencias">
              <div className="landing-tool-copy landing-reveal">
                <span className="landing-eyebrow">Ferramenta 03</span>
                <h3>Experiências reunidas em um único lugar</h3>
                <p>
                  O dashboard organiza o acesso ao Modo Livre, campanhas, atividades, robôs, tutoriais
                  e manuais. Algumas áreas de conteúdo continuam evoluindo conforme a plataforma cresce.
                </p>
                <ul className="landing-tool-list">
                  <li><Icon name="check" />Modo Livre para experimentar com blocos e robô</li>
                  <li><Icon name="check" />Campanhas e desafios interativos</li>
                  <li><Icon name="check" />Áreas dedicadas a atividades, tutoriais e manuais</li>
                </ul>
              </div>

              <div className="landing-tool-visual landing-reveal" aria-hidden="true">
                <div className="landing-card-fan">
                  <div className="landing-fan-card landing-fan-card--one">
                    <span>EXPERIÊNCIA 01</span>
                    <Icon name="blocks" />
                    <strong>Modo Livre</strong>
                  </div>
                  <div className="landing-fan-card landing-fan-card--two">
                    <span>EXPERIÊNCIA 02</span>
                    <Icon name="play" />
                    <strong>Campanhas</strong>
                  </div>
                  <div className="landing-fan-card landing-fan-card--three">
                    <span>EXPERIÊNCIA 03</span>
                    <Icon name="learn" />
                    <strong>Atividades</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section">
          <div className="landing-wrap">
            <div className="landing-divider landing-reveal" aria-hidden="true">
              <span /><span /><span /><span />
            </div>
            <div className="landing-section-heading landing-section-heading--center landing-reveal">
              <span className="landing-eyebrow">Por que LogicalEduc</span>
              <h2>Ferramentas para aprender fazendo</h2>
            </div>

            <div className="landing-benefit-grid">
              {benefits.map((benefit) => (
                <article className="landing-benefit-card landing-reveal" key={benefit.title}>
                  <div className="landing-benefit-icon"><Icon name={benefit.icon} /></div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-section landing-section--tint" id="para-quem">
          <div className="landing-wrap">
            <div className="landing-section-heading landing-section-heading--center landing-reveal">
              <span className="landing-eyebrow">Para quem é</span>
              <h2>Para aprender, ensinar e experimentar</h2>
            </div>

            <div className="landing-audience-grid">
              <article className="landing-audience-card landing-audience-card--family landing-reveal">
                <h3>Para famílias e estudantes</h3>
                <p>
                  Crie uma conta e explore programação visual, robótica e os diferentes espaços de
                  aprendizagem disponíveis na LogicalEduc.
                </p>
                <Link className="landing-btn landing-btn--light" to="/register">
                  Criar conta
                  <Icon name="arrow" />
                </Link>
              </article>

              <article className="landing-audience-card landing-audience-card--school landing-reveal">
                <h3>Para escolas e educadores</h3>
                <p>
                  Use programação em blocos e robótica como apoio a experiências práticas de lógica e
                  pensamento computacional.
                </p>
                <a className="landing-btn landing-btn--ghost" href="mailto:contato@logicaleduc.com.br">
                  Falar com a equipe
                  <Icon name="arrow" />
                </a>
              </article>
            </div>
          </div>
        </section>

        <section className="landing-cta-band">
          <div className="landing-wrap">
            <h2 className="landing-reveal">Comece a explorar a LogicalEduc</h2>
            <p className="landing-reveal">
              Crie sua conta para acessar a plataforma ou entre se você já faz parte da LogicalEduc.
            </p>
            <div className="landing-cta-actions landing-reveal">
              <Link className="landing-btn landing-btn--light landing-btn--large" to="/register">
                Criar conta
              </Link>
              <Link className="landing-btn landing-btn--dark-outline landing-btn--large" to="/login">
                Entrar
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-wrap">
          <div className="landing-footer-grid">
            <div className="landing-footer-brand">
              <Brand />
              <p>Programação visual e robótica educacional para aprender lógica colocando ideias em prática.</p>
            </div>

            <div className="landing-footer-column">
              <h4>Plataforma</h4>
              <ul>
                <li><a href="#como-funciona">Como funciona</a></li>
                <li><a href="#ferramentas">Ferramentas</a></li>
                <li><a href="#experiencias">Experiências</a></li>
              </ul>
            </div>

            <div className="landing-footer-column">
              <h4>Acesso</h4>
              <ul>
                <li><Link to="/login">Entrar</Link></li>
                <li><Link to="/register">Criar conta</Link></li>
                <li><a href="mailto:contato@logicaleduc.com.br">Contato</a></li>
              </ul>
            </div>
          </div>

          <div className="landing-footer-bottom">
            <span>© 2026 LogicalEduc. Todos os direitos reservados.</span>
            <span>Feito com lógica e criatividade.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

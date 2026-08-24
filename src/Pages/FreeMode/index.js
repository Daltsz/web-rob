import "./FreeMode.css";
import "../../Components/Blocks/customblocks";
import { getDefaultToolBox } from "../../Components/Blockly/getDefaultToolBox";
import { DEFAULT_OPTIONS } from "../../Components/Blockly/workspaceConfigs";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BlocklyWorkspace, useBlocklyWorkspace} from "react-blockly";
import {pythonGenerator} from 'blockly/python';
import { sendRobotCommand } from "../../Services/robots";
import { getMyRobots } from "../../Services/pairing";
import Header from '../../Components/Header';
import PairRobotModal from "../../Components/Pair/pairRobotModal";

const FEEDBACK_ICONS = {
  success: '✓',
  info: 'i',
  warning: '!',
  error: '×',
};


const PYTHON_KEYWORDS = new Set([
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break',
  'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally',
  'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal',
  'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield',
]);

const PYTHON_NUMBER_PATTERN = /^(?:0[xX][0-9a-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|(?:\d[\d_]*\.\d*|\.\d+|\d[\d_]*)(?:[eE][+-]?\d[\d_]*)?[jJ]?)/;
const PYTHON_IDENTIFIER_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*/;
const PYTHON_STRING_PREFIX_PATTERN = /^[rRuUbBfF]{1,2}(?=['"])/;

function tokenizePythonCode(code) {
  const lines = code ? code.split('\n') : [];
  let openTripleQuote = null;

  return lines.map((line) => {
    const tokens = [];
    let index = 0;

    const pushToken = (type, value) => {
      if (value) {
        tokens.push({ type, value });
      }
    };

    while (index < line.length) {
      if (openTripleQuote) {
        const closingIndex = line.indexOf(openTripleQuote, index);

        if (closingIndex === -1) {
          pushToken('string', line.slice(index));
          index = line.length;
          continue;
        }

        const closingEnd = closingIndex + openTripleQuote.length;
        pushToken('string', line.slice(index, closingEnd));
        index = closingEnd;
        openTripleQuote = null;
        continue;
      }

      const currentChar = line[index];

      if (currentChar === '#') {
        pushToken('comment', line.slice(index));
        break;
      }

      let prefixLength = 0;
      const prefixMatch = line.slice(index).match(PYTHON_STRING_PREFIX_PATTERN);
      if (prefixMatch) {
        prefixLength = prefixMatch[0].length;
      }

      const quoteIndex = index + prefixLength;
      const quoteChar = line[quoteIndex];
      if (quoteChar === "'" || quoteChar === '"') {
        const tripleQuote = quoteChar.repeat(3);
        const isTripleQuoted = line.slice(quoteIndex, quoteIndex + 3) === tripleQuote;

        if (isTripleQuoted) {
          const contentStart = quoteIndex + 3;
          const closingIndex = line.indexOf(tripleQuote, contentStart);

          if (closingIndex === -1) {
            pushToken('string', line.slice(index));
            openTripleQuote = tripleQuote;
            break;
          }

          const closingEnd = closingIndex + 3;
          pushToken('string', line.slice(index, closingEnd));
          index = closingEnd;
          continue;
        }

        let cursor = quoteIndex + 1;
        let escaped = false;

        while (cursor < line.length) {
          const char = line[cursor];

          if (!escaped && char === quoteChar) {
            cursor += 1;
            break;
          }

          if (!escaped && char === '\\') {
            escaped = true;
          } else {
            escaped = false;
          }

          cursor += 1;
        }

        pushToken('string', line.slice(index, cursor));
        index = cursor;
        continue;
      }

      if (/\d/.test(currentChar) || (currentChar === '.' && /\d/.test(line[index + 1] || ''))) {
        const numberMatch = line.slice(index).match(PYTHON_NUMBER_PATTERN);
        if (numberMatch) {
          pushToken('number', numberMatch[0]);
          index += numberMatch[0].length;
          continue;
        }
      }

      if (/[A-Za-z_]/.test(currentChar)) {
        const identifierMatch = line.slice(index).match(PYTHON_IDENTIFIER_PATTERN);
        if (identifierMatch) {
          const identifier = identifierMatch[0];
          const identifierEnd = index + identifier.length;
          const nextNonWhitespaceIndex = identifierEnd + (line.slice(identifierEnd).match(/^\s*/)?.[0].length || 0);
          const isFunction = line[nextNonWhitespaceIndex] === '(' && !PYTHON_KEYWORDS.has(identifier);

          pushToken(PYTHON_KEYWORDS.has(identifier) ? 'keyword' : isFunction ? 'function' : 'plain', identifier);
          index = identifierEnd;
          continue;
        }
      }

      let cursor = index + 1;
      while (cursor < line.length) {
        const char = line[cursor];
        const startsSpecialToken =
          char === '#' ||
          char === "'" ||
          char === '"' ||
          /\d/.test(char) ||
          /[A-Za-z_]/.test(char) ||
          (char === '.' && /\d/.test(line[cursor + 1] || ''));

        if (startsSpecialToken) {
          break;
        }

        cursor += 1;
      }

      pushToken('plain', line.slice(index, cursor));
      index = cursor;
    }

    return tokens;
  });
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  textarea.style.top = '-9999px';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  const copied = typeof document.execCommand === 'function' && document.execCommand('copy');
  textarea.remove();

  if (!copied) {
    throw new Error('Não foi possível copiar o código.');
  }
}

function FeedbackCard({ feedback }) {
  if (!feedback) {
    return null;
  }

  const isError = feedback.type === 'error';

  return (
    <div
      className={`free-mode-feedback free-mode-feedback-${feedback.type}`}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
    >
      <span className="free-mode-feedback-icon" aria-hidden="true">
        {FEEDBACK_ICONS[feedback.type] || 'i'}
      </span>
      <div className="free-mode-feedback-copy">
        <strong>{feedback.title}</strong>
        <span>{feedback.message}</span>
      </div>
    </div>
  );
}

export default function App() {
  const toolbox = getDefaultToolBox();
  const [workspaceCode, setWorkspaceCode] = useState('');
  const [topic, setTopic] = useState(null);
  const [showPairModal, setShowPairModal] = useState(false);
  const [robots, setRobots] = useState([]);
  const [robot, setRobot] = useState(null);
  const [robotsLoading, setRobotsLoading] = useState(true);
  const [robotsError, setRobotsError] = useState('');
  const [isSendingCommand, setIsSendingCommand] = useState(false);
  const [compileFeedback, setCompileFeedback] = useState(null);
  const [commandFeedback, setCommandFeedback] = useState(null);
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);
  const [copyStatus, setCopyStatus] = useState('idle');
  const mountedRef = useRef(true);
  const sendingCommandRef = useRef(false);
  const blocklyRef = useRef(null);
  const robotChoiceRefs = useRef([]);
  const codeExpandButtonRef = useRef(null);
  const codeDialogRef = useRef(null);
  const codeDialogCloseRef = useRef(null);
  const { workspace } = useBlocklyWorkspace({
    toolboxConfiguration: toolbox,
    workspaceConfiguration: DEFAULT_OPTIONS,
    ref: blocklyRef,
  });

  const loadRobots = useCallback(async () => {
    try {
      setRobotsLoading(true);
      setRobotsError('');

      const linkedRobots = await getMyRobots();
      if (!mountedRef.current) {
        return;
      }

      const pairedRobots = Array.isArray(linkedRobots)
        ? linkedRobots.filter((item) => item && item.status === 'PAIRED' && item.topic)
        : [];

      setRobots(pairedRobots);

      if (pairedRobots.length === 1) {
        setRobot(pairedRobots[0]);
        setTopic(pairedRobots[0].topic);
        return;
      }

      setRobot(null);
      setTopic(null);
    } catch (err) {
      if (!mountedRef.current) {
        return;
      }

      console.error('Erro ao carregar robôs do usuário', err);
      setRobots([]);
      setRobot(null);
      setTopic(null);
      setRobotsError('Não foi possível carregar seus robôs. Tente novamente.');
      setShowPairModal(false);
    } finally {
      if (mountedRef.current) {
        setRobotsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    loadRobots();

    return () => {
      mountedRef.current = false;
    };
  }, [loadRobots]);

  useEffect(() => {
    if (!workspace) {
      return undefined;
    }

    const invalidateCompiledCode = (event) => {
      if (!event || event.isUiEvent || event.type === 'finished_loading') {
        return;
      }

      setWorkspaceCode('');
      setCompileFeedback(null);
      setCommandFeedback(null);
      setCopyStatus('idle');
      setIsCodeExpanded(false);
    };

    workspace.addChangeListener(invalidateCompiledCode);

    return () => {
      workspace.removeChangeListener(invalidateCompiledCode);
    };
  }, [workspace]);

  useEffect(() => {
    if (compileFeedback?.type !== 'success') {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      if (mountedRef.current) {
        setCompileFeedback(null);
      }
    }, 4500);

    return () => window.clearTimeout(timer);
  }, [compileFeedback]);

  useEffect(() => {
    if (commandFeedback?.type !== 'success') {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      if (mountedRef.current) {
        setCommandFeedback(null);
      }
    }, 4500);

    return () => window.clearTimeout(timer);
  }, [commandFeedback]);

  useEffect(() => {
    if (copyStatus !== 'success') {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      if (mountedRef.current) {
        setCopyStatus('idle');
      }
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [copyStatus]);


  useEffect(() => {
    if (!isCodeExpanded) {
      return undefined;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const triggerElement = codeExpandButtonRef.current;
    document.body.style.overflow = 'hidden';
    codeDialogCloseRef.current?.focus();

    const handleDialogKeyDown = (event) => {
      if (event.key === 'Escape') {
        setCopyStatus('idle');
        setIsCodeExpanded(false);
        return;
      }

      if (event.key !== 'Tab' || !codeDialogRef.current) {
        return;
      }

      const focusableElements = codeDialogRef.current.querySelectorAll(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements.length) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleDialogKeyDown);

    return () => {
      document.removeEventListener('keydown', handleDialogKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      triggerElement?.focus();
    };
  }, [isCodeExpanded]);

  const openCodePreview = () => {
    if (workspaceCode) {
      setCopyStatus('idle');
      setIsCodeExpanded(true);
    }
  };

  const closeCodePreview = () => {
    setCopyStatus('idle');
    setIsCodeExpanded(false);
  };

  const handleCopyCode = async () => {
    if (!workspaceCode) {
      return;
    }

    setCopyStatus('idle');

    try {
      await copyTextToClipboard(workspaceCode);

      if (mountedRef.current) {
        setCopyStatus('success');
      }
    } catch (err) {
      if (mountedRef.current) {
        setCopyStatus('error');
      }
      console.error('Não foi possível copiar o código compilado', err);
    }
  };

  const handleDownloadCode = () => {
    if (!workspaceCode) {
      return;
    }

    const blob = new Blob([workspaceCode], { type: 'text/x-python;charset=utf-8' });
    const objectUrl = window.URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');

    downloadLink.href = objectUrl;
    downloadLink.download = 'logicaleduc_codigo.py';
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    window.URL.revokeObjectURL(objectUrl);
  };

  const handleCompileClick = () => {
    setCompileFeedback(null);
    setCommandFeedback(null);
    setCopyStatus('idle');
    setIsCodeExpanded(false);

    if (!workspace) {
      setWorkspaceCode('');
      setCompileFeedback({
        type: 'error',
        title: 'Não foi possível compilar',
        message: 'Verifique os blocos e tente novamente.',
      });
      return;
    }

    try{
      let code = pythonGenerator.workspaceToCode(workspace);
      code = code.replace(/\n$/, '');
      setWorkspaceCode(code);
      setCompileFeedback({
        type: 'success',
        title: 'Compilação concluída!',
        message: 'Seu código está pronto para ser enviado ao robô.',
      });
    }catch(err){
      setWorkspaceCode('');
      setCompileFeedback({
        type: 'error',
        title: 'Não foi possível compilar',
        message: 'Verifique os blocos e tente novamente.',
      });
      console.log('message error', err);
    }
  };

  const handleRobotSelection = (selectedRobot) => {
    setRobot(selectedRobot);
    setTopic(selectedRobot ? selectedRobot.topic : null);
    setCommandFeedback(null);
  };

  const handleRobotChoiceKeyDown = (event, currentIndex) => {
    if (robots.length < 2) {
      return;
    }

    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % robots.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + robots.length) % robots.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = robots.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    handleRobotSelection(robots[nextIndex]);
    robotChoiceRefs.current[nextIndex]?.focus();
  };

  const handleRobotPaired = (pairedRobot) => {
    setRobots((currentRobots) => {
      const alreadyExists = currentRobots.some((item) => item.id === pairedRobot.id);

      if (alreadyExists) {
        return currentRobots.map((item) => item.id === pairedRobot.id ? pairedRobot : item);
      }

      return [...currentRobots, pairedRobot];
    });

    setRobot(pairedRobot);
    setTopic(pairedRobot.topic || null);
    setRobotsError('');
    setCommandFeedback(null);
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (sendingCommandRef.current) {
      return;
    }

    if (!robot){
      setCommandFeedback({
        type: 'warning',
        title: 'Selecione um robô',
        message: 'Escolha ou pareie um robô antes de controlar.',
      });
      return;
    }

    if(!workspaceCode){
      setCommandFeedback({
        type: 'warning',
        title: 'Código não compilado',
        message: 'Compile o código antes de controlar o robô.',
      });
      return;
    }

    sendingCommandRef.current = true;
    setIsSendingCommand(true);
    setCompileFeedback(null);
    setCommandFeedback({
      type: 'info',
      title: 'Enviando comando...',
      message: 'Aguarde enquanto o código é encaminhado pelo sistema.',
    });

    try{
      await sendRobotCommand(robot.id, workspaceCode);

      if (mountedRef.current) {
        setCommandFeedback({
          type: 'success',
          title: 'Código enviado com sucesso!',
          message: 'O comando foi encaminhado pelo sistema.',
        });
      }
    }catch(err){
      if (mountedRef.current) {
        setCommandFeedback({
          type: 'error',
          title: 'Não foi possível enviar',
          message: 'Tente novamente em alguns instantes.',
        });
      }
      console.log('Mensagem Não Enviada', err);
    }finally{
      sendingCommandRef.current = false;

      if (mountedRef.current) {
        setIsSendingCommand(false);
      }
    }
  };

  const getRobotLabel = (item) => {
    return item.name || item.mac || item.topic || `Robô ${item.id}`;
  };

  const codeLines = workspaceCode ? workspaceCode.split('\n') : [];
  const highlightedCodeLines = useMemo(() => tokenizePythonCode(workspaceCode), [workspaceCode]);
  const codeLineCount = codeLines.length;
  const codeLineLabel = `${codeLineCount} ${codeLineCount === 1 ? 'linha' : 'linhas'}`;

  return (
    <div className="free-mode-page">
      <header>
        <Header></Header>
      </header>

      <div className="free_mode_topbar">
        {robotsLoading && (
          <div className="free_mode_robot_state">
            <span className="free_mode_robot_info" role="status" aria-live="polite">
              Carregando robôs vinculados...
            </span>
          </div>
        )}

        {!robotsLoading && robotsError && (
          <div className="free_mode_robot_state free_mode_robot_error_state">
            <span className="free_mode_robot_error" role="alert">
              {robotsError}
            </span>
            <button
              type="button"
              className="free_mode_retry_button"
              onClick={loadRobots}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!robotsLoading && !robotsError && robots.length === 0 && (
          <div
            className="free_mode_robot_state free_mode_robot_empty_state"
            role="status"
            aria-live="polite"
          >
            <div className="free_mode_robot_empty_copy">
              <strong>Nenhum robô vinculado.</strong>
              <span>Pareie seu primeiro robô para começar a programar.</span>
            </div>
            <button
              type="button"
              className="free_mode_pair_button"
              onClick={() => setShowPairModal(true)}
            >
              Parear novo robô
            </button>
          </div>
        )}

        {!robotsLoading && !robotsError && robots.length > 0 && (
          <>
            <button
              type="button"
              className="free_mode_pair_button"
              onClick={() => setShowPairModal(true)}
            >
              Parear novo robô
            </button>

            {robots.length === 1 && (
              <span className="free_mode_robot_info">1 robô vinculado</span>
            )}

            {robots.length > 1 && (
              <section
                className="free_mode_robot_picker"
                aria-labelledby="free-mode-robot-picker-title"
              >
                <div className="free_mode_robot_picker_header">
                  <div className="free_mode_robot_picker_heading">
                    <span className="free_mode_robot_picker_eyebrow">
                      {robots.length} robôs vinculados
                    </span>
                    <strong id="free-mode-robot-picker-title">
                      Escolha qual robô receberá os comandos
                    </strong>
                  </div>
                  <span
                    className={`free_mode_robot_picker_status${robot ? ' free_mode_robot_picker_status_selected' : ''}`}
                    aria-live="polite"
                  >
                    {robot ? 'Robô escolhido' : 'Seleção necessária'}
                  </span>
                </div>

                <span id="free-mode-robot-picker-help" className="free-mode-sr-only">
                  Use as setas para navegar entre os robôs. Home vai para o primeiro e End para o último.
                </span>

                <div
                  className="free_mode_robot_choices"
                  role="radiogroup"
                  aria-label="Robôs vinculados"
                  aria-describedby="free-mode-robot-picker-help"
                >
                  {robots.map((item, index) => {
                    const itemLabel = getRobotLabel(item);
                    const isSelected = robot?.id === item.id;

                    return (
                      <button
                        key={item.id}
                        ref={(element) => {
                          robotChoiceRefs.current[index] = element;
                        }}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`Selecionar ${itemLabel}`}
                        tabIndex={isSelected || (!robot && index === 0) ? 0 : -1}
                        className={`free_mode_robot_choice${isSelected ? ' free_mode_robot_choice_selected' : ''}`}
                        onClick={() => handleRobotSelection(item)}
                        onKeyDown={(event) => handleRobotChoiceKeyDown(event, index)}
                      >
                        <span className="free_mode_robot_choice_icon" aria-hidden="true">🤖</span>
                        <span className="free_mode_robot_choice_copy">
                          <strong>{itemLabel}</strong>
                          {item.topic && item.topic !== itemLabel && (
                            <span>{item.topic}</span>
                          )}
                        </span>
                        <span className="free_mode_robot_choice_marker" aria-hidden="true">
                          {isSelected ? '✓' : ''}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {robot ? (
              <section
                className="free_mode_selected_robot_card"
                aria-label="Robô selecionado"
                aria-live="polite"
              >
                <span className="free_mode_selected_robot_icon" aria-hidden="true">
                  🤖
                </span>
                <div className="free_mode_selected_robot_copy">
                  <span className="free_mode_selected_robot_eyebrow">Robô selecionado:</span>
                  <strong className="free_mode_selected_robot_name">
                    {getRobotLabel(robot)}
                  </strong>
                  {topic && topic !== getRobotLabel(robot) && (
                    <span className="free_mode_selected_robot_topic">{topic}</span>
                  )}
                </div>
                <span className="free_mode_selected_robot_badge">Vinculado</span>
              </section>
            ) : (
              <section
                className="free_mode_selected_robot_card free_mode_selected_robot_card_empty"
                aria-label="Nenhum robô selecionado"
                aria-live="polite"
              >
                <span className="free_mode_selected_robot_icon" aria-hidden="true">
                  🤖
                </span>
                <div className="free_mode_selected_robot_copy">
                  <span className="free_mode_selected_robot_eyebrow">Robô selecionado:</span>
                  <strong className="free_mode_selected_robot_name">Nenhum robô selecionado</strong>
                  <span className="free_mode_selected_robot_topic">
                    Escolha um robô na lista para continuar.
                  </span>
                </div>
              </section>
            )}
          </>
        )}
      </div>

      <section
        className="free-mode-workspace"
        ref={blocklyRef}
        aria-label="Área de programação por blocos"
      >
        <BlocklyWorkspace/>
      </section>

      <div className="free-mode-actions">
        <section
          className={`free-mode-code-window${workspaceCode ? ' free-mode-code-window-ready' : ''}`}
          aria-labelledby="free-mode-code-window-title"
        >
          <div className="free-mode-code-window-header">
            <div className="free-mode-code-window-title-group">
              <span className="free-mode-code-window-eyebrow">Resultado da compilação</span>
              <strong id="free-mode-code-window-title">Código compilado</strong>
            </div>
            <button
              ref={codeExpandButtonRef}
              type="button"
              className="free-mode-code-expand-button"
              onClick={openCodePreview}
              disabled={!workspaceCode}
              aria-haspopup="dialog"
              aria-controls="free-mode-code-dialog"
            >
              <span aria-hidden="true">↗</span>
              Expandir código
            </button>
          </div>

          <button
            type="button"
            className="free-mode-code-preview"
            onClick={openCodePreview}
            disabled={!workspaceCode}
            aria-label={workspaceCode ? 'Abrir código compilado em visualização expandida' : 'Compile o código para habilitar a visualização expandida'}
          >
            <code>{workspaceCode || 'O código compilado aparecerá aqui.'}</code>
          </button>
        </section>
        <div className="free-mode-buttons-wrapper">
          <div className="free-mode-buttons">
            <button
              type="button"
              className={`free-mode-action-button${workspaceCode ? ' free-mode-action-button-compiled' : ''}`}
              onClick={handleCompileClick}
            >
              {workspaceCode ? '✓ Compilado' : 'Compilar'}
            </button>
            <button
              type="button"
              className="free-mode-action-button"
              onClick={handleClick}
              disabled={!robot || !workspaceCode || isSendingCommand}
              aria-busy={isSendingCommand}
            >
              {isSendingCommand ? 'Enviando...' : 'Controlar'}
            </button>
          </div>

          <FeedbackCard feedback={compileFeedback} />
          <FeedbackCard feedback={commandFeedback} />
        </div>
      </div>



      {isCodeExpanded && workspaceCode && (
        <div
          className="free-mode-code-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeCodePreview();
            }
          }}
        >
          <section
            ref={codeDialogRef}
            id="free-mode-code-dialog"
            className="free-mode-code-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="free-mode-code-dialog-title"
            aria-describedby="free-mode-code-dialog-description"
          >
            <div className="free-mode-code-dialog-header">
              <div className="free-mode-code-dialog-heading">
                <span className="free-mode-code-window-eyebrow">Visualização expandida</span>
                <h2 id="free-mode-code-dialog-title">Código compilado</h2>
                <span id="free-mode-code-dialog-description">Visualize todo o código Python/MicroPython gerado pelos blocos.</span>
              </div>
              <button
                ref={codeDialogCloseRef}
                type="button"
                className="free-mode-code-dialog-close"
                onClick={closeCodePreview}
                aria-label="Fechar código expandido"
              >
                ×
              </button>
            </div>
            <div
              className="free-mode-code-dialog-meta"
              aria-label={`Código compilado em MicroPython. ${codeLineLabel}.`}
            >
              <span className="free-mode-code-dialog-meta-item free-mode-code-dialog-status">
                <span className="free-mode-code-dialog-status-icon" aria-hidden="true">✓</span>
                Código compilado
              </span>
              <span className="free-mode-code-dialog-meta-item free-mode-code-dialog-language">
                MicroPython
              </span>
              <span className="free-mode-code-dialog-meta-item free-mode-code-dialog-lines">
                {codeLineLabel}
              </span>
            </div>
            <div className="free-mode-code-dialog-tools" aria-label="Utilidades do código compilado">
              <div className="free-mode-code-dialog-tool-group">
                <button
                  type="button"
                  className={`free-mode-code-dialog-tool-button${copyStatus === 'success' ? ' free-mode-code-dialog-tool-button-success' : ''}${copyStatus === 'error' ? ' free-mode-code-dialog-tool-button-error' : ''}`}
                  onClick={handleCopyCode}
                  aria-label={copyStatus === 'success' ? 'Código copiado' : 'Copiar código compilado'}
                >
                  <span aria-hidden="true">{copyStatus === 'success' ? '✓' : '⧉'}</span>
                  {copyStatus === 'success' ? 'Código copiado' : 'Copiar código'}
                </button>
                <span
                  className={`free-mode-code-dialog-copy-feedback${copyStatus === 'success' ? ' free-mode-sr-only' : ''}${copyStatus === 'error' ? ' free-mode-code-dialog-copy-feedback-error' : ''}`}
                  role={copyStatus === 'error' ? 'alert' : 'status'}
                  aria-live={copyStatus === 'error' ? 'assertive' : 'polite'}
                >
                  {copyStatus === 'success' ? 'Código copiado para a área de transferência.' : ''}
                  {copyStatus === 'error' ? 'Não foi possível copiar. Tente novamente.' : ''}
                </span>
              </div>
              <button
                type="button"
                className="free-mode-code-dialog-tool-button"
                onClick={handleDownloadCode}
                aria-label="Baixar código compilado como arquivo Python"
              >
                <span aria-hidden="true">↓</span>
                Baixar .py
              </button>
            </div>
            <span id="free-mode-code-dialog-scroll-help" className="free-mode-sr-only">
              Use as setas, Page Up e Page Down para navegar pelo código. Pressione Escape para fechar a visualização expandida.
            </span>
            <div
              className="free-mode-code-dialog-body"
              role="region"
              tabIndex={0}
              aria-label="Visualizador do código MicroPython compilado"
              aria-describedby="free-mode-code-dialog-scroll-help"
            >
              <pre aria-label="Código MicroPython compilado">
                <code>
                  {highlightedCodeLines.map((tokens, index) => (
                    <span className="free-mode-code-line" key={`line-${index}`}>
                      <span className="free-mode-code-line-number" aria-hidden="true">
                        {index + 1}
                      </span>
                      <span className="free-mode-code-line-content">
                        {tokens.length > 0 ? tokens.map((token, tokenIndex) => (
                          <span
                            className={`free-mode-code-token free-mode-code-token-${token.type}`}
                            key={`${index}-${tokenIndex}-${token.type}`}
                          >
                            {token.value}
                          </span>
                        )) : ' '}
                      </span>
                    </span>
                  ))}
                </code>
              </pre>
            </div>
          </section>
        </div>
      )}

      {showPairModal && (
        <PairRobotModal
          onClose={() => setShowPairModal(false)}
          onPaired={handleRobotPaired}
        />
      )}
    </div>
  );
}

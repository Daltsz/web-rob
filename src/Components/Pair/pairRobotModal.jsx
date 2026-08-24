import React, { useEffect, useRef, useState } from 'react';
import { pairRobot, getMyRobots} from '../../Services/pairing';
import './pairRobotModal.css'

export default function PairRobotModal({onClose, onPaired}){
    const [robotCode, setRobotCode] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const mountedRef = useRef(true);
    const cancelledRef = useRef(false);
    const waitTimerRef = useRef(null);
    const waitResolveRef = useRef(null);

    useEffect(() => {
      return () => {
        mountedRef.current = false;
        cancelledRef.current = true;

        if (waitTimerRef.current) {
          clearTimeout(waitTimerRef.current);
          waitTimerRef.current = null;
        }

        if (waitResolveRef.current) {
          const resolveWait = waitResolveRef.current;
          waitResolveRef.current = null;
          resolveWait();
        }
      };
    }, []);

    const normalizeMac = (value) => {
      return String(value || "")
        .replace(/[^a-fA-F0-9]/g, "")
        .toUpperCase();
    };

    const wait = (ms) => new Promise((resolve) => {
      waitResolveRef.current = resolve;
      waitTimerRef.current = setTimeout(() => {
        waitTimerRef.current = null;
        waitResolveRef.current = null;
        resolve();
      }, ms);
    });

    const isCancelled = () => cancelledRef.current || !mountedRef.current;

    const handleClose = () => {
      cancelledRef.current = true;

      if (waitTimerRef.current) {
        clearTimeout(waitTimerRef.current);
        waitTimerRef.current = null;
      }

      if (waitResolveRef.current) {
        const resolveWait = waitResolveRef.current;
        waitResolveRef.current = null;
        resolveWait();
      }

      if (onClose) {
        onClose();
      }
    };

    const handlePair = async (e) => {
      e.preventDefault();

      const normalizedMac = normalizeMac(robotCode);

      if (!normalizedMac || normalizedMac.length !== 12) {
        setStatus("MAC inválido. Verifique o código digitado.");
        return;
      }

      cancelledRef.current = false;

      try {
        setLoading(true);
        setStatus("Enviando challenge para o robô...");

        const data = await pairRobot(normalizedMac);
        if (isCancelled()) {
          return;
        }

        if (data.status !== "challenge_sent") {
          setStatus("Falha ao enviar challenge.");
          return;
        }

        setStatus("Challenge enviado! Aguardando resposta do robô...");

        const startedAt = Date.now();
        const timeoutMs = 60000;
        const intervalMs = 2000;

        while (!isCancelled() && Date.now() - startedAt < timeoutMs) {
          const robots = await getMyRobots();
          if (isCancelled()) {
            return;
          }

          const pairedRobot = robots.find((robot) => {
            return (
              normalizeMac(robot.mac) === normalizedMac &&
              robot.status === "PAIRED" &&
              robot.topic
            );
          });

          if (pairedRobot) {
            setStatus(`Robô pareado! Tópico: ${pairedRobot.topic}`);
            localStorage.setItem("robotTopic", pairedRobot.topic);

            if (onPaired) {
              onPaired(pairedRobot);
            }

            await wait(800);
            if (!isCancelled() && onClose) {
              onClose();
            }

            return;
          }

          setStatus("Aguardando o robô responder ao pareamento...");
          await wait(intervalMs);
        }

        if (!isCancelled()) {
          setStatus(
            "O robô não respondeu. Verifique se ele está ligado, conectado ao Wi-Fi e apontando para o broker correto."
          );
        }
      } catch (err) {
        if (!isCancelled()) {
          console.error(err);
          setStatus("Erro ao chamar API de pareamento.");
        }
      } finally {
        if (!isCancelled()) {
          setLoading(false);
        }
      }
    };


    // ========================================================================================================================
    // const handlePair = async (e) =>{
    //     e.preventDefault();

    //     try{
    //         setLoading(true);
    //         setStatus('Enviando challenge para o Robo');
    //         const data = await pairRobot(robotCode);

    //         if (data.status !== 'challenge_sent'){
    //             setStatus('Falha ao enviar challenge');
    //             setLoading(false);
    //             return;
    //         }

    //         setStatus('Challenge enviado! Aguardando resposta do robo...');

    //         setTimeout(async () =>{
    //             try{
    //                 setStatus('Verificar Robos Pareados...');
    //                 const robots = await getMyRobots();

    //                 if (!robots.length){
    //                     setStatus('Nenhum robo encontrado ainda. Tentar novamente em alguns segundos.');
    //                 }else{
    //                     const robot = robots[0]
    //                     setStatus('Robo pareado! Topico: ${robot.topic}');
    //                     localStorage.setItem('robotTopic', robot.topic);
    //                     if (onPaired){
    //                         onPaired(robot);
    //                     }
    //                     setTimeout(() => {
    //                         if (onClose) {
    //                             onClose();
    //                         }
    //                     }, 800);
    //                 }
    //             }catch (err){
    //                 console.error(err);
    //                 setStatus('Erro ao buscar robos do usuario!');
    //             }finally{
    //                 setLoading(false);
    //             }
    //         }, 3000);
    //     }catch (err){
    //         console.log(err);
    //         setStatus('Erro ao chamar API de pareamento');
    //         setLoading(false);
    //     }
    // };

    //==============================================================================================








    // return(
    //     <div className='pair_modal_overlay'>
    //         <div className='pair_modal_card'>
    //             <h2 className='pair_modal_title'>Parear Robô</h2>
    //             <p className='pair_modal_description'>
    //                 Digite o código/MAC do seu Robô para conectar antes de usar os blocos.
    //             </p>
    //             <form onSubmit={handlePair}>
    //                 <input
    //                     type="text"
    //                     placeholder="Codigo/MAC do Robô"
    //                     value={robotCode}
    //                     onChange={(e) =>{setRobotCode(e.target.value)}}
    //                     className='pair_modal_input'
    //                 />
    //                 <button
    //                     type='submit'
    //                     disabled={loading || !robotCode}
    //                     className={`pair_modal_button ${loading || !robotCode ? 'pair_modal_button_disabled': ''}`}
    //                 >
    //                     {loading ? 'Processando...' : 'Parear'}
    //                 </button>
    //             </form>
    //             {status && <p className='pair_modal_status'>{status}</p>}
    //             <button 
    //                 type='button'
    //                 onClick={handleClose}
    //                 className='pair_modal_close'   
    //             >
    //                 Fechar
    //             </button>
    //         </div>
    //     </div>
    // );

    return (
    <div
      className="pair_modal_overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="pair_modal_card"
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: 24,
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        }}
      >
        <h2 className="pair_modal_title" style={{ marginBottom: 16 }}>
          Parear Robô
        </h2>
        <p
          className="pair_modal_description"
          style={{ fontSize: 14, marginBottom: 16 }}
        >
          Digite o código/MAC do seu Robô para conectar antes de usar os Logical Blocks.
        </p>

        <form onSubmit={handlePair}>
          <input
            type="text"
            placeholder="Código/MAC do Robô"
            value={robotCode}
            onChange={(e) => setRobotCode(e.target.value)}
            disabled={loading}
            className="pair_modal_input"
            style={{
              padding: 8,
              width: '100%',
              marginBottom: 12,
              borderRadius: 8,
              border: '1px solid #ccc',
            }}
          />
          <button
            type="submit"
            disabled={loading || !robotCode}
            className="pair_modal_button"
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 8,
              border: 'none',
              cursor: loading || !robotCode ? 'default' : 'pointer',
              backgroundColor: loading || !robotCode ? '#888' : '#00BFFF',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            {loading ? 'Processando...' : 'Parear'}
          </button>
        </form>

        {status && (
          <p
            className="pair_modal_status"
            style={{ marginTop: 12, fontSize: 13 }}
          >
            {status}
          </p>
        )}

        <button
          type="button"
          onClick={handleClose}
          // disabled={loading}
          
          className="pair_modal_close"
          style={{
            marginTop: 10,
            background: 'transparent',
            border: 'none',
            color: loading ? '#aaa' : '#555',
            fontSize: 13,
            textDecoration: 'underline',
            cursor: loading ? 'default' : 'pointer',
          }}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}


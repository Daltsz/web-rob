import "./FreeMode.css";
import "../../Components/Blocks/customblocks";
import { getDefaultToolBox } from "../../Components/Blockly/getDefaultToolBox";
import { DEFAULT_OPTIONS } from "../../Components/Blockly/workspaceConfigs";
import React, { useEffect, useRef, useState } from "react";
import { BlocklyWorkspace, useBlocklyWorkspace} from "react-blockly";
import {javascriptGenerator} from 'blockly/javascript';
import { sendRobotCommand } from "../../Services/robots";
import Header from '../../Components/Header';
import PairRobotModal from "../../Components/Pair/pairRobotModal";

// const topico = "pareamento/40:f5:20:28:dd:c7"


export default function App() {
  const toolbox = getDefaultToolBox();
  const [workspaceCode, setWorkspaceCode] = useState('');
  const [topic, setTopic] = useState(null);
  const [showPairModal, setShowPairModal] = useState(false);
  const [robot, setRobot] = useState(null);
  const blocklyRef = useRef(null);
  const { workspace } = useBlocklyWorkspace({
    toolboxConfiguration: toolbox,
    workspaceConfiguration: DEFAULT_OPTIONS,
    ref: blocklyRef,
  });


  // useEffect(() => {
  //   const savedTopic = localStorage.getItem("robotTopic");
  //   if (savedTopic){
  //     setTopic(savedTopic);
  //     setShowPairModal(false);
  //   } else {
  //     setShowPairModal(true);
  //   }
  // }, []);
  useEffect(() => {
    // TEMPORÁRIO: sempre abrir o modal ao entrar na tela
    setShowPairModal(true);
  }, []);

  const handleCompileClick = () => {
    if (workspace) {
      try{
      // javascriptGenerator.addReservedWords('code');
      let code = javascriptGenerator.workspaceToCode(workspace);
      console.log(code)
      // code = code.split(/\s+(?=[^\s]*$)/)
      // code = [code]
      // code = code.map(s => s.replace(/\n$/, ''));
      code = code.replace(/\n$/, '');
      console.log(code)
      setWorkspaceCode(code);
      alert('Compilado Com Sucesso')
      }catch(err){
        alert('Não Compilado')
        console.log('message error', err);
      }
    }
  };

  const handleRobotPaired = (robot) =>{
    setRobot(robot)
    setTopic(robot.topic);
  }

  const handleClick = async (e) =>{
    e.preventDefault();
    try{
      if (!robot){
        alert("Nenhum robô pareado. Por favor, pareie seu robô primeiro.");
        setShowPairModal(true);
        return;
      };

      if(!workspaceCode){
        alert('Nenhum código compilado. Clique em "Compilar" antes de controlar o robô.')
        return; 
      };

      console.log(workspaceCode)
      let topicToSend = topic.trim();
      // let messageToSend = workspaceCode[0].toString('utf8');
      // let messageToSend = String(workspaceCode);
      // console.log(messageToSend)
      console.log(topicToSend)
      
      await sendRobotCommand(robot.id, workspaceCode);
      alert("Codigo enviado para o robo")
      

      // // publishMessage(topicToSend, messageToSend)
      // const ok = publishMessage(topicToSend, messageToSend);
      // if (!ok) {
      //   // alert("Ainda não publicou: MQTT não está conectado (foi enfileirado).");
      //   console.warn("Não publicou (MQTT não conectado)");
      //   return;
      // }
      // // alert("Publicado no MQTT!");
      // console.log("Publicado!");
      // alert('Rodou Corretamente')
    }catch(err){
      alert('Erro ao enviar comando')
      console.log('Mensagem Não Enviada', err);
    }
  };


  return (
    <div className="free-mode-page">
      <header>
        <Header></Header>
      </header>
      <div className="free_mode_topbar">
        <button 
          type="button"
          className="free_mode_pair_button"
          onClick={()=> setShowPairModal(true)}
        >
          Parear / Trocar Robô
        </button>
        {topic && (
          <span className="free_mode_robot_info">
            Robô conectado em: <strong>{topic}</strong>
          </span>
        )}
      </div>
      <div  className="free-mode-workspace" ref={blocklyRef}>
        <BlocklyWorkspace/>
      </div>
      <div className="free-mode-actions">
        <div className="free-mode-code">{workspaceCode}</div>
        <div className="free-mode-buttons">
          <button className="free-mode-action-button" onClick={handleCompileClick}>Compilar</button>
          <button  className="free-mode-action-button" onClick={handleClick}>Controlar</button>
        </div>
      </div>
      {showPairModal && (
        <PairRobotModal
          onClose={()=> setShowPairModal(false)

            // ATIVAR NOVAMENTE AS LINHAS ABAIXO
            // const savedTopic = localStorage.getItem("robotTopic")
            // if (!savedTopic){
            //   return;
            // }
            // setShowPairModal(false)
            // ================================================================
          }
          onPaired = {handleRobotPaired}
        />
      )}
      {/* {showPairModal && (
        <div
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
            style={{
              background: '#fff',
              padding: 24,
              borderRadius: 12,
            }}
          >
            <h2>TESTE MODAL INLINE</h2>
            <p>Se você está vendo isso, o showPairModal está funcionando.</p>
            <button onClick={() => setShowPairModal(false)}>Fechar teste</button>
          </div>
        </div>
      )} */}
    </div>
  );
}

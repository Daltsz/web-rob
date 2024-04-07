import { javascriptGenerator } from 'blockly/javascript';
import React, { useRef, useState } from "react";
import { BlocklyWorkspace, useBlocklyWorkspace } from "react-blockly";
import Header from '../../Components/Header';
import api from '../../Services/api';
import "./FreeMode.css";
import { getDefaultToolBox } from "./LogicBlocks/Blockly/getDefaultToolBox";
import { DEFAULT_OPTIONS } from "./LogicBlocks/Blockly/workspaceConfigs";
import "./LogicBlocks/Blocks/customblocks";


export default function App() {
  const toolbox = getDefaultToolBox();
  const [workspaceCode, setWorkspaceCode] = useState('');
  const blocklyRef = useRef(null);
  const { workspace } = useBlocklyWorkspace({
    toolboxConfiguration: toolbox,
    workspaceConfiguration: DEFAULT_OPTIONS,
    ref: blocklyRef,
  });

  const handleCompileClick = () => {
    if (workspace) {
      try {
        // javascriptGenerator.addReservedWords('code');
        let code = javascriptGenerator.workspaceToCode(workspace);
        code = code.split(' ')
        console.log(code)
        setWorkspaceCode(code);
        alert('Compilado Com Sucesso')
      } catch (err) {
        alert('Não Compilado')
        console.log('message error', err);
      }
    }
  }


  const handleClick = async (e) => {
    e.preventDefault();
    try {
      let resp = await api.post('/led-blink', workspaceCode);
      console.log(resp);
      alert('Rodou Corretamente')
    } catch (err) {
      alert('Infelizmente não Rodou')
      console.log('Mensagem Não Enviada', err);
    }
  }


  return (

    <div>
      <Header />
      <div className="fill-height" ref={blocklyRef}>
        <BlocklyWorkspace />
      </div>
      <div className="buttonsWorkSpace">
        <div className="code">{workspaceCode}</div>

        <div className="divBtns">
          <button className="Btns" onClick={handleCompileClick}>Compilar</button>
          <button className="Btns" onClick={handleClick}>Controlar</button>
        </div>

      </div>

    </div>
  );
}

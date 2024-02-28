import "./index.css";
import "../Moviments/Blocks/Blocks.js";
import { getDefaultToolBoxMoviment } from "../Moviments/Blocks/workspaceBlock/toolboxBlock.js";
import { DEFAULT_OPTIONS_MOVIMENT } from "../Moviments/Blocks/workspaceBlock/workspace.js";
import React, { useRef, useState } from "react";
import { BlocklyWorkspace, useBlocklyWorkspace } from "react-blockly";
import { javascriptGenerator } from 'blockly/javascript';
// import api from '../../Services/api';
import Header from '../../Components/Header';



export default function Moviments() {
    const toolbox = getDefaultToolBoxMoviment();
    const [workspaceCode, setWorkspaceCode] = useState('');
    const blocklyRef = useRef(null);
    const { workspace } = useBlocklyWorkspace({
        toolboxConfiguration: toolbox,
        workspaceConfiguration: DEFAULT_OPTIONS_MOVIMENT,
        ref: blocklyRef,
    });

    const handleCompileClick = () => {
        if (workspace) {
            try {
                // javascriptGenerator.addReservedWords('code');
                let code = javascriptGenerator.workspaceToCode(workspace);
                // code = code.split(' ')
                console.log(code)
                setWorkspaceCode(code);
                alert('Compilado Com Sucesso')
            } catch (err) {
                alert('Não Compilado')
                console.log('message error', err);
            }
        }
    }


    //   const handleClick = async (e) =>{
    //     e.preventDefault();
    //     try{
    //       let resp = await api.post('/led-blink', workspaceCode);
    //       console.log(resp);
    //       alert('Rodou Corretamente')
    //     }catch(err){
    //       alert('Infelizmente não Rodou')
    //       console.log('Mensagem Não Enviada', err);
    //     }
    //   }


    return (
        <>
            <Header></Header>
            <div className="fill-height" ref={blocklyRef}>
                <BlocklyWorkspace />
            </div>
            <div className="divBtns">
                <button className="Btns" onClick={handleCompileClick}>Compilar</button>
            </div>

        </>
    );
}

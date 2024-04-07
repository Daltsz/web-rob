// Calculator.js
import Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import React, { useEffect, useState } from 'react';
import Header from '../../Components/Header';
import "./index.css";

const Calculator = () => {
    const [generatedCode, setGeneratedCode] = useState('');
    const [results, setResults] = useState([]);
    const [expressao, setExpressao] = useState([]);


    const evaluateFn = () => {
        return generatedCode;
    }

    const handleRunCode = () => {
        try {
            const result = evaluateFn();

            if (Number.isNaN(result)) {
                alert('A expressão é inválida.');
            } else {
                setResults((prevResults) => [...prevResults, { expression: expressao, result }]);
            }
        } catch (error) {
            alert('Erro ao avaliar a expressão.');
        }
    };

    // const handleBlockCode = () => {
    //     const code = javascriptGenerator.workspaceToCode(workspace);
    //     setGeneratedCode((prevCode) => prevCode + '\n' + code);
    // };

    useEffect(() => {
        const workspace = Blockly.inject('blocklyDiv', {
            toolbox: document.getElementById('toolbox'),
        });

        const handleChange = () => {
            const code = javascriptGenerator.workspaceToCode(workspace);
            setGeneratedCode(code);
            setExpressao(code);
        };

        workspace.addChangeListener(handleChange);

        return () => {
            workspace && workspace.dispose();
        };
    }, [results]);

    const runCode = () => {
        handleRunCode();
        // handleBlockCode();
    };


    return (
        <div>
            <Header />
            <div id="blocklyDiv" style={{ height: '400px', width: '100%', position: "relative" }}></div>
            <div className='conteudo'>
                <div className='codigo'>
                    <h4>Código Gerado:</h4>
                    <pre>{generatedCode}</pre>
                    <h4>Resultados:</h4>
                    {results.length > 0 ? (
                        <ul>
                            {results.map((result, index) => (
                                <li key={index}><strong>Expressão {index + 1}:</strong> {result.expression} - <strong>Resultado:</strong> {result.result}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>N/A.</p>
                    )}
                </div>
                <div className='btnCalcular'>
                    <button onClick={runCode} className='Calcular'>Calcular</button>
                </div>
            </div>

            <xml
                xmlns="https://developers.google.com/blockly/xml"
                id="toolbox"
                style={{ display: 'none' }}
            >
                <category name="Operadores" colour="230">
                    <block type="math_number"></block>
                    <block type="math_arithmetic"></block>
                    <block type="math_trig"></block>
                    <block type="math_constant"></block>
                </category>
                <category name="Lógica" colour="210">
                    <block type="logic_compare"></block>
                    <block type="logic_operation"></block>
                    <block type="logic_negate"></block>
                </category>
            </xml>
        </div>
    );
};

export default Calculator;

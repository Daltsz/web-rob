import React from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../../Components/Header';
import "./index.css";

export default function Campaing() {
    const navigate = useNavigate()

    return (
        <>
            <Header />
            <div className='btnsCampanha'>
                <button className='btnCalculator' onClick={() => { navigate('/calculator') }}>Calculadora</button>
            </div>
            <div className='btnsCampanha'>
                <button className='btnCalculator' onClick={() => { navigate('/moviment') }}>Movimentos</button>
            </div>
            <div className='btnsCamapnha'>
                <button className='btnCalculator' onClick={() => { navigate('/Puzzle')}}>Puzzles</button>
            </div>
            <div className='btnsCamapnha'>
                <button className='btnCalculator' onClick={() => { navigate('/blocklyGames')}}>BlocklyGames</button>
            </div>
        </>
    );
}
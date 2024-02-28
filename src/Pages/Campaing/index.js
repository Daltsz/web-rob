import React from 'react';
import Header from '../../Components/Header';
import { useNavigate } from "react-router-dom";
import "./index.css"

export default function Campaing() {
    const navigate = useNavigate()

    return (
        <>
            <Header />
            <div className='btnsCampanha'>
                <button className='btnCalculator' onClick={() => { navigate('/calculator') }}>Calculadora</button>
            </div>
            <div className='btnsCampanha'>
                <button className='btnCalculator' onClick={() => { navigate('/Moviment') }}>Movimentos</button>
            </div>

        </>
    );
}
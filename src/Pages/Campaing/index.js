import React from 'react';
import Header from '../../Components/Header';
import { useNavigate } from "react-router-dom";
import "./index.css"

export default function Campaing(){
    const navigate = useNavigate()

    return(
        <div>
            <header>
                <Header/>
            </header>
            <div className='btnsCampanha'>
                <button className='btnCalculator' onClick={() => { navigate('/puzzle') }}>Calculadora</button>
            </div>
                    
        </div>
    );
}
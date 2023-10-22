import React from 'react';
import { useNavigate } from "react-router-dom";
import logo from '../../assets/Logo.svg';
import './style.css'

export default function Header() {
    const navigate = useNavigate()
    return (
        <header className="container" >
            <div className='menu'>

                <button id='logo' onClick={() => { navigate('/inicio') }}  >
                    <img className="logo" src={logo} alt='Logo'></img>
                </button>

                <div className='btns'>
                    <button id='FreeMode' onClick={() => { navigate('/FreeMode') }}  >
                        Modo Livre
                    </button>

                    <button id='Campaing' onClick={() => { navigate('/Campaing') }}  >
                        Campanha
                    </button>
                </div>
            </div>
        </header>
    );
}
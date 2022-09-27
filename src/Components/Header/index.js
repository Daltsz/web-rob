import React from 'react';
import {Link} from 'react-router-dom';
import logo from '../../assets/logo.svg.svg';
import './style.css'

export default function Header() {
 return (  
    <header className="container" >    
            <div className='menu'>
                <Link to='/'>
                    <img className="logo" src={logo} alt='logo'></img>
                </Link>
                <Link  to='/FreeMode'>
                    <div>
                        <strong>Free Mode</strong>
                    </div>
                </Link>
                <Link  to= '/Campaing'>
                    <div>
                        <strong>Campaing</strong>
                    </div>
                </Link>
            </div>
    </header>
 );
}


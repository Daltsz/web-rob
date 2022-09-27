
import React from 'react';
import {Link} from 'react-router-dom';
import logo from '../../assets/logo.svg.svg';
import Dropdown from './dropdown';
import './style_design.css';

const items = [
    {
        id:1,
        value: 'New'
    },
    {   
        id:2,
        value: 'Load '
    },
    {
        id:3,
        value: 'Save '
    }
];


export default function Header_Design() {
 return (
    <header className='container_design'>
        <div className='Menu_Design'>
            <Link to='/'>
                <img className="logo" src={logo} alt='logo'></img>
            </Link>
            <Dropdown title='EDITAR E CUSTOMIZAR O BOTÃO' items={items}></Dropdown>
        </div>    
    </header>
 );
}
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BoasVindas from './Pages/BoasVindas';
import Calculator from './Pages/Calculator/calculador.js';
import Campaing from './Pages/Campaing';
import FreeMode from './Pages/FreeMode';
import Home from './Pages/Home';
import Moviments from './Pages/Moviments/index.js';

export default function Directions() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path='/' element={<BoasVindas></BoasVindas>}></Route>
                <Route exact path='/inicio' element={<Home></Home>}></Route>
                <Route path='/FreeMode' element={<FreeMode></FreeMode>} ></Route>
                <Route path='/Campaing' element={<Campaing></Campaing>}></Route>
                <Route path='/calculator' element={<Calculator></Calculator>}></Route>
                <Route path='/moviment' element={<Moviments></Moviments>}></Route>
            </Routes>
        </BrowserRouter>
    );
}
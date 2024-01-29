import React from 'react'; 
import {Route, Routes, BrowserRouter} from 'react-router-dom';
import FreeMode from './Pages/FreeMode';
import Home from './Pages/Home';
import Campaing from './Pages/Campaing';
import BoasVindas from './Pages/BoasVindas';
import Calculator from './Pages/Calculator/calculador.js';
import PuzzleComponent from './Pages/Puzzle/PuzzleGame.js';

export default function Directions(){
    return(
        <BrowserRouter>
            <Routes>
                <Route exact path='/' element={<BoasVindas></BoasVindas>}></Route>
                <Route exact path='/inicio' element={<Home></Home>}></Route>
                <Route path='/FreeMode' element={<FreeMode></FreeMode>} ></Route>
                <Route path ='/Campaing' element={<Campaing></Campaing>}></Route>
                <Route path ='/calculator' element={<Calculator></Calculator>}></Route>
            </Routes>
        </BrowserRouter>
    );
}
import React from 'react'; 
import {Route, Routes, BrowserRouter} from 'react-router-dom';
import FreeMode from './Pages/FreeMode';
import Home from './Pages/Home';
import Campaing from './Pages/Campaing';

export default function Directions(){
    return(
        <BrowserRouter>
            <Routes>
                <Route exact path='/' element={<Home></Home>}></Route>
                <Route path='/FreeMode' element={<FreeMode></FreeMode>} ></Route>
                <Route path ='/Campaing' element={<Campaing></Campaing>}></Route>
            </Routes>
        </BrowserRouter>
    );
}
import React from 'react'; 
import {Route, Routes, BrowserRouter, Navigate} from 'react-router-dom';
import FreeMode from './Pages/FreeMode';
import Home from './Pages/Home';
import Campaing from './Pages/Campaing';
import BoasVindas from './Pages/BoasVindas';
import Calculator from './Pages/Calculator/calculador.js';
import PuzzleComponent from './Pages/Puzzle/PuzzleGame.js';
import BlocklyGamesComponent from './Pages/blocklyGames/blocklygames.js';
import Moviments from './Pages/Moviments/index.js';
import SingIn from './Pages/Login/SingIn.js'
import SingUp from './Pages/Login/SingUp.js'
import ForgotPassword from './Pages/ForgotPassword/index.jsx';
import ResetPassword from './Pages/ResetPassword/index.jsx';
import Tutoriais from './Pages/Tutoriais';
import Manuais from './Pages/Manuais';
import MeusRobos from './Pages/MeusRobos';
import Atividades from './Pages/Atividades';

function RequireAuth({children}){
    const token = localStorage.getItem('token');
    if(!token){
        return <Navigate to="/login" replace></Navigate>
    }
    return children;
}

export default function Directions(){
    return(
        <BrowserRouter>
            <Routes>
                <Route exact path='/' element={<BoasVindas></BoasVindas>}></Route>
                <Route exact path='/inicio' element={<Home></Home>}></Route>
                <Route path='/login' element={<SingIn></SingIn>}></Route>
                <Route path='/register' element={<SingUp></SingUp>}></Route>
                <Route path='/login/forgot_password' element={<ForgotPassword/>}></Route>
                <Route path='/login/reset_password' element={<ResetPassword/>}></Route>
                <Route 
                    path='/FreeMode'
                    element={<RequireAuth>
                                <FreeMode></FreeMode>
                            </RequireAuth>
                    }>    
                </Route>
                <Route path ='/Campaing' element={<Campaing></Campaing>}></Route>
                <Route path ='/calculator' element={<Calculator></Calculator>}></Route>
                <Route path ='/Moviment' element={<Moviments></Moviments>}></Route>
                <Route path='/blocklyGames' element={<BlocklyGamesComponent></BlocklyGamesComponent>}></Route>
                <Route path='/tutoriais' element={<Tutoriais />}></Route>
                <Route path='/manuais' element={<Manuais />}></Route>
                <Route path='/meus-robos' element={<MeusRobos />}></Route>
                <Route path='/atividades' element={<Atividades />}></Route>
            </Routes>
        </BrowserRouter>
    );
}
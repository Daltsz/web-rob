import React from 'react'; 
import {Route, Switch, BrowserRouter} from 'react-router-dom';
import FreeMode from './Pages/FreeMode';
import Home from './Pages/Home';
import Campaing from './Pages/Campaing';

export default function Routes(){

    return(

        <BrowserRouter>      
            <Switch>
                <Route exact path='/' component={Home} ></Route>
                <Route path='/FreeMode' component={FreeMode} ></Route>
                <Route path ='/Campaing' component={Campaing}></Route>
            </Switch>
        </BrowserRouter>    




    );
}
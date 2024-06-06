import React from "react";
import Directions from './AppRoutes';
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';

export const MySwal = withReactContent(Swal);

function App() {
  return (
    <Directions></Directions>
  );
}

export default App;
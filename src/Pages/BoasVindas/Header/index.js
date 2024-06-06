import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/Logo.svg";
import "../Header/index.css";


function Header() {
    const navigate = useNavigate()


    return (

        <div className="header">
            <div className="logo">
                <img src={Logo} alt="Logo" />
            </div>

            <div className="menu">
                <ul>
                    <li>
                        <a href="#section-sobre">Sobre</a>
                    </li>

                    <li>
                        <a href="#tutorial">Tutorial</a>
                    </li>

                    <li>
                        <a href="#colaboradores">Colaboradores</a>
                    </li>

                    <li>
                        <a href="#footer">Contato</a>
                    </li>
                </ul>
            </div>

            <div className="btnLogin">
                <button id="btnEntrar" onClick={() => { navigate('/login') }}>Entrar</button>
                <button id="btnCriarConta" onClick={() => { navigate('/createAcount') }}>Criar conta</button>
            </div>
        </div>
    )
}

export default Header
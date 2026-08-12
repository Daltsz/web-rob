import "../Header/index.css"
// import Logo from "../../../assets/Logo.svg"
// import Logo from "../../../assets/LogicalEducLogosemescrita_semfundo.svg";
import { useNavigate, Link } from "react-router-dom";


function Header() {
    const navigate = useNavigate()


    return (

        <div className="header">
            <div className="logo">
                <Link to="/">
                    <img src="/assets/LogicalEducLogosemescrita_semfundo.svg" alt="Logo Logical Educ" className="logo-img" />
                </Link>
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
                <button id="btnEntrar" onClick={() => {navigate('/login') }}>Entrar</button>
                <button id="btnCriarConta" onClick={() => {navigate('/register')}}>Criar conta</button>
            </div>
        </div>
    )
}

export default Header
import { useNavigate, Link } from "react-router-dom";
import "../../Pages/BoasVindas/Header/index.css";   

export default function Header() {
    const navigate = useNavigate()
    return (
        <header className="header" >
            <div className='logo'>
                <Link to='/'>
                    <img
                        src="/assets/LogicalEducLogosemescrita_semfundo.svg"
                        alt="Logo Logical Educ"
                        className="logo-img"
                    />
                </Link>
            </div>
            <div className='btnLogin'>
                <button id='FreeMode' className="header-btn" onClick={() => { navigate('/FreeMode') }}  >
                    Modo Livre
                </button>

                <button id='Campaing' className="header-btn" onClick={() => { navigate('/Campaing') }}  >
                    Campanha
                </button>
            </div>
        </header>
    );
}
import "../Sobre/index.css"
import CodeCircle from "../../../assets/code_circle.svg"
import Book from "../../../assets/icon_book.svg"
import Educa from "../../../assets/icon_game.svg"



function Sobre() {
    return (
        <div id="section-sobre">
            <h2 className="h1Title">Sobre a plataforma</h2>

            <h1 className="h2Texto-Sobre">Somos a ponte entre sua <span className="palavra-destacada">criatividade</span> e a ação do seu robô, tornando a programação visual uma realidade interessante</h1>    

            <div className="btnsDiferenciais">
                <div className="ProgAcessivel">
                    <button id="Programacao"><img src={CodeCircle} alt="Circle" /></button>
                    <h1>Programação <br /> Acessível</h1>
                </div>

                <div className="AprendInterativo">
                    <button id="Aprendizado"><img src={Book} alt="Book" /></button>
                    <h1>Aprendizado <br /> Interativo</h1>
                </div>

                <div className="Educa">
                    <button id="Educacional"><img src={Educa} alt="Educacional" /></button>
                    <h1>Educacional</h1>
                </div>
            </div>        
        </div>
    )
}

export default Sobre
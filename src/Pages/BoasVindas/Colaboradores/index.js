import "../Colaboradores/index.css"
import Antonio  from   '../../../assets/Antonio.svg';
import Dadalto from '../../../assets/Dadalto.svg';

function Colaboradores(){
    return (
        <div id="colaboradores">
            <h1 className="h1Colaboradores">
                Colaboradores
            </h1>

            <div className="cards">
                <div>
                    <img src={Antonio} alt="Antonio Carlos" />
                    <p className="nome-colab">
                        Antônio Carlos
                    </p>

                    <p className="descricao-colab">
                        Professor da UTFPR, doutor em Computação e coordenador do projeto Ensino Lúdico de Lógica de Programação (ELLP), que desde 2014 promove o ensino de lógica de programação para crianças de escolas públicas de forma envolvente e acessivel
                    </p>
                </div>

                <div>
                    <img src={Dadalto} alt="Gabriel Dadalto" />
                    <p className="nome-colab">
                        Gabriel Dadalto
                    </p>

                    <p className="descricao-colab">
                        Engenheiro de Computação formado pela UTFPR, mestrando pela USP e pesquisador na aplicação de Inteligência Artificial à saúde e à análise de imagens médicas. Atua no desenvolvimento de soluções tecnológicas baseadas em IA, conectando pesquisa científica, inovação e impacto social. 
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Colaboradores;
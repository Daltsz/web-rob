import Antonio from '../../../assets/Antonio.svg';
import Beatriz from '../../../assets/Beatriz.svg';
import Dadalto from '../../../assets/Dadalto.svg';
import Higor from '../../../assets/Higor.svg';
import "../Colaboradores/index.css";


function Colaboradores() {
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
                        Graphic design is a craft where professionals create visual content to communicate and the messages. By applying visual hierarchy and page layout techniques
                    </p>
                </div>

                <div>
                    <img src={Dadalto} alt="Gabriel Dadalto" />
                    <p className="nome-colab">
                        Gabriel Dadalto
                    </p>

                    <p className="descricao-colab">
                        Front-end web development is the practice of converting data to a graphical interface, through the use of HTML, CSS, and JavaScript.
                    </p>
                </div>

                <div>
                    <img src={Beatriz} alt="Rogerio Pozza" />
                    <p className="nome-colab">
                        Beatriz Cristina
                    </p>

                    <p className="descricao-colab">
                        Front-end web development is the practice of converting data to a graphical interface, through the use of HTML, CSS, and JavaScript.
                    </p>
                </div>

                <div>
                    <img src={Higor} alt="Rogerio Pozza" />
                    <p className="nome-colab">
                        Higor Rozan
                    </p>

                    <p className="descricao-colab">
                        Front-end web development is the practice of converting data to a graphical interface, through the use of HTML, CSS, and JavaScript.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Colaboradores;
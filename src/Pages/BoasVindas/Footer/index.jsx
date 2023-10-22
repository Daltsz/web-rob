import "../Footer/index.css"
import Logo from "../../../assets/Logo.svg"

function Footer() {
    return (
        <div className="fundo">

            <div id="footer">
                <div className="esquerdo-contato">
                    <img src={Logo} alt="Logo" />

                    <p className="p-contato">contato</p>
                    <p className="p-email">email@gmail.com</p>
                </div>

                <div className="direito">
                    <div className="links">
                        <p className="p-links">Links</p>
                        <ul>
                            <li>Facebook</li>
                            <li>Instagram</li>
                            <li>YouTube</li>
                        </ul>
                    </div>

                    <div className="navegacao">
                        <p className="p-links-navegacao">Navegação</p>
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
                </div>


            </div>

            <p className="p-footer">© 2023 Feito por <a href="https://github.com/BeaComp" target="_blank">Beatriz Cristina de Faria</a></p>
        </div>
    )
}

export default Footer;
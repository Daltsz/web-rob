import "../Footer/index.css"

function Footer() {
    return (
        <div className="welcome-footer-background">

            <div id="footer">
                <div className="esquerdo-contato">
                    <div className="footer-logo-container">
                        <a href="#inicio">
                            <img
                                src="/assets/LogicalEducLogo_sem_fundo_com_escrita.svg"
                                alt="Logo Logical Educ"
                                className="footer-logo"
                            />
                        </a>
                    </div>

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

            <p className="p-footer">© 2024 LogicalEduc. All rights reserved.</p>
        </div>
    )
}

export default Footer;
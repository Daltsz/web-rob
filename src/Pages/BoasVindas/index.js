
import Sobre from "./Sobre";
import Tutorial from "./Tutorial";
import Colaboradores from "./Colaboradores";
import Footer from "./Footer"
import '../BoasVindas/index.css'
import Principal from "./Principal";


function BoasVindas() {

    return (
        <div className="Inicio" id='inicio'>
            <style>{`
                body {
                overflow: auto;
                }
            `}</style>

            <Principal />

            <div id="section-sobre">
                <Sobre />
            </div>

            <div id="tutorial">
                <Tutorial />
            </div>

            <div id="colaboradores">
                <Colaboradores />
            </div>

            <Footer />
        </div>
    )
}

export default BoasVindas
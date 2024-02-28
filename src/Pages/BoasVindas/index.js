
import Sobre from "./Sobre";
import Tutorial from "./Tutorial";
import Colaboradores from "./Colaboradores";
import Footer from "./Footer"
import '../BoasVindas/index.css'
import Principal from "./Principal";


function BoasVindas() {

    return (
        <div className="Inicio">
            <style>{`
                body {
                overflow: auto;
                }
            `}</style>

            <Principal />
            <Sobre />
            <Tutorial />
            <Colaboradores />
            <Footer />
        </div>
    )
}

export default BoasVindas
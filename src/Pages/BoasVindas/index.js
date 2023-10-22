import Principal from "./Principal";
import Sobre from "./Sobre";
import Tutorial from "./Tutorial";
import Colaboradores from "./Colaboradores";
import Footer from "./Footer"
import '../BoasVindas/index.css'


function BoasVindas() {

    return (
        <div className="Inicio">
            <Principal />
            <Sobre />
            <Tutorial />
            <Colaboradores />
            <Footer />
        </div>
    )
}

export default BoasVindas
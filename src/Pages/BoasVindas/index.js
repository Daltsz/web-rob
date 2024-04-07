
import '../BoasVindas/index.css';
import Colaboradores from "./Colaboradores";
import Footer from "./Footer";
import Principal from "./Principal";
import Sobre from "./Sobre";
import Tutorial from "./Tutorial";


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
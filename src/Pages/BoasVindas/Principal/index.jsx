import Header from '../Header'
import '../Principal/index.css'
import Mockup from '../../../assets/Mockup.svg'

function Principal() {


  return (
    <>
      <div className='fundo'>
        <Header />

        <div className='principal'>
          <div>
            <h1 className='h1Programacao'>
              Programação <br /> de forma visual
            </h1>

            <h2 className='h2Texto'>
              Desvende o mundo da programação de forma intuitiva e criativa com nossa plataforma de linguagem de blocos, onde cada bloco é uma peça que derá vida ao robô.
            </h2>

            <div className='buttons'>
              <button id='btnVamosLa'>Vamos lá</button>
              <div className='btnTutorial'>
                <button id='play'> <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none">
                  <circle cx="31" cy="31" r="31" fill="#DEF4FE" />
                  <path d="M39 31.5L27.75 25.0048V37.9952L39 31.5Z" fill="#0DACFF" />
                </svg> </button>
                <h1 className='h1Tutorial'>Tutorial!</h1>
              </div>
            </div>
          </div>

          <div className='mockup'>
            <img src={Mockup} alt="Mockup" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Principal
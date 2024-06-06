import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/Logo.svg';
import google from '../../assets/icons8-google-logo.svg';
import { auth, provider } from '../../firebase';
import "./index.css";

export default function SingIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const singIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                navigate("/inicio");
            }).catch((error) => {
                console.log(error)
            })
    }

    const handleSingInGoogle = () => {
        signInWithPopup(auth, provider)
            .then((userCredential) => {
                navigate("/inicio");
            }).catch((error) => {
                console.log(error)
            })
    }

    return (
        <>
            <div className="headerLogin">
                <div className='menuLogin'>
                    <img className="logoLogin" src={logo} alt='Logo'></img>
                </div>
            </div>

            <div className="containerLogin">
                <div className='containerLeft'>
                    <p className='frase'>
                        Entre e controle seu robô
                    </p>

                    <p className='isCount'>
                        Não tem uma conta?
                    </p>
                    <p className='createCount' style={{ color: "#04A8FF", cursor: 'pointer' }} onClick={() => { navigate('/createAcount') }}>
                        Crie aqui!
                    </p>
                </div>

                <div className='containerRight'>
                    <p className='entrar'>
                        Entrar
                    </p>

                    <Form onSubmit={singIn}>
                        <Form.Group className="mb-4" controlId="formBasicEmail">
                            <Form.Control
                                className='form'
                                type="email"
                                placeholder="Enter email or user name"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control
                                className='form'
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-5" controlId="formBasicCheckbox">
                            <Form.Text className="text-muted textForm" style={{ cursor: 'pointer' }}>
                                Esqueci minha senha
                            </Form.Text>
                        </Form.Group>
                        <Button className='mb-4 btnEntrar' variant="primary" type="submit">
                            Entrar
                        </Button>

                        <Form.Group className="mb-4" controlId="formBasicCheckbox">
                            <Form.Text className="textForm d-flex justify-content-center" style={{ fontSize: 14 }}>
                                ou entre com
                            </Form.Text>
                        </Form.Group>
                    </Form>
                    <div className='d-flex justify-content-center'>
                        <Button
                            onClick={handleSingInGoogle}
                            style={{ backgroundColor: 'transparent', color: "#212529", fontFamily: "Poppins", fontSize: 14, borderColor: "#04A8FF" }}>
                            <img className="Google" src={google} alt='' style={{ marginRight: 4 }}></img>
                            Entre com o Google</Button>
                    </div>

                </div>
            </div>


        </>

    )
}
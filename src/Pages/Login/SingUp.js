import { AuthErrorCodes, createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { errorAlert, successAlert } from '../../Components/FunctionsAlerts/Functions';
import logo from '../../assets/Logo.svg';
import Saly from '../../assets/Saly-1.svg';
import { auth } from '../../firebase';
import "./index.css";

export default function SingUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRoute = () => {
        navigate("/login");
    }

    const singUp = (e) => {
        e.preventDefault();

        if (password.length <= 6) {
            errorAlert("A senha deve ter mais de 6 caracteres!");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                successAlert("Conta criada com sucesso!", handleRoute)
            }).catch((error) => {
                switch (error.code) {
                    case AuthErrorCodes.EMAIL_EXISTS:
                        errorAlert("O e-mail já está cadastrado. Por favor, utilize outro e-mail.");
                        break;
                    case AuthErrorCodes.INVALID_EMAIL:
                        errorAlert("O e-mail não é válido. Por favor, utilize outro e-mail.");
                        break;
                    case AuthErrorCodes.WEAK_PASSWORD:
                        errorAlert("Esta senha é muito fraca. Por favor, crie uma senha mais forte.");
                        break;
                    default:
                        errorAlert("Ocorreu um erro ao criar a conta. Por favor, tente novamente mais tarde.");
                }
            });
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
                    <p className='frase' style={{ marginBottom: 0 }}>
                        Crie sua conta!
                    </p>

                    <div className='d-flex'>
                        <div>
                            <p className='isCount'>
                                Já tem uma conta?
                            </p>
                            <p className='createCount' style={{ color: "#04A8FF", cursor: 'pointer' }} onClick={() => { navigate('/login') }}>
                                Login
                            </p>
                        </div>

                        <img className="logoLogin" src={Saly} alt='' style={{ marginLeft: 250 }}></img>
                    </div>

                </div>

                <div className='containerRight'>
                    <p className='entrar'>
                        Criar conta
                    </p>

                    <Form onSubmit={singUp}>
                        <Form.Group className="mb-4" controlId="formBasicEmail">
                            <Form.Control
                                className='form'
                                type="email"
                                placeholder="E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control
                                className='form'
                                type="password"
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>

                        <Button className='mb-4 btnEntrar' variant="primary" type="submit">
                            Registrar
                        </Button>
                    </Form>

                </div>
            </div>
        </>

    )
}
// import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import {login} from '../../Services/auth'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate, Link} from 'react-router-dom';
// import logo from '../../assets/Logo.svg';
// import { auth, provider } from '../../firebase';
import "./index.css";
import { errorAlert } from '../../Components/Alerts/FunctionsAlerts';
import { GoogleLogin } from '@react-oauth/google';
import { loginWithGoogle } from '../../Services/auth';

export default function SingIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // const singIn = (e) => {
    //     e.preventDefault();
    //     signInWithEmailAndPassword(auth, email, password)
    //         .then((userCredential) => {
    //             navigate("/inicio");
    //         }).catch((error) => {
    //             console.log(error)
    //         })
    // }

    const singIn = async (e) =>{
        e.preventDefault();
        try{
            const user = await login(email, password);
            console.log('Logado como: ', user);
            navigate("/inicio")
        } catch (error){
            console.log(error);
            if(error.response && error.response.status === 401){
                errorAlert('E-mail/Username ou Password invalido!');
            }else{
                errorAlert('Erro ao logar. Tente novamente.')
            }
        }
    };


    return (
        <div className="login-page login-page--signin">
            <div className="login-header">
                <div className="login-logo">
                    <Link to="/">
                        <img src="/assets/LogicalEducLogosemescrita_semfundo.svg" alt="Logo Logical Educ" className="login-logo-img" />
                    </Link>
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
                    <p 
                        className='createCount'
                        onClick={() => { navigate('/register') }}
                    >
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
                            <Form.Text 
                                className="forgotPasswordLink  textForm"
                                onClick={() => navigate('./forgot_password')}     
                            >
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
                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                try {
                                    const user = await loginWithGoogle(credentialResponse.credential);
                                    console.log('Logado com Google:', user);
                                    navigate("/inicio");
                                } catch (error) {
                                    console.log(error);
                                    errorAlert('Erro ao entrar com Google. Tente novamente.');
                                }
                            }}
                            onError={() => {
                                errorAlert('Erro ao autenticar com Google.');
                            }}
                        />
                    </div>
                </div>
            </div>


        </div>

    )
}
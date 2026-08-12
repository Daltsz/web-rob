// import { AuthErrorCodes, createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate, Link} from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { register, loginWithGoogle } from '../../Services/auth';
import { errorAlert, successAlert } from '../../Components/Alerts/FunctionsAlerts';
// import logo from '../../assets/Logo.svg';
import Saly from '../../assets/Saly-1.svg';
// import { auth } from '../../firebase';
import "./index.css";

export default function SingUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');

    const navigate = useNavigate();

    const handleRoute = () => {
        navigate("/login");
    }

    const singUp = async (e) => {
        e.preventDefault();

        try{
           await register(name, email, password, phone);
           successAlert("Conta Criada com Sucesso!", handleRoute) 
        } catch(error){
            if(error.code === 'PASSWORD_TOO_SHORT'){
                errorAlert('A senha deve ser mais de 6 caracteres')
                return; 
            }
            if (error.response){
                if(error.response.status === 409){
                    errorAlert("Este e-mail ja está cadastrado.")
                    return;
                }
            }
            errorAlert("Ocorreu um erro ao criar a conta. Por favor, tente novamente mais tarde.")
            
        }
    };

        // if (password.length <= 6) {
        //     errorAlert("A senha deve ter mais de 6 caracteres!");
        //     return;
        // }

        // createUserWithEmailAndPassword(auth, email, password)
        //     .then((userCredential) => {
        //         successAlert("Conta criada com sucesso!", handleRoute)
        //     }).catch((error) => {
        //         switch (error.code) {
        //             case AuthErrorCodes.EMAIL_EXISTS:
        //                 errorAlert("O e-mail já está cadastrado. Por favor, utilize outro e-mail.");
        //                 break;
        //             case AuthErrorCodes.INVALID_EMAIL:
        //                 errorAlert("O e-mail não é válido. Por favor, utilize outro e-mail.");
        //                 break;
        //             case AuthErrorCodes.WEAK_PASSWORD:
        //                 errorAlert("Esta senha é muito fraca. Por favor, crie uma senha mais forte.");
        //                 break;
        //             default:
        //                 errorAlert("Ocorreu um erro ao criar a conta. Por favor, tente novamente mais tarde.");
        //         }
        //     });
    
    return (
        <>
            <div className="header">
                {/* <div className='menuLogin'>
                    <img className="logoLogin" src={logo} alt='Logo'></img>
                </div> */}
                <div className="logo">
                    <Link to="/">
                        <img src="/assets/LogicalEducLogosemescrita_semfundo.svg" alt="Logo Logical Educ" className="logo-img" />
                    </Link>
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
                            <p 
                                className='createCount'
                                onClick={() => { navigate('/login') }}
                            >
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
                        <Form.Group className="mb-4" controlId="formBasicName">
                            <Form.Control
                                className='form'
                                type="name"
                                placeholder="Nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
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
                        <Form.Group className="mb-3" controlId="formBasicPhone">
                            <Form.Control
                                className='form'
                                type="phone"
                                placeholder="Telefone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)} />
                        </Form.Group>

                        <Button className='mb-4 btnEntrar' variant="primary" type="submit">
                            Registrar
                        </Button>
                        <Form.Group className="mb-4">
                            <Form.Text className="textForm d-flex justify-content-center" style={{ fontSize: 14 }}>
                                ou cadastre-se com
                            </Form.Text>
                        </Form.Group>

                        <div className='d-flex justify-content-center'>
                            <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                    try {
                                        const user = await loginWithGoogle(credentialResponse.credential);
                                        console.log('Cadastrado/logado com Google:', user);
                                        navigate("/inicio");
                                    } catch (error) {
                                        console.log(error);
                                        errorAlert('Erro ao cadastrar com Google. Tente novamente.');
                                    }
                                }}
                                onError={() => {
                                    errorAlert('Erro ao autenticar com Google.');
                                }}
                            />
                        </div>
                    </Form>

                </div>
            </div>
        </>

    )
}
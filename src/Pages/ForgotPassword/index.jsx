import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { recoverPassword } from "../../Services/auth";
import { successAlert, errorAlert } from "../../Components/Alerts/FunctionsAlerts";
import "../Login/index.css";

export default function ForgotPassword(){
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            await recoverPassword(email);

            successAlert('Se o e-mail existir, enviamos um codigo de recuperação.', ()=>{
                navigate('/login/reset_password', {state: {email}});
            });
        }catch (err){
            console.log(err);
            errorAlert('Ocorreu um erro ao enviar o e-mail, Tente novamente mais tarde.');
        }
    };

    return(
        <div className="login-page">
            <div className="login-header">
                <div className="login-logo">
                    <Link to='/'>
                        <img 
                            src="/assets/LogicalEducLogosemescrita_semfundo.svg"
                            alt="Logo Logical Educ"
                            className="login-logo-img"
                        />
                    </Link>
                </div>
            </div>

            <div className="containerLogin">
                <div className="containerLeft">
                    <p className="frase">Esqueceu sua senha?</p>
                    <p className="isCount">
                        Informe seu e-mail e enviaremos um codigo de recuperação.
                    </p>
                </div>

                <div className="containerRight">
                    <p className="entrar">Recuperar senha</p>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4" controlId="formRecoverEmail" >
                            <Form.Control 
                                className="form"
                                type="email"
                                placeholder="Digite seu e-mail"
                                value={email}
                                onChange={(e)=> setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Button className="mb-4 btnEntrar" variant="primary" type="submit">
                            Enviar Código
                        </Button>
                    </Form>
                    <p 
                        className="backToLoginLink d-flex justify-content-center"
                        onClick={() => navigate('/login')}
                    >
                        Voltar para o login
                    </p>
                </div>
            </div>

        </div>
    );
}
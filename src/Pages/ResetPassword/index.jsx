import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Button, Form, FormControl } from "react-bootstrap";
import { resetPassword } from "../../Services/auth";
import { successAlert, errorAlert } from "../../Components/Alerts/FunctionsAlerts";
import "../Login/index.css";

export default function ResetPassword(){
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState(location.state?.email || '');
    const [code, setCode] = useState('')
    const [newPassword, setNewPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(newPassword.length < 8){
            errorAlert('A senha deve ter mais de 8 caracteres');
            return;
        }
        try{
            await resetPassword(email, code, newPassword);
            successAlert('Senha alterada com sucesso!', ()=>{
                navigate('/login');
            });
        }catch (err){
            console.log(err);
            if(err.response && err.response.status === 400){
                errorAlert('Código inválido ou expirado.');
            }else{
                errorAlert('Erro ao alterar a senha. Tente novamente.')
            }
        }
    };

    return (
        <>
            <div className="header">
                <div className="logo">
                    <Link to='/'>
                        <img
                            src="/assets/LogicalEducLogosemescrita_semfundo.svg"
                            alt="Logo Logical Educ"
                            className="logo-img"
                        />
                    </Link>
                </div>
            </div>

            <div className="containerLogin">
                <div className="containerLeft">
                    <p className="frase">Redefinir Senha</p>
                    <p className="isCount">
                        Digite o codigo de recuperação e sua nova senha.
                    </p>
                </div>

                <div className="containerRight">
                    <p className="entrar">Nova Senha</p>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4" controlId="formResetEmail">
                            <FormControl
                                className="form"
                                type="email"
                                placeholder="E-mail"
                                value={email}
                                onChange={(e) =>setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-4" controlId="formResetCode">
                            <Form.Control
                                className="form"
                                type="text"
                                placeholder="Código de recuperação"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formResetPassword">
                            <Form.Control
                                className="form"
                                type="password"
                                placeholder="Nova senha"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Button className="mb-4 btnEntrar" variant="primary" type="submit">
                            Alterar senha
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
        </>
    );
}
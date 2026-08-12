import {api} from './http'

export async function login(email, password) {
    const response = await api.post('/auth/login', {email, password});
    const {accessToken, user} = response.data;


    localStorage.setItem('token', accessToken);
    localStorage.setItem('userId', user.id);

    return user;
}


export async function register(name, email, password, phone) {

    if (password.length <= 8) {
        const err = new Error('PASSWORD_TOO_SHORT');
        err.code = 'PASSWORD_TOO_SHORT';
        throw err;
    }
    const response = await api.post('/auth/register', {name, email, password, phone});
    return response.data;
}


export async function recoverPassword(email){
    const response = await api.post('auth/password/recover', {email});
    return response.data;
}


export async function resetPassword(email, code, newPassword){
    const response = await api.post('auth/password/reset', {
        email,
        code,
        new_password: newPassword,
    });
    return response.data
}



export async function loginWithGoogle(credential) {
    const response = await api.post('/auth/google', { credential });

    const { accessToken, user } = response.data;

    localStorage.setItem('token', accessToken);
    localStorage.setItem('userId', user.id);

    return user;
}
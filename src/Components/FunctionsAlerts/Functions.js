import { MySwal } from "../../App";


export function successAlert(message, hideAlert) {
    MySwal.fire({
        title: "Sucesso!",
        html: message,
        icon: 'success',
        allowOutsideClick: false,
        customClass: {
            confirmButton: "btn-primary "
        }
    }).then(hideAlert);

};

export function infoAlert(message, hideAlert) {
    MySwal.fire({
        title: "Solicitação recebida com sucesso!",
        html: message,
        icon: 'info',
        allowOutsideClick: false,
        customClass: {
            confirmButton: "btn-info"
        }
    }).then(hideAlert);
};

export function infoAviso(message, hideAlert) {
    MySwal.fire({
        title: "Alerta",
        html: message,
        icon: 'info',
        allowOutsideClick: false,
        customClass: {
            confirmButton: "btn-info"
        }
    }).then(hideAlert);
};

export function errorAlert(message, hideAlert) {
    MySwal.fire({
        title: "Erro!",
        html: message,
        icon: 'error',
        allowOutsideClick: false,
        customClass: {
            confirmButton: "btn-danger "
        }
    }).then(hideAlert);
};


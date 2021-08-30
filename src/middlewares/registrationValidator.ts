import { checkSchema } from 'express-validator';

export default checkSchema({
    name: {
        isLength: {
            options: {
                min: 2,
            },
            errorMessage: 'O nome precisa de pelo menos 2 caracteres.'
        },
        notEmpty: true,
    },
    email: {
        isEmail: true,
        errorMessage: 'E-mail inválido!',
        notEmpty: true,
    },
    password: {
        isLength: {
            options: {
                min: 4,
                max: 8
            },
            errorMessage: 'A senha precisa de no mínimo 4 dígitos e no máximo 8.'
        },
        notEmpty: true
    },
    passwordConfirm: {
        isLength: {
            options: {
                min: 4,
                max: 8
            },
            errorMessage: 'A confirmação da senha precisa ser igual a senha.'
        },
        notEmpty: true
    },
});
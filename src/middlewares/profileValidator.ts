import { checkSchema } from "express-validator";

export default checkSchema({
    name: {
        notEmpty: true,
        errorMessage: 'O campo de nome do usuário não pode ser vazio.'
    },
    email: {
        isEmail: true,
        notEmpty: true,
        errorMessage: 'Insira um e-mail válido.'
    },
    password: {
        optional: true
    },
    confirmPassword: {
        optional: true
    }
});
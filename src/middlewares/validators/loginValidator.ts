import { checkSchema } from "express-validator";

export default checkSchema({
    email: {
        isEmail: true,
        notEmpty: true,
        errorMessage: 'Insira um endereço de e-mail válido!',
    },
    password: {
        notEmpty: true,
        errorMessage: 'O campo de senha não pode estar vazio!'
    }
});
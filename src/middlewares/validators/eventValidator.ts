import { checkSchema } from "express-validator";

export default checkSchema({
    title: {
        isLength: {
            options: {
                min: 2,
            },
            errorMessage: 'O título precisa de no mínimo 2 caracteres.'
        },
        notEmpty: true
    },
    description: {
        optional: true,
        isLength: {
            options: {
                max: 240
            }, 
            errorMessage: 'A descrição não pode contar mais que 240 caracteres.'
        }
    },
});
import { Request, Response } from 'express';
import { matchedData, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import { User } from '../model/User';

export function login(req: Request, res: Response) {
    let userIsAuthenticated = false;

    res.render('login', { userIsAuthenticated });
}

export function register(req: Request, res: Response) {
    res.render('register');
}
export async function registerAction(req: Request, res: Response) {
    let data = matchedData(req);
    let errors = validationResult(req);

    if(!errors.isEmpty()) {
        let validationErrors = errors.mapped();

        for(let err in validationErrors) {
            if(validationErrors[err].msg) {
                req.flash('error', validationErrors[err].msg);
                return res.redirect('/register');
            }
        }
    }

    if(data.password !== data.passwordConfirm) {
        req.flash('error', 'As senhas não correspondem!');
        return res.redirect('/register');
    }

    let checkEmail = await User.count({
        where: {
            email: data.email
        }
    });

    if(checkEmail > 0) {
        req.flash('error','Não é possível utilizar esse endereço de e-mail, tente outro.');
        return res.redirect('/register');
    }

    let { name, email, password } = data;
    password = await bcrypt.hash(password, 10);

    await User.create({
        name,
        email,
        password
    });

    req.flash('success', 'Usuário cadastrado com sucesso! Faça o login.')
    res.redirect('/login');
}   

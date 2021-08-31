import { Request, Response } from 'express';
import { matchedData, validationResult } from 'express-validator';

import { User } from '../models/User';

export function login(req: Request, res: Response) {
    res.render('login');
}

export function logoutAction(req: Request, res: Response) {
    req.logOut();
    res.locals.user = '';
    res.locals.isUserAuthenticated = false;

    req.flash('success', 'Você saiu de sua conta!');
    res.redirect('/login');
}

export function register(req: Request, res: Response) {
    res.render('register');
}
export async function registerAction(req: Request, res: Response) {
    const data = matchedData(req);
    const errors = validationResult(req);

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

    await User.create({
        name, 
        email, 
        password
    });


    req.flash('success', 'Usuário cadastrado com sucesso! Faça o login.')
    res.redirect('/login');
}   

import { Request, Response } from 'express';

import { matchedData, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

export function login(req: Request, res: Response) {
    let userIsAuthenticated = false;

    res.render('login', { userIsAuthenticated });
}

export function register(req: Request, res: Response) {
    res.render('register');
}
export function registerAction(req: Request, res: Response) {
    let data = matchedData(req);
    let errors = validationResult(req);

    if(!errors.isEmpty()) {
        let validationErrors = errors.mapped();

        for(let err in validationErrors) {
            if(validationErrors[err].msg) {
                req.flash('error', validationErrors[err].msg);
            }
        }
    }

    if(data.password !== data.passwordConfirm) {
        req.flash('error', 'As senhas não correspondem!');
        return res.redirect('/register');
    }

    res.redirect('/register');
}   

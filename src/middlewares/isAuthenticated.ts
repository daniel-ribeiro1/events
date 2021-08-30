import { Request, Response, NextFunction } from 'express';
import { User } from '../model/User';

export default (req: Request, res: Response, next: NextFunction) => {
    if(!req.user) {
        res.locals.isUserAuthenticated = false;

        req.flash('warning', 'Faça o login para continuar!');
        return res.redirect('/login');
    }

    res.locals.user = req.user;
    res.locals.isUserAuthenticated = true;
    next();
}
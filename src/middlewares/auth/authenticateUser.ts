import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { validationResult } from 'express-validator';

export default (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        let validationErrors = errors.mapped();

        for(let error in validationErrors) {
            if(validationErrors[error].msg) {
                req.flash('warning', validationErrors[error].msg);
                return res.redirect('/login');
            }
        }
    }

   passport.authenticate('local', (err, user, info) => {
       if(err) {
           next(err);
       }

       if(!user) {
           req.flash('warning', 'E-mail ou senha incorretos.');
           return res.redirect('/login');
       }

       req.logIn(user, (err) => {
           if(err) {
               next(err);
           }

           res.redirect('/user');
       })
   })(req, res, next);
}
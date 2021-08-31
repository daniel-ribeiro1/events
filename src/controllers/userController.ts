import { Request, Response } from 'express';
import { matchedData, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import { Event } from '../models/Event';
import { User } from '../models/User';

export function editProfile(req: Request, res: Response) {
    res.render('user/profile');
}
export async function editProfileAction(req: Request, res: Response) {
    const { user } = res.locals;
    const data = matchedData(req);
    const errorsResult = validationResult(req);

    if(!errorsResult.isEmpty()) {
        let validationErrors = errorsResult.mapped();

        for(let err in validationErrors) {
            if(validationErrors[err].msg) {
                req.flash('warning', validationErrors[err].msg);
                return res.redirect('/user/profile');
            }
        }
    }

    const userProfile = await User.findByPk(user.id);

    if(!userProfile) {
        req.flash('error', 'Não foi possível encontrar o perfil do usuáirio!');
        return res.redirect('/user');
    }

    let { name, email, password, confirmPassword } = data;

    if(email !== userProfile.email) {
        let emailList = await User.count({
            where: {
                email
            }
        });

        if(emailList > 0) {
            req.flash('error', 'Você não pode utilizar este e-mail, tente outro.');
            return res.redirect('/user/profile');
        }
    }

    if(password && ( (password.length < 4) || (password.length > 8))) {
        req.flash('warning', 'As senhas devem ter no mínimo 4 caracteres e no máximo 8');
        return res.redirect('/user/profile');
    }
    if(password && (password !== confirmPassword)) {
        req.flash('warning', 'As senhas não correspondem.');
        return res.redirect('/user/profile');
    }

    userProfile.name = name;
    userProfile.email = email;
    if(password) userProfile.password = password;
    await userProfile.save();

    req.flash('success', 'Perfil editado com sucesso!');
    res.redirect('/user/profile');
}

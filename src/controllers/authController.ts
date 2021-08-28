import { Request, Response } from 'express';

export function login(req: Request, res: Response) {
    let userIsAuthenticated = false;

    res.render('login', { userIsAuthenticated });
}

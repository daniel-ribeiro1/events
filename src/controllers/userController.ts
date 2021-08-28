import { Request, Response } from 'express';

export function myEvents(req: Request, res: Response) {
    res.render('user/myEvents', {userIsAuthenticated: true});
}


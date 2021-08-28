import { Request, Response } from 'express';

export function myEvents(req: Request, res: Response) {
    res.render('user/myEvents', {userIsAuthenticated: true});
}

export function newEvent(req: Request, res: Response) {
    res.render('user/newEvent');
}

export function editEvent(req: Request, res: Response) {
    res.render("user/editEvent");
}


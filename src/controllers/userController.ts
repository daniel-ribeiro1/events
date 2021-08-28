import { Request, Response } from 'express';

export function myEvents(req: Request, res: Response) {
    res.render('user/myEvents', {userIsAuthenticated: true});
}

export function newEvent(req: Request, res: Response) {
    res.render('user/newEvent', {userIsAuthenticated: true});
}

export function editEvent(req: Request, res: Response) {
    res.render("user/editEvent", {userIsAuthenticated: true});
}

export function profile(req: Request, res: Response) {
    res.render('user/profile', {userIsAuthenticated: true});
}

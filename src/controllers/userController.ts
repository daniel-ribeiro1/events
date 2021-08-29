import { Request, Response } from 'express';
import { start } from 'repl';
import { Op } from 'sequelize';
import { Event } from '../model/Event';

// Get events
export function myEvents(req: Request, res: Response) {
    res.render('user/myEvents', {userIsAuthenticated: true});
}

// Add event
export function newEvent(req: Request, res: Response) {
    res.render('user/newEvent', {userIsAuthenticated: true});
}
export async function newEventAction(req: Request, res: Response) {
    let { title, startTime, endTime, description } = req.body;

    startTime = getTimeStringInMilliseconds(startTime);
    endTime = getTimeStringInMilliseconds(endTime);

    // Event time validations 
    if(startTime >= endTime) {
        return res.redirect('/user/new-event');
    }
    const numberOfEventsFound = await Event.count({
        where: {
            [Op.or]: [
                {
                    // startTimeDB <= startTime && endTimeDB >= startTime
                    [Op.and]: [
                        {
                            startTime: {
                                [Op.lte]: startTime
                            }
                        },
                        {
                            endTime: {
                                [Op.gte]: startTime
                            }
                        }
                    ],
                }, 
                {
                     // startTimeDB <= endTime && endTimeDB >= endTime
                    [Op.and]: [
                        {
                            startTime: {
                                [Op.lte]: endTime,
                            }
                        },
                        {
                            endTime: {
                                [Op.gte]: endTime
                            }
                        }
                    ]
                },
                {
                    // startTimeDB >= startTime && endTimeDB <= endTime
                    [Op.and]: [
                        {
                            startTime: {
                                [Op.gte]: startTime,
                            }
                        },
                        {
                            endTime: {
                                [Op.lte]: endTime
                            }
                        }
                    ]
                    
                }
            ]
        }
    })
    if(numberOfEventsFound > 0) {
        return res.redirect('/user/new-event');
    }

    await Event.create({
        title, 
        startTime,
        endTime,
        description
    });

    res.redirect('/user/new-event');
}

// Edit event 
export function editEvent(req: Request, res: Response) {
    res.render("user/editEvent", {userIsAuthenticated: true});
}

// Edit profile
export function profile(req: Request, res: Response) {
    res.render('user/profile', {userIsAuthenticated: true});
}


// Functions
function getTimeStringInMilliseconds(timeString: string) {
    const date = new Date();
    
    let hours = parseInt(timeString.split(':')[0]);
    let minutes = parseInt(timeString.split(':')[1]);

    date.setHours(hours);
    date.setMinutes(minutes);

    return date.getTime();
}



import { Request, Response } from 'express';
import { start } from 'repl';
import { Op } from 'sequelize';
import { Event } from '../model/Event';

// Get events
export async function myEvents(req: Request, res: Response) {
    const events = await Event.findAll({
        order: ['startTime']
    });

    res.render('user/myEvents', { userIsAuthenticated: true, events});
}

// Add event
export function newEvent(req: Request, res: Response) {
    res.render('user/newEvent', {userIsAuthenticated: true});
}
export async function newEventAction(req: Request, res: Response) {
    let { title, startTime, endTime, description } = req.body;
    let currentTime = new Date().getTime();

    startTime = getTimeStringInMilliseconds(startTime);
    endTime = getTimeStringInMilliseconds(endTime);

    // Event time validations 
    if(startTime >= endTime || startTime < currentTime) {
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

    res.redirect('/user');
}

// Edit event 
export async function editEvent(req: Request, res: Response) {
    const currentEvent = await Event.findByPk(req.params.id);

    if(!currentEvent) {
        return res.redirect('/user');
    }

    res.render("user/editEvent", { userIsAuthenticated: true, currentEvent});
}
export async function editEventAction(req: Request, res: Response) {
    let { title, startTime, endTime, description } = req.body;
    let currentTime = new Date().getTime();

    startTime = getTimeStringInMilliseconds(startTime);
    endTime = getTimeStringInMilliseconds(endTime);

    const currentEvent = await Event.findByPk(req.params.id);
    if(!currentEvent) {
        return res.redirect('/user');
    }

    let startTimeEvent = getTimeStringInMilliseconds(currentEvent.startTime.toString());
    let endTimeEvent = getTimeStringInMilliseconds(currentEvent.endTime.toString());

    if( (startTimeEvent !== startTime) || (endTimeEvent !== endTime) ) {
        // Event time validations 
        if(startTime >= endTime || startTime < currentTime) {
            return res.redirect('/user/edit-event/' + req.params.id);
        }
        const events = await Event.findAll({
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
        });
        if(events.length > 0) {
            if(events.length !== 1) {
                return res.redirect('/user/edit-event/' + req.params.id);
            }

            if(events[0].id !== parseInt(req.params.id)) {
                return res.redirect('/user/edit-event/' + req.params.id);
            }

        } 
    }

    console.log('\n\n Foi \n\n')

    currentEvent.title = title;
    currentEvent.startTime = startTime;
    currentEvent.endTime = endTime;
    currentEvent.description = description;
    await currentEvent.save();

    res.redirect('/user/edit-event/' + req.params.id);
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
    date.setMilliseconds(0);

    return date.getTime();
}



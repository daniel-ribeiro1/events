import { Request, Response } from 'express';
import { matchedData, validationResult } from 'express-validator';
import { Op } from 'sequelize';

import { Event } from '../models/Event';

// Get events
export async function myEvents(req: Request, res: Response) {
    const { user }= res.locals;
    
    const events = await Event.findAll({
        order: ['startTime'],
        where: {
            authorId: user.id
        }
    });

    res.render('user/myEvents', { events });
}


// Add event
export function newEvent(req: Request, res: Response) {
    res.render('user/newEvent');
}
export async function newEventAction(req: Request, res: Response) {
    const { user } = res.locals;
    
    let { startTime, endTime } = req.body;
    const data = matchedData(req);
    const errorsResult = validationResult(req);
    
    // check validation errors
    if(!errorsResult.isEmpty()) {
        let validationErrors = errorsResult.mapped();

        for(let err in validationErrors) {
            if(validationErrors[err].msg) {
                req.flash('warning', validationErrors[err].msg);
                return res.redirect('/user/new-event');
            }
        }
    }

    startTime = getTimeStringInMilliseconds(startTime);
    endTime = getTimeStringInMilliseconds(endTime);

    if(!startTime || !endTime) {
        req.flash('error', 'Preencha os campos com horários válidos!');
        return res.redirect('/user/new-event');
    }

    // Event time validations 
    if(startTime >= endTime) {
        req.flash('warning', 'O horário de início do evento deve ser maior que o horário de término do mesmo.')
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
        req.flash('error', 'Não foi possível criar o evento pois houve choque de horários.');
        return res.redirect('/user/new-event');
    }

    let { title, description } = data;

    await Event.create({
        title, 
        startTime,
        endTime,
        description,
        authorId: user.id
    });

    req.flash('success', 'Evento criado com sucesso!');
    res.redirect('/user');
}


// Edit event 
export async function editEvent(req: Request, res: Response) {
    const { user } = res.locals;

    const currentEvent = await Event.findOne({
        where: {
            id: req.params.id,
            authorId: user.id
        }
    });

    if(!currentEvent) {
        req.flash('warning', 'Não foi possível encontrar o evento!');
        return res.redirect('/user');
    }

    res.render("user/editEvent", { userIsAuthenticated: true, currentEvent});
}
export async function editEventAction(req: Request, res: Response) {
    const { user } = res.locals;
    let { startTime, endTime } = req.body;
    const data = matchedData(req);
    const errorsResult = validationResult(req);
    
    // check validation errors
    if(!errorsResult.isEmpty()) {
        let validationErrors = errorsResult.mapped();

        for(let err in validationErrors) {
            if(validationErrors[err].msg) {
                req.flash('warning', validationErrors[err].msg);
                return res.redirect('/user/edit-event/' + req.params.id);
            }
        }
    }

    const currentEvent = await Event.findOne({
        where: {
            id: req.params.id,
            authorId: user.id
        }
    });
    if(!currentEvent) {
        req.flash('warning', 'Não foi possível encontrar o evento!');
        return res.redirect('/user');
    }

    startTime = getTimeStringInMilliseconds(startTime);
    endTime = getTimeStringInMilliseconds(endTime);

    if(!startTime || !endTime) {
        req.flash('error', 'Preencha os campos com horários válidos!');
        return res.redirect('/user/edit-event' + req.params.id);
    }

    let startTimeEvent = getTimeStringInMilliseconds(currentEvent.startTime.toString());
    let endTimeEvent = getTimeStringInMilliseconds(currentEvent.endTime.toString());

    if( (startTimeEvent !== startTime) || (endTimeEvent !== endTime) ) {
        // Event time validations 
        if(startTime >= endTime) {
            req.flash('warning', 'O horário de início deve ser maior que o horário de finalização do evento.')
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
                req.flash('error', 'Não foi possível criar o evento pois houve choque de horários.');
                return res.redirect('/user/edit-event/' + req.params.id);
            }

            if(events[0].id !== parseInt(req.params.id)) {
                req.flash('error', 'Não foi possível criar o evento pois houve choque de horários.');
                return res.redirect('/user/edit-event/' + req.params.id);
            }

        } 
    }

    let { title, description } = data;

    currentEvent.title = title;
    currentEvent.startTime = startTime;
    currentEvent.endTime = endTime;
    currentEvent.description = description;
    await currentEvent.save();

    req.flash('success', 'Evento editado com sucesso!');
    res.redirect('/user/edit-event/' + req.params.id);
}

// Delete event
export async function deleteEventAction(req: Request, res: Response) {
    const { user } = res.locals;

    await Event.destroy({
        where: {
            id: req.params.id,
            authorId: user.id
        }
    });

    req.flash('success', 'Evento apagado com sucesso!');
    res.redirect('/user');
}


// Functions
function getTimeStringInMilliseconds(timeString: string | null): number | boolean {
    if(!timeString) {
        return false;
    }
    
    const date = new Date();
    
    let hours = parseInt(timeString.split(':')[0]);
    let minutes = parseInt(timeString.split(':')[1]);

    if(isNaN(hours) || isNaN(minutes)) {
        return false;
    }

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date.getTime();
}



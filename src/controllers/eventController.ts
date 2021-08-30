import { Request, Response } from 'express';
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

    if(!title || !startTime || !endTime) {
        req.flash('warning', 'Preencha os campos!');
        return res.redirect('/user/new-event');
    }

    startTime = getTimeStringInMilliseconds(startTime);
    endTime = getTimeStringInMilliseconds(endTime);

    if(description && description.length > 240) {
        req.flash('warning', 'A descrição não pode contar mais que 240 caracteres.');
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

    await Event.create({
        title, 
        startTime,
        endTime,
        description
    });

    req.flash('success', 'Evento criado com sucesso!');
    res.redirect('/user');
}

// Edit event 
export async function editEvent(req: Request, res: Response) {
    const currentEvent = await Event.findByPk(req.params.id);

    if(!currentEvent) {
        req.flash('error', 'Não foi possível encontrar o evento!');
        return res.redirect('/user');
    }

    res.render("user/editEvent", { userIsAuthenticated: true, currentEvent});
}
export async function editEventAction(req: Request, res: Response) {
    let { title, startTime, endTime, description } = req.body;

    startTime = getTimeStringInMilliseconds(startTime);
    endTime = getTimeStringInMilliseconds(endTime);

    if(description && description.length > 240) {
        req.flash('warning', 'A descrição não pode contar mais que 240 caracteres.');
        return res.redirect('/user/edit-event/' + req.params.id);
    }

    const currentEvent = await Event.findByPk(req.params.id);
    if(!currentEvent) {
        req.flash('error', 'Não foi possível encontrar o evento!');
        return res.redirect('/user');
    }

    if(!title || !startTime || !endTime) {
        req.flash('warning', 'Preencha os campos!');
        return res.redirect('/user/edit-event/' + req.params.id);
    }

    let startTimeEvent = getTimeStringInMilliseconds(currentEvent.startTime.toString());
    let endTimeEvent = getTimeStringInMilliseconds(currentEvent.endTime.toString());

    if( (startTimeEvent !== startTime) || (endTimeEvent !== endTime) ) {
        // Event time validations 
        if(startTime >= endTime) {
            req.flash('warning', 'O horário de início do evento deve ser maior que o horário de término do mesmo.')
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
    await Event.destroy({
        where: {
            id: req.params.id
        }
    });

    req.flash('success', 'Evento apagado com sucesso!');
    res.redirect('/user');
}


// Functions
function getTimeStringInMilliseconds(timeString: string) {
    const date = new Date();
    
    let hours = parseInt(timeString.split(':')[0]);
    let minutes = parseInt(timeString.split(':')[1]);

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date.getTime();
}



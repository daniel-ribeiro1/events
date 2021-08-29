import express from 'express';
import mustache from 'mustache-express';
import { join } from 'path';
import dotenv from 'dotenv';
import session from 'express-session';
import flash from 'connect-flash';

import mainRoutes from './routes/index';
import userRoutes from './routes/user';

dotenv.config();
const server = express();

// Sessions
server.use(session({
    secret: process.env.SECRET as string,
    resave: false,
    saveUninitialized: false
}));
// Flash
server.use(flash());

server.use((req, res, next) => {
    res.locals.successMessage = req.flash('success');
    res.locals.errorMessage = req.flash('error');
    res.locals.warningMessage = req.flash('warning');

    next();
});
// Engine
server.engine('mustache', mustache());
server.set('views', join(__dirname, 'views'));
server.set('view engine', 'mustache');

// Static files
server.use(express.static(join(__dirname, 'public')));

// Allow Post Request
server.use(express.urlencoded({ extended: true }));

// Routes
server.use(mainRoutes);
server.use('/user', userRoutes);

server.get('*', (req, res) => {
    res.render('notFound', {userIsAuthenticated: true});
});

server.listen(process.env.PORT);
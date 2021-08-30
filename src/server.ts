import express from 'express';
import mustache from 'mustache-express';
import { join } from 'path';
import dotenv from 'dotenv';
import session from 'express-session';
import flash from 'connect-flash';
import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';

import mainRoutes from './routes/index';
import userRoutes from './routes/user';
import { UserInstance, User } from './model/User';


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
    res.locals.failureFlash = req.flash('failureFlash');
    res.locals.successFlash = req.flash('successFlash');

    next();
});

// Passport 
server.use(passport.initialize());
server.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
})
passport.deserializeUser(async (userData: UserInstance, done) => {
    const user = await User.findByPk(userData.id);

    done(null, user); 
});

passport.use(new Strategy({
    usernameField: 'email',
    passwordField: 'password'
    },
    async (email, password, done) => {
        const user = await User.findOne({
            where: {
                email
            },
        });

        if(!user) {
            return done(null, false);
        }

        if(!await bcrypt.compare(password, user.password)) {
            return done(null, false);
        }

        done(null, user);
    }
));
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
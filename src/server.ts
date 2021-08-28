import express from 'express';
import mustache from 'mustache-express';
import { join } from 'path';
import dotenv from 'dotenv';

import mainRoutes from './routes/index';
import userRoutes from './routes/user';

dotenv.config();
const server = express();

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
    res.render('notFound');
});

server.listen(process.env.PORT);
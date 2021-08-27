import express from 'express';
import mustache from 'mustache-express';
import { join } from 'path';
import dotenv from 'dotenv';

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
server.get('*', (req, res) => {
    res.send("Página não encontrada!");
    // res.render('NotFound');
});

server.listen(process.env.PORT);
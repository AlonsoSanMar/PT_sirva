import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import session from 'express-session';
import bodyParser from 'body-parser';

import registroRouter from './router/registro.js';
import loginRouter from './router/login.js';
import menuRouter from './router/menu.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 8081;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: 'mi_secreto',
    resave: false,
    saveUninitialized: true
}));

//CONEXION CON LA BASE DE DATOS:
//const bodyParser = require('body-parser');
// obtener de un formulario
app.use(bodyParser.urlencoded({ extended: false }));
// enviar en formato json
app.use(bodyParser.json());
//const mongoose = require('mongoose');
const usuario = 'Pantera';
const password = 'pantera';
const nombreBD = 'pruebaPT';

const uri = `mongodb+srv://${usuario}:${password}@isiweb.5wlgxmu.mongodb.net/${nombreBD}?retryWrites=true&w=majority`;
//{ useNewUrlParser: true, useUnifiedTopology: true }
mongoose.connect(uri)
    .then(() => console.log('Bien... estás conectado a la Base de Datos :D'))
    .catch(e => console.log('error de conexión', e));

app.use('/', loginRouter);
app.use('/registro', registroRouter);
app.use('/menu', menuRouter);

app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}!`));
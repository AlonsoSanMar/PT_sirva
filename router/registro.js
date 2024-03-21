import express from 'express';
const router = express.Router();

import Uea from '../models/uea.js';
import Usuario from '../models/usuario.js';
import Tutor from '../models/tutor.js';

router.get('/buscar', async (req, res) => {
    const arrUeas = await Uea.find({});
    res.json(arrUeas);
});

router.get('/buscaUea', async (req, res) => {
    const clave = req.query.clave;
    const uea = await Uea.find({clave: clave});
    res.json(uea);
});

router.get('/buscarUeasActuales/:ueasActualesArr', async (req, res) => {
    if (req.session && req.session.idUsuario) {
        const ueasActualesArr = req.params.ueasActualesArr.split(','); // Convertir la cadena en un arreglo
        const ueasActuales = await Uea.find({ clave: { $in: ueasActualesArr } }); 
        res.json(ueasActuales);
    }
})

router.get('/buscaMatricula', async(req, res) => {
    const matricula = req.query.matricula;
    const usuario = await Usuario.find({matricula: matricula});
    //console.log(usuario);
    if(usuario.length > 0){
        res.status(401).send("Ya existe un usuario con esta matricula");
    }else{
        res.status(200).send("Matricula Correcta");
    }
});

router.get('/buscaCorreo', async(req, res) => {
    const correo = req.query.correo;
    const usuario = await Tutor.find({correo: correo});
    //console.log(usuario);
    if(usuario.length > 0){
        res.status(401).send("Ya existe un usuario con esta correo");
    }else{
        res.status(200);
    }
});

router.post('/alumno', (req, res) => {
    const { nombre, apellidos, matricula, anio_ingreso, periodo, creditos_actuales, correo, password } = req.body;
    req.session.nombre = nombre;
    req.session.apellidos = apellidos;
    req.session.matricula = matricula;
    req.session.anio_ingreso = anio_ingreso;
    req.session.periodo = periodo;
    req.session.creditos_actuales = creditos_actuales;
    req.session.correo = correo
    req.session.password = password;
    res.redirect('alumno/ueas');
});

router.get('/alumno', (req, res) => {
    res.render('registro_alumno_datosP');
});

router.get('/alumno/ueas', (req, res) => {
    // Obtener los datos de la sesión
    const { nombre, apellidos, matricula, anio_ingreso, periodo, creditos_actuales, correo, password } = req.session;
    
    // Crear un nuevo objeto con los datos de la sesión y otros datos necesarios
    const nuevoUsuario = {
        nombre: nombre,
        apellidos: apellidos,
        matricula: matricula,
        anio_ingreso: anio_ingreso,
        periodo: periodo,
        creditos_actuales: creditos_actuales,
        correo: correo,
        password: password,
        // Añadir otros datos necesarios para crear el objeto según tus requerimientos
    };

    // Renderizar la vista y pasar el nuevo objeto como contexto
    res.render('registro_alumno_ueas', { nuevoUsuario: nuevoUsuario });
});

router.post('/alumno/resumen', (req, res) => {
    // Obtener los datos de la sesión
    const { ueasSeleccionadas } = req.body;
    req.session.ueasSeleccionadas = ueasSeleccionadas;
    //res.redirect('alumno/guardar');
    res.status(200);
});

router.post('/alumno/guardar', (req, res) => {
    // Obtener los datos de la sesión
    const { nombre, apellidos, matricula, anio_ingreso, periodo, creditos_actuales, correo, password, ueasSeleccionadas } = req.body;
    req.session.nombre = nombre;
    req.session.apellidos = apellidos;
    req.session.matricula = matricula;
    req.session.anio_ingreso = anio_ingreso;
    req.session.periodo = periodo;
    req.session.creditos_actuales = creditos_actuales;
    req.session.correo = correo
    req.session.password = password;
    req.session.ueasSeleccionadas = ueasSeleccionadas;
    // Renderizar la vista y pasar el nuevo objeto como contexto
    //res.redirect('alumno/guardar');
    res.status(200).send("Correcto");
});

router.get('/alumno/guardar', (req,res) => {
    // Obtener los datos de la sesión
    const { nombre, apellidos, matricula, anio_ingreso, periodo, creditos_actuales, correo, password, ueasSeleccionadas } = req.session;
    
    // Crear un nuevo objeto con los datos de la sesión y otros datos necesarios
    const nuevoUsuario = {
        nombre: nombre,
        apellidos: apellidos,
        matricula: matricula,
        anio_ingreso: anio_ingreso,
        periodo: periodo,
        creditos_actuales: creditos_actuales,
        correo: correo,
        password: password,
        ueasSeleccionadas: ueasSeleccionadas
        // Añadir otros datos necesarios para crear el objeto según tus requerimientos
    };

    res.render('registro_alumno_resumen', {nuevoUsuario: nuevoUsuario});
});

// Para el registro de usuario
router.post('/signup', async(req, res) => {
    const {nombre, apellidos, matricula, anio_ingreso, periodo, creditos_actuales, correo, password, ueasSeleccionadas} = req.body;
    const usuario = await Usuario.findOne({correo : correo});
    
    if(usuario){
        res.status(401).send('Ya existe un usuario con ese correo');
    }else{
        Usuario.create({nombre: nombre, apellidos: apellidos, matricula: matricula, anio_ingreso: anio_ingreso, periodo: periodo, creditos_actuales: creditos_actuales, correo: correo, password: password, ueasSeleccionadas: ueasSeleccionadas})
        .then(usuario => {
            req.session.idUsuario = usuario._id.toString();
            res.status(200).send('Registro exitoso');
        })
        .catch(err => {
            res.status(402).send('Error al insertar en la base de datos');
        });
    }
});

// Peticiones para la parte del registro de un profesor
router.get('/profesor', (req, res) => {
    res.render('registro_profesor');
});

router.post('/signup/profesor', async (req, res) => {
    const {nombre, apellidos, correo, password, tutorados} = req.body;
    const tutor = await Tutor.findOne({correo : correo});
    
    if(tutor){
        res.status(401).send('Ya existe un tutor con ese correo');
    }else{
        Tutor.create({nombre: nombre, apellidos: apellidos, correo: correo, password: password, tutorados: tutorados})
        .then(tutor => {
            req.session.idTutor = tutor._id.toString();
            res.status(200).send('Registro exitoso');
        })
        .catch(err => {
            res.status(402).send('Error al insertar en la base de datos');
        });
    }
});

export default router;

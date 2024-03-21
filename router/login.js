import express from 'express';
const router = express.Router();

import Usuario from '../models/usuario.js';
import Tutor from '../models/tutor.js';

router.get('/', (req, res) => {
    // Eliminamos los datos que ya fueron utilizados para el registro
    req.session.destroy();
    res.render('login'); // Renderiza la vista login.ejs desde la carpeta de vistas
    //res.render('menu');
});

router.post('/login', async(req, res) =>{
    
    const {matricula, password} = req.body;
    const usuario = await Usuario.findOne({matricula : matricula, password : password});
    console.log(usuario);

    if(usuario){
        req.session.idUsuario = usuario._id.toString();
        res.status(200).send('Inicio exitoso');

    }else{
        res.status(401).send('Credenciales incorrectas');
    }
});

router.post('/loginCorreo', async(req, res) =>{
    
    const {correo, password} = req.body;
    const usuario = await Usuario.findOne({correo : correo, password : password});
    const tutor = await Tutor.findOne({correo : correo, password : password});
    //Falta añadir al usuario Profesor y buscar en su coleccion igual
    console.log(usuario);
    console.log(tutor);

    if(usuario){
        req.session.idUsuario = usuario._id.toString();
        res.status(200).send('alumno/inicio');
    }else if(tutor){
        req.session.idUsuario = tutor._id.toString();
        res.status(200).send('tutor');
    }else{
        res.status(401).send('Credenciales incorrectas');
    }
});

export default router;
//module.exports = router;
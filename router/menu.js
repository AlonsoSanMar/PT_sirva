import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();

import Uea from '../models/uea.js';
import Usuario from '../models/usuario.js';
import Tutor from '../models/tutor.js';
import Mensaje from '../models/mensaje.js';
import Cita from '../models/cita.js';


/*router.get('/alumno/inicio', async (req, res) => {
    if (req.session && req.session.idUsuario) {
        //console.log("Id de la sesion: ", req.session.idUsuario);
        try {
            const usuario = await Usuario.findOne({ _id: req.session.idUsuario });

            console.log(req.session.id);
            res.render('menu_alumno_inicio', {
                nuevoUsuario: usuario
            });
        } catch (error) {
            console.log(error);
            res.render('404');
        }
    } else {
        res.render('login');
    }
});*/

router.get('/alumno/inicio', async (req, res) => {
    if (req.session && req.session.idUsuario) {
        console.log("Id de la sesion: ", req.session.idUsuario);
        try {
            const usuario = await Usuario.findOne({ _id: req.session.idUsuario });
            const tutor = await Tutor.findOne({ tutorados: { $in: usuario.matricula } });
            const mensajesNoLeidos = await Mensaje.find({ destino: usuario.matricula, status: false });

            console.log(req.session.id);

            if(tutor){
                res.render('menu_alumno_miCuenta', {
                    nuevoUsuario: usuario,
                    tutor: tutor,
                    mensajesNoLeidos: mensajesNoLeidos
                });
            }else{
                res.render('menu_alumno_miCuenta', {
                    nuevoUsuario: usuario,
                    tutor: "",
                    mensajesNoLeidos: mensajesNoLeidos
                });
            }
        } catch (error) {
            console.log(error);
            res.render('404');
        }
    } else {
        res.render('login');
    }
});

router.get('/alumno/actualizarSeleccion', async (req, res) => {
    if (req.session && req.session.idUsuario) {
        console.log("Id de la sesion: ", req.session.idUsuario);
        try {
            const usuario = await Usuario.findOne({ _id: req.session.idUsuario });
            const mensajesNoLeidos = await Mensaje.find({ destino: usuario.matricula, status: false });

            console.log(req.session.id);
            res.render('menu_alumno_actualizarSeleccion', {
                nuevoUsuario: usuario,
                mensajesNoLeidos: mensajesNoLeidos
            });
        } catch (error) {
            console.log(error);
            res.render('404');
        }
    } else {
        res.render('login');
    }
});

router.post('/alumno/actualizarSeleccion', async (req, res) => {
    const { matricula, creditos_actuales, ueasSeleccionadas } = req.body;

    try {
        const usuario = await Usuario.findOne({ matricula: matricula });

        if (usuario) {
            // Actualizar los datos del usuario
            usuario.creditos_actuales = creditos_actuales;
            usuario.ueasSeleccionadas = ueasSeleccionadas;
            await usuario.save();

            res.status(200).json({ message: 'Datos de usuario actualizados correctamente' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar los datos del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


router.get('/alumno/riesgo', async (req, res) => {
    if (req.session && req.session.idUsuario) {
        //console.log("Id de la sesion: ", req.session.idUsuario);
        try {
            const usuario = await Usuario.findOne({ _id: req.session.idUsuario });
            const mensajesNoLeidos = await Mensaje.find({ destino: usuario.matricula, status: false });

            console.log(req.session.id);
            res.render('nivel_riesgo', {
                nuevoUsuario: usuario,
                mensajesNoLeidos: mensajesNoLeidos
            });
        } catch (error) {
            console.log(error);
            res.render('404');
        }
    } else {
        res.render('login');
    }
});

router.get('/alumno/recomendacion', async (req, res) => {
    if (req.session && req.session.idUsuario) {
        //console.log("Id de la sesion: ", req.session.idUsuario);
        try {
            const usuario = await Usuario.findOne({ _id: req.session.idUsuario });
            const mensajesNoLeidos = await Mensaje.find({ destino: usuario.matricula, status: false });

            console.log(req.session.id);
            res.render('recomendacion_materias', {
                nuevoUsuario: usuario,
                mensajesNoLeidos: mensajesNoLeidos
            });
        } catch (error) {
            console.log(error);
            res.render('404');
        }
    } else {
        res.render('login');
    }
});

router.get('/alumno/mensajes', async (req, res) => {
    if (req.session && req.session.idUsuario) {
        //console.log("Id de la sesion: ", req.session.idUsuario);
        try {
            const usuario = await Usuario.findOne({ _id: req.session.idUsuario });
            let mensajes = await Mensaje.find({ destino: usuario.matricula });
            let mensajesEnviados = await Mensaje.find({ origen: usuario.matricula });
            const mensajesNoLeidos = await Mensaje.find({ destino: usuario.matricula, status: false });

            // Ordenar los mensajes por día y  por hora
            mensajes.sort((a, b) => {
                const fechaA = new Date(parseDateString(a.fechaEnvio));
                const fechaB = new Date(parseDateString(b.fechaEnvio));
                const horaA = parseTimeString(a.horaEnvio);
                const horaB = parseTimeString(b.horaEnvio);
                if (fechaB.getTime() !== fechaA.getTime()) {
                    return fechaB - fechaA; // Orden descendente (los más recientes primero)
                } else {
                    return horaB - horaA;
                }
            });

            mensajesEnviados.sort((a, b) => {
                const fechaA = new Date(parseDateString(a.fechaEnvio));
                const fechaB = new Date(parseDateString(b.fechaEnvio));
                const horaA = parseTimeString(a.horaEnvio);
                const horaB = parseTimeString(b.horaEnvio);
                if (fechaB.getTime() !== fechaA.getTime()) {
                    return fechaB - fechaA; // Orden descendente (los más recientes primero)
                } else {
                    return horaB - horaA;
                }
            });

            console.log(req.session.id);
            res.render('mensajes_alumno', {
                nuevoUsuario: usuario,
                mensajes: mensajes,
                mensajesEnviados: mensajesEnviados,
                mensajesNoLeidos: mensajesNoLeidos
            });
        } catch (error) {
            console.log(error);
            res.render('404');
        }
    } else {
        res.render('login');
    }
});

router.post('/alumno/mensajes', async (req, res) => {
    const { origen, destino, status, titulo, cuerpo, fechaEnvio, horaEnvio } = req.body;
    //const mensaje = await Mensaje.findOne({ correo: correo });

    const alumnoDestino = await Usuario.findOne({ matricula: destino});
    const tutorDestino = await Tutor.findOne({ correo: destino });

    if( alumnoDestino || tutorDestino ){
        Mensaje.create({ origen: origen, destino: destino, status: status, titulo: titulo, cuerpo: cuerpo, fechaEnvio: fechaEnvio, horaEnvio: horaEnvio })
        .then(mensaje => {
            res.status(200).send('Mensaje Enviado');
        })
        .catch(err => {
            res.status(402).send('Error al enviar el mensaje :(');
        });
    }else{
        res.status(401).send();
    }
});

router.post('/alumno/mensajeLeido/:mensajeId', async (req, res) => {
    try {
        const mensajeId = new mongoose.Types.ObjectId(req.params.mensajeId);
        const mensaje = await Mensaje.findByIdAndUpdate(mensajeId, { status: true });
        res.status(200).send({ message: 'Mensaje marcado como leído correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error al marcar el mensaje como leído' });
    }
});

router.post('/alumno/mensajeEliminar/:mensajeId', async (req, res) => {
    try {
        const mensajeId = new mongoose.Types.ObjectId(req.params.mensajeId);
        const mensaje = await Mensaje.findByIdAndDelete(mensajeId);
        res.status(200).send({ message: 'Mensaje eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error al eliminar el mensaje' });
    }
});

router.get('/alumno/recomendacion/ueasSiguientes', async (req, res) => {
    /*const seriacion = req.query.seriacion;
    const uea = await Uea.find({seriacion: { $in: [seriacion] } });
    res.json(uea);
*/
    if (req.session && req.session.idUsuario) {
        const usuario = await Usuario.findOne({ _id: req.session.idUsuario });
        const ueasNuevas = await Uea.find({ seriacion: { $in: usuario.ueasSeleccionadas } })
        res.json(ueasNuevas);
    }

});

router.get('/alumno/recomendacionTutor/ueasSiguientes', async (req, res) => {
    /*const seriacion = req.query.seriacion;
    const uea = await Uea.find({seriacion: { $in: [seriacion] } });
    res.json(uea);
*/
    if (req.session && req.session.idUsuario) {
        const matricula = req.query.matricula;

        const usuario = await Usuario.findOne({ matricula: matricula });
        const ueasNuevas = await Uea.find({ seriacion: { $in: usuario.ueasSeleccionadas } })
        res.json(ueasNuevas);
    }

});

router.get('/alumno/recomendacion/ueasCreditos', async (req, res) => {
    if (req.session && req.session.idUsuario) {
        const ueasConCreditos = await Uea.find({ seriacion: { $regex: /Créditos/ } });
        res.json(ueasConCreditos);
    }
});


router.get('/alumno/calendarioCompartido', async (req, res) => {
    if (req.session && req.session.idUsuario) {
        console.log("Id de la sesion: ", req.session.idUsuario);
        try {
            const usuario = await Usuario.findOne({ _id: req.session.idUsuario });
            const tutor = await Tutor.findOne({ tutorados: { $in: usuario.matricula } });
            const mensajesNoLeidos = await Mensaje.find({ destino: usuario.matricula, status: false });

            console.log(req.session.id);
            if(tutor){
                res.render('menu_alumno_calendario', {
                    nuevoUsuario: usuario,
                    tutor: tutor,
                    mensajesNoLeidos: mensajesNoLeidos
                });
            }else{
                res.render('menu_alumno_calendario', {
                    nuevoUsuario: usuario,
                    tutor: "",
                    mensajesNoLeidos: mensajesNoLeidos
                });
            }
        } catch (error) {
            console.log(error);
            res.render('404');
        }
    } else {
        res.render('login');
    }
});

router.get('/alumno/traerCitas', async (req, res) => {
    if (req.session && req.session.idUsuario) {
        const tutor = req.query.tutor;
        try {
            const arrCitas = await Cita.find({ correo_tutor: tutor });
            res.json(arrCitas);
        } catch (error) {
            console.log(error);
            res.render('404');
        }
    } else {
        res.render('login');
    }
});


router.get('/tutor', async (req, res) => {
    if (req.session && req.session.idUsuario) {
        console.log("Id de la sesion: ", req.session.idUsuario);
        try {
            const tutor = await Tutor.findOne({ _id: req.session.idUsuario });
            const mensajesNoLeidos = await Mensaje.find({ destino: tutor.correo, status: false });

            console.log(req.session.id);
            res.render('menu_tutor', {
                nuevoUsuario: tutor,
                mensajesNoLeidos: mensajesNoLeidos
            });
        } catch (error) {
            console.log(error);
            res.render('404');
        }
    } else {
        res.render('login');
    }
});

router.get('/tutor/tutorados', async (req, res) => {
    if (req.session && req.session.idUsuario) {
        console.log("Id de la sesion: ", req.session.idUsuario);
        try {
            const tutor = await Tutor.findOne({ _id: req.session.idUsuario });
            const tutorados = await Usuario.find({ matricula: { $in: tutor.tutorados } })
            const mensajesNoLeidos = await Mensaje.find({ destino: tutor.correo, status: false });

            console.log(req.session.id);
            res.render('menu_tutor_tutorados', {
                nuevoUsuario: tutor,
                tutorados: tutorados,
                mensajesNoLeidos: mensajesNoLeidos
            });
        } catch (error) {
            console.log(error);
            res.render('404');
        }
    } else {
        res.render('login');
    }
});

router.post('/tutor/agregarTutorado', async (req, res) => {
    if (req.session && req.session.idUsuario) {
        try {
            const { matricula } = req.body;

            const tutor = await Tutor.findOne({ _id: req.session.idUsuario });
            const alumno = await Usuario.findOne({ matricula: matricula });

            if (tutor.tutorados.includes(matricula) || !alumno) {
                return res.status(400).send('Error al agregar :(');
            }

            // Encuentra el tutor por su ID y actualiza el array 'tutorados' agregando la nueva matrícula
            await Tutor.findOneAndUpdate(
                { _id: req.session.idUsuario }, // Busca por el ID del tutor
                { $push: { tutorados: matricula } }, // Agrega la nueva matrícula al array 'tutorados'
                { new: true } // Devuelve el documento actualizado
            );

            res.status(200).send('Matrícula agregada correctamente al tutor.');
        } catch (error) {
            console.log(error);
            res.status(402).send('Error al agregar la matrícula al tutor.');
        }
    } else {
        res.render('login');
    }
});

router.post('/tutor/eliminarTutorado/:matricula', async (req, res) => {
    if (req.session && req.session.idUsuario) {
        try {
            const matricula = req.params.matricula;
            await Tutor.updateOne(
                { _id: req.session.idUsuario },
                { $pull: { tutorados: matricula } }
            );

            res.status(200).send({ message: 'Matrícula eliminada correctamente del tutor.' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: 'Error al eliminar el mensaje' });
        }
    } else {
        res.render('login');
    }
});


router.get('/tutor/calendarioCompartido', async (req, res) => {
    if (req.session && req.session.idUsuario) {
        console.log("Id de la sesion: ", req.session.idUsuario);
        try {
            const tutor = await Tutor.findOne({ _id: req.session.idUsuario });
            const tutorados = await Usuario.find({ matricula: { $in: tutor.tutorados } })
            const mensajesNoLeidos = await Mensaje.find({ destino: tutor.correo, status: false });

            console.log(req.session.id);
            res.render('menu_tutor_calendario', {
                nuevoUsuario: tutor,
                tutorados: tutorados,
                mensajesNoLeidos: mensajesNoLeidos
            });
        } catch (error) {
            console.log(error);
            res.render('404');
        }
    } else {
        res.render('login');
    }
});


router.get('/tutor/traerCitas', async (req, res) => {
    if (req.session && req.session.idUsuario) {
        console.log("Id de la sesion: ", req.session.idUsuario);
        try {
            const tutor = await Tutor.findOne({ _id: req.session.idUsuario });
            const arrCitas = await Cita.find({ correo_tutor: tutor.correo });
            res.json(arrCitas);
        } catch (error) {
            console.log(error);
            res.render('404');
        }
    } else {
        res.render('login');
    }
});

router.post('/tutor/agendarCita', async (req, res) => {
    const { correo_tutor, id_cita, titulo, fechaInicio, fechaTermino, bgColor } = req.body;

    Cita.create({ correo_tutor: correo_tutor, id_cita: id_cita, titulo: titulo, fechaInicio: fechaInicio, fechaTermino: fechaTermino, bgColor: bgColor })
        .then(cita => {
            res.status(200).send('Cita agendada');
        })
        .catch(err => {
            res.status(402).send('Error al enviar el mensaje :(');
        });
});

router.post('/tutor/eliminarCita', async (req, res) => {
    const { id_cita } = req.body;
    try {
        const cita = await Cita.findOneAndDelete({ id_cita: id_cita });
        res.status(200).send({ message: 'Cita eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error al eliminar la cita' });
    }
});

router.post('/tutor/actualizarCita', async (req, res) => {
    const { id_cita, titulo, fechaInicio, fechaTermino } = req.body;
    try {
        const cita = await Cita.findOneAndUpdate(
            { id_cita: id_cita }, // criterio de búsqueda
            {
                titulo: titulo,
                fechaInicio: fechaInicio,
                fechaTermino: fechaTermino
            }, // nuevos valores
            { new: true } // para devolver el documento actualizado
        );
        res.status(200).send({ message: 'Cita actualizada correctamente'});
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error al actualizar la cita' });
    }
});


router.get('/tutor/mensajes', async (req, res) => {
    if (req.session && req.session.idUsuario) {
        //console.log("Id de la sesion: ", req.session.idUsuario);
        try {
            const usuario = await Tutor.findOne({ _id: req.session.idUsuario });
            let mensajes = await Mensaje.find({ destino: usuario.correo });
            let mensajesEnviados = await Mensaje.find({ origen: usuario.correo });
            const mensajesNoLeidos = await Mensaje.find({ destino: usuario.correo, status: false });

            // Ordenar los mensajes por día y  por hora
            mensajes.sort((a, b) => {
                const fechaA = new Date(parseDateString(a.fechaEnvio));
                const fechaB = new Date(parseDateString(b.fechaEnvio));
                const horaA = parseTimeString(a.horaEnvio);
                const horaB = parseTimeString(b.horaEnvio);
                if (fechaB.getTime() !== fechaA.getTime()) {
                    return fechaB - fechaA; // Orden descendente (los más recientes primero)
                } else {
                    return horaB - horaA;
                }
            });

            mensajesEnviados.sort((a, b) => {
                const fechaA = new Date(parseDateString(a.fechaEnvio));
                const fechaB = new Date(parseDateString(b.fechaEnvio));
                const horaA = parseTimeString(a.horaEnvio);
                const horaB = parseTimeString(b.horaEnvio);
                if (fechaB.getTime() !== fechaA.getTime()) {
                    return fechaB - fechaA; // Orden descendente (los más recientes primero)
                } else {
                    return horaB - horaA;
                }
            });

            console.log(req.session.id);
            res.render('mensajes_tutor', {
                nuevoUsuario: usuario,
                mensajes: mensajes,
                mensajesEnviados: mensajesEnviados,
                mensajesNoLeidos: mensajesNoLeidos
            });
        } catch (error) {
            console.log(error);
            res.render('404');
        }
    } else {
        res.render('login');
    }
});

router.post('/tutor/mensajes', async (req, res) => {
    const { origen, destino, status, titulo, cuerpo, fechaEnvio, horaEnvio } = req.body;
    //const mensaje = await Mensaje.findOne({ correo: correo });

    const alumnoDestino = await Usuario.findOne({ matricula: destino});
    const tutorDestino = await Tutor.findOne({ correo: destino });

    if( alumnoDestino || tutorDestino ){
        Mensaje.create({ origen: origen, destino: destino, status: status, titulo: titulo, cuerpo: cuerpo, fechaEnvio: fechaEnvio, horaEnvio: horaEnvio })
        .then(mensaje => {
            res.status(200).send('Mensaje Enviado');
        })
        .catch(err => {
            res.status(402).send('Error al enviar el mensaje :(');
        });
    }else{
        res.status(401).send();
    }
});

router.post('/tutor/mensajeLeido/:mensajeId', async (req, res) => {
    try {
        const mensajeId = new mongoose.Types.ObjectId(req.params.mensajeId);
        const mensaje = await Mensaje.findByIdAndUpdate(mensajeId, { status: true });
        res.status(200).send({ message: 'Mensaje marcado como leído correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error al marcar el mensaje como leído' });
    }
});

router.post('/tutor/mensajeEliminar/:mensajeId', async (req, res) => {
    try {
        const mensajeId = new mongoose.Types.ObjectId(req.params.mensajeId);
        const mensaje = await Mensaje.findByIdAndDelete(mensajeId);
        res.status(200).send({ message: 'Mensaje eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error al eliminar el mensaje' });
    }
});

router.get('/logout', async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Sesión cerrada con exito!")
            res.redirect('/'); // Redirigir a la página principal u otra página de inicio de sesión
        }
    });
});

// Funciones para ayudar ordenar los mensajes
function parseDateString(dateString) {
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day);
}

function parseTimeString(timeString) {
    const [hours, minutes, seconds] = timeString.split(':');
    return new Date(1970, 0, 1, hours, minutes, seconds);
}


export default router;
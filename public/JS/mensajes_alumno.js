let boolResponder = false;
// Función para hacer el envio del mensaje
function enviarMensaje(origen, destino, status, titulo, cuerpo, fechaActual, horaActual){
    const url = '/menu/alumno/mensajes';

    const data = {
        origen: origen,
        destino: destino,
        status: status,
        titulo: titulo,
        cuerpo: cuerpo,
        fechaEnvio: fechaActual,
        horaEnvio: horaActual
    };

    fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
    }).then(response => {
        if(response.status == 200){
            alert("Mensaje Enviado!")
            window.location.replace('/menu/alumno/mensajes');
        }else if(response.status == 401){
            alert('El destinatario no existe :(');
        }else{
            alert('Error desconocido, contacte al administrador');
        }
    }).catch(error => {
        console.log(error);
    });
}

//Prueba
document.getElementById('enviar-msj').addEventListener('click', () => {
    //let origen = "2193000496";
    //let destino = "tutor@azc.uam.mx";
    //let titulo = "Primer Mensaje";
    //let cuerpo = "Es el primer mensaje de prueba";
    //let fechaEnvio = "12/03/24 a las 9:16 a.m";

    let origen = document.getElementById('origen-envio').value;
    let destino = document.getElementById('destino-envio').value;
    let status = false;
    let titulo = document.getElementById('titulo-envio').value;
    let cuerpo = document.getElementById('cuerpo-envio').value;

    let fechaActual = new Date().toLocaleDateString('en-GB');
    let horaActual = new Date().toLocaleTimeString('en-GB', { hour12: false });
    //console.log(origen, destino, status, titulo, cuerpo, fechaEnvio)

    enviarMensaje(origen, destino, status, titulo, cuerpo, fechaActual, horaActual);
});

document.getElementById('no-enviarMsj').addEventListener('click', () => {
    if(boolResponder){
        window.location.reload();
    }
})


let btnsAbrirLeer = document.getElementsByClassName('abrir-leer');

for (let i = 0; i < btnsAbrirLeer.length; ++i) {
    btnsAbrirLeer[i].addEventListener('click', () => {
        boolResponder = false;
    });
}


// Cuando de leer mensaje que se actualice el status del mensaje a true (leido)
let btnsLeer = document.getElementsByClassName('leer-msj');

for (let i = 0; i < btnsLeer.length; ++i) {
    btnsLeer[i].addEventListener('click', () => {
        let msjID = document.getElementById('msj-id' + i).value; // Suponiendo que tengas un campo oculto con el ID del mensaje
        marcarMensajeLeido(msjID);
        console.log(msjID);
    });
}

function marcarMensajeLeido(mensajeId) {
    const url = `mensajeLeido/${mensajeId}`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al marcar el mensaje como leído');
        }
        window.location.replace('/menu/alumno/mensajes');
    })
    .catch(error => {
        console.error(error);
        // Manejar el error en caso de que ocurra
    });
}

function marcarMensajeLeidoAlResponder(mensajeId) {
    const url = `mensajeLeido/${mensajeId}`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al marcar el mensaje como leído');
        }
    })
    .catch(error => {
        console.error(error);
        // Manejar el error en caso de que ocurra
    });
}

// Para el boton que elimine mensajes
let btnsEliminar = document.getElementsByClassName('btn-eliminar-msj');

for (let i = 0; i < btnsEliminar.length; ++i) {
    btnsEliminar[i].addEventListener('click', () => {
        let msjID = document.getElementById('msj-id' + i).value; // Suponiendo que tengas un campo oculto con el ID del mensaje
        eliminarMensaje(msjID);
        console.log(msjID);
    });
}

function eliminarMensaje(mensajeId) {
    const url = `mensajeEliminar/${mensajeId}`;

    if(confirm("¿Seguro que quieres eliminar este mensaje?")){
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el mensaje');
            }
            window.location.replace('/menu/alumno/mensajes');
        })
        .catch(error => {
            console.error(error);
        });
    }
}

// Función para responder a un mensaje
let btnsResponder = document.getElementsByClassName('responder-msj');

for (let i = 0; i < btnsResponder.length; ++i) {
    btnsResponder[i].addEventListener('click', () => {
        let modal = new bootstrap.Modal(document.getElementById('exampleModal'));
        let destino = document.getElementById('destino-envio');
        destino.value = document.getElementById('origen-msj' + i).textContent;
        boolResponder = true;
        modal.show();
        let msjID = document.getElementById('msj-id' + i).value; // Suponiendo que tengas un campo oculto con el ID del mensaje
        marcarMensajeLeidoAlResponder(msjID);
    });
}
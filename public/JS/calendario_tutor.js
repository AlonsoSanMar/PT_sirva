document.addEventListener('DOMContentLoaded', async function () {

    const response = await fetch(`/menu/tutor/traerCitas`);
    const data = await response.json();
    console.log(data.length);

    let calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        eventClick: function (event) {
            let id = event.event.id;
            let title = event.event.title;
            let start = event.event.start;
            let end = event.event.end;
            console.log("id: ", id);

            // Llenamos con los datos del evento
            let eventNameUPD = document.getElementById('eventNameUPD');
            eventNameUPD.value = title;

            let eventDateUPD = document.getElementById('eventDateUPD');
            eventDateUPD.value = start.toISOString().slice(0, 16);

            let eventDateFinalUPD = document.getElementById('eventDateFinalUPD');
            eventDateFinalUPD.value = end.toISOString().slice(0, 16);

            // Obtener referencia al modal
            let eventModal = new bootstrap.Modal(document.getElementById('modalActualiza'));

            // Mostrar el modal
            eventModal.show();

            let btnEliminar = document.getElementById('eliminar-evento');
            btnEliminar.onclick = function () {
                if (confirm("¿Quieres eliminar esta cita?")) {
                    const url = 'eliminarCita';
                    const data = {
                        id_cita: id,
                    };

                    fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(response => {
                        if (response.status == 200) {
                            alert("Cita Eliminada!")
                            window.location.replace('/menu/tutor/calendarioCompartido');
                        } else if (response.status == 401) {
                            alert('Error :(');
                        } else {
                            alert('Error desconocido, contacte al administrador');
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                }
            };

            let btnActualizar = document.getElementById('actualizar');
            btnActualizar.onclick = function () {
                if (confirm("¿Quieres actualizar esta cita?")) {
                    const url = 'actualizarCita';

                    const data = {
                        id_cita: id,
                        titulo: eventNameUPD.value,
                        fechaInicio: eventDateUPD.value,
                        fechaTermino: eventDateFinalUPD.value,
                    };

                    fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(response => {
                        if (response.status == 200) {
                            alert("Cita Actualizada!")
                            window.location.replace('/menu/tutor/calendarioCompartido');
                        } else if (response.status == 401) {
                            alert('Error :(');
                        } else {
                            alert('Error desconocido, contacte al administrador');
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                }
            };
        }
    });

    // Agregar eventos traidos desde la base
    if (data.length > 0) {
        for (let i = 0; i < data.length; ++i) {
            let evento = {
                id: data[i].id_cita,
                title: data[i].titulo,
                start: data[i].fechaInicio,
                end: data[i].fechaTermino,
                backgroundColor: data[i].bgColor
            }
            calendar.addEvent(evento);
        }
    }

    calendar.render();
});

function generarIdUnico() {
    return Math.random().toString(36).substring(2, 10);
}

// Para agendar fechas
function agendar() {
    let correo_tutor = document.getElementById('correo-tutor').value;
    let id_cita = generarIdUnico();
    let titulo = document.getElementById('eventName').value;
    let fechaInicio = document.getElementById('eventDate').value;
    let fechaTermino = document.getElementById('eventDateFinal').value;
    let bgColor = document.getElementById('bgColor').value;

    let inpTitulo = document.getElementById('eventName');
    let inpInicio = document.getElementById('eventDate');
    let inpTermino = document.getElementById('eventDateFinal');

    if (titulo != "" && fechaInicio != "" && fechaTermino != "") {
        inpTitulo.classList.remove('is-invalid');
        inpInicio.classList.remove('is-invalid');
        inpTermino.classList.remove('is-invalid');

        const url = 'agendarCita';

        const data = {
            correo_tutor: correo_tutor,
            id_cita: id_cita,
            titulo: titulo,
            fechaInicio: fechaInicio,
            fechaTermino: fechaTermino,
            bgColor: bgColor
        };

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status == 200) {
                alert("Cita Agendada!")
                window.location.replace('/menu/tutor/calendarioCompartido');
            } else if (response.status == 401) {
                alert('Error :(');
            } else {
                alert('Error desconocido, contacte al administrador');
            }
        }).catch(error => {
            console.log(error);
        });
    } else {
        inpTitulo.classList.add('is-invalid');
        inpInicio.classList.add('is-invalid');
        inpTermino.classList.add('is-invalid');
    }
}

document.getElementById('agendar').addEventListener('click', agendar);



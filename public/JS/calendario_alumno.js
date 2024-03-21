document.addEventListener('DOMContentLoaded', async function () {
    const tutor = document.getElementById('correo-tutor').value;
    const response = await fetch(`/menu/alumno/traerCitas?tutor=${tutor}`);
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

            let  eventDateFinalUPD = document.getElementById('eventDateFinalUPD');
            eventDateFinalUPD.value = end.toISOString().slice(0, 16);

            // Obtener referencia al modal
            let eventModal = new bootstrap.Modal(document.getElementById('modalActualiza'));

            // Mostrar el modal
            eventModal.show();
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
                color: data[i].bgColor
            }
            calendar.addEvent(evento);
        }
    }

    calendar.render();
});




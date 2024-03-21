function agregarTutorado(matricula) {
    const url = '/menu/tutor/agregarTutorado';

    const data = {
        matricula: matricula
    };

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.status == 200) {
            alert("Tutorado agregado!")
            window.location.replace('/menu/tutor/tutorados');
        } else if (response.status == 400) {
            alert('Error al agregar. Verifique que la matricula sea la correcta');
        } else {
            alert('Error desconocido, contacte al administrador');
        }
    }).catch(error => {
        console.log(error);
    });
}

function eliminarTutorado(matricula) {
    const url = `eliminarTutorado/${matricula}`;

    if (confirm("¿Seguro que quieres eliminar está tutoría?")) {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar la tutoría');
                }
                alert("Eliminado correctamente!")
                window.location.replace('/menu/tutor/tutorados');
            })
            .catch(error => {
                console.error(error);
            });
    }
}

function limpiaContUeas(i){
    const contenedor = document.getElementById('cont-seleccion' + i);
    while(contenedor.hasChildNodes()){
        contenedor.removeChild(contenedor.firstChild);
    }
}

// Para agregar un tutorado
document.getElementById('agregar-tutorado').addEventListener('click', () => {
    let matricula = document.getElementById('nueva-matricula');
    //console.log(origen, destino, status, titulo, cuerpo, fechaEnvio)

    let regex = /^21[0-9][1-3][0-9]{6}$|^22[0-4][1-3][0-9]{6}$/;
    if (!regex.test(matricula.value)) {
        matricula.classList.add('is-invalid');
    } else {
        matricula.classList.remove('is-invalid');
        agregarTutorado(matricula.value);
    }
})

//Para eliminar tutorados
let btnsEliminarTutorado = document.getElementsByClassName('btn-eliminar-tutorado');

for (let i = 0; i < btnsEliminarTutorado.length; ++i) {
    btnsEliminarTutorado[i].addEventListener('click', () => {
        let matricula = document.getElementById('matricula-tutorado' + i).textContent; // Suponiendo que tengas un campo oculto con el ID del mensaje
        eliminarTutorado(matricula);
        console.log(matricula);
    });
}


/*Todo le script para consultar el tutorado */

// Funciones para mostrar el nivel de riesgo
let btnsConsultarTutorado = document.getElementsByClassName('btn-consultar-tutorado');
let creditos, anioIngreso, periodo = 0;

for (let i = 0; i < btnsConsultarTutorado.length; ++i) {
    btnsConsultarTutorado[i].addEventListener('click', () => {
        creditos = document.getElementById('creditos_actuales' + i).value;
        anioIngreso = document.getElementById('anio_ingreso' + i).value;
        periodo = document.getElementById('periodo' + i).value;
        limpiaContUeas(i);
        cargaPagina(i);
    });
}

async function cargaPagina(i) {

    function trimestresConcluidos(arrExtendido) {
        let distancia = 12;
        // Encuentra los índices de los elementos buscados
        const indice2024Invierno = arrExtendido.indexOf('2024-Invierno');
        const indiceInicial = arrExtendido.indexOf(anioIngreso + "-" + periodo);

        if (indice2024Invierno !== -1 && indiceInicial !== -1) {
            // Calcula la distancia entre los índices
            distancia = Math.abs(indice2024Invierno - indiceInicial);
        } else if (indice2024Invierno == -1) {
            distancia = 12;
        }

        //console.log("Distancia entre '2024-Invierno' y '2022-Otoño':", distancia);
        porcentajeConRespectoIngreso = (distancia * 100) / 12;
    }



    function checaPorcentaje() {
        let msjPorcentaje = document.getElementById('msj-progreso-anio' + i);
        if (porcentajeConRespectoIngreso > 0 && porcentajeConRespectoIngreso < 20) {
            msjPorcentaje.textContent = "Actualmente en los trimestres [1 - 2]";
            msjPorcentaje.classList.add('bg-warning');
            msjPorcentaje.classList.add('border-warning');
        } else if (porcentajeConRespectoIngreso > 20 && porcentajeConRespectoIngreso < 50) {
            msjPorcentaje.textContent = "Actualmente en los trimestres [3 - 5]";
            msjPorcentaje.classList.add('bg-danger');
            msjPorcentaje.classList.add('border-danger');
        } else if (porcentajeConRespectoIngreso > 50 && porcentajeConRespectoIngreso < 80) {
            msjPorcentaje.textContent = "Actualmente en los trimestres [6 - 7]";
            msjPorcentaje.classList.add('bg-danger');
            msjPorcentaje.classList.add('border-danger');
        } else if (porcentajeConRespectoIngreso > 80 && porcentajeConRespectoIngreso < 100) {
            msjPorcentaje.textContent = "Actualmente en los trimestres [8 - 11]";
            msjPorcentaje.classList.add('bg-warning');
            msjPorcentaje.classList.add('border-warning');
        }
        else if (porcentajeConRespectoIngreso >= 100) {
            msjPorcentaje.textContent = "12 trimestres cumplidos";
            msjPorcentaje.classList.add('bg-success');
            msjPorcentaje.classList.add('border-success');
            porcentajeConRespectoIngreso = 100;
        }
        //console.log(parseInt(porcentajeConRespectoIngreso))

        let number = document.getElementById('number' + i);
        let counter = 0;
        setInterval(() => {
            if (counter == parseInt(porcentajeConRespectoIngreso)) {
                clearInterval();
            } else {
                counter += 1;
                number.innerHTML = counter + "%";
            }
        }, 30)
    }


    let riesgo = document.getElementById('nivelRiesgo' + i);
    let imgRiesgo = document.getElementById('img-riesgo' + i);

    const avancePor = parseInt((creditos * 100) / 472);
    //console.log(avancePor);

    riesgo.style.width = avancePor + "%";
    riesgo.setAttribute('aria-valuenow', avancePor);
    if (imgRiesgo) {
        imgRiesgo.style.left = avancePor + "%";
    }


    // Para el Progress bar circular

    let porcentajeConRespectoIngreso = 0;


    // Para obtener el %%%
    let aumentoAnio = 0;
    if (periodo == 'Primavera') {
        let arr = ['-Primavera', '-Otoño', '-Invierno'];
        let arrExtendido = [];
        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < arr.length; ++j) {
                if (arr[j].includes('Invierno')) {
                    aumentoAnio += 1;
                    arrExtendido.push((aumentoAnio + parseInt(anioIngreso)) + arr[j])
                } else {
                    arrExtendido.push((aumentoAnio + parseInt(anioIngreso)) + arr[j])
                }
            }
        }
        //console.log(arrExtendido);
        trimestresConcluidos(arrExtendido);
    } else if (periodo == 'Otoño') {
        let arr = ['-Otoño', '-Invierno', '-Primavera'];
        let arrExtendido = [];
        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < arr.length; ++j) {
                if (arr[j].includes('Invierno')) {
                    aumentoAnio += 1;
                    arrExtendido.push((aumentoAnio + parseInt(anioIngreso)) + arr[j])
                } else {
                    arrExtendido.push((aumentoAnio + parseInt(anioIngreso)) + arr[j])
                }
            }
        }
        //console.log(arrExtendido);
        trimestresConcluidos(arrExtendido);
    } else {
        let arr = ['-Invierno', '-Primavera', '-Otoño'];
        let arrExtendido = [];
        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < arr.length; ++j) {
                if (arr[j].includes('Invierno')) {
                    aumentoAnio += 1;
                    arrExtendido.push((aumentoAnio + parseInt(anioIngreso)) + arr[j])
                } else {
                    arrExtendido.push((aumentoAnio + parseInt(anioIngreso)) + arr[j])
                }
            }
        }
        //console.log(arrExtendido);
        trimestresConcluidos(arrExtendido);
    }


    checaPorcentaje();

    // Obtén una referencia al círculo SVG
    const circle = document.getElementById('circulo' + i);

    const strokeDashOffset = parseInt(472 - (472 * (parseFloat(porcentajeConRespectoIngreso) / 100)));
    console.log("Lo de la vuelta", strokeDashOffset);

    //Agregamos el stroke para que sea distinto para cada circulo
    circle.style.stroke = `url(#GradientColor${i})`;

    circle.style.setProperty('--stroke-dash-offset', `${strokeDashOffset}`);
    // Agrega la animación
    circle.style.animation = "anim 2s linear forwards";
    // Agrega los estilos de animación
    const style = document.createElement('style');
    style.textContent = `
    @keyframes anim {
        100% {
            stroke-dashoffset: var(--stroke-dash-offset, 0);
        }
    }
`;
    document.head.appendChild(style);




    //---------------------------------------------

    // Para el mensaje correspondiente al nivel de creditos
    let contMsjCreditos = document.getElementById('msj-progreso-creditos' + i);
    function mostrarMsjCreditos() {
        //let msj = document.createElement('p');
        // Aquí es checar el porcentaje y modificar el mensaje para que sea de acuerdo a su avance con algunas recomendaciones

        if (avancePor > 80) {
            contMsjCreditos.classList.add('border-success');
            contMsjCreditos.classList.add('bg-success');
        } else if (avancePor > 35 && avancePor < 80) {
            contMsjCreditos.classList.add('border-warning');
            contMsjCreditos.classList.add('bg-warning');
        } else if (avancePor > 0 && avancePor < 35) {
            contMsjCreditos.classList.add('border-danger');
            contMsjCreditos.classList.add('bg-danger');
        }

        contMsjCreditos.textContent = "Porcentaje de créditos actual: " + avancePor + "%";

        //contMsjCreditos.appendChild(msj);
    }

    mostrarMsjCreditos();


    // Para el tooltip
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

    // Para mostrar como tal la uea seleccionada
    async function traerUea() {
        const cont = document.getElementById('cont-ueas' + i);
        const hijos = cont.children;
        for (let j = 0; j < hijos.length; j++) {
            const c = hijos[j].textContent;
            const response = await fetch(`/registro/buscaUea?clave=${c.trim()}`);
            const data = await response.json();
            //console.log(data);

            const contenedor = document.getElementById('cont-seleccion' + i);

            const elemento = document.createElement('div');
            elemento.classList.add('card');
            elemento.classList.add('cont-uea-padre');
            //elemento.classList.add('u');
            elemento.setAttribute('id', 'id-' + data[0].clave);

            const elementoHijo = document.createElement('div');
            elementoHijo.classList.add('card-body');
            elementoHijo.classList.add('u');
            elementoHijo.classList.add('d-flex');
            elementoHijo.classList.add('flex-column');
            elementoHijo.classList.add('justify-content-between');
            elementoHijo.classList.add('align-items-center');

            let nombre = document.createElement('p');
            nombre.textContent = data[0].nombre;

            let clave = document.createElement('p');
            clave.textContent = "Clave: " + data[0].clave;

            let creditos = document.createElement('p');
            creditos.textContent = "Creditos: " + data[0].creditos;

            let tipo = document.createElement('p');
            tipo.textContent = "Tipo: " + data[0].tipo;

            elementoHijo.appendChild(nombre);
            elementoHijo.appendChild(clave);
            elementoHijo.appendChild(creditos);
            elementoHijo.appendChild(tipo);

            elemento.appendChild(elementoHijo);

            contenedor.appendChild(elemento);

        }
    }

    await traerUea();
}


// Para mostrar las ueas de cada tutorado



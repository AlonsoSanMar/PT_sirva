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

function limpiaContUeas(i) {
    const contenedor = document.getElementById('cont-seleccion' + i);
    while (contenedor.hasChildNodes()) {
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

        let numberAvance = document.getElementById('number-avance' + i);
        let counterAvance = 0;
        setInterval(() => {
            if (counterAvance == parseInt(avancePor)) {
                clearInterval();
            } else {
                counterAvance += 1;
                numberAvance.innerHTML = counterAvance + "%";
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
    let style = document.createElement('style');
    style.textContent = `
    @keyframes anim {
        100% {
            stroke-dashoffset: var(--stroke-dash-offset, 0);
        }
    }
`;
    document.head.appendChild(style);

    // Obtén una referencia al círculo SVG
    const circleAvance = document.getElementById('circulo-avance' + i);

    const strokeAvance = parseInt(472 - (472 * (parseFloat(avancePor) / 100)));

    circleAvance.style.stroke = `url(#GradientColor${i})`;

    circleAvance.style.setProperty('--stroke-dash-offset', `${strokeAvance}`);
    // Agrega la animación
    circleAvance.style.animation = "anim 2s linear forwards";
    // Agrega los estilos de animación
    style = document.createElement('style');
    style.textContent = `
    @keyframes anim {
        100% {
            stroke-dashoffset: var(--stroke-dash-offset, 0);
        }
    }
`;
    document.head.appendChild(style);


    //---------------------------------------------



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


//-------------------------------------------------

// Para la recomendacion de materias



//const ueas_seleccionadas = document.getElementById('ueasSeleccionadas').textContent;
let ueas_seleccionadas = '';
let creditos_posibles = '';
let arreglo_ueas = [];
//let arreglo_ueas = [];
//const creditos_posibles = document.getElementById('creditos_actuales').textContent;
//const arreglo_ueas = ueas_seleccionadas.trim().split(",");
let ueas_posibles_directas = [];
let ueasMenoresAcreditosActuales = [];

let tooltipTriggerList = '';

// Mandamos traer todas las ueas que tienen como seriacion las actuales que lleva el usuario
async function ueasNuevas(arreglo_ueas, carga, tipo, index) {
    console.log("El i = ", index);
    try {
        ueas_seleccionadas = document.getElementById('cont-ueas' + index);
        let elementos_p = ueas_seleccionadas.getElementsByTagName("p");
        creditos_posibles = document.getElementById('creditos_actuales' + index).value;
        console.log("Creditos posibles", creditos_posibles);

        for (let i = 0; i < elementos_p.length; ++i) {
            let texto = elementos_p[i].textContent.trim();
            arreglo_ueas.push(texto);
        }

        //arreglo_ueas = ueas_seleccionadas.trim();
        console.log("ueas que lleva", arreglo_ueas);
        let matricula = document.getElementById('matricula-tutorado' + index).textContent;

        const response = await fetch(`/menu/alumno/recomendacionTutor/ueasSiguientes?matricula=${matricula}`);
        const data = await response.json();

        ueas_posibles_directas = data;
        console.log(ueas_posibles_directas); // Aquí se imprimirán los datos correctamente
        ueasNuevasCreditos(ueas_posibles_directas, carga, tipo, index);
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
}

async function ueasNuevasCreditos(ueas_posibles_directas, carga, tipo, index) {
    try {
        const response = await fetch(`/menu/alumno/recomendacion/ueasCreditos`);
        const data = await response.json();
        console.log("nuevas ", ueas_posibles_directas);
        // Filtrar los elementos de data donde la propiedad seriacion es menor a 200 Créditos
        ueasMenoresAcreditosActuales = data.filter(uea => {
            for (let valor of uea.seriacion) {
                const match = valor.match(/\d+/);
                if (match && parseInt(match[0]) < creditos_posibles) {
                    return true;
                }
            }
            return false;
        });

        //console.log(ueasMenoresAcreditosActuales);
        // Traer las ueas que tengan coregistro y dejarlas en un arreglo aparte
        let ueas_de_coregistro = await verificaCoregistro(ueas_posibles_directas);
        verificarSeriacionesCoregistro(ueas_de_coregistro, ueas_posibles_directas);

        console.log("ueas", ueasMenoresAcreditosActuales);

        ueas_posibles_directas = ueas_posibles_directas.concat(ueasMenoresAcreditosActuales);
        quitarUeasActuales(ueas_posibles_directas);
        verificarSeriaciones(ueas_posibles_directas);

        // Aqui obtenemos y verificamos las 3 recomendaciones
        let ueas_posibles_recoUno = ajustarNivelDeCarga(ueas_posibles_directas, carga, tipo, ueas_de_coregistro);
        verificarSeriaciones(ueas_posibles_recoUno);
        mostrarUeasDirectas(ueas_posibles_recoUno, 1, index);

        // Para el tooltip
        tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
}

async function verificaCoregistro(ueas_posibles_directas) {
    let ueas_con_coregistro = [];
    let fetchPromises = [];

    ueas_posibles_directas.forEach(e => {
        if (e.coregistro.length > 0) {
            e.coregistro.forEach(clave => {
                fetchPromises.push(
                    fetch(`/registro/buscaUea?clave=${clave}`)
                        .then(response => response.json())
                        .then(data => {
                            ueas_con_coregistro.push(data[0]);
                        })
                );
            });
        }
    });

    // Esperar a que todas las solicitudes fetch se completen
    await Promise.all(fetchPromises);

    return ueas_con_coregistro;
}



function ajustarNivelDeCarga(ueas_posibles_directas, carga, tipo, ueas_de_coregistro) {
    let creditosCarga = 0;

    let tipo_contrario_minimo = Math.floor(Math.random() * 2) + 1;
    let totalOBL = ueas_posibles_directas.filter(function (uea) { return uea.tipo === 'OBL'; });
    let totalOPT = ueas_posibles_directas.filter(function (uea) { return uea.tipo === 'OPT'; });

    let ueas_con_carga = [];

    let limite = 100;
    let maximaCargaMinima = Math.floor(Math.random() * (20 - 15 + 1)) + 20;
    let maximaCargaModerada = Math.floor(Math.random() * (40 - 30 + 1)) + 30;
    let maximaCargaIntensa = Math.floor(Math.random() * (54 - 50 + 1)) + 50;

    console.log("ueas de coregistro", ueas_de_coregistro);

    if (tipo == "") {
        tipo_contrario_minimo = 0;
    }

    console.log("tipo contrario minimo: " + tipo_contrario_minimo);

    if (carga == 'minima') {
        while (creditosCarga < maximaCargaMinima && ueas_posibles_directas.length > 0 && limite > 0) {
            if (limite == 1) {
                console.log("no pude llenar");
                let ueas_restantes = tipo == "OBL" ? ueas_posibles_directas.filter(uea => uea.tipo == "OPT") : ueas_posibles_directas.filter(uea => uea.tipo == "OBL");
                //ueas_restantes = ueas_posibles_directas.filter(uea => uea.tipo == "OPT");
                ueas_restantes.sort(() => Math.random() - 0.5);
                //Que repase uno a uno cada uea de ueas_posibles_directas y añada las que no están
                for (let i = 0; i < ueas_restantes.length; ++i) {
                    if (!ueas_con_carga.find(uea => uea.clave == ueas_restantes[i].clave)) {
                        if (ueas_restantes[i].coregistro.length == 0) {
                            console.log("Se agrego: ", ueas_restantes[i].nombre);
                            ueas_con_carga.push(ueas_restantes[i]);
                            creditosCarga += parseInt(ueas_restantes[i].creditos);
                            break;
                        }
                    }
                }
                continue;
            }

            const indiceAleatorio = Math.floor(Math.random() * ueas_posibles_directas.length);
            if (ueas_con_carga.includes(ueas_posibles_directas[indiceAleatorio])) {
                continue;
            }
            if ((creditosCarga + parseInt(ueas_posibles_directas[indiceAleatorio].creditos)) <= maximaCargaMinima && (tipo == ueas_posibles_directas[indiceAleatorio].tipo || tipo == "")) {
                if (tipo != ueas_posibles_directas[indiceAleatorio].tipo || tipo != "") {
                    tipo_contrario_minimo -= 1;
                    if (tipo_contrario_minimo < 0) {
                        if (totalOBL > 0) {
                            continue;
                        }
                    }
                }
                if (ueas_posibles_directas[indiceAleatorio].coregistro > 0) {
                    ueas_con_carga.push(ueas_posibles_directas[indiceAleatorio]);
                    creditosCarga += parseInt(ueas_posibles_directas[indiceAleatorio].creditos);
                    for (let i = 0; i < ueas_posibles_directas[indiceAleatorio].coregistro.length; ++i) {
                        let ueaCorreq = ueas_de_coregistro.find(uea => uea.clave === ueas_posibles_directas[indiceAleatorio].coregistro[i]);
                        if (ueaCorreq) {
                            console.log("Si existe la uea con coregistro");
                            if (ueas_con_carga.find(uea => uea.clave === ueaCorreq.clave)) {
                                console.log("No se agrega por que ya estaba");
                            } else {
                                ueas_con_carga.push(ueaCorreq);
                                creditosCarga += parseInt(ueaCorreq.creditos);
                            }
                        }
                    }
                } else {
                    if (ueas_con_carga.find(uea => uea.clave === ueas_posibles_directas[indiceAleatorio].clave)) {
                        console.log("No se agrega por que ya estaba");
                    } else {
                        ueas_con_carga.push(ueas_posibles_directas[indiceAleatorio]);
                        creditosCarga += parseInt(ueas_posibles_directas[indiceAleatorio].creditos);
                    }
                    /*ueas_con_carga.push(ueas_posibles_directas[indiceAleatorio]);
                    creditosCarga += parseInt(ueas_posibles_directas[indiceAleatorio].creditos);*/
                }


                //ueas_posibles_directas.splice(indiceAleatorio, 1);
            }

            limite -= 1;
        }
    } else if (carga == 'moderada') {
        while (creditosCarga < maximaCargaModerada && ueas_posibles_directas.length > 0 && limite > 0) {
            if (limite == 1) {
                console.log("no pude llenar");
                let ueas_restantes = tipo == "OBL" ? ueas_posibles_directas.filter(uea => uea.tipo == "OPT") : ueas_posibles_directas.filter(uea => uea.tipo == "OBL");
                //ueas_restantes = ueas_posibles_directas.filter(uea => uea.tipo == "OPT");
                ueas_restantes.sort(() => Math.random() - 0.5);
                //Que repase uno a uno cada uea de ueas_posibles_directas y añada las que no están
                for (let i = 0; i < ueas_restantes.length; ++i) {
                    if ((parseInt(ueas_restantes[i].creditos) + creditosCarga) < maximaCargaModerada) {
                        if (!ueas_con_carga.find(uea => uea.clave == ueas_restantes[i].clave)) {
                            if (ueas_restantes[i].coregistro.length == 0) {
                                console.log("Se agrego: ", ueas_restantes[i].nombre);
                                ueas_con_carga.push(ueas_restantes[i]);
                                creditosCarga += parseInt(ueas_restantes[i].creditos);
                            }
                        }
                    }
                }
                limite -= 1;
                continue;
            }

            const indiceAleatorio = Math.floor(Math.random() * ueas_posibles_directas.length);
            if (ueas_con_carga.includes(ueas_posibles_directas[indiceAleatorio])) {
                continue;
            }
            if ((creditosCarga + parseInt(ueas_posibles_directas[indiceAleatorio].creditos)) <= maximaCargaMinima && (tipo == ueas_posibles_directas[indiceAleatorio].tipo || tipo == "")) {
                if (ueas_posibles_directas[indiceAleatorio].coregistro > 0) {
                    ueas_con_carga.push(ueas_posibles_directas[indiceAleatorio]);
                    creditosCarga += parseInt(ueas_posibles_directas[indiceAleatorio].creditos);
                    for (let i = 0; i < ueas_posibles_directas[indiceAleatorio].coregistro.length; ++i) {
                        let ueaCorreq = ueas_de_coregistro.find(uea => uea.clave === ueas_posibles_directas[indiceAleatorio].coregistro[i]);
                        if (ueaCorreq) {
                            console.log("Si existe la uea con coregistro");
                            if (ueas_con_carga.find(uea => uea.clave === ueaCorreq.clave)) {
                                console.log("No se agrega por que ya estaba");
                            } else {
                                ueas_con_carga.push(ueaCorreq);
                                creditosCarga += parseInt(ueaCorreq.creditos);
                            }
                        }
                    }
                } else {
                    if (ueas_con_carga.find(uea => uea.clave === ueas_posibles_directas[indiceAleatorio].clave)) {
                        console.log("No se agrega por que ya estaba");
                    } else {
                        ueas_con_carga.push(ueas_posibles_directas[indiceAleatorio]);
                        creditosCarga += parseInt(ueas_posibles_directas[indiceAleatorio].creditos);
                    }
                    /*ueas_con_carga.push(ueas_posibles_directas[indiceAleatorio]);
                    creditosCarga += parseInt(ueas_posibles_directas[indiceAleatorio].creditos);*/
                }


                //ueas_posibles_directas.splice(indiceAleatorio, 1);
            }

            limite -= 1;
        }
    } else if (carga == 'intensa') {
        while (creditosCarga < maximaCargaIntensa && ueas_posibles_directas.length > 0 && limite > 0) {
            //Si el limite ya es 0, que se agreguen aquellas materias que falten (si es que hay)
            if (limite == 1) {
                console.log("no pude llenar");
                let ueas_restantes = tipo == "OBL" ? ueas_posibles_directas.filter(uea => uea.tipo == "OPT") : ueas_posibles_directas.filter(uea => uea.tipo == "OBL");
                //ueas_restantes = ueas_posibles_directas.filter(uea => uea.tipo == "OPT");
                ueas_restantes.sort(() => Math.random() - 0.5);
                //Que repase uno a uno cada uea de ueas_posibles_directas y añada las que no están
                for (let i = 0; i < ueas_restantes.length; ++i) {
                    if ((parseInt(ueas_restantes[i].creditos) + creditosCarga) < maximaCargaIntensa) {
                        if (!ueas_con_carga.find(uea => uea.clave == ueas_restantes[i].clave)) {
                            if (ueas_restantes[i].coregistro.length == 0) {
                                console.log("Se agrego: ", ueas_restantes[i].nombre);
                                ueas_con_carga.push(ueas_restantes[i]);
                                creditosCarga += parseInt(ueas_restantes[i].creditos);
                            }
                        }
                    }
                }
                limite -= 1;
                continue;
            }

            const indiceAleatorio = Math.floor(Math.random() * ueas_posibles_directas.length);
            if (ueas_con_carga.includes(ueas_posibles_directas[indiceAleatorio])) {
                continue;
            }
            if ((creditosCarga + parseInt(ueas_posibles_directas[indiceAleatorio].creditos)) <= maximaCargaMinima && (tipo == ueas_posibles_directas[indiceAleatorio].tipo || tipo == "")) {
                if (ueas_posibles_directas[indiceAleatorio].coregistro > 0) {
                    ueas_con_carga.push(ueas_posibles_directas[indiceAleatorio]);
                    creditosCarga += parseInt(ueas_posibles_directas[indiceAleatorio].creditos);
                    for (let i = 0; i < ueas_posibles_directas[indiceAleatorio].coregistro.length; ++i) {
                        let ueaCorreq = ueas_de_coregistro.find(uea => uea.clave === ueas_posibles_directas[indiceAleatorio].coregistro[i]);
                        if (ueaCorreq) {
                            console.log("Si existe la uea con coregistro");
                            if (ueas_con_carga.find(uea => uea.clave === ueaCorreq.clave)) {
                                console.log("No se agrega por que ya estaba");
                            } else {
                                ueas_con_carga.push(ueaCorreq);
                                creditosCarga += parseInt(ueaCorreq.creditos);
                            }
                        }
                    }
                } else {
                    if (ueas_con_carga.find(uea => uea.clave === ueas_posibles_directas[indiceAleatorio].clave)) {
                        console.log("No se agrega por que ya estaba");
                    } else {
                        ueas_con_carga.push(ueas_posibles_directas[indiceAleatorio]);
                        creditosCarga += parseInt(ueas_posibles_directas[indiceAleatorio].creditos);
                    }
                    /*ueas_con_carga.push(ueas_posibles_directas[indiceAleatorio]);
                    creditosCarga += parseInt(ueas_posibles_directas[indiceAleatorio].creditos);*/
                }


                //ueas_posibles_directas.splice(indiceAleatorio, 1);
            }

            limite -= 1;
        }
    } else {
        ueas_posibles_directas = [];
    }

    console.log("Total de creditos: " + creditosCarga);
    return ueas_con_carga;
}

function quitarUeasActuales(ueas_posibles_directas) {
    for (let i = 0; i < ueas_posibles_directas.length; ++i) {
        for (let j = 0; j < arreglo_ueas.length; ++j) {
            if (arreglo_ueas[j].includes(ueas_posibles_directas[i].clave)) {
                console.log("Uea que llevas actual no posible llevarla otra vez: ", ueas_posibles_directas[i]);
                ueas_posibles_directas.splice(i, 1);
                // Reducir el índice i para compensar la eliminación
                i--;
            }
        }
    }
}

function verificarSeriaciones(ueas_posibles_directas) {
    for (let i = 0; i < ueas_posibles_directas.length; ++i) {
        for (let j = 0; j < ueas_posibles_directas.length; ++j) {
            if (ueas_posibles_directas[j].seriacion.includes(ueas_posibles_directas[i].clave)) {
                console.log("Uea no posible: ", ueas_posibles_directas[j]);
                ueas_posibles_directas.splice(j, 1);
                // Reducir el índice i para compensar la eliminación
                j--;
            }
        }
    }
}

function verificarSeriacionesCoregistro(ueas_con_coregistro, ueas_posibles_directas) {
    let ueas_con_coregistro_temp = [];
    for (let i = 0; i < ueas_posibles_directas.length; ++i) {
        for (let j = 0; j < ueas_con_coregistro.length; ++j) {
            if (ueas_con_coregistro[j].seriacion.includes(ueas_posibles_directas[i].clave)) {
                console.log("Uea de coregistro no posible: ", ueas_con_coregistro[j]);
                ueas_con_coregistro_temp.push(ueas_con_coregistro[j]);
            }
        }
    }
    //console.log("Ueas que no se pueden:", ueas_con_coregistro_temp);
    //Elimino las de tempo en ueas con coregistro
    if (ueas_con_coregistro_temp.length > 0) {
        for (let i = 0; i < ueas_con_coregistro_temp.length; ++i) {
            let index = ueas_con_coregistro.indexOf(ueas_con_coregistro_temp[i]);
            if (index !== -1) {
                ueas_con_coregistro.splice(index, 1);
            }
        }
    }
}



function mostrarUeasDirectas(ueas_posibles_directas, recomendacion, index) {
    for (let i = 0; i < ueas_posibles_directas.length; ++i) {
        const contenedor = document.getElementById('cont-seleccion-' + recomendacion + index);

        const elemento = document.createElement('div');
        elemento.classList.add('card');
        elemento.classList.add('cont-uea-padre');
        //elemento.classList.add('u');
        elemento.setAttribute('id', 'id-' + ueas_posibles_directas[i].clave);

        // Agregar tooltip solo a las que requieren 'Autorización'
        if (ueas_posibles_directas[i].seriacion.includes('Autorización')) {
            elemento.setAttribute('data-bs-toggle', 'tooltip');
            elemento.setAttribute('data-bs-placement', 'top');
            elemento.setAttribute('data-bs-title', 'Esta uea requiere de Autorización');
        }

        const elementoHijo = document.createElement('div');
        elementoHijo.classList.add('card-body');
        elementoHijo.classList.add('u');
        elementoHijo.classList.add('d-flex');
        elementoHijo.classList.add('flex-column');
        elementoHijo.classList.add('justify-content-between');
        elementoHijo.classList.add('align-items-center');

        let nombre = document.createElement('p');
        nombre.textContent = ueas_posibles_directas[i].nombre;

        let clave = document.createElement('p');
        clave.textContent = "Clave: " + ueas_posibles_directas[i].clave;

        let creditos = document.createElement('p');
        creditos.textContent = "Creditos: " + ueas_posibles_directas[i].creditos;

        let tipo = document.createElement('p');
        tipo.textContent = "Tipo: " + ueas_posibles_directas[i].tipo;

        elementoHijo.appendChild(nombre);
        elementoHijo.appendChild(clave);
        elementoHijo.appendChild(creditos);
        elementoHijo.appendChild(tipo);

        elemento.appendChild(elementoHijo);

        contenedor.appendChild(elemento);
    }

}


function limpiaContenedorRecomendacion(i) {
    let cont = document.getElementById('cont-seleccion-1' + i);
    while (cont.hasChildNodes()) {
        cont.removeChild(cont.firstChild);
    }
}

let btnsGenerarRecomendacion = document.getElementsByClassName('btn-generar-recomendacion');

// Para que solo se pueda elegir una solo opcion
for (let i = 0; i < btnsGenerarRecomendacion.length; ++i) {
    const checkboxObligatorio = document.getElementById('tipo-obl' + i);
    const checkboxOptativo = document.getElementById('tipo-opt' + i);

    checkboxObligatorio.addEventListener('change', function () {
        if (this.checked) {
            checkboxOptativo.checked = false; // Desactivar checkbox optativo si se activa el obligatorio
        }
    });

    checkboxOptativo.addEventListener('change', function () {
        if (this.checked) {
            checkboxObligatorio.checked = false; // Desactivar checkbox obligatorio si se activa el optativo
        }
    });
}



for (let i = 0; i < btnsGenerarRecomendacion.length; ++i) {
    // Para checar el checkbox seleccionado y mostrar solo esas ueas
    document.getElementById('btn-generar' + i).addEventListener('click', () => {
        const seleccion = document.getElementsByName('inlineRadioOptions');
        const tipoPriorizado = document.getElementsByName('opcionesTipo');
        arreglo_ueas = [];
        let sel = "";
        let tipo = "";
        for (let i = 0; i < seleccion.length; ++i) {
            if (seleccion[i].checked) {
                console.log("Seleccion en: " + seleccion[i].value);
                sel = seleccion[i].value;
            }
        }

        for (let i = 0; i < tipoPriorizado.length; ++i) {
            if (tipoPriorizado[i].checked) {
                console.log("tipo Priorizado en: " + tipoPriorizado[i].value);
                tipo = tipoPriorizado[i].value;
            }
        }

        if (sel != "") {
            limpiaContenedorRecomendacion(i);
            ueasNuevas(arreglo_ueas, sel, tipo, i);
        }
        else {
            alert("Selecciona un nivel de carga académica");
        }
    })
}
//--------------------------------------------------


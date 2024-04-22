const ueas_seleccionadas = document.getElementById('ueasSeleccionadas').textContent;
const creditos_posibles = document.getElementById('creditos_actuales').textContent;
const arreglo_ueas = ueas_seleccionadas.trim().split(",");
let ueas_posibles_directas = [];
let ueasMenoresAcreditosActuales = [];
console.log(arreglo_ueas);

let tooltipTriggerList = '';

// Mandamos traer todas las ueas que tienen como seriacion las actuales que lleva el usuario
async function ueasNuevas(arreglo_ueas, carga, tipo) {
    try {
        const response = await fetch(`/menu/alumno/recomendacion/ueasSiguientes`);
        const data = await response.json();
        //console.log(data);
        ueas_posibles_directas = data;
        console.log(ueas_posibles_directas); // Aquí se imprimirán los datos correctamente
        ueasNuevasCreditos(ueas_posibles_directas, carga, tipo);
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
}

async function ueasNuevasCreditos(ueas_posibles_directas, carga, tipo) {
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

        ueas_posibles_directas = ueas_posibles_directas.concat(ueasMenoresAcreditosActuales);
        quitarUeasActuales(ueas_posibles_directas);
        verificarSeriaciones(ueas_posibles_directas);

        // Aqui obtenemos y verificamos las 3 recomendaciones
        let ueas_posibles_recoUno = ajustarNivelDeCarga(ueas_posibles_directas, carga, tipo, ueas_de_coregistro);
        verificarSeriaciones(ueas_posibles_recoUno);
        mostrarUeasDirectas(ueas_posibles_recoUno, 1);

        let ueas_posibles_recoDos = ajustarNivelDeCarga(ueas_posibles_directas, carga, tipo, ueas_de_coregistro);
        verificarSeriaciones(ueas_posibles_recoDos);
        mostrarUeasDirectas(ueas_posibles_recoDos, 2);

        let ueas_posibles_recoTres = ajustarNivelDeCarga(ueas_posibles_directas, carga, tipo, ueas_de_coregistro);
        verificarSeriaciones(ueas_posibles_recoTres);
        mostrarUeasDirectas(ueas_posibles_recoTres, 3);

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



function mostrarUeasDirectas(ueas_posibles_directas, recomendacion) {
    for (let i = 0; i < ueas_posibles_directas.length; ++i) {
        const contenedor = document.getElementById('cont-seleccion-' + recomendacion);

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


function limpiaContenedorRecomendacion() {
    let cont = document.getElementById('cont-seleccion-1');
    let contDos = document.getElementById('cont-seleccion-2');
    let contTres = document.getElementById('cont-seleccion-3');
    while (cont.hasChildNodes()) {
        cont.removeChild(cont.firstChild);
    }

    while (contDos.hasChildNodes()) {
        contDos.removeChild(contDos.firstChild);
    }

    while (contTres.hasChildNodes()) {
        contTres.removeChild(contTres.firstChild);
    }
}


// Para que solo se pueda elegir una solo opcion
const checkboxObligatorio = document.getElementById('tipo-obl');
const checkboxOptativo = document.getElementById('tipo-opt');

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

// Para checar el checkbox seleccionado y mostrar solo esas ueas
document.getElementById('btn-generar').addEventListener('click', () => {
    const seleccion = document.getElementsByName('inlineRadioOptions');
    const tipoPriorizado = document.getElementsByName('opcionesTipo');
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
        document.getElementById('cont-recomendaciones').style.display = 'block';
        limpiaContenedorRecomendacion();
        ueasNuevas(arreglo_ueas, sel, tipo);
    }
    else {
        alert("Selecciona un nivel de carga académica");
    }
})

/* Para crear el pdf con las recomendaciones
document.getElementById('boton-generar-pdf').addEventListener('click', () => {
    let element = document.getElementById('cont-principal');
    let opt = {
        margin: 1,
        filename: 'recomendaciones.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Captura el contenido HTML y genera un canvas
    html2canvas(element, {
        scale: 2,
        useCORS: true
    }).then(canvas => {
        let imgData = canvas.toDataURL('image/jpeg', 1.0);
        let pdf = new jsPDF('p', 'in', 'letter');
        let imgWidth = 5.5;
        let pageHeight = 11;
        let imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(opt.filename);
    });
});
*/




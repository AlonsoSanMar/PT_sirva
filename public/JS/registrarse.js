let ueas = []; // Aqui guardo todas las ueas que el usuario curso, para crear su cuenta
let ueasSeriadasRevisadas = [];
let creditosUser = document.getElementsByName('creditos_actuales')[0].value;

function removerNodos(id) {
    let el = document.getElementById(id);
    while (el.hasChildNodes()) {
        el.removeChild(el.firstChild);
    }
}

//Función para que la uea seleccionada por error se elimine
function eliminaUeaDeSeleccion(uea) {
    let cont = document.getElementById('cont-seleccion');
    let u = document.getElementById('id-' + uea.clave);
    cont.removeChild(u);
    ueas = ueas.filter(ue => !ue.nombre.toLowerCase().includes(uea.nombre.toLowerCase()));
    actualizarFormulario();
}

// Alerta sobre si los creditos actuales del usuario son los correctos Falta checar que solamente muestre el msj una vez
let msjCreditos = false;
function alertaCreditosMinimos(creditos) {
    let btn = document.getElementById('siguiente');
    if (parseInt(creditosUser) < creditos) {
        if (!msjCreditos) {
            alert("Tus creditos actuales no te permiten esta seleccion de UEA. Realiza la seleccion correcta");
        }
        msjCreditos = true;
    } else {
        msjCreditos = false;
    }
}

// Función para saber si cuenta con los creditos minimos para llevar esa UEA
/*
async function creditosMinimos(uea) {
    let regex = /^[0-9]{2,3}\s*Créditos/i;
    if (uea.seriacion.length > 0) {
        for (const seriacion of uea.seriacion) {
            if (!regex.test(seriacion)) {
                if (!ueasRevisadas.includes(seriacion)) {
                    ueasRevisadas.push(seriacion);
                    try {
                        const response = await fetch(`/buscaUea?clave=${seriacion}`);
                        const data = await response.json();
                        creditosNecesarios += parseInt(data[0].creditos);
                        //console.log("Creditos minimos: " + creditosNecesarios);
                        alertaCreditosMinimos(creditosNecesarios);
                        if (data[0].seriacion.length > 0) {
                            await creditosMinimos(data[0]);
                        }
                    } catch (error) {
                        console.log("Error :(", error);
                    }
                }
            }
        }
    }
}*/
let creditosNecesarios = 0;
let ueasRevisadas = [];
async function creditosMinimos(uea) {
    let regex = /^[0-9]{2,3}\s*Créditos/i;
    if (uea.seriacion.length > 0) {
        for (const seriacion of uea.seriacion) {
            if (!regex.test(seriacion)) {
                if (!ueasRevisadas.includes(seriacion)) {
                    ueasRevisadas.push(seriacion);
                    try {
                        const response = await fetch(`/registro/buscaUea?clave=${seriacion}`);
                        const data = await response.json();
                        creditosNecesarios += parseInt(data[0].creditos);
                        alertaCreditosMinimos(creditosNecesarios);
                        if (data[0].seriacion.length > 0) {
                            await creditosMinimos(data[0]);
                        }
                    } catch (error) {
                        console.log("Error :(", error);
                    }
                }
            }
        }
    }
    // Devolver una promesa resuelta cuando todas las operaciones asíncronas han terminado
    return Promise.resolve();
}


//Funcion para checar si la uea tiene en .seriacion algun dato del tipo = 24 Créditos
function creditosSuficientes(uea) {
    let regex = /^[0-9]{2,3}\s*Créditos/i;
    //let regex = new RegExp(creditosUser + "\\s*Créditos", "i");
    for (let i = 0; i < uea.seriacion.length; ++i) {
        if (regex.test(uea.seriacion[i])) {
            console.log("Si tiene una seriacion por creditos");
            let numero = uea.seriacion[i].match(/[0-9]{2,3}/);
            if (numero && (creditosUser >= parseInt(numero))) {
                alert("Seriación por créditos evaluada");
            } else if (numero && creditosUser < parseInt(numero)) {
                alert("No puedes cursar esta UEA por creditos insuficientes");
                eliminaUeaDeSeleccion(uea);
            }
        } else {
            console.log("No tiene seriacion por creditos");
        }
    }


    /* Verificar si la serialización contiene el patrón deseado
    if (regex.test(uea.seriacion)) {
        console.log("Si tiene una seriacion por creditos");
        for (let i = 0; i < uea.seriacion.length; ++i) {
            let numero = uea.seriacion[i].match(/[0-9]{3}/);
            if (numero && (creditosUser >= numero)) {
                alert("Seriación por créditos evaluada");
            } else if (numero && creditosUser < numero) {
                alert("No puedes cursar esta UEA por creditos insuficientes");
                eliminaUeaDeSeleccion(uea);
            }
        }
    } else {
        console.log("No tiene seriacion por creditos");
    }*/
}

//Funcion para verificar que la uea agregada se puede cursar actualmente con las ya agregadas anteriormente
async function verificaUeas(uea) {
    let regex = /^[0-9]{2,3}\s*Créditos/i;
    if (uea.seriacion.length > 0) {
        for (const seriacion of uea.seriacion) {
            if (!regex.test(seriacion)) {
                if (!ueasSeriadasRevisadas.includes(seriacion)) {
                    ueasSeriadasRevisadas.push(seriacion);
                    try {
                        const response = await fetch(`/registro/buscaUea?clave=${seriacion}`);
                        const data = await response.json();
                        if (ueas.length > 0) {
                            // Comparar la seriacion
                            for (const element of ueas) {
                                if (element.clave == data[0].clave) {
                                    alert("Esta UEA no es posible cursarla junto con las ya seleccionadas :(");
                                    eliminaUeaDeSeleccion(data[0]);
                                }
                            }
                        }
                        if (data[0].seriacion.length > 0) {
                            await verificaUeas(data[0]);
                        }
                    } catch (error) {
                        console.log("Error :(", error);
                    }
                }
            }
        }
    }
}


//Debe añadir ueas que tengan coregistro automaticamente
function checaCoregistro(uea) {
    if (uea.coregistro.length > 0) {
        uea.coregistro.forEach(coregistro => {
            fetch(`/registro/buscaUea?clave=${coregistro}`)
                .then(response => response.json())
                .then(data => {
                    if (ueas.find(u => u.clave === data[0].clave) === undefined) {
                        //console.log("Ya está agregado");
                        agregaUea(data[0]);
                        //comparaCreditosMinimos();
                    }
                    alert("Esta UEA requiere de un coregistro");
                })
        });
    }
}


// Al agregar hay que checar si no está ya agregada
function agregaUea(uea) {
    if (ueas.length == 0) {
        removerNodos('cont-seleccion');
        let card = document.getElementById('cont-seleccion');
        card.classList.add('d-flex');
        card.classList.add('flex-wrap');
        card.classList.add('justify-content-center');
        card.classList.add('align-items-center');
        card.classList.add('gap-2');
    }

    if (ueas.find(u => u.clave === uea.clave) === undefined) {

        ueas.push(uea);
        const contenedor = document.getElementById('cont-seleccion');

        document.getElementById('barra-buscar').value = '';

        const elemento = document.createElement('div');
        elemento.classList.add('card');
        elemento.classList.add('cont-uea-padre');
        //elemento.classList.add('u');
        elemento.setAttribute('id', 'id-' + uea.clave);

        const elementoHijo = document.createElement('div');
        elementoHijo.classList.add('card-body');
        elementoHijo.classList.add('u');
        elementoHijo.classList.add('d-flex');
        elementoHijo.classList.add('flex-column');
        elementoHijo.classList.add('justify-content-between');
        elementoHijo.classList.add('align-items-center');

        let nombre = document.createElement('p');
        nombre.textContent = uea.nombre;

        let clave = document.createElement('p');
        clave.textContent = "Clave: " + uea.clave;

        let creditos = document.createElement('p');
        creditos.textContent = "Creditos: " + uea.creditos;

        let tipo = document.createElement('p');
        tipo.textContent = "Tipo: " + uea.tipo;

        let btnEliminar = document.createElement('button'); //Usando font awesome e 'i'
        btnEliminar.textContent = "Eliminar";
        btnEliminar.classList.add('btn-eliminar');
        btnEliminar.addEventListener('click', () => {
            contenedor.removeChild(elemento); //Elimino visualmente
            ueas = ueas.filter(u => !u.nombre.toLowerCase().includes(uea.nombre.toLowerCase()))
            //eliminaUeaDeSeleccion(uea);
            actualizarFormulario();
            comparaCreditosMinimos();

            if (uea.coregistro.length > 0) {
                //console.log("Ueas con coregistro eliminadas..");
                uea.coregistro.forEach(coregistro => {
                    fetch(`/registro/buscaUea?clave=${coregistro}`)
                        .then(response => response.json())
                        .then(data => {
                            if (ueas.find(u => u.clave === data[0].clave)) { 
                                eliminaUeaDeSeleccion(data[0])
                            }
                        })
                });
            }
        });

        elementoHijo.appendChild(nombre);
        elementoHijo.appendChild(clave);
        elementoHijo.appendChild(creditos);
        elementoHijo.appendChild(tipo);
        elementoHijo.appendChild(btnEliminar);

        elemento.appendChild(elementoHijo);

        contenedor.appendChild(elemento);
        /*
        const elemento = document.createElement('div');
        elemento.classList.add('uea');
        elemento.setAttribute('id', 'id-' + uea.clave);

        let nombre = document.createElement('p');
        nombre.textContent = uea.nombre;

        let clave = document.createElement('p');
        clave.textContent = "Clave: " + uea.clave;

        let creditos = document.createElement('p');
        creditos.textContent = "Creditos: " + uea.creditos;

        let tipo = document.createElement('p');
        tipo.textContent = "Tipo: " + uea.tipo;

        let btnEliminar = document.createElement('button'); //Usando font awesome e 'i'
        btnEliminar.textContent = "Eliminar";
        btnEliminar.classList.add('btn-eliminar');
        btnEliminar.addEventListener('click', () => {
            contenedor.removeChild(elemento); //Elimino visualmente
            ueas = ueas.filter(u => !u.nombre.toLowerCase().includes(uea.nombre.toLowerCase()))
            //eliminaUeaDeSeleccion(uea);
            actualizarFormulario();

            comparaCreditosMinimos();
        });

        elemento.appendChild(nombre);
        elemento.appendChild(clave);
        elemento.appendChild(creditos);
        elemento.appendChild(tipo);
        elemento.appendChild(btnEliminar);

        contenedor.appendChild(elemento);
*/
        if (ueas.length > 1) {
            ueas.forEach(e => {
                ueasSeriadasRevisadas = [];
                verificaUeas(e);
            });
        }

        //Agregarla en el formulario con id = form-usuario
        actualizarFormulario();

    } else {
        alert("Ya está agregada esta UEA");
    }
}


function actualizarFormulario() {
    const formulario = document.getElementById('form-usuario');

    // Eliminar campos de UEA existentes del formulario
    const camposUEA = formulario.querySelectorAll('.campo-uea');
    camposUEA.forEach(campo => {
        formulario.removeChild(campo);
    });

    // Agregar campos de UEA actualizados al formulario
    ueas.forEach(uea => {
        const campoUEA = document.createElement('input');
        campoUEA.type = 'hidden';
        campoUEA.name = 'ueasSeleccionadas[]';
        campoUEA.value = uea.clave;
        campoUEA.classList.add('campo-uea');
        formulario.appendChild(campoUEA);
    });
}

// Para la barra de busqueda
const searchInput = document.getElementById('barra-buscar');
const sugerencias = document.getElementById('sugerencias');

let lastFetch = null;   // Para evitar que cuando escribas rapido o borres rapido se acumulen las sugerencias repetidas

searchInput.addEventListener('input', async () => {
    const term = searchInput.value;
    sugerencias.innerHTML = '';

    // Cancela la solicitud anterior si aún no se ha completado
    if (lastFetch !== null) {
        lastFetch.abort();
    }

    if (term.length > 0) {
        lastFetch = new AbortController();
        const { signal } = lastFetch;

        try {
            const response = await fetch(`/registro/buscar`, { signal });
            const data = await response.json();
            //Checamos de la forma que se pueda evitar acentos, mayus y minus
            const sugerenciasFiltradas = data.filter(item => {
                return item.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(term.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
            });


            // Para que solo muestre 5 sugerencias y no todas
            const limiteSugerencias = 4;

            for (let i = 0; i < Math.min(limiteSugerencias, sugerenciasFiltradas.length); i++) {
                const uea = sugerenciasFiltradas[i];
                const suggestion = document.createElement('li');
                suggestion.textContent = uea.nombre;

                suggestion.addEventListener('click', () => {
                    searchInput.value = suggestion.textContent;
                    removerNodos('sugerencias');
                });

                sugerencias.appendChild(suggestion);
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                //...
            }
        }
    }
});

/* Funcion que llama a la funcion para comparar creditos
function comparaCreditosMinimos() {
    creditosNecesarios = 0;
    ueasRevisadas = [];
    for (const e of ueas) {
        //console.log(ueas.length);
        creditosMinimos(e);
    }
}*/

async function comparaCreditosMinimos() {
    creditosNecesarios = 0;
    ueasRevisadas = [];
    for (const e of ueas) {
        await creditosMinimos(e);
    }
}

function sumarCreditos() {
    let ueasCreditos = 0;
    for (let i = 0; i < ueas.length; ++i) {
        ueasCreditos += parseInt(ueas[i].creditos);
    }
    return ueasCreditos;
}

let creditos_inscritos = 0

document.getElementById('btn-busca').addEventListener('click', async () => {
    let btn = document.getElementById('siguiente');

    if (searchInput.value.trim() !== '') {
        const term = searchInput.value;
        const response = await fetch(`/registro/buscar`);
        const data = await response.json();

        const resultados = data.filter(uea => uea.nombre.toLowerCase() === term.toLowerCase());

        // Verificamos que exista algo, si no hay nada no se agrega nada
        if (resultados.length > 0) {
            document.getElementById('cont-seleccion').style.display = 'flex';
            agregaUea(resultados[0]);
            //comparaCreditosMinimos();
            ueasSeriadasRevisadas = [];
            verificaUeas(resultados[0]);
            checaCoregistro(resultados[0]);
            creditosSuficientes(resultados[0]);
        }

    }
});

//Función para el boton siguiente con las ueas seleccionadas
//posiblemente checar si al final si estan bien los coregistros y seriacion
/*
document.getElementById('siguiente').addEventListener('click', () => {
    console.log(ueas)
    //window.location.replace('registro/alumno/resumen');
})*/

document.getElementById('siguiente').addEventListener('click', recogerDatos);

// funcion para recoger los datos del formulario
function recogerDatos() {
    let nombre = document.getElementsByName('nombre')[0].value;
    let apellidos = document.getElementsByName('apellidos')[0].value;
    let matricula = document.getElementsByName('matricula')[0].value;
    let anio_ingreso = document.getElementsByName('anio_ingreso')[0].value;
    let periodo = document.getElementsByName('periodo')[0].value;
    let creditos_actuales = document.getElementsByName('creditos_actuales')[0].value;
    let correo = document.getElementsByName('correo')[0].value;
    let password = document.getElementsByName('password')[0].value;

    let valoresUeas = document.getElementsByName('ueasSeleccionadas[]');
    let ueasSeleccionadas = [];
    for (let i = 0; i < valoresUeas.length; ++i) {
        ueasSeleccionadas.push(valoresUeas[i].value);
    }

    //console.log(ueasSeleccionadas);
    registroUsuario(nombre, apellidos, matricula, anio_ingreso, periodo, creditos_actuales, correo, password, ueasSeleccionadas);
}

//Checar bien las respuestas

function registroUsuario(nombre, apellidos, matricula, anio_ingreso, periodo, creditos_actuales, correo, password, ueasSeleccionadas) {
    const data = {
        nombre: nombre,
        apellidos: apellidos,
        matricula: matricula,
        anio_ingreso: anio_ingreso,
        periodo: periodo,
        creditos_actuales: creditos_actuales,
        correo: correo,
        password: password,
        ueasSeleccionadas: ueasSeleccionadas
    }

    const url = 'guardar';

    creditos_inscritos = sumarCreditos();
    //console.log("Creditos inscritos:", creditos_inscritos);

    if (ueas.length == 0) {
        alert("No has añadido ninguna UEA");
    } else {
        comparaCreditosMinimos().then(() => {
            if (!msjCreditos) {
                if (creditos_inscritos < 64) {
                    if (confirm("¿Estás seguro con la eleccion de UEA?")) {
                        fetch(url, {
                            method: 'POST',
                            body: JSON.stringify(data),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(response => {
                            if (response.status == 200) {
                                window.location.replace('/registro/alumno/guardar');
                            } else {
                                alert('Error desconocido, contacte al administrador');
                            }
                        }).catch(error => {
                            console.log('Error al hacer la petición');
                            console.log(error);
                        });
                    }
                } else {
                    alert("Tienes exceso de creditos... :( . Realiza una selección correcta");
                }
            }

        });
    }
}
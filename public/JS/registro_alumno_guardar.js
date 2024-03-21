
document.getElementById('btn-registrar').addEventListener('click', recogerDatos);

// Para mostrar como tal la uea seleccionada
async function traerUea() {
    const cont = document.getElementById('cont-ueas');
    const hijos = cont.children;
    console.log(hijos.length);
    for (let i = 0; i < hijos.length; i++) {
        const c = hijos[i].textContent;
        const response = await fetch(`/registro/buscaUea?clave=${c.trim()}`);
        const data = await response.json();
        //console.log(data);

        const contenedor = document.getElementById('cont-seleccion');

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

    const url = '/registro/signup';

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.status == 200) {
            alert("Registro existoso!");
            window.location.replace('/');
        } else if (response.status == 401) {
            alert('¡Ya existe un usuario registrado con ese correo!');
        } else {
            alert('Error desconocido, contacte al administrador');
        }
    }).catch(error => {
        console.log('Error al hacer la petición');
        console.log(error);
    });
}


traerUea();



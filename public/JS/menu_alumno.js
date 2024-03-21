
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

traerUea();


// Para actualizar 
document.getElementById('btn-actualizar-seleccion').addEventListener('click', () => {
    window.location.replace('/menu/alumno/actualizarSeleccion');
})

// Para abrir el calendario
document.getElementById('calendario').addEventListener('click', () => {
    let modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
    modal.show();
})

// Para abrir la página de cbi en otra ventana al dar click en el div
document.getElementById('pagina-cbi').addEventListener('click', () =>{
    window.open("http://cbi.azc.uam.mx/", '_blank');
})

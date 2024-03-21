let alerta = document.getElementById('alerta');
let btnSig = document.getElementById('btn-siguiente');

const inpCreditos = document.getElementById('creditos_actuales');
const inpAnio = document.getElementById('anio_ingreso');
const inpContr = document.getElementById('password');
const inpConfContr = document.getElementById('conf-password');
const inpMat = document.getElementById('matricula');

document.getElementById('matricula').addEventListener('input', agregaCorreo);
document.getElementById('matricula').addEventListener('input', verificarTamMat);
document.getElementById('matricula').addEventListener('input', agregaAnio);
document.getElementById('matricula').addEventListener('input', agregaPeriodo);
//document.getElementById('anio_ingreso').addEventListener('input', verificarAnio);
document.getElementById('creditos_actuales').addEventListener('input', verificarCreditos);
document.getElementById('password').addEventListener('input', minimoContra);
document.getElementById('conf-password').addEventListener('input', verificarContrasena);

function minimoContra(){
    let input = document.getElementById('password').value;
    let regex = /.{5,}/
    if(input != ""){
        if(!regex.test(input)){
            alerta.style.display = 'block';
            inpContr.classList.add('is-invalid');
            inpConfContr.setAttribute('readonly', '');
            inpCreditos.setAttribute('readonly', '');
            inpMat.setAttribute('readonly', '');
            document.getElementById('msj-alerta').textContent = "Contraseña incompleta";

        }else{
            alerta.style.display = 'none';
            inpContr.classList.add('is-valid');
            inpContr.classList.remove('is-invalid');
            inpConfContr.removeAttribute('readonly');
            inpCreditos.removeAttribute('readonly');
            inpMat.setAttribute('readonly');
        }
    }else{
        alerta.style.display = 'none';
        inpContr.classList.remove('is-invalid');
        inpContr.classList.remove('is-valid');
        inpConfContr.removeAttribute('readonly');
        inpCreditos.removeAttribute('readonly');
        inpMat.setAttribute('readonly');
    }
}

function agregaPeriodo(){
    let d = document.getElementById('matricula').value;
    let selectPeriodo = document.getElementById('periodo');
    if(d != ""){
        let p = d.substring(3, 4);
        if(p == "1"){
            selectPeriodo.value = "Invierno";
        }else if(p == "2"){
            selectPeriodo.value = "Primavera";
        }else if(p == "3"){
            selectPeriodo.value = "Otoño";
        }
    }else{
        selectPeriodo.value = "Periodo";
    }
}

function agregaAnio(){
    let d = document.getElementById('matricula').value;
    let inputAnio = document.getElementById('anio_ingreso');
    if (d != "") {
        inpAnio.value = "20" + d.toString().substring(1, 3);
    } else {
        inputAnio.value = "";
    }
}

//Función para colocar el correo de forma automática
function agregaCorreo() {
    let d = document.getElementById('matricula').value;
    //console.log(d);
    let inputCorreo = document.getElementById('correo');
    if (d != "") {
        inputCorreo.value = "al" + d + "@azc.uam.mx";
    } else {
        inputCorreo.value = "";
    }
}

async function buscarMatricula(matricula) {
    try {
        const response = await fetch(`/registro/buscaMatricula?matricula=${matricula}`);
        if (response.status == 200) {
            const data = await response.text();
            //console.log(data); // Imprimir respuesta del servidor en la consola
            alert(data);
            btnSig.removeAttribute('disabled');
            inpCreditos.removeAttribute('readonly');
            inpConfContr.removeAttribute('readonly');
            inpContr.removeAttribute('readonly');
        } else if (response.status === 401) {
            const errorMessage = await response.text();
            //console.log("Error 401:", errorMessage); // Imprimir mensaje de error en la consola
            alert(errorMessage);
            btnSig.setAttribute('disabled', '');
            inpCreditos.setAttribute('readonly', '');
            inpContr.setAttribute('readonly', '');
            inpConfContr.setAttribute('readonly', '');
        } else {
            console.error('Error en la solicitud:', response.status);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}

//Función para verificar que la matriucula sea de 10 numero exactamente
function verificarTamMat() {
    //let regex = /^[0-9]{10}$/;
    let regex = /^21[0-9][1-3][0-9]{6}$|^22[0-4][1-3][0-9]{6}$/;
    let d = document.getElementById('matricula').value;
    if (d != "") {
        //console.log(regex.test(d));
        if (!regex.test(d)) {
            alerta.style.display = 'block';
            document.getElementById('msj-alerta').textContent = "Matricula incorrecta";
            inpMat.classList.add('is-invalid');
            btnSig.setAttribute('disabled', '');
            inpCreditos.setAttribute('readonly', '');
            inpContr.setAttribute('readonly', '');
            inpConfContr.setAttribute('readonly', '');
        } else {
            alerta.style.display = 'none';
            inpMat.classList.add('is-valid');
            inpMat.classList.remove('is-invalid');
            btnSig.removeAttribute('disabled');
            inpCreditos.removeAttribute('readonly');
            inpConfContr.removeAttribute('readonly');
            inpContr.removeAttribute('readonly');
            buscarMatricula(d);
        }
    } else {
        alerta.style.display = 'none';
        inpMat.classList.remove('is-valid');
        inpMat.classList.remove('is-invalid');
        btnSig.removeAttribute('disabled');
        inpCreditos.removeAttribute('readonly');
        inpConfContr.removeAttribute('readonly');
        inpContr.removeAttribute('readonly');
    }
}

//Funcion para verificar que el año de ingreso sea de entre 2010 y el actual
function verificarAnio() {
    let inputAnio = document.getElementById('anio_ingreso').value;
    let fechaActual = new Date().getFullYear();

    if (inputAnio != "") {
        if (inputAnio >= 2010 && inputAnio <= fechaActual) {
            //console.log("Correcto");
            alerta.style.display = 'none';
            btnSig.removeAttribute('disabled');
            inpCreditos.removeAttribute('readonly');
            inpConfContr.removeAttribute('readonly');
            inpContr.removeAttribute('readonly');
            inpMat.removeAttribute('readonly');
        } else {
            //console.log("Mal");
            alerta.style.display = 'block';
            document.getElementById('msj-alerta').textContent = "El año debe ser entre 2010 y " + fechaActual;
            btnSig.setAttribute('disabled', '');
            inpCreditos.setAttribute('readonly', '');
            inpContr.setAttribute('readonly', '');
            inpConfContr.setAttribute('readonly', '');
            inpMat.setAttribute('readonly', '');
        }
    } else {
        alerta.style.display = 'none';
        btnSig.removeAttribute('disabled');
        inpCreditos.removeAttribute('readonly');
        inpConfContr.removeAttribute('readonly');
        inpContr.removeAttribute('readonly');
        inpMat.removeAttribute('readonly');
    }
}

function verificarCreditos() {
    let c = document.getElementById('creditos_actuales').value;

    if (c != "") {
        if (c > 3 && c < 602) {
            alerta.style.display = 'none';
            inpCreditos.classList.add('is-valid');
            inpCreditos.classList.remove('is-invalid');
            btnSig.removeAttribute('disabled');
            inpConfContr.removeAttribute('readonly');
            inpContr.removeAttribute('readonly');
            inpMat.removeAttribute('readonly');
            inpAnio.removeAttribute('readonly');
        } else {
            alerta.style.display = 'block';
            document.getElementById('msj-alerta').textContent = "El rango de créditos permitidos es desde 4 - 601";
            inpCreditos.classList.add('is-invalid');
            btnSig.setAttribute('disabled', '');
            inpContr.setAttribute('readonly', '');
            inpConfContr.setAttribute('readonly', '');
            inpMat.setAttribute('readonly', '');
            inpAnio.removeAttribute('readonly');
        }
    } else {
        alerta.style.display = 'none';
        inpCreditos.classList.remove('is-invalid');
        inpCreditos.classList.remove('is-valid');
        btnSig.removeAttribute('disabled');
        inpConfContr.removeAttribute('readonly');
        inpContr.removeAttribute('readonly');
        inpMat.removeAttribute('readonly');
        inpAnio.removeAttribute('readonly');
    }
}

// Función para verificar contrasena
function verificarContrasena() {
    let contra = document.getElementById('password').value;
    let conf = document.getElementById('conf-password').value;
    if (conf != "") {
        if (conf != contra) {
            alerta.style.display = 'block';
            document.getElementById('msj-alerta').textContent = "La contraseña no coincide";
            inpConfContr.classList.add('is-invalid');
            btnSig.setAttribute('disabled', '');
            inpMat.setAttribute('readonly', '');
            inpAnio.setAttribute('readonly', '');
            inpCreditos.setAttribute('readonly', '');
        } else {
            alerta.style.display = 'none';
            inpConfContr.classList.add('is-valid');
            inpConfContr.classList.remove('is-invalid');
            btnSig.removeAttribute('disabled');
            inpMat.removeAttribute('readonly');
            inpAnio.removeAttribute('readonly');
            inpCreditos.removeAttribute('readonly');
        }
    } else {
        alerta.style.display = 'none';
        inpConfContr.classList.remove('is-invalid');
        inpConfContr.classList.remove('is-valid');
        btnSig.removeAttribute('disabled');
        inpMat.removeAttribute('readonly');
        inpAnio.removeAttribute('readonly');
        inpCreditos.removeAttribute('readonly');
    }
}

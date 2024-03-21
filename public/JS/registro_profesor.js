let alerta = document.getElementById('alerta');
let msjAlerta = document.getElementById('msj-alerta');
let btnSig = document.getElementById('btn-siguiente');

const inpContr = document.getElementById('password');
const inpConfContr = document.getElementById('conf-password');
const inpCorreo = document.getElementById('correo');

document.getElementById('btn-siguiente').addEventListener('click', recogerDatos);
document.getElementById('correo').addEventListener('input', validaCorreo);
document.getElementById('conf-password').addEventListener('input', verificarContrasena);
document.getElementById('password').addEventListener('input', minimoContra);

//Funcion para checar la minima longuitud de la contraseña
function minimoContra(){
    let input = document.getElementById('password').value;
    let regex = /.{5,}/
    if(input != ""){
        if(!regex.test(input)){
            alerta.style.display = 'block';
            document.getElementById('password').classList.add("is-invalid");
            inpConfContr.setAttribute('readonly', '');
            inpCorreo.setAttribute('readonly', '');
            btnSig.setAttribute('disabled', '');
            msjAlerta.textContent = "Contraseña incompleta";

        }else{
            alerta.style.display = 'none';
            document.getElementById('password').classList.remove("is-invalid");
            document.getElementById('password').classList.add("is-valid");
            inpConfContr.removeAttribute('readonly');
            inpCorreo.removeAttribute('readonly');
            btnSig.removeAttribute('disabled');
        }
    }else{
        alerta.style.display = 'none';
        document.getElementById('password').classList.remove("is-invalid");
        document.getElementById('password').classList.remove("is-valid");
        inpConfContr.removeAttribute('readonly');
        inpCorreo.removeAttribute('readonly');
        btnSig.removeAttribute('disabled');
    }
}


//Funcion para verificar si no existe ya un correo
async function buscaCorreo(correo){
    try {
        const response = await fetch(`/registro/buscaCorreo?correo=${correo}`);
        if (response.status == 200) {
            btnSig.removeAttribute('disabled');
            inpConfContr.removeAttribute('readonly');
            inpContr.removeAttribute('readonly');
        } else if (response.status === 401) {
            const errorMessage = await response.text();
            alert(errorMessage);
            btnSig.setAttribute('disabled', '');
            inpContr.setAttribute('readonly', '');
            inpConfContr.setAttribute('readonly', '');
        } else {
            console.error('Error en la solicitud:', response.status);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}

// Función para validar el correo
function validaCorreo() {
    let regex = /^[a-z A-Z]+@azc.uam.mx$/;
    let correo = document.getElementById('correo').value;
    if (correo != "") {
        if (regex.test(correo)) {
            alerta.style.display = 'none';
            document.getElementById('correo').classList.remove('is-invalid');
            document.getElementById('correo').classList.add('is-valid');
            btnSig.removeAttribute('disabled');
            buscaCorreo(correo);
            inpContr.removeAttribute('readonly');
            inpConfContr.removeAttribute('readonly');
        } else {
            msjAlerta.textContent = "Correo Inválido";
            alerta.style.display = 'block';
            document.getElementById('correo').classList.add('is-invalid');
            btnSig.setAttribute('disabled', '');
            inpContr.setAttribute('readonly', '');
            inpConfContr.setAttribute('readonly', '');
        }
    } else {
        alerta.style.display = 'none';
        document.getElementById('correo').classList.remove('is-invalid');
        document.getElementById('correo').classList.remove('is-valid');
        btnSig.removeAttribute('disabled');
        inpContr.removeAttribute('readonly');
        inpConfContr.removeAttribute('readonly');
    }
}

function verificarContrasena() {
    let contra = document.getElementById('password').value;
    let conf = document.getElementById('conf-password').value;
    if (conf != "") {
        if (conf != contra) {
            alerta.style.display = 'block';
            document.getElementById('conf-password').classList.add("is-invalid");
            msjAlerta.textContent = "La contraseña no coincide";
            btnSig.setAttribute('disabled', '');
            inpCorreo.setAttribute('readonly', '');
            return true;
        } else {
            alerta.style.display = 'none';
            document.getElementById('conf-password').classList.remove("is-invalid");
            document.getElementById('conf-password').classList.add("is-valid");
            btnSig.removeAttribute('disabled');
            inpCorreo.removeAttribute('readonly');
            return false;
        }
    }else {
        alerta.style.display = 'none';
        document.getElementById('conf-password').classList.remove("is-invalid");
        document.getElementById('conf-password').classList.remove("is-valid");
        btnSig.removeAttribute('disabled');
        inpCorreo.removeAttribute('readonly');
        return false;
    }
}


// funcion para recoger los datos del formulario
function recogerDatos() {
    let nombre = document.getElementsByName('nombre')[0].value;
    let apellidos = document.getElementsByName('apellidos')[0].value;
    let correo = document.getElementsByName('correo')[0].value;
    let password = document.getElementsByName('password')[0].value;
    let tutorados = [];

    if(correo && password && nombre && apellidos){
        validaCorreo(correo);
        if(!verificarContrasena(password)){
            registroUsuario(nombre, apellidos, correo, password, tutorados);
        }
    }else{
        alert("Registro Incompleto");
    }
}

function registroUsuario(nombre, apellidos, correo, password, tutorados) {
    const data = {
        nombre: nombre,
        apellidos: apellidos,
        correo: correo,
        password: password,
        tutorados: tutorados
    }

    const url = '/registro/signup/profesor';

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.status == 200) {
            alert("Registro Exitoso!");
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
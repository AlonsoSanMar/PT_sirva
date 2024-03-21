document.getElementById('nuevo-user').addEventListener('click', () => {
    window.location.replace('/registro/alumno');
})

document.getElementById('nuevo-user-prof').addEventListener('click', () => {
    window.location.replace('/registro/profesor');
})

document.getElementById('btn-iniciarSesion').addEventListener('click', recogerDatos);

//Funcion para el login
function recogerDatos(){
    const matricula = document.getElementById('iniciar-matricula').value;
    const password = document.getElementById('iniciar-password').value;

    let regexAlumno = /^al\d{10}@azc.uam.mx/i;
    let regexProfe = /^[a-z A-Z]+@azc.uam.mx/i;

    if(matricula && password){
        if(regexAlumno.test(matricula) || regexProfe.test(matricula)){
            console.log("Es correo ");
            iniciarSesionCorreo(matricula, password);
        }else{
            iniciarSesion(matricula,password);
        }
    }else{
        alert('Debes ingresar todos los datos');
    }
}

function iniciarSesion(matricula, password){
    const url = '/login';

    const data = {
        matricula: matricula,
        password: password,
    };

    fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
    }).then(response => {
        if(response.status == 200){
            window.location.replace('/menu/alumno/inicio');

        }else if(response.status == 401){
            alert('Credenciales Incorrectas');
        }else{
            alert('Error desconocido, contacte al administrador');
        }
    }).catch(error => {
        console.log(error);
    });
}

async function iniciarSesionCorreo(correo, password){
    const url = '/loginCorreo';

    const data = {
        correo: correo,
        password: password,
    };

    fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
    }).then( async response => {
        if(response.status == 200){
            let menu = await response.text();
            window.location.replace('/menu/' + menu);
        }else if(response.status == 401){
            alert('Credenciales Incorrectas');
        }else{
            alert('Error desconocido, contacte al administrador');
        }
    }).catch(error => {
        console.log(error);
    });
}
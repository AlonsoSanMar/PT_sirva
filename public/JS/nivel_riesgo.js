// Funciones para mostrar el nivel de riesgo
const creditos = document.getElementById('creditos_actuales').value;
const anioIngreso = document.getElementById('anio_ingreso').value;
const periodo = document.getElementById('periodo').value;

function trimestresConcluidos(arrExtendido){
    let distancia = 12;
    // Encuentra los índices de los elementos buscados
    const indice2024Invierno = arrExtendido.indexOf('2024-Invierno');
    const indiceInicial = arrExtendido.indexOf(anioIngreso + "-" + periodo);

    if (indice2024Invierno !== -1 && indiceInicial !== -1) {
        // Calcula la distancia entre los índices
        distancia = Math.abs(indice2024Invierno - indiceInicial);
    }else if(indice2024Invierno == -1){
        distancia = 12;
    }

    //console.log("Distancia entre '2024-Invierno' y '2022-Otoño':", distancia);
    porcentajeConRespectoIngreso = (distancia * 100) / 12;
}



function checaPorcentaje(){
    let msjPorcentaje = document.getElementById('msj-progreso-anio');
    if(porcentajeConRespectoIngreso > 0 && porcentajeConRespectoIngreso < 20){
        msjPorcentaje.textContent = "Actualmente en los trimestres [1 - 2]";
        msjPorcentaje.classList.add('bg-warning');
        msjPorcentaje.classList.add('border-warning');
    }else if(porcentajeConRespectoIngreso > 20 && porcentajeConRespectoIngreso < 50){
        msjPorcentaje.textContent = "Actualmente en los trimestres [3 - 5]";
        msjPorcentaje.classList.add('bg-danger');
        msjPorcentaje.classList.add('border-danger');
    }else if(porcentajeConRespectoIngreso > 50 && porcentajeConRespectoIngreso < 80){
        msjPorcentaje.textContent = "Actualmente en los trimestres [6 - 7]";
        msjPorcentaje.classList.add('bg-danger');
        msjPorcentaje.classList.add('border-danger');
    }else if(porcentajeConRespectoIngreso > 80 && porcentajeConRespectoIngreso < 100){
        msjPorcentaje.textContent = "Actualmente en los trimestres [8 - 11]";
        msjPorcentaje.classList.add('bg-warning');
        msjPorcentaje.classList.add('border-warning');
    }
    else if(porcentajeConRespectoIngreso >= 100){
        msjPorcentaje.textContent = "12 trimestres cumplidos...";
        msjPorcentaje.classList.add('bg-success');
        msjPorcentaje.classList.add('border-success');
        porcentajeConRespectoIngreso = 100;
    }
    //console.log(parseInt(porcentajeConRespectoIngreso))
    
    let number = document.getElementById('number');
    let counter = 0;
    setInterval(() => {
        if(counter == parseInt(porcentajeConRespectoIngreso)){
            clearInterval();
        }else{
            counter += 1;
            number.innerHTML = counter + "%";
        }
    }, 30)
}


let riesgo = document.getElementById('nivelRiesgo');
let imgRiesgo = document.getElementById('img-riesgo');

const avancePor = parseInt((creditos * 100) / 472);
//console.log(avancePor);

riesgo.style.width = avancePor+"%";
riesgo.setAttribute('aria-valuenow', avancePor);

window.addEventListener('load', function() {
    if (imgRiesgo) {
        if(avancePor < 100){
            imgRiesgo.style.left = avancePor +"%";
        }else{
            imgRiesgo.style.left = "100%";
        }
    }
});


// Para el Progress bar circular

let porcentajeConRespectoIngreso = 0;


// Para obtener el %%%
let aumentoAnio = 0;
if(periodo == 'Primavera'){
    let arr = ['-Primavera', '-Otoño', '-Invierno'];
    let arrExtendido = [];
    for(let i = 0; i < 4; ++i) {
        for(let j = 0; j < arr.length; ++j){
            if(arr[j].includes('Invierno')){
                aumentoAnio += 1;
                arrExtendido.push((aumentoAnio + parseInt(anioIngreso)) + arr[j])
            }else{
                arrExtendido.push((aumentoAnio + parseInt(anioIngreso)) + arr[j])
            }
        }
    }
    //console.log(arrExtendido);
    trimestresConcluidos(arrExtendido);
}else if(periodo == 'Otoño'){
    let arr = ['-Otoño', '-Invierno', '-Primavera'];
    let arrExtendido = [];
    for(let i = 0; i < 4; ++i) {
        for(let j = 0; j < arr.length; ++j){
            if(arr[j].includes('Invierno')){
                aumentoAnio += 1;
                arrExtendido.push((aumentoAnio + parseInt(anioIngreso)) + arr[j])
            }else{
                arrExtendido.push((aumentoAnio + parseInt(anioIngreso)) + arr[j])
            }
        }
    }
    //console.log(arrExtendido);
    trimestresConcluidos(arrExtendido);
}else{
    let arr = ['-Invierno', '-Primavera', '-Otoño'];
    let arrExtendido = [];
    for(let i = 0; i < 4; ++i) {
        for(let j = 0; j < arr.length; ++j){
            if(arr[j].includes('Invierno')){
                aumentoAnio += 1;
                arrExtendido.push((aumentoAnio + parseInt(anioIngreso)) + arr[j])
            }else{
                arrExtendido.push((aumentoAnio + parseInt(anioIngreso)) + arr[j])
            }
        }
    }
    //console.log(arrExtendido);
    trimestresConcluidos(arrExtendido);
}


checaPorcentaje();

// Obtén una referencia al círculo SVG
const circle = document.getElementById('circulo');

const strokeDashOffset = parseInt(472 - (472 * (parseFloat(porcentajeConRespectoIngreso) / 100)));

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
let contMsjCreditos = document.getElementById('msj-progreso-creditos');
function mostrarMsjCreditos(){
    //let msj = document.createElement('p');
    // Aquí es checar el porcentaje y modificar el mensaje para que sea de acuerdo a su avance con algunas recomendaciones
    
    if(avancePor > 80){
        contMsjCreditos.classList.add('border-success');
        contMsjCreditos.classList.add('bg-success');
    }else if(avancePor > 35 && avancePor < 80){
        contMsjCreditos.classList.add('border-warning');
        contMsjCreditos.classList.add('bg-warning');
    }else if(avancePor > 0 && avancePor < 35){
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
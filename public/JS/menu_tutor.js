// Funciones para el menú de tutor
// Para abrir el calendario
document.getElementById('calendario').addEventListener('click', () => {
    let modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
    modal.show();
})

// Para abrir la página de cbi en otra ventana al dar click en el div
document.getElementById('pagina-cbi').addEventListener('click', () =>{
    window.open("http://cbi.azc.uam.mx/", '_blank');
})

// Obtener todos los elementos li dentro de la clase "sidebar"
var sidebarItems = document.querySelectorAll('.sidebar ul li');

// Iterar sobre cada elemento li y agregar un event listener para el evento 'click'
sidebarItems.forEach(function(item) {
    item.addEventListener('click', function() {
        // Remover la clase 'active' del elemento li que la tenga
        var activeItem = document.querySelector('.sidebar ul li.active');
        if (activeItem) {
            activeItem.classList.remove('active');
        }
        // Agregar la clase 'active' al elemento li que se hizo clic
        this.classList.add('active');
    });
});

// Obtener el elemento con la clase 'open-btn' y agregar un event listener para el evento 'click'
document.querySelector('.open-btn').addEventListener('click', function() {
    // Agregar la clase 'active' a la barra lateral
    document.querySelector('.sidebar').classList.add('active');
    document.querySelector('body').classList.add('sidebar-active')
});

// Obtener el elemento con la clase 'close-btn' y agregar un event listener para el evento 'click'
document.querySelector('.close-btn').addEventListener('click', function() {
    // Remover la clase 'active' de la barra lateral
    document.querySelector('.sidebar').classList.remove('active');
    document.querySelector('body').classList.remove('sidebar-active')
    document.querySelector('.sidebar-backdrop').style.display = 'none';
});


// Mostrar sidebar y backdrop al hacer clic en el botón del sidebar
document.querySelector('.open-btn').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.add('show');
    document.querySelector('.sidebar-backdrop').style.display = 'block';
});

// Ocultar sidebar y backdrop al hacer clic en el backdrop
document.querySelector('.sidebar-backdrop').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.remove('show');
    document.querySelector('.sidebar').classList.remove('active');
    document.querySelector('body').classList.remove('sidebar-active');
    document.querySelector('.sidebar-backdrop').style.display = 'none';
});

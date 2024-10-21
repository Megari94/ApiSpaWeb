document.getElementById("facturaAdminLink").addEventListener("click", function(event) {
    event.preventDefault();  // Evita la acción predeterminada del enlace
    window.location.href = "facturaAdmin.html";  // Redirige a la nueva página
});
document.getElementById("TurnoLink").addEventListener("click", function(event) {
    event.preventDefault();  // Evita la acción predeterminada del enlace
    window.location.href = "Turnos.html";  // Redirige a la nueva página
});
document.getElementById("ISAdminLink").addEventListener("click", function(event) {
    event.preventDefault();  // Evita la acción predeterminada del enlace
    window.location.href = "InformeServicioAdmin.html";  // Redirige a la nueva página
});
document.getElementById("IPAdminLink").addEventListener("click", function(event) {
    event.preventDefault();  // Evita la acción predeterminada del enlace
    window.location.href = "InformePagoAdmin.html";  // Redirige a la nueva página
});
document.getElementById("turnoAdminLink").addEventListener("click", function(event) {
    event.preventDefault();  // Evita la acción predeterminada del enlace
    window.location.href = "PagosAdmin.html";  // Redirige a la nueva página
});
document.getElementById("ServicioLink").addEventListener("click", function(event) {
    event.preventDefault();  // Evita la acción predeterminada del enlace
    window.location.href = "Servicios.html";  // Redirige a la nueva página
});
document.getElementById("PersonalLink").addEventListener("click", function(event) {
    event.preventDefault();  // Evita la acción predeterminada del enlace
    window.location.href = "PersonalAdmin.html";  // Redirige a la nueva página
});
document.getElementById("clienteAdminLink").addEventListener("click", function(event) {
    event.preventDefault();  // Evita la acción predeterminada del enlace
    window.location.href = "ClientesAdmin.html";  // Redirige a la nueva página
});


let etapaIdSeleccionada; // Variable global para ID de etapa seleccionada


// Función para abrir el modal para agregar servicio
function abrirModalAgregar() {
    document.getElementById('modalAgregar').style.display = 'block';
}

// Función para guardar el nuevo servicio
function guardarServicio() {
    const nombre = document.getElementById('nombreServicio').value;
    const personalCargo = document.getElementById('personalCargo').value;
    
    // Crear un nuevo objeto de etapa
    const nuevoServicio = {
        id: etapasData.length + 1, // Generar ID automáticamente
        nombre: nombre,
        etapa: '1 de 1', // Suponiendo que cada servicio es de una etapa
        personalCargo: personalCargo
    };

    etapasData.push(nuevoServicio); // Agregar el nuevo servicio a la lista
    cargarEtapas(etapasData); // Recargar la tabla
    cerrarModal('modalAgregar'); // Cerrar el modal
}

// Funciones de acción para editar
function abrirModalEditar(id) {
    etapaIdSeleccionada = id; // Guardar el ID de la etapa seleccionada
    const etapa = etapasData.find(e => e.id === id);
    document.getElementById('nombreEditar').value = etapa.nombre;
    document.getElementById('etapaEditar').value = etapa.etapa;
    document.getElementById('personalCargoEditar').value = etapa.personalCargo;
    document.getElementById('modalEditar').style.display = 'block';
}

function guardarEdicion() {
    const nombre = document.getElementById('nombreEditar').value;
    const etapa = document.getElementById('etapaEditar').value;
    const personalCargo = document.getElementById('personalCargoEditar').value;

    const etapaIndex = etapasData.findIndex(e => e.id === etapaIdSeleccionada);
    etapasData[etapaIndex] = { id: etapaIdSeleccionada, nombre, etapa, personalCargo };

    cargarEtapas(etapasData);
    cerrarModal('modalEditar');
}

// Funciones para dar de baja
function abrirModalBaja(id) {
    etapaIdSeleccionada = id; // Guardar ID de la etapa seleccionada para dar de baja
    document.getElementById('modalBaja').style.display = 'block';
}

document.getElementById('confirmarBajaBtn').onclick = function() {
    etapasData = etapasData.filter(e => e.id !== etapaIdSeleccionada);
    cargarEtapas(etapasData);
    cerrarModal('modalBaja');
};

// Función para cerrar modales
function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Cargar los datos al inicio
window.onload = function() {
    cargarEtapas(etapasData);
}

// Función para redirigir a la página de inicio de sesión
function redirectToLogin() {
    window.location.href = "index.html";
}

// Función para abrir/cerrar el menú lateral
function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    sidebar.style.display = sidebar.style.display === "block" ? "none" : "block";
}

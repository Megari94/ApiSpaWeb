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
let etapasData = [
    { id: 1, nombre: 'Masajes', etapa: '1 de 3', personalCargo: 'Carlos' },
    { id: 2, nombre: 'Manicura', etapa: '1 de 1', personalCargo: 'Marta' },
    { id: 3, nombre: 'Depilación', etapa: '1 de 1', personalCargo: 'Laura' },
    { id: 4, nombre: 'Afeitado', etapa: '1 de 1', personalCargo: 'José' }
];

let etapaIdSeleccionada; // Variable global para ID de etapa seleccionada

// Función para cargar datos en la tabla
function cargarEtapas(data) {
    const tableBody = document.getElementById('personalTableBody');
    tableBody.innerHTML = ''; // Limpiar tabla antes de cargar

    data.forEach(etapa => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${etapa.id}</td>
            <td>${etapa.nombre}</td>
            <td>${etapa.etapa}</td>
            <td>${etapa.personalCargo}</td>
            <td class="action-buttons">
                <button onclick="abrirModalEditar(${etapa.id})">Editar</button>
                <button onclick="abrirModalBaja(${etapa.id})">Dar de Baja</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para filtrar las etapas por nombre del servicio o personal a cargo
function filtrarEtapas() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredData = etapasData.filter(etapa =>
        etapa.nombre.toLowerCase().includes(searchInput) || 
        etapa.personalCargo.toLowerCase().includes(searchInput)
    );
    cargarEtapas(filteredData);
}

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

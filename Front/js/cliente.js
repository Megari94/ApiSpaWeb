// cliente.js 
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const idCliente = localStorage.getItem('idCliente');

    // Verifica si el usuario está autenticado
    if (!token) {
        window.location.href = 'login.html';
    }

    // Verifica en qué página estás
    const page = document.body.dataset.page;

    if (page === 'TurnosCliente') {
        cargarTurnos(idCliente, token);
    } else if (page === 'SolTurnoCliente') {
        cargarServicios(token);
        manejarSolicitudTurno(token, idCliente);
    }

    // Función para cerrar sesión
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.clear();
        window.location.href = 'login.html';
    });

    // Función para alternar el menú lateral
    document.getElementById('menuButton').addEventListener('click', function() {
        toggleMenu();
    });
});

function cargarTurnos(idCliente, token) {
    fetch(`https://spaadministrativo-production-4488.up.railway.app/Sesion/sesionCliente/${idCliente}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('TableBody');
        tableBody.innerHTML = '';

        data.forEach(sesion => {
            const row = document.createElement('tr');
            const costo = sesion.asistencia === "SOLICITADO" ? "a confirmar" : sesion.costo;

            // Formatear la fecha
            const fechaFormateada = formatearFecha(sesion.fecha);

            row.innerHTML = `
                <td>${sesion.asistencia}</td>  <!-- Aquí mostramos el valor tal cual -->
                <td>${costo}</td>
                <td>${fechaFormateada}</td> <!-- Aquí usamos la fecha formateada -->
                <td>${sesion.servicio}</td>
            `;
            tableBody.appendChild(row);
        });
        
    })
    .catch(error => console.error('Error al cargar turnos:', error));
}

// Función para formatear la fecha
function formatearFecha(fechaISO) {
    const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
    };
    const fecha = new Date(fechaISO);
    return new Intl.DateTimeFormat('es-ES', options).format(fecha);
}

function cargarServicios(token) {
    fetch('https://spaadministrativo-production-4488.up.railway.app/servicio/traerServicio', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const servicioSelect = document.getElementById('appointmentService');
        data.forEach(servicio => {
            const option = document.createElement('option');
            option.value = servicio.id;
            option.textContent = servicio.nombreServicio;
            servicioSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error al cargar servicios:', error));
}

function manejarSolicitudTurno(token, idCliente) {
    document.getElementById('appointmentForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Obtenemos la fecha seleccionada por el usuario
        const fechaInput = document.getElementById('appointmentDate').value;

        // Convertimos la fecha al formato local con la zona horaria correcta
        const fechaLocal = new Date(fechaInput);

        // Convertir la fecha a UTC para enviarla sin el problema de las 3 horas
        const fechaUTC = new Date(fechaLocal.getTime() - (fechaLocal.getTimezoneOffset() * 60000)).toISOString();

        const servicioId = document.getElementById('appointmentService').value;

        fetch('https://spaadministrativo-production-4488.up.railway.app/Sesion/agregarSesion', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_Cliente: idCliente,
                id_Servicio: servicioId,
                fecha: fechaUTC,  // Envía la fecha en formato UTC
                costo: 0.0,
                asistencia: "SOLICITADO"
            })
        })
        .then(response => {
            if (response.ok) {
                alert('Turno guardado con éxito');
                // Redirigir o actualizar la página según sea necesario
            } else {
                alert('Error al guardar el turno');
            }
        })
        .catch(error => console.error('Error al solicitar turno:', error));
    });
}

function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}
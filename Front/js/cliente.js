// cliente.js 
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const idCliente = localStorage.getItem('idCliente');

    // Verifica si el usuario está autenticado
    if (!token) {
        window.location.href = 'Login.html';
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
        window.location.href = 'Login.html';
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
            const costo = sesion.costo === 0 ? "a confirmar" : sesion.costo;
            
            // Determinar la clase CSS según el estado
            let claseEstado = '';
            if (sesion.asistencia === "RECHAZADO") {
                claseEstado = 'estado-rechazado'; // Clase para estado rechazado
            } else if (sesion.asistencia === "CONFIRMADO") {
                claseEstado = 'estado-confirmado'; // Clase para estado confirmado
            }

            // Formatear la fecha
            const fechaFormateada = formatearFecha(sesion.fecha);

            row.innerHTML = `
                <td class="${claseEstado}">${sesion.asistencia}</td> 
                <td>${costo}</td>
                <td>${fechaFormateada}</td> <!-- Aquí usamos la fecha formateada -->
                <td>${sesion.servicio}</td>
                <td> 
                    <button class="btn-editar" onclick="mostrarModal('modalPagar')">Pagar</button>
                    <button class="btn-baja" onclick="mostrarModal('modalRegistrar')">Registrar operacion</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error al cargar turnos:', error));
}


// Función para mostrar el modal
function mostrarModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

// Función para cerrar el modal
function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Funciones de confirmación
function confirmarPago() {
    alert('Pago confirmado');
    cerrarModal('modalPagar');
}

function confirmarRegistro() {
    alert('Registro confirmado');
    cerrarModal('modalRegistrar');
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

        // Obtenemos la fecha y hora seleccionadas por el usuario
        const fechaHoraInput = document.getElementById('appointmentDateTime').value; // Cambiado aquí

        // Crear objeto Date para asegurarse de que la fecha y hora sean válidas
        const fechaLocal = new Date(fechaHoraInput); // Esto crea la fecha local

        // Obtener el año, mes, día, hora y minuto
        const year = fechaLocal.getFullYear();
        const month = String(fechaLocal.getMonth() + 1).padStart(2, '0'); // Los meses son base 0
        const day = String(fechaLocal.getDate()).padStart(2, '0');
        const hour = String(fechaLocal.getHours()).padStart(2, '0');
        const minute = String(fechaLocal.getMinutes()).padStart(2, '0');

        // Formato de fecha LocalDateTime sin 'Z'
        const formattedDate = `${year}-${month}-${day}T${hour}:${minute}`; // Aquí estamos formateando correctamente

        const servicioId = document.getElementById('appointmentService').value;
 // Obtener el método de pago seleccionado
        const metPago = document.getElementById('paymentMethod').value;
        
        fetch('https://spaadministrativo-production-4488.up.railway.app/Sesion/agregarSesion', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_Cliente: idCliente,
                id_Servicio: servicioId,
                fecha: formattedDate,  // Enviamos la fecha y hora en formato LocalDateTime
                costo: 0.0,
                asistencia: "SOLICITADO",
                 metPago: metPago
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

document.addEventListener('DOMContentLoaded', () => {
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const paymentMethods = ["TRANSFERENCIA", "EFECTIVO", "TARJETA"];

    paymentMethods.forEach(method => {
        const option = document.createElement('option');
        option.value = method; // Asigna el valor en mayúsculas
        option.textContent = method;
        paymentMethodSelect.appendChild(option);
    });
});


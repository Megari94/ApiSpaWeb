document.addEventListener('DOMContentLoaded', function () {
    // Obtén el token y el ID de personal guardado en localStorage
    const token = localStorage.getItem('token');
    const idPersonal = localStorage.getItem('idPersonal');
    console.log('Token:', token); // Verificar el valor
    console.log('ID de Personal:', idPersonal); // Verificar el valor

    // Verifica si el personal está autenticado
    if (!token) {
        // Redirige a la página de login si no hay un token
        window.location.href = '../Login.html';
    }

    // Verifica en qué página estás usando el dataset de la página
    const page = document.body.dataset.page;

    if (page === 'TurnosPersonal') {
        cargarTurnos(Number(idPersonal));  // Convierte idPersonal a número antes de pasar
    } else if (page === 'RegistrarTurno') {
        cargarServicios(token);
        manejarSolicitudTurno(token, idPersonal);
    }

    // Cerrar sesión
    document.getElementById('logoutBtn').addEventListener('click', function () {
        localStorage.clear();  // Limpiar todo en localStorage
        window.location.href = '../Login.html';  // Redirige al login
    });

    // Alternar el menú lateral
    document.getElementById('menuButton').addEventListener('click', function () {
        toggleMenu();
    });
});

// Función para manejar el inicio de sesión con la API
function login(username, password) {
    fetch('https://spaadministrativo-production-4488.up.railway.app/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Datos recibidos de la API:', data);
        if (data.success) {
            // Almacena los datos en localStorage
            localStorage.setItem('token', data.token); // Si tienes token de autenticación
            localStorage.setItem('idPersonal', data.Id); // Guarda el ID del usuario
            localStorage.setItem('nombre_usuario', data.nombre_usuario); // Guarda el nombre de usuario
            localStorage.setItem('rol', data.rol); // Guarda el rol

            // Verifica que los valores se hayan almacenado correctamente
            console.log('Token almacenado:', data.token);
            console.log('ID de Personal almacenado:', data.Id);

            // Redirige a la página correspondiente según el rol
            if (data.rol === 'Personal') {
                window.location.href = 'personal/Personal.html';
            } else {
                alert('Rol no autorizado.');
            }
        } else {
            alert(data.message || 'Error en el inicio de sesión');
        }
    })
    .catch(error => {
        console.error('Error en el inicio de sesión:', error);
        alert('Hubo un error al intentar iniciar sesión.');
    });
}

// Función para cargar los turnos del personal
function cargarTurnos(idPersonal) {
    fetch(`https://spaadministrativo-production-4488.up.railway.app/personal/turnos/${idPersonal}`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        const tableBody = document.getElementById('TableBody');
        tableBody.innerHTML = '';  // Limpiar la tabla antes de llenarla

        // Filtrar las sesiones para mostrar solo los confirmados
        const sesionesConfirmadas = data.filter(sesion => sesion.asistencia === 'CONFIRMADO');

        // Iterar sobre las sesiones confirmadas y agregarlas a la tabla
        sesionesConfirmadas.forEach(sesion => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${sesion.idA}</td>
                <td>${sesion.asistencia}</td>
                <td>${sesion.costo}</td>
                <td>${formatearFecha(sesion.fecha)}</td>  <!-- Aquí aplicamos el formato de fecha -->
                <td>${sesion.nombreCliente}</td>
                <td>${sesion.servicio}</td>          
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error al cargar los turnos:', error);
        alert('Hubo un error al cargar los turnos.');
    });
}

// Función para formatear la fecha en el formato deseado
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

// Función para alternar el menú lateral
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Función para filtrar los turnos
function filtrarTurnos() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const tableBody = document.getElementById('TableBody');
    const rows = tableBody.getElementsByTagName('tr');

    // Itera sobre todas las filas de la tabla
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let found = false;

        // Verifica si hay celdas en la fila
        if (cells.length > 0) {
            // Obtiene el contenido de las celdas relevantes
            const nombreCliente = cells[4].textContent.toLowerCase(); // Nombre Cliente
            const nombreServicio = cells[5].textContent.toLowerCase(); // Nombre Servicio
            const fecha = cells[3].textContent.toLowerCase(); // Fecha
            
            // Verifica si el texto de búsqueda coincide con alguna de las celdas
            if (nombreCliente.includes(searchInput) || nombreServicio.includes(searchInput) || fecha.includes(searchInput)) {
                found = true; // Coincide
            }
        }

        // Muestra u oculta la fila según el resultado de la búsqueda
        rows[i].style.display = found ? '' : 'none';
    }
}

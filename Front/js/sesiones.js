async function loadSessionsAdmin() {
    try {
        // 1. Obtener todas las sesiones desde el nuevo endpoint
        const responseSesiones = await fetch('https://spaadministrativo-production-4488.up.railway.app/Sesion/traerAdmin', {
            method: 'GET'
        });

        if (!responseSesiones.ok) {
            console.error('Error al obtener las sesiones:', responseSesiones.statusText);
            return;
        }

        const sesiones = await responseSesiones.json();

        // 2. Mostrar la tabla con los datos obtenidos
        displaySessions(sesiones);
    } catch (error) {
        console.error('Error al conectarse al servidor:', error);
    }
}

function displaySessions(sesiones) {
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = ''; // Limpiar la tabla

    sesiones.forEach((sesion) => {
        const row = document.createElement('tr');
        const fechaFormateada = formatearFecha(sesion.fecha);

        row.innerHTML = `
            <td>${sesion.id}</td>
            <td>${sesion.asistencia}</td>
            <td>${sesion.costo}</td>
            <td>${fechaFormateada}</td>
            <td>${sesion.nombre_completo} </td>
            <td>${sesion.nombre_servicio}</td>
            <td>
                <div class="button-group">
                    <button class="btn-aceptar" onclick="aceptarSolicitud('${sesion.id}', '${sesion.nombre_completo}, '${sesion.nombre_servicio}', ${sesion.costo})">Aceptar</button>
                    <button class="btn-rechazar" onclick="rechazarSolicitud('${sesion.id}')">Denegar</button>
                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Llamar a la función al cargar la página
window.onload = loadSessionsAdmin;

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

// Llamada para obtener los turnos desde la API
async function obtenerTurnos() {
    try {
        const response = await fetch('https://spaadministrativo-production-4488.up.railway.app/Sesion/traerAdmin');
        const turnos = await response.json();

        // Llenar la tabla con los datos obtenidos
        const tableBody = document.getElementById('TableBody');
        tableBody.innerHTML = ''; // Limpiar la tabla antes de insertar los datos

        turnos.forEach(turno => {
            // Mostrar solo turnos que estén en estado 'confirmado' o 'cancelado'
            if (turno.estado === 'CONFIRMADO' || turno.estado === 'CANCELADO') {
                const fila = document.createElement('tr');
                
                fila.innerHTML = `
                    <td>${turno.id}</td>
                    <td>${turno.asistencia}</td>
                    <td>${turno.costo}</td>
                    <td>${turno.fecha}</td>
                    <td>${turno.nombre_completo}</td>
                    <td>${turno.nombre_servicio}</td>
                    <td>
                        <button onclick="cancelarTurno(${turno.id})" class="cancelar-btn">Cancelar</button>
                    </td>
                `;

                tableBody.appendChild(fila);
            }
        });
    } catch (error) {
        console.error('Error al obtener los turnos:', error);
    }
}

// Función para cancelar el turno
async function cancelarTurno(turnoId) {
    try {
        const respuesta = confirm("¿Estás seguro de que deseas cancelar este turno?");
        if (respuesta) {
            // Actualizar el estado del turno en la base de datos (PUT o POST según API)
            const response = await fetch(`https://spaadministrativo-production-4488.up.railway.app/Sesion/cancelar/${turnoId}`, {
                method: 'PUT', // Ajustar el método según la API (puede ser PUT o POST)
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ estado: 'Cancelado' }) // Mandar el estado actualizado
            });

            if (response.ok) {
                alert('Turno cancelado exitosamente.');
                obtenerTurnos(); // Refrescar la tabla con los nuevos datos
            } else {
                alert('Error al cancelar el turno.');
            }
        }
    } catch (error) {
        console.error('Error al cancelar el turno:', error);
    }
}

// Llamar a la función para obtener los turnos al cargar la página
document.addEventListener('DOMContentLoaded', obtenerTurnos);

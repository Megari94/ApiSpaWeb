let turnos = []; // Variable global para almacenar los turnos obtenidos

// Llamada para obtener los turnos desde la API
async function obtenerTurnos() {
    try {
        const response = await fetch('https://spaadministrativo-production-4488.up.railway.app/Sesion/traerAdmin');
        turnos = await response.json(); // Guardar los turnos en la variable global

        mostrarTurnos(turnos); // Llenar la tabla con los datos obtenidos
    } catch (error) {
        console.error('Error al obtener los turnos:', error);
    }
}

// Función para mostrar los turnos en la tabla
function mostrarTurnos(turnosAmostrar) {
    const tableBody = document.getElementById('TableBody');
    tableBody.innerHTML = ''; // Limpiar la tabla antes de insertar los datos

    turnosAmostrar.forEach(turno => {
        // Mostrar solo turnos que estén en estado 'confirmado' o 'cancelado'
        if (turno.asistencia === 'CONFIRMADO' || turno.asistencia === 'CANCELADO') {
            const claseAsistencia = turno.asistencia === 'CANCELADO' ? 'asistencia-cancelado' : 'asistencia-confirmado';
            const fila = document.createElement('tr');

            fila.innerHTML = `
                <td>${turno.id}</td>
                <td class="${claseAsistencia}">${turno.asistencia}</td>
                <td>${turno.costo}</td>
                <td>${turno.fecha}</td>
                <td>${turno.nombre_completo}</td>
                <td>${turno.nombre_servicio}</td>
            `;
            if (turno.asistencia !== 'CANCELADO') {
                fila.innerHTML += `
                    <td>
                        <button onclick="cancelarTurno(${turno.id}, this)" class="cancelar-btn">Cancelar</button>
                    </td>
                `;
            } else {
                // Si está cancelado, dejar la columna vacía o con un texto de "Cancelado"
                fila.innerHTML += `<td></td>`;
            }

            tableBody.appendChild(fila);
        }
    });
}

// Función para filtrar turnos por nombre del cliente
function filtrarTurnos() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase(); // Obtener el valor del input
    const turnosFiltrados = turnos.filter(turno => 
        turno.nombre_completo.toLowerCase().includes(searchInput) // Filtrar por nombre completo
    );

    mostrarTurnos(turnosFiltrados); // Mostrar los turnos filtrados
}

// Función para cancelar el turno
async function cancelarTurno(turnoId, boton) {
    try {
        // Actualizar el estado del turno en la base de datos
        const response = await fetch(`https://spaadministrativo-production-4488.up.railway.app/Sesion/cancelar/${turnoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ estado: 'Cancelado' }) // Mandar el estado actualizado
        });

        if (response.ok) {
            boton.remove(); // Eliminar el botón de cancelar
            obtenerTurnos(); // Volver a obtener y mostrar los turnos
        } else {
            alert('Error al cancelar el turno.');
        }
    } catch (error) {
        console.error('Error al cancelar el turno:', error);
    }
}

// Llamar a la función para obtener los turnos al cargar la página
document.addEventListener('DOMContentLoaded', obtenerTurnos);

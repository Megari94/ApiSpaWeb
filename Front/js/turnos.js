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
    } catch (error) {
        console.error('Error al obtener los turnos:', error);
    }
}
function filtrarTurnos() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase(); // Obtener el valor del input
    const turnosFiltrados = turnos.filter(turno => 
        turno.nombre_completo.toLowerCase().includes(searchInput) // Filtrar por nombre completo
    );

    mostrarTurnos(turnosFiltrados); // Mostrar los turnos filtrados
}
// Función para cancelar el turno
// Función para cancelar el turno sin preguntar y actualizar la interfaz
async function cancelarTurno(turnoId, boton) {
    try {
        // Actualizar el estado del turno en la base de datos (PUT o POST según API)
        const response = await fetch(`https://spaadministrativo-production-4488.up.railway.app/Sesion/cancelar/${turnoId}`, {
            method: 'PUT', // Ajustar el método según la API
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ estado: 'Cancelado' }) // Mandar el estado actualizado
        });

        if (response.ok) {
            // Cambiar el texto del botón o eliminarlo de la interfaz
            boton.remove(); // Eliminar el botón de cancelar
            obtenerTurnos(); 
            // También podrías actualizar el estado del turno directamente en la tabla si lo deseas
        } else {
            alert('Error al cancelar el turno.');
        }
    } catch (error) {
        console.error('Error al cancelar el turno:', error);
    }
}


// Llamar a la función para obtener los turnos al cargar la página
document.addEventListener('DOMContentLoaded', obtenerTurnos);

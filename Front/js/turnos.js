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

 function agregarTurno() {
            // Muestra el modal al hacer clic en "Agregar Turno"
            const modal = document.getElementById('modalAgregarPersonal');
            modal.style.display = 'block';
             obtenerClientes();
        }

        function cerrarModalAlHacerClickFuera(event, modalId) {
            const modal = document.getElementById(modalId);
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        }let clientes = [];

// Función para obtener los clientes de la API
async function obtenerClientes() {
    try {
        const response = await fetch("https://spaadministrativo-production-4488.up.railway.app/clientes/traerClientesAdmin");
        clientes = await response.json();
    } catch (error) {
        console.error("Error al obtener los clientes:", error);
    }
}

// Función para filtrar los clientes según el input
function filtrarClientes() {
    const input = document.getElementById('nombreUsuario').value.toLowerCase();
    const select = document.getElementById('clienteSelect');
    select.innerHTML = ''; // Limpiar las opciones

    if (input.length > 0) {
        const clientesFiltrados = clientes.filter(cliente =>
            cliente.nombre.toLowerCase().includes(input) || 
            cliente.apellido.toLowerCase().includes(input)
        );

        if (clientesFiltrados.length > 0) {
            select.style.display = 'block'; // Mostrar la lista desplegable
           
            clientesFiltrados.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente.id; // Suponiendo que cada cliente tiene un ID
                option.textContent = `${cliente.nombre} ${cliente.apellido}`;
                select.appendChild(option);
            });
        } else {
            select.style.display = 'none'; // Ocultar si no hay coincidencias
        }
    } else {
        select.style.display = 'none'; // Ocultar si el input está vacío
    }
}

// Función para seleccionar un cliente de la lista
function seleccionarCliente() {
    const select = document.getElementById('clienteSelect');
    const selectedOption = select.options[select.selectedIndex];
    
    if (selectedOption) {
        document.getElementById('nombreUsuario').value = selectedOption.textContent; // Llenar el input con el nombre completo
        select.style.display = 'none'; // Ocultar la lista después de seleccionar
    }
}

// Llama a la función para obtener los clientes cuando se carga la página
document.addEventListener('DOMContentLoaded', obtenerClientes);

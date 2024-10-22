
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

// Función para obtener y formatear la fecha y hora
function obtenerFechaHoraFormateada() {
    const fechaHora = document.getElementById('fechaHora').value; // Obtiene la fecha y hora del input

    if (fechaHora) {
        const fechaFormateada = formatearFecha(fechaHora); // Formatea la fecha
        console.log("Fecha y hora formateada:", fechaFormateada);

        return fechaFormateada;
    } else {
        console.error("No se ha seleccionado una fecha y hora.");
        return null;
    }
}

// Llama a la función cuando el usuario envíe el formulario
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto

    const fechaHoraFinal = obtenerFechaHoraFormateada(); // Obtén la fecha y hora formateada
    if (fechaHoraFinal) {
        alert(`Fecha y hora seleccionada: ${fechaHoraFinal}`); // Muestra la fecha y hora formateada
    }

    // Aquí puedes procesar la fecha y hora formateada según lo que necesites
});


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

let servicios = []; // Variable para almacenar los servicios

// Función para obtener los servicios de la API
async function obtenerServicios() {
    try {
        const response = await fetch("https://spaadministrativo-production-4488.up.railway.app/servicio/traerServicio");
        servicios = await response.json(); // Guardar los servicios en la variable
    } catch (error) {
        console.error("Error al obtener los servicios:", error);
    }
}

// Llama a la función para obtener los servicios cuando se carga la página
document.addEventListener('DOMContentLoaded', obtenerServicios);

// Función para filtrar los servicios según el input
function filtrarServicios() {
    const input = document.getElementById('servicioInput').value.toLowerCase();
    const select = document.getElementById('servicioSelect');
    select.innerHTML = ''; // Limpiar las opciones

    if (input.length > 0) {
        const serviciosFiltrados = servicios.filter(servicio =>
            servicio.nombreServicio.toLowerCase().includes(input) // Filtrar por nombre de servicio
        );

        if (serviciosFiltrados.length > 0) {
            select.style.display = 'block'; // Mostrar la lista desplegable

            serviciosFiltrados.forEach(servicio => {
                const option = document.createElement('option');
                option.value = servicio.id; // Usar el ID del servicio
                option.textContent = servicio.nombreServicio; // Mostrar el nombre
                select.appendChild(option);
            });
        } else {
            select.style.display = 'none'; // Ocultar si no hay coincidencias
        }
    } else {
        select.style.display = 'none'; // Ocultar si el input está vacío
    }
}

// Función para seleccionar un servicio de la lista
function seleccionarServicio() {
    const select = document.getElementById('servicioSelect');
    const selectedOption = select.options[select.selectedIndex];

    if (selectedOption) {
        document.getElementById('servicioInput').value = selectedOption.textContent; // Llenar el input con el nombre del servicio
        select.style.display = 'none'; // Ocultar la lista después de seleccionar
    }
}

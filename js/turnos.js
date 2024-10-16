document.addEventListener("DOMContentLoaded", () => {
    getTurnosData(); // Llama a la función para obtener los datos al cargar la página
});

// Función para obtener los datos de los turnos
async function getTurnosData() {
    try {
        const response = await fetch("http://localhost:8080/Sesion/traer");
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const turnos = await response.json();
        populateTable(turnos);
    } catch (error) {
        console.error("Error al obtener los datos de los turnos:", error);
    }
}

// Función para llenar la tabla con los datos obtenidos
function populateTable(turnos) {
    const tableBody = document.querySelector("#turnosTable tbody");
    tableBody.innerHTML = ""; // Limpia el contenido existente

    turnos.forEach(turno => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${turno.id}</td>
            <td>${turno.asistencia}</td>
            <td>${turno.costo}</td>
            <td>${turno.fecha}</td>
            <td>${turno.clienteId}</td>
            <td>${turno.servicioId}</td>
            <td>
                <button onclick="editTurno(${turno.id})">Editar</button>
                <button onclick="deleteTurno(${turno.id})">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para editar un turno
function editTurno(id) {
    alert(`Editando turno con ID: ${id}`);
    // Aquí puedes implementar la lógica para editar el turno
}

// Función para eliminar un turno
function deleteTurno(id) {
    if (confirm(`¿Estás seguro de que deseas eliminar el turno con ID: ${id}?`)) {
        alert(`Eliminando turno con ID: ${id}`);
        // Aquí puedes implementar la lógica para eliminar el turno
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM completamente cargado y analizado");
    cargarServicios();
});

function cargarServicios() {
    console.log("Cargando servicios...");
    fetch("https://spaadministrativo-production-4488.up.railway.app/servicio/traerServicioAdmin", {
    })
    .then(response => {
        console.log("Respuesta del servidor:", response);
        if (!response.ok) {
            throw new Error("Error al obtener los servicios: " + response.statusText);
        }
        return response.json();
    })
    .then(servicios => {
        console.log("Servicios obtenidos:", servicios);
        const tableBody = document.getElementById("personalTableBody");
        tableBody.innerHTML = ""; // Limpiar el contenido actual

        servicios.forEach(servicio => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${servicio.id}</td>
                <td>${servicio.nombreServicio}</td>
                <td>${servicio.nroEtapas}</td>
                <td>${servicio.personalNombre || 'N/A'} ${servicio.personalApellido || 'N/A'}</td>
                <td>
                    <button onclick="abrirModalEditar(${servicio.id})">Editar</button>
                    <button onclick="confirmarBaja(${servicio.id})">Dar de baja</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error("Error al cargar servicios:", error.message);
        alert("No se pueden cargar los servicios en este momento.");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    cargarServicios();
});

function cargarServicios() {
    fetch("/servicio/traerServicioAdmin") // Asegúrate de que la URL sea correcta
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener los servicios");
            }
            return response.json();
        })
        .then(servicios => {
            const tableBody = document.getElementById("personalTableBody");
            tableBody.innerHTML = ""; // Limpiar el contenido actual

            servicios.forEach(servicio => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${servicio.id}</td>
                    <td>${servicio.nombreServicio}</td>
                    <td>${servicio.nroEtapas}</td>
                    <td>${servicio.personalNombre || 'N/A'}</td>
                    <td>
                        <button onclick="abrirModalEditar(${servicio.id})">Editar</button>
                        <button onclick="confirmarBaja(${servicio.id})">Dar de baja</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error:", error);
        });
}





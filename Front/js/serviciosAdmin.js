document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM completamente cargado y analizado");
    cargarServicios();

    // Agrega un evento de entrada para el campo de búsqueda
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", filtrarEtapas);
});

let serviciosData = []; // Variable global para almacenar los servicios

function cargarServicios() {
    console.log("Cargando servicios...");
    fetch("https://spaadministrativo-production-4488.up.railway.app/servicio/traerServicioAdmin")
        .then(response => {
            console.log("Respuesta del servidor:", response);
            if (!response.ok) {
                throw new Error("Error al obtener los servicios: " + response.statusText);
            }
            return response.json();
        })
        .then(servicios => {
            console.log("Servicios obtenidos:", servicios);
            serviciosData = servicios; // Guardamos los servicios en la variable global
            mostrarServicios(serviciosData); // Muestra los servicios al cargar
        })
        .catch(error => {
            console.error("Error al cargar servicios:", error.message);
            alert("No se pueden cargar los servicios en este momento.");
        });
}

function mostrarServicios(servicios) {
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
}

function filtrarEtapas() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    console.log("Filtro aplicado:", searchInput); // Debugging: Ver el valor del filtro

    // Asegúrate de que serviciosData esté inicializado antes de filtrar
    if (serviciosData.length === 0) {
        console.log("No hay servicios disponibles para filtrar.");
        return; // Salir si no hay servicios
    }

    const filteredServicios = serviciosData.filter(servicio => {
        const nombreServicio = servicio.nombreServicio.toLowerCase();
        const personalCompleto = `${servicio.personalNombre || ''} ${servicio.personalApellido || ''}`.toLowerCase();
        
        // Debugging: Ver qué servicios se están comparando
        console.log(`Comparando "${nombreServicio}" y "${personalCompleto}" con "${searchInput}"`);

        return nombreServicio.includes(searchInput) || personalCompleto.includes(searchInput);
    });

    mostrarServicios(filteredServicios); // Mostrar los servicios filtrados
}

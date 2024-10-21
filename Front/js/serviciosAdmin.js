document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM completamente cargado y analizado");
    cargarServicios();

    // Agrega un evento de entrada para el campo de búsqueda
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", filtrarEtapas);
});


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
function abrirModalAgregar() {
    cargarPersonal(); // Cargar el personal antes de abrir el modal
    document.getElementById("modalAgregar").style.display = "block";
}
function guardarServicio() {
    const nombreServicio = document.getElementById('nombreServicio').value;
    const nroEtapas = document.getElementById('etapasServicio').value;
    const personalId = document.getElementById('personalCargo').value;

    // Crear el objeto servicio
    const nuevoServicio = {
        id: null, // ID se maneja automáticamente en el backend
        nombreServicio: nombreServicio,
        nroEtapas: parseInt(nroEtapas), // Asegurarte de que sea un número
        personalId: parseInt(personalId) // Asegurarte de que sea un número
    };

    // Enviar el objeto al servidor
    fetch("https://spaadministrativo-production-4488.up.railway.app/servicio/crearAdmin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoServicio)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al guardar el servicio: " + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log("Servicio guardado:", data);
        // Recargar los datos de servicios o cerrar el modal
        cargarServicios(); // Asumiendo que tienes una función para cargar servicios
        cerrarModal('modalAgregar'); // Cierra el modal después de guardar
    })
    .catch(error => {
        console.error("Error al guardar el servicio:", error);
        alert("No se pudo guardar el servicio. Intente nuevamente.");
    });
}


function abrirModalEditar(servicioId) {
    const servicio = serviciosData.find(s => s.id === servicioId);
    if (servicio) {
        document.getElementById("nombreEditar").value = servicio.nombreServicio;
        document.getElementById("etapaEditar").value = servicio.nroEtapas; // Cambia si el nombre del campo es diferente

        // Llamamos a cargarPersonal para asegurarnos de que el desplegable esté actualizado
        cargarPersonal().then(() => {
            // Una vez que el personal esté cargado, seleccionamos el personal correspondiente
            document.getElementById("personalCargoEditar").value = servicio.personal.id; // Asegúrate de que el ID esté correctamente mapeado
        });

        // Guarda el ID del servicio para su uso en la función de guardado
        document.getElementById("formEditar").setAttribute("data-servicio-id", servicioId);
        
        // Abre el modal
        document.getElementById("modalEditar").style.display = "block";
    }
}

function cargarPersonal() {
    return fetch("https://spaadministrativo-production-4488.up.railway.app/Personal/PersonalDTO")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener el personal: " + response.statusText);
            }
            return response.json();
        })
        .then(personal => {
            const selectAgregar = document.getElementById("personalCargo");
            const selectEditar = document.getElementById("personalCargoEditar");

            // Limpiar las opciones existentes
            selectAgregar.innerHTML = "";
            selectEditar.innerHTML = "";

            // Crear opciones y agregarlas a los selects
            personal.forEach(p => {
                const option = document.createElement("option");
                option.value = p.id; // El valor será el ID del personal
                option.text = p.nombre_Completo; // El texto será el nombre completo

                // Añadir la opción a ambos selects
                selectAgregar.appendChild(option.cloneNode(true));
                selectEditar.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error al cargar el personal:", error.message);
            alert("No se puede cargar el personal en este momento.");
        });
}

function guardarEdicion() {
    const servicioId = document.getElementById("formEditar").getAttribute("data-servicio-id");
    const nombreServicio = document.getElementById("nombreEditar").value;
    const nroEtapas = document.getElementById("etapaEditar").value; // Asegúrate que el nombre de la variable coincida
    const personalId = document.getElementById("personalCargoEditar").value; // Asegúrate que esto se mapee correctamente

    const servicioActualizado = {
        id: servicioId,
        nombreServicio: nombreServicio,
        nroEtapas: nroEtapas,
        personalId: personalId
    };

    fetch(`https://spaadministrativo-production-4488.up.railway.app/servicio/editarII`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(servicioActualizado)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al editar el servicio: " + response.statusText);
        }
        return response.json(); // Puedes omitir esto si no necesitas manejar la respuesta
    })
    .then(() => {
        alert("Servicio editado con éxito");
        cargarServicios(); // Recargar servicios después de editar
        cerrarModal("modalEditar"); // Cierra el modal
    })
    .catch(error => {
        console.error("Error al editar el servicio:", error.message);
        alert("No se pudo editar el servicio.");
    });
}
let serviciosData = []; // Variable global para almacenar los servicios
function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}


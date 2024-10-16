document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("personal-table-body");

    // Función para obtener los datos de la API
    function getPersonalData() {
        fetch('https://spaadministrativo-production-4488.up.railway.app/Personal/traer')
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la respuesta de la API");
                }
                return response.json();
            })
            .then(data => {
                populateTable(data);
            })
            .catch(error => {
                console.error("Error al obtener los datos del personal:", error);
            });
    }

    // Función para llenar la tabla con los datos obtenidos
    function populateTable(personalData) {
        personalData.forEach(personal => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${personal.id}</td>
                <td>${personal.contrasenia}</td>
                <td>${personal.nombre_usuario}</td>
                <td>${personal.apellido}</td>
                <td>${personal.correo}</td>
                <td>
                    <a href="#" class="edit"><i class="fas fa-edit"></i></a>
                    <a href="#" class="delete"><i class="fas fa-trash-alt"></i></a>
                </td>
            `;

            tableBody.appendChild(row);
        });
    }

    // Llama a la función para obtener los datos cuando la página se cargue
    getPersonalData();
});

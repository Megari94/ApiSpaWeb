document.addEventListener("DOMContentLoaded", function () {
    cargarPersonal(); // Llama a la función para cargar el personal al cargar la página
});

function cargarPersonal() {
    return fetch("https://spaadministrativo-production-4488.up.railway.app/Personal/PersonalDTO")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener el personal: " + response.status + " " + response.statusText);
            }
            return response.json();
        })
        .then(personal => {
            const selectPersonal = document.getElementById("apellidoPersonal");

            if (!selectPersonal) {
                throw new Error("No se encontró el elemento select con el ID 'apellidoPersonal'");
            }

            // Limpiar las opciones existentes
            selectPersonal.innerHTML = "<option value=''>Seleccione un personal</option>";

            // Crear opciones y agregarlas al select
            personal.forEach(p => {
                const option = document.createElement("option");
                option.value = p.id; // El valor será el ID del personal
                option.text = p.nombre_Completo; // El texto será el nombre completo
                selectPersonal.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error al cargar el personal:", error.message);
            alert("No se puede cargar el personal en este momento. " + error.message);
        });
}

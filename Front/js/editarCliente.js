// editarCliente.js

document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const idCliente = localStorage.getItem('idCliente');

    // Verifica si el usuario está autenticado
    if (!token) {
        window.location.href = 'Login.html';
    }

    // Manejar la edición de la información del cliente
    manejarEdicionCliente(idCliente, token);
});

// Manejar la edición de la información del cliente
function manejarEdicionCliente(idCliente, token) {
    document.getElementById('personalInfoForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir el envío del formulario por defecto

        // Obtener los nuevos valores del formulario
        const newNombre = document.getElementById('firstName').value;
        const newApellido = document.getElementById('lastName').value;
        const newUsuario = document.getElementById('username').value;
        const newCorreo = document.getElementById('email').value;
        const newContrasenia = document.getElementById('password').value;

        // Crear parámetros de consulta
        const params = new URLSearchParams({
            nombre: newNombre,
            apellido: newApellido,
            nombre_usuario: newUsuario,
            correo: newCorreo,
            contrasenia: newContrasenia
        });

        // Realizar la solicitud PUT para editar el cliente
        fetch(`https://spaadministrativo-production-4488.up.railway.app/clientes/editar/${idCliente}?${params.toString()}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Información del cliente actualizada con éxito');
                location.reload();
            } else {
                alert('Error al actualizar la información del cliente');
            }
        })
        .catch(error => console.error('Error al editar el cliente:', error));
    });
}

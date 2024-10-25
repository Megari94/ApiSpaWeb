// editarCliente.js

document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const idCliente = localStorage.getItem('idCliente');

    // Verifica si el usuario está autenticado
    if (!token) {
        window.location.href = 'Login.html';
    }

    if (document.body.dataset.page === 'EditarInfoCliente') {
        cargarInformacionCliente(idCliente, token);
        manejarEdicionCliente(idCliente, token);
    }
});

// Cargar información del cliente en el formulario de edición
function cargarInformacionCliente(idCliente, token) {
    fetch(`https://spaadministrativo-production-4488.up.railway.app/clientes/encontrarClienteDTO/${idCliente}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(cliente => {
        document.getElementById('firstName').value = cliente.nombre;
        document.getElementById('lastName').value = cliente.apellido;
        document.getElementById('username').value = cliente.nombre_usuario;
        document.getElementById('email').value = cliente.correo;
    })
    .catch(error => console.error('Error al cargar información del cliente:', error));
}

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

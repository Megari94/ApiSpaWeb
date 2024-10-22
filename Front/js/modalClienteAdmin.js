function abrirModalEditarCliente(id) {
    const cliente = clientesData.find(c => c.id === id); // Cambié personalData a clientesData

    if (cliente) {
        clienteIdSeleccionado = id; // Variable para almacenar el ID seleccionado
        document.getElementById('nombreEditar').value = cliente.nombre;
        document.getElementById('apellidoEditar').value = cliente.apellido;
        document.getElementById('correoEditar').value = cliente.correo;
        document.getElementById('contrasenaEditar').value = cliente.contrasenia;
        document.getElementById('nombreUsuarioEditar').value = cliente.nombre_usuario;
        document.getElementById('modalEditarCliente').style.display = 'block'; // Asegúrate de tener un modal con este ID
    }
}
async function guardarEdicionCliente() {
    const nombre = document.getElementById('nombreEditar').value;
    const apellido = document.getElementById('apellidoEditar').value;
    const correo = document.getElementById('correoEditar').value;
    const contrasena = document.getElementById('contrasenaEditar').value;
    const nombreUsuario = document.getElementById('nombreUsuarioEditar').value;
    const clienteId = clienteIdSeleccionado;

    // Verifica que todos los campos tengan valores
    if (nombre && apellido && correo && contrasena && nombreUsuario) {
        const clienteActualizado = {
            id: clienteId,
            nombre,
            apellido,
            correo,
            contrasenia: contrasena,
            nombre_usuario: nombreUsuario
        };

        try {
            const response = await fetch(https://spaadministrativo-production-4488.up.railway.app/clientes/editar/${clienteId}, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clienteActualizado),
            });

            if (response.ok) {
                cargarClientes(); // Recargar la lista de clientes
                cerrarModal('modalEditarCliente');
            } else {
                console.error('Error al editar el cliente');
            }
        } catch (error) {
            console.error('Error al editar el cliente:', error);
        }
    } else {
        console.error('Por favor, completa todos los campos.');
    }
}
    function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}//// Cargar la tabla cuando la página se carga por primera vez
window.onload = function() {
    cargarClientes(); // Cambié cargarPersonal a cargarClientes
};
};

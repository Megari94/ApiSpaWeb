// Función para abrir el modal de edición y llenar los campos
function modalEditarCliente(id) {
    const cliente = clientesData.find(c => c.id === id);

    if (cliente) {
        clienteIdSeleccionado = id; // Guardar el ID del cliente seleccionado
        document.getElementById('nombreEditar').value = cliente.nombre;
        document.getElementById('apellidoEditar').value = cliente.apellido;
        document.getElementById('correoEditar').value = cliente.correo;
        document.getElementById('contrasenaEditar').value = cliente.contrasenia;
        document.getElementById('nombreUsuarioEditar').value = cliente.nombre_usuario;
        document.getElementById('modalEditarCliente').style.display = 'block'; // Mostrar el modal
    }
}

// Función para guardar los cambios realizados en el cliente
async function guardarEdicionCliente() {
    const nombre = document.getElementById('nombreEditar').value;
    const apellido = document.getElementById('apellidoEditar').value;
    const correo = document.getElementById('correoEditar').value;
    const contrasena = document.getElementById('contrasenaEditar').value;
    const nombreUsuario = document.getElementById('nombreUsuarioEditar').value;
    const clienteId = clienteIdSeleccionado; // Usar el cliente seleccionado

    // Verificar que todos los campos tengan valores
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
            // Enviar una solicitud PUT para actualizar los datos del cliente
            const response = await fetch(`https://spaadministrativo-production-4488.up.railway.app/clientes/editar/${clienteId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clienteActualizado),
            });

            if (response.ok) {
                console.log('Cliente actualizado correctamente.');
                cargarClientes(); // Recargar la lista de clientes
                cerrarModal('modalEditarCliente'); // Cerrar el modal tras la edición
            } else {
                console.error('Error al editar el cliente.');
            }
        } catch (error) {
            console.error('Error al editar el cliente:', error);
        }
    } else {
        console.error('Por favor, completa todos los campos.');
    }
}

// Función para cerrar el modal
function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none'; // Ocultar el modal
}


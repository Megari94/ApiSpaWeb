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

// Escucha el envío del formulario
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Lógica para determinar el rol seleccionado y llamar a la función correspondiente
    if (document.getElementById('roleCliente').checked) {
        loginCliente(username, password);  // Llamar la función para cliente
    } else if (document.getElementById('rolePersonal').checked) {
        loginPersonal(username, password);  // Llamar la función para personal
    }
});

// Función para loguear un cliente
function loginCliente(username, password) {
    fetch('https://spaadministrativo-production-4488.up.railway.app/Cliente/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Enviar credenciales
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la autenticación del cliente'); // Maneja errores de red o backend
        }
        return response.json(); // Convierte la respuesta a JSON
    })
    .then(data => {
        // Verifica si el inicio de sesión fue exitoso
        if (data.success) {
            // Guarda el token, nombre de usuario y rol en el localStorage
           localStorage.setItem('token', data.token); // Guarda el token
            localStorage.setItem('idCliente', data.clienteId); // Guarda el ID del cliente

            // Verifica que los valores se hayan almacenado correctamente
            console.log('Token cliente almacenado:', data.token);
            console.log('ID de Cliente almacenado:', data.clienteId);

            
            // Redirige a la página del cliente
            window.location.href = 'ClienteVista.html';
        } else {
            // Muestra un mensaje de error si la autenticación no fue exitosa
            throw new Error(data.message || 'Inicio de sesión fallido para cliente');
        }
    })
    .catch(error => {
        // Muestra el mensaje de error en la página
        document.getElementById('error-message').innerText = error.message;
    });
}

// Función para loguear personal
function loginPersonal(username, password) {
    fetch('https://spaadministrativo-production-4488.up.railway.app/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Enviar credenciales
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la autenticación'); // Maneja errores de red o backend
        }
        return response.json(); // Convierte la respuesta a JSON
    })
    .then(data => {
        // Verifica si el inicio de sesión fue exitoso
        if (data.success) {
            // Guarda el token, nombre de usuario y rol en el localStorage
            localStorage.setItem('token', data.token); // Guarda el token
            localStorage.setItem('idPersonal', data.Id); // Guarda el ID del personal
            localStorage.setItem('nombreUsuario', data.nombre_usuario); // Guarda el nombre de usuario
            localStorage.setItem('rol', data.rol); // Guarda el rol del usuario

            // Verifica que los valores se hayan almacenado correctamente
            console.log('Token almacenado:', data.token);
            console.log('ID de Personal almacenado:', data.Id);
            
            // Redirige a la página correspondiente según el rol
            switch (data.rol) {
                case 'ADMINISTRADOR':
                    window.location.href = 'Administrador.html';
                    break;
                case 'SECRETARIA':
                    window.location.href = 'Secretaria.html';
                    break;
                case 'PERSONAL':
                    window.location.href = '/personal/Personal.html';
                    break;
                default:
                    throw new Error('Rol no reconocido');
            }
        } else {
            // Muestra un mensaje de error si la autenticación no fue exitosa
            throw new Error(data.message || 'Inicio de sesión fallido');
        }
    })
    .catch(error => {
        // Muestra el mensaje de error en la página
        document.getElementById('error-message').innerText = error.message;
    });
}

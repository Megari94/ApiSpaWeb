document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    let apiUrl = ''; // URL de la API

    // Lógica para determinar la URL de la API según el rol seleccionado
    if (document.getElementById('roleCliente').checked) {
        apiUrl = 'https://spaadministrativo-production-4488.up.railway.app/Cliente/login';
    } else {
        apiUrl = 'https://spaadministrativo-production-4488.up.railway.app/login';
    }

    // Enviar la solicitud a la API
    fetch(apiUrl, {
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
            // Guarda el token y el nombre de usuario en el localStorage
            localStorage.setItem('token', data.token); // Guarda el token
            localStorage.setItem('nombreUsuario', data.nombre_usuario); // Guarda el nombre de usuario

            // Verifica si el usuario es un cliente
            if (document.getElementById('roleCliente').checked) {
                localStorage.setItem('idCliente', data.clienteId); // Guarda el ID del cliente
                window.location.href = 'ClienteVista.html'; // Redirige a cliente.html
            } else {
                // Guarda el rol solo si no es un cliente
                localStorage.setItem('rol', data.rol); // Guarda el rol del usuario

                // Redirige a la página correspondiente según el rol
                switch (data.rol) {
                    case 'ADMINISTRADOR':
                        window.location.href = 'Administrador.html';
                        break;
                    case 'SECRETARIA':
                        window.location.href = 'Secretaria.html';
                        break;
                    case 'PERSONAL':
                        window.location.href = 'personal/Personal.html';
                        break;
                    default:
                        throw new Error('Rol no reconocido');
                }
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
});

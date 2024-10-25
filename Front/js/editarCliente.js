document.addEventListener('DOMContentLoaded', function() {
    console.log("Página cargada con data-page:", document.body.dataset.page);
    const token = localStorage.getItem('token');
    const idCliente = localStorage.getItem('idCliente');

    // Verifica si el usuario está autenticado
    if (!token) {
        window.location.href = 'Login.html';
        return;
    }

    // Verifica si la página actual es EditarInfoCliente.html
    if (document.body.dataset.page === 'EditarInfoCliente') {
        cargarInformacionCliente(idCliente, token);
        manejarEdicionCliente(idCliente, token);
    }
});

// Función para cargar la información del cliente
function cargarInformacionCliente(idCliente, token) {
    fetch(`https://spaadministrativo-production-4488.up.railway.app/clientes/encontrarClienteDTO/${idCliente}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar la información del cliente');
        }
        return response.json();
    })
    .then(data => {
        // Verifica si los campos del formulario están presentes en el DOM
        const firstNameField = document.getElementById('firstName');
        const lastNameField = document.getElementById('lastName');
        const emailField = document.getElementById('email');
        const passwordField = document.getElementById('password');
        const usernameField = document.getElementById('username');

        if (firstNameField && lastNameField && emailField && passwordField && usernameField) {
            firstNameField.value = data.nombre;       // Cambiado de firstName a nombre
            lastNameField.value = data.apellido;      // Cambiado de lastName a apellido
            emailField.value = data.correo;           // Cambiado de email a correo
            passwordField.value = data.contrasenia;   // Cambiado de password a contrasenia
            usernameField.value = data.nombre_usuario; // Cambiado de username a nombre_usuario
        } else {
            console.error('Los campos del formulario no se encontraron en el DOM.');
        }
    })
    .catch(error => {
        console.error('Error al cargar la información del cliente:', error);
        alert('No se pudo cargar la información del cliente. Inténtelo de nuevo más tarde.');
    });
}

// Función para manejar la edición de la información del cliente
function manejarEdicionCliente(idCliente, token) {
    const form = document.getElementById('personalInfoForm');
    
    if (!form) {
        console.error('El formulario no se encontró en el DOM.');
        return;
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const updatedData = {
            nombre: document.getElementById('firstName').value,          // Cambiado de firstName a nombre
            apellido: document.getElementById('lastName').value,        // Cambiado de lastName a apellido
            correo: document.getElementById('email').value,             // Cambiado de email a correo
            contrasenia: document.getElementById('password').value,     // Cambiado de password a contrasenia
            nombre_usuario: document.getElementById('username').value,  // Cambiado de username a nombre_usuario
            listaSesiones: null,  // Enviar como null
            listaConsultas: null,  // Enviar como null
            listaServicio: null     // Enviar como null
        };

        fetch(`https://spaadministrativo-production-4488.up.railway.app/clientes/editar/${idCliente}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al actualizar la información del cliente');
            }
            alert('Información actualizada correctamente');
        })
        .catch(error => {
            console.error('Error al actualizar la información del cliente:', error);
            alert('No se pudo actualizar la información del cliente. Inténtelo de nuevo más tarde.');
        });
    });
}

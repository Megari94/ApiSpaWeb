document.addEventListener('DOMContentLoaded', function() {
    console.log("Página cargada con data-page:", document.body.dataset.page);
    const token = localStorage.getItem('token');
    const idPersonal = localStorage.getItem('idPersonal');

    // Verifica si el usuario está autenticado
    if (!token) {
        window.location.href = 'Login.html';
        return;
    }

    // Verifica si la página actual es EditarInfoCliente.html
    if (document.body.dataset.page === 'EditarInfoPersonal') {
        cargarInformacionPersonal(idPersonal, token);
        manejarEdicionPersonal(idPersonal, token);
    }
});

// Función para cargar la información del cliente
function cargarInformacionPersonal(idPersonal, token) {
    fetch(`https://spaadministrativo-production-4488.up.railway.app/Personal/personalInfo/${idPersonal}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                console.error('Error al cargar la información del Usuario:', err);
                throw new Error('Error al cargar la información del usuario: ' + (err.message || 'Error desconocido'));
            });
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
            // Asignar valores a los campos del formulario
            firstNameField.value = data.nombre || ''; // Evitar asignaciones nulas
            lastNameField.value = data.apellido || '';
            emailField.value = data.correo || '';
            passwordField.value = data.contrasenia || '';
            usernameField.value = data.nombre_usuario || '';
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
function manejarEdicionPersonal(idPersonal, token) {
    const form = document.getElementById('personalInfoForm');
    
    if (!form) {
        console.error('El formulario no se encontró en el DOM.');
        return;
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Crear un objeto de datos con los valores del formulario
        const data = {
            id: idPersonal, // Usar el ID del personal
            nombre: document.getElementById('firstName').value.trim(),
            apellido: document.getElementById('lastName').value.trim(),
            correo: document.getElementById('email').value.trim(),
            contrasenia: document.getElementById('password').value.trim(),
            nombre_usuario: document.getElementById('username').value.trim()
        };

        console.log('Datos a enviar:', JSON.stringify(data)); // Para verificar los datos

        fetch(`https://spaadministrativo-production-4488.up.railway.app/Personal/editar/${idPersonal}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data) // Enviar el objeto como JSON
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    console.error('Error al actualizar la información del personal:', err);
                    throw new Error('Error al actualizar la información del personal: ' + (err.message || 'Error desconocido'));
                });
            }
            alert('Información del personal actualizada correctamente');
        })
        .catch(error => {
            console.error('Error al actualizar la información del personal:', error);
            alert('No se pudo actualizar la información del personal. Inténtelo de nuevo más tarde.');
        });
    });
}


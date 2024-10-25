document.addEventListener('DOMContentLoaded', function() {
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
        // Cargar los datos en los campos del formulario
        document.getElementById('firstName').value = data.firstName;
        document.getElementById('lastName').value = data.lastName;
        document.getElementById('username').value = data.username;
        document.getElementById('email').value = data.email;
        document.getElementById('password').value = data.password;
    })
    .catch(error => {
        console.error('Error al cargar la información del cliente:', error);
        alert('No se pudo cargar la información del cliente. Inténtelo de nuevo más tarde.');
    });
}

// Función para manejar la edición de la información del cliente
function manejarEdicionCliente(idCliente, token) {
    const form = document.getElementById('personalInfoForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const updatedData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
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

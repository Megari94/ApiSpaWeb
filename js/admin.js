document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    const userInfoElement = document.getElementById('nombreUsuario');

    // Si no hay token, redirigir al login
    if (!token) {
        window.location.href = 'Login.html';
        return;
    }

    // Mostrar el nombre de usuario si está disponible
    if (nombreUsuario) {
        userInfoElement.textContent = `Bienvenido, ${nombreUsuario}`;
    } else {
        userInfoElement.textContent = 'Bienvenido, Administrador';
    }
});

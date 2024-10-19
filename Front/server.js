const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

// Configurar el puerto
const PORT = process.env.PORT || 8080;

// Permitir CORS
app.use(cors());

// Servir archivos estáticos desde la raíz y carpetas
app.use(express.static(__dirname)); // Para servir archivos HTML, CSS, JS directamente

// Ruta principal para el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Login.html')); // Cambia a tu archivo principal
});

// Otras rutas para tus archivos HTML si es necesario
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'Login.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

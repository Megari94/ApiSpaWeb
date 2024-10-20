const { jsPDF } = window.jspdf;
const services = [];

function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    sidebar.classList.toggle('hide');
    mainContent.classList.toggle('full');
}

function redirectToLogin() {
    window.location.href = 'login.html';
}


document.getElementById("facturaLink").addEventListener("click", function(event) {
    event.preventDefault();  // Evita la acción predeterminada del enlace
    window.location.href = "factura.html";  // Redirige a la nueva página
  });

  document.getElementById("pagosLink").addEventListener("click", function(event) {
    event.preventDefault();  // Evita la acción predeterminada del enlace
    window.location.href = "Pagos.html";  // Redirige a la nueva página
  });
  document.getElementById("IPLink").addEventListener("click", function(event) {
    event.preventDefault();  // Evita la acción predeterminada del enlace
    window.location.href = "InformePago.html";  // Redirige a la nueva página
  });
  document.getElementById("ISLink").addEventListener("click", function(event) {
    event.preventDefault();  // Evita la acción predeterminada del enlace
    window.location.href = "InformeServicio.html";  // Redirige a la nueva página
  });

  

  
  function generarFactura(nombreCliente, servicio, monto) {
    // Obtener la fecha actual
    const fechaActual = new Date();
    const fechaFormateada = `${fechaActual.getDate()}/${fechaActual.getMonth() + 1}/${fechaActual.getFullYear()}`;

    // Cargar jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Título
    doc.setFontSize(20);
    doc.text('Factura', 90, 20);

    // Información del cliente, servicio y fecha actual
    doc.setFontSize(12);
    doc.text(`Cliente: ${nombreCliente}`, 20, 40);
    doc.text(`Servicio: ${servicio}`, 20, 60);
    doc.text(`Monto: $${monto}`, 20, 70);
    doc.text(`Fecha: ${fechaFormateada}`, 20, 80); // Agregar la fecha

    // Guardar el PDF con nombre dinámico
    doc.save(`Factura_${nombreCliente}.pdf`);
}

function aceptarSolicitud(filaId, nombreCliente, servicio, monto) {
    generarFactura(nombreCliente, servicio, monto);
    actualizarEstado(filaId, 'Aceptado');
}

function rechazarSolicitud(filaId) {
    actualizarEstado(filaId, 'Denegado');
}

function actualizarEstado(filaId, estado) {
    const fila = document.getElementById(filaId);
    const celdaSolicitud = fila.querySelector('td:last-child');

    // Cambia el contenido de la celda según el estado
    if (estado === 'Aceptado') {
        celdaSolicitud.innerHTML = `<span class="estado-aceptado">${estado}</span>`;
    } else if (estado === 'Denegado') {
        celdaSolicitud.innerHTML = `<span class="estado-rechazado">${estado}</span>`;
    }
}


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

function removeService(button) {
    const serviceRow = button.parentElement;
    serviceRow.remove();
    updateTotal();
}

function addService() {
    const servicesContainer = document.getElementById('servicesContainer');
    const serviceRow = document.createElement('div');
    serviceRow.className = 'service-row';
    serviceRow.innerHTML = `
        <input type="text" placeholder="ID Servicio">
        <input type="text" placeholder="Nombre ">
        <input type="number" placeholder="Costo" oninput="updateTotal()">
        <button onclick="removeService(this)">Eliminar</button>
    `;
    servicesContainer.appendChild(serviceRow);
    updateTotal();
}

function updateTotal() {
    const totalAmountInput = document.getElementById('totalAmount');
    const serviceRows = document.querySelectorAll('.service-row');
    let total = 0;

    serviceRows.forEach(row => {
        const costInput = row.querySelector('input[type="number"]');
        const cost = parseFloat(costInput.value) || 0;
        total += cost;
    });

    totalAmountInput.value = total.toFixed(2);
}

function generateInvoice() {
    const invoiceDate = document.getElementById('invoiceDate').value;
    const clientName = document.getElementById('clientName').value;
    const totalAmount = document.getElementById('totalAmount').value;

    if (!invoiceDate || !clientName || totalAmount === '0.00') {
        alert("Por favor complete todos los campos.");
        return;
    }

    const doc = new jsPDF();
    doc.text("Factura", 20, 20);
    doc.text(`Fecha: ${invoiceDate}`, 20, 30);
    doc.text(`Cliente: ${clientName}`, 20, 40);

    let yOffset = 50;
    const serviceRows = document.querySelectorAll('.service-row');
    serviceRows.forEach(row => {
        const serviceId = row.querySelector('input[placeholder="ID Servicio"]').value;
        const serviceName = row.querySelector('input[placeholder="Nombre "]').value;
        const serviceCost = row.querySelector('input[placeholder="Costo"]').value;
        doc.text(`Servicio: ${serviceId} - ${serviceName} - $${serviceCost}`, 20, yOffset);
        yOffset += 10;
    });

    doc.text(`Total: $${totalAmount}`, 20, yOffset + 10);
    doc.save('factura.pdf');

    // Limpiar formulario después de generar la factura
    document.getElementById('invoiceDate').value = '';
    document.getElementById('clientName').value = '';
    document.getElementById('totalAmount').value = '0.00';
    document.getElementById('servicesContainer').innerHTML = '';
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
    actualizarEstado(filaId, 'Rechazado');
}

function actualizarEstado(filaId, estado) {
    const fila = document.getElementById(filaId);
    const celdaSolicitud = fila.querySelector('td:last-child');

    // Cambia el contenido de la celda según el estado
    if (estado === 'Aceptado') {
        celdaSolicitud.innerHTML = `<span class="estado-aceptado">${estado}</span>`;
    } else if (estado === 'Rechazado') {
        celdaSolicitud.innerHTML = `<span class="estado-rechazado">${estado}</span>`;
    }
}
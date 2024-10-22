// Establecer la fecha actual en el campo de fecha
window.onload = function() {
    const today = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
    document.getElementById('invoiceDate').value = today; // Asignar la fecha actual al campo de entrada
};

let pdfBlob; // Variable global para almacenar el Blob del PDF

// Función para agregar servicios
function addService() {
    const container = document.getElementById('servicesContainer');
    const serviceRow = document.createElement('div');
    serviceRow.classList.add('service-row');
    serviceRow.innerHTML = `
        <input type="text" placeholder="ID Servicio" class="service-id" required>
        <input type="text" placeholder="Nombre del Servicio" class="service-name" required>
        <input type="number" placeholder="Costo" class="service-cost" step="0.01" min="0" required oninput="calculateTotal()">
        <button onclick="removeService(this)">Eliminar</button>
    `;
    container.appendChild(serviceRow);
}

// Función para eliminar un servicio
function removeService(button) {
    const serviceRow = button.parentElement; // Obtener la fila del servicio
    serviceRow.remove(); // Eliminar la fila del DOM
    calculateTotal(); // Recalcular el total
}

// Función para calcular el total
function calculateTotal() {
    const serviceRows = document.querySelectorAll('.service-row');
    let total = 0;
    serviceRows.forEach(row => {
        const cost = parseFloat(row.querySelector('.service-cost').value) || 0;
        total += cost;
    });
    document.getElementById('totalAmount').value = total.toFixed(2);
}

async function generarFactura() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');

    const invoiceDate = document.getElementById('invoiceDate').value;
    const clientName = document.getElementById('clientName').value;
    const totalAmount = document.getElementById('totalAmount').value;

    // Validar campos obligatorios
    if (!invoiceDate || !clientName || totalAmount === '0.00') {
        alert("Por favor complete todos los campos.");
        return;
    }

    // Título y encabezado
    doc.setFontSize(14);
    doc.setFont("Helvetica", "bold");
    doc.text("SENTIRSE BIEN", 70, 75);
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");

    // Bordes para la estructura de la factura
    doc.rect(30, 30, 550, 750); // Borde general
    doc.rect(30, 30, 550, 120); // Borde encabezado
    doc.rect(30, 700, 550, 50); // Borde subtotal y total

    // Detalles de la factura
    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.text("Detalle de Factura", 380, 65);

    // Obtener la fecha actual
    const fechaActual = new Date();
    const dia = fechaActual.getDate().toString().padStart(2, '0');
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    const anio = fechaActual.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${anio}`;

    doc.text("Fecha de Emisión: " + fechaFormateada, 380, 95);
    doc.text("CUIT: 27316471566", 380, 110);
    doc.text("Recibí de: " + clientName, 40, 170);

    // Encabezado de la tabla
    doc.setFontSize(10);
    doc.setFont("Helvetica", "bold");
    doc.text("Código", 50, 330);
    doc.text("Producto / Servicio", 160, 330);
    doc.text("Precio Unit.", 550, 330, { align: "right" });

    // Dibujar una línea para el encabezado
    doc.line(30, 335, 580, 335);

    // Añadir los datos del servicio/producto
    const serviceRows = document.querySelectorAll('.service-row');
    let yOffset = 350;
    let totalServicios = 0;
    serviceRows.forEach((row) => {
        const serviceId = row.querySelector('.service-id').value;
        const serviceName = row.querySelector('.service-name').value;
        const serviceCost = parseFloat(row.querySelector('.service-cost').value);

        totalServicios += serviceCost;

        doc.setFont("Helvetica", "normal");
        doc.text(serviceId, 60, yOffset);
        const productoDividido = doc.splitTextToSize(serviceName, 180);
        doc.text(productoDividido, 160, yOffset);
        doc.text(serviceCost.toFixed(2), 550, yOffset, { align: "right" });

        yOffset += 20;
        doc.line(30, yOffset, 580, yOffset); // Línea debajo de la fila de producto
        yOffset += 20;
    });

    // Subtotal y total
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    doc.text("Total de todos los servicios: $" + totalServicios.toFixed(2), 400, yOffset + 40);
    doc.line(30, yOffset + 30, 580, yOffset + 30); // Línea estilo footer

    // Descargar automáticamente el PDF
    pdfBlob = doc.output('blob');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = "factura.pdf";
    link.click();

    // Recargar la página después de la descarga
    location.reload();
}

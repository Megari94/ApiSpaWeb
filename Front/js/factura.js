// Establecer la fecha actual en el campo de fecha
window.onload = function() {
    const today = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
    document.getElementById('invoiceDate').value = today; // Asignar la fecha actual al campo de entrada
};

// Función para agregar servicios
function addService() {
    const container = document.getElementById('servicesContainer');
    const serviceRow = document.createElement('div');
    serviceRow.classList.add('service-row');
    serviceRow.innerHTML = `
        <input type="text" placeholder="ID Servicio" class="service-id">
        <input type="text" placeholder="Nombre del Servicio" class="service-name">
        <input type="number" placeholder="Costo" class="service-cost" step="0.01" min="0" oninput="calculateTotal()">
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

// Función para generar la factura en PDF
async function generarFactura() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');

    const invoiceDate = document.getElementById('invoiceDate').value;
    const clientName = document.getElementById('clientName').value;
    const totalAmount = document.getElementById('totalAmount').value;

    // Validar que todos los campos necesarios estén completos
    if (!invoiceDate || !clientName || totalAmount === '0.00') {
        alert("Por favor complete todos los campos.");
        return;
    }

    // Título y encabezado de la factura
    doc.setFontSize(14);
    doc.setFont("Helvetica", "bold");
    doc.text("SENTIRSE BIEN", 70, 75);
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");

    // Dibujar bordes para la factura
    doc.rect(30, 30, 550, 750); // Borde general
    doc.rect(30, 30, 550, 120); // Borde encabezado
    doc.rect(30, 700, 550, 50); // Borde subtotal y total

    // Detalle de la factura
    doc.setFontSize(16);
    doc.text("Detalle de Factura", 380, 65);
    doc.setFontSize(12);
    doc.text("N°: 00001", 380, 80);

    // Formatear la fecha actual en formato dd/mm/yyyy
    const fechaActual = new Date();
    const dia = fechaActual.getDate().toString().padStart(2, '0');
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    const anio = fechaActual.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${anio}`;
    doc.text("Fecha de Emisión: " + fechaFormateada, 380, 95);
    doc.text("CUIT: 27316471566", 380, 110);
    doc.text("Ingresos Brutos: EXENTO", 380, 125);
    doc.text("Fecha de Inicio de Actividades: ", 380, 140);

    // Datos del cliente
    doc.text("Recibí de: " + clientName, 40, 170);
    doc.text("DNI: ", 350, 170);
    doc.text("Domicilio: ", 40, 190);
    doc.text("Localidad:", 40, 210);
    doc.text("Provincia: ", 350, 210);

    // Encabezado de la tabla de productos/servicios
    doc.setFontSize(10);
    doc.setFont("Helvetica", "bold");
    doc.text("Código", 50, 330);
    doc.text("Producto / Servicio", 160, 330);
    doc.text("Precio Unit.", 550, 330, { align: "right" });
    doc.line(30, 335, 580, 335); // Línea para el encabezado de la tabla

    // Añadir productos/servicios al PDF
    const serviceRows = document.querySelectorAll('.service-row');
    let yOffset = 350;
    serviceRows.forEach((row) => {
        const serviceId = row.querySelector('.service-id').value;
        const serviceName = row.querySelector('.service-name').value;
        const serviceCost = row.querySelector('.service-cost').value;

        doc.setFont("Helvetica", "normal");
        doc.text(serviceId, 60, yOffset);
        doc.text(doc.splitTextToSize(serviceName, 180), 160, yOffset);
        doc.text(serviceCost, 550, yOffset, { align: "right" });

        yOffset += 20;
        doc.line(30, yOffset, 580, yOffset); // Línea debajo de la fila de producto
        yOffset += 20;
    });

    // Total de la factura
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    doc.text("Importe Total: $" + totalAmount, 400, 727);

    // Generar el PDF y descargarlo automáticamente
    const pdfBlob = doc.output('blob');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = "factura.pdf";
    link.click();

    // Limpiar el formulario después de generar la factura
    document.getElementById('invoiceDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('clientName').value = '';
    document.getElementById('totalAmount').value = '0.00';
    document.getElementById('servicesContainer').innerHTML = '';
}

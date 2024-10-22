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

    // Dibuja un rectángulo alrededor de la "C"
    const cX = 290;
    const cY = 50;
    const cWidth = 40;
    const cHeight = 40;
    doc.rect(cX, cY, cWidth, cHeight); // Dibuja el rectángulo
    doc.setFontSize(30);
    doc.text("C", cX + 13, cY + 30); // Centra la "C" dentro del rectángulo
    doc.setFontSize(12);

    // Detalles de la factura a la derecha
    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.text("Detalle de Factura", 380, 65);

    // Obtener la fecha actual y formatearla
    const fechaActual = new Date();
    const dia = fechaActual.getDate().toString().padStart(2, '0');
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    const anio = fechaActual.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${anio}`;
    doc.text("Fecha de Emisión: " + fechaFormateada, 380, 95);

    doc.text("CUIT: 27316471566", 380, 110);
    doc.text("Ingresos Brutos: EXENTO", 380, 125);
    doc.text("Fecha de Inicio de Actividades: ", 380, 140);

    // Datos de recibo
    doc.text("Recibí de: " + clientName, 40, 170);
    doc.text("DNI: ", 350, 170);
    doc.text("Domicilio: ", 40, 190);
    doc.text("Localidad:", 40, 210);
    doc.text("Provincia: ", 350, 210);
    doc.text("Tipo de Ingreso: PRODUCIDOS PROPIOS ", 40, 240);
    doc.text("Medio de Pago recibido: TRANSFERENCIA A CTA 10071/08 Nº BNA", 40, 260);
    doc.text("Concepto ", 40, 280);

    // Encabezado de la tabla
    doc.setFontSize(10);
    doc.setFont("Helvetica", "bold");
    doc.text("Código", 50, 330);
    doc.text("Producto / Servicio", 160, 330);
    doc.text("Precio Unit.", 550, 330, { align: "right" });
    doc.line(30, 335, 580, 335); // Línea para el encabezado

    // Añadir los datos del servicio/producto
    const serviceRows = document.querySelectorAll('.service-row');
    let yOffset = 350;
    let totalServicios = 0;
    serviceRows.forEach((row) => {
        const serviceId = row.querySelector('.service-id').value;
        const serviceName = row.querySelector('.service-name').value;
        const serviceCost = parseFloat(row.querySelector('.service-cost').value) || 0;

        doc.setFont("Helvetica", "normal");
        doc.text(serviceId, 60, yOffset);
        const productoDividido = doc.splitTextToSize(serviceName, 180);
        doc.text(productoDividido, 160, yOffset);
        doc.text(serviceCost.toFixed(2), 550, yOffset, { align: "right" });

        yOffset += 20;
        doc.line(30, yOffset, 580, yOffset); // Línea debajo de la fila de producto
        yOffset += 20;

        totalServicios += serviceCost;
    });

    // Subtotal y total
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    doc.text("Importe Total: $" + totalServicios.toFixed(2), 400, 727);
    doc.line(30, 735, 580, 735); // Línea final estilo footer
    doc.text("Total de servicios: $" + totalServicios.toFixed(2), 40, 750);

    // Convertir PDF a Blob para descarga
    pdfBlob = doc.output('blob');

    // Descargar automáticamente el PDF
    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = "factura.pdf";
    link.click();

    // Limpiar el formulario después de generar la factura
    setTimeout(() => {
        document.getElementById('invoiceDate').value = today;
        document.getElementById('clientName').value = '';
        document.getElementById('totalAmount').value = '0.00';
        document.getElementById('servicesContainer').innerHTML = '';
    }, 1000);
}


//________________INFORME TIPO PAGO__________________________
async function generarInforme(event) {
    event.preventDefault(); // Evita el envío del formulario

    // Obtiene los valores ingresados
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;

    // Llamada a la API para obtener los servicios en formato JSON
    let servicios = [];
    try {
        const response = await fetch(`https://spaadministrativo-production-4488.up.railway.app/informe-pago?startDate=${fechaInicio}T00:00:00&endDate=${fechaFin}T23:59:59`);
        servicios = await response.json();
    } catch (error) {
        console.error('Error fetching services:', error);
        alert('No se pudieron obtener los servicios. Intente nuevamente más tarde.');
        return;
    }

    // Si los servicios fueron obtenidos correctamente, generar el PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');

    // Título y encabezado del informe
    doc.setFontSize(14);
    doc.setFont("Helvetica", "bold");
    doc.text("Informe de Pagos", 70, 75);
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");

    // Encabezado del informe
    doc.text(`Desde: ${fechaInicio} Hasta: ${fechaFin}`, 70, 100);

    // Crear la tabla de servicios
    doc.setFontSize(10);
    doc.setFont("Helvetica", "bold");
    doc.text("ID", 50, 130);
    doc.text("Nombre Completo", 100, 130);
    doc.text("Asistencia", 270, 130);
    doc.text("Fecha", 370, 130);
    doc.text("Servicio", 470, 130);
    doc.text("Costo", 570, 130, { align: "right" });

    // Dibujar línea para el encabezado
    doc.line(30, 135, 580, 135);

    // Añadir servicios a la tabla
    let yOffset = 150;
    servicios.forEach(servicio => {
        doc.setFont("Helvetica", "normal");

        // Mostrar los datos en el PDF utilizando el formato JSON que proporcionaste
        doc.text(servicio.id.toString(), 30, yOffset);
        doc.text(servicio.nombre_completo, 50, yOffset);
        doc.text(servicio.asistencia, 200, yOffset);
        doc.text(servicio.fecha, 300, yOffset);
        doc.text(servicio.nombre_servicio, 400, yOffset);
        doc.text(servicio.costo.toFixed(2), 500, yOffset, { align: "right" });

        yOffset += 10; // Espaciado entre filas
        doc.line(30, yOffset - 5, 580, yOffset - 5); // Línea debajo de la fila
    });

    // Convertir el PDF a Blob para descarga
    const pdfBlobInforme = doc.output('blob');

    // Descargar automáticamente el informe
    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlobInforme);
    link.download = "informe_pagos.pdf";
    link.click();

    // Recargar la página después de un breve retraso
    setTimeout(() => {
        location.reload();
    }, 1000); // Espera 1 segundo antes de recargar la página
}

// Añadir evento para generar informe
document.getElementById('informeForm').addEventListener('submit', generarInforme);

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

    // Dibuja líneas verticales
    const lineX = cX + (cWidth / 2);
    const lineStartY = cY + cHeight;
    const lineEndY = lineStartY + 60;
    doc.line(lineX, lineStartY, lineX, lineEndY); // Línea debajo
    const lineStartYAbove = cY;
    const lineEndYAbove = lineStartYAbove - 20;
    doc.line(lineX, lineStartYAbove, lineX, lineEndYAbove); // Línea encima

    // Detalles de la factura a la derecha
    doc.setFontSize(16);
    doc.setFont("Helvetica", "bold");
    doc.text("Detalle de Factura", 380, 65);

    // Detalle de la factura
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
    doc.text("N°: 00001", 380, 80);
    
    // Obtener la fecha actual
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

    // Dibujar una línea para el encabezado
    doc.line(30, 335, 580, 335);

    // Añadir los datos del servicio/producto
    const serviceRows = document.querySelectorAll('.service-row');
    let yOffset = 350;
    serviceRows.forEach((row) => {
        const serviceId = row.querySelector('.service-id').value;
        const serviceName = row.querySelector('.service-name').value;
        const serviceCost = parseFloat(row.querySelector('.service-cost').value).toFixed(2);

        doc.setFont("Helvetica", "normal");
        doc.text(serviceId, 60, yOffset);
        const productoDividido = doc.splitTextToSize(serviceName, 180);
        doc.text(productoDividido, 160, yOffset);
        doc.text(serviceCost, 550, yOffset, { align: "right" });

        yOffset += 20;
        doc.line(30, yOffset, 580, yOffset); // Línea debajo de la fila de producto
        yOffset += 20;
    });

    // Separador
    doc.line(30, yOffset, 580, yOffset); 
    yOffset += 10; // Espacio antes del total

    // Sumar total de servicios
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    doc.text("Importe Total: $" + totalAmount, 400, yOffset);
    yOffset += 30; // Espacio después del total

    // Convertir PDF a Blob para descarga
    pdfBlob = doc.output('blob');

    // Descargar automáticamente el PDF
    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = "factura.pdf";
    link.click();
    
    // Recargar la página
    location.reload();

    // Limpiar formulario después de generar la factura
    document.getElementById('invoiceDate').value = today;
    document.getElementById('clientName').value = '';
    document.getElementById('totalAmount').value = '0.00';
    document.getElementById('servicesContainer').innerHTML = '';
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
        const response = await fetch(`https://spaadministrativo-production-4488.up.railway.app/informe-tipo-pago?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
        servicios = await response.json();
    } catch (error) {
        console.error("Error al obtener servicios:", error);
        return; // Termina la ejecución si hay un error
    }

    // Crea un nuevo documento PDF
    const doc = new jsPDF('p', 'pt', 'a4');

    // Título del informe
    doc.setFontSize(14);
    doc.setFont("Helvetica", "bold");
    doc.text("Informe Tipo de Pago", 210, 50);

    // Encabezados
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
    doc.text(`Desde: ${fechaInicio}`, 40, 80);
    doc.text(`Hasta: ${fechaFin}`, 40, 95);

    // Tabla de servicios
    doc.setFontSize(10);
    doc.setFont("Helvetica", "bold");
    doc.text("ID", 40, 120);
    doc.text("Servicio", 120, 120);
    doc.text("Costo", 400, 120);

    // Línea de separación
    doc.line(30, 125, 570, 125);

    // Agregar servicios a la tabla
    let yOffset = 140;
    servicios.forEach(servicio => {
        doc.setFont("Helvetica", "normal");
        doc.text(servicio.id, 40, yOffset);
        doc.text(servicio.nombre, 120, yOffset);
        doc.text(servicio.costo.toFixed(2), 400, yOffset);
        yOffset += 15; // Espaciado entre filas
    });

    // Línea final
    doc.line(30, yOffset, 570, yOffset);

    // Cálculo del total
    const total = servicios.reduce((sum, servicio) => sum + servicio.costo, 0);
    yOffset += 10;
    doc.setFont("Helvetica", "bold");
    doc.text(`Total: $${total.toFixed(2)}`, 400, yOffset);

    // Generar el PDF
    const pdfBlob = doc.output('blob');

    // Descargar el PDF
    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = "informe_tipo_pago.pdf";
    link.click();
    
    // Recargar la página
    location.reload();
}

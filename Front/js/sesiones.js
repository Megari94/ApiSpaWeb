  let sesionesGlobal = []; 
async function loadSessionsAdmin() {
    try {
        // 1. Obtener todas las sesiones desde el nuevo endpoint
        const responseSesiones = await fetch('https://spaadministrativo-production-4488.up.railway.app/Sesion/traerAdmin', {
            method: 'GET'
        });

        if (!responseSesiones.ok) {
            console.error('Error al obtener las sesiones:', responseSesiones.statusText);
            return;
        }
      
        const sesiones = await responseSesiones.json();
        sesionesGlobal = sesiones; 

        // 2. Mostrar la tabla con los datos obtenidos
        displaySessions(sesionesGlobal);
    } catch (error) {
        console.error('Error al conectarse al servidor:', error);
    }
}

function displaySessions(sesiones) {
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = ''; // Limpiar la tabla

    // Filtrar las sesiones que tienen asistencia igual a "SOLICITADO"
    const sesionesFiltradas = sesiones.filter(sesion => sesion.asistencia === 'SOLICITADO');

    sesionesFiltradas.forEach((sesion) => {
        const row = document.createElement('tr');
        const fechaFormateada = formatearFecha(sesion.fecha);

        row.innerHTML = `
            <td>${sesion.id}</td>
            <td>${sesion.asistencia}</td>
            <td>${sesion.costo}</td>
            <td>${fechaFormateada}</td>
            <td>${sesion.nombre_completo}</td>
            <td>${sesion.nombre_servicio}</td>
            <td>
                <div class="button-group">
                    <button class="btn-aceptar" onclick="aceptarSolicitud('${sesion.id}', '${sesion.nombre_completo}', '${sesion.nombre_servicio}', ${sesion.costo})">Aceptar</button>
                    <button class="btn-rechazar" onclick="rechazarSolicitud('${sesion.id}',this)">Denegar</button>
                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Llamar a la función al cargar la página
window.onload = loadSessionsAdmin;

    async function generarFactura() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');

    // Usar los datos globales para rellenar la factura
    const invoiceDate = new Date().toLocaleDateString(); // Fecha actual
    const clientName = nombreClienteGlobal; // Nombre del cliente desde la solicitud
    const serviceName = servicioGlobal; // Nombre del servicio desde la solicitud
    const totalAmount = document.getElementById('precio').value; // Precio ingresado en el modal

    // Validar campos obligatorios
    if (!clientName || totalAmount === '0.00') {
        alert("Por favor complete todos los campos.");
        return;
    }

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
      
    // Obtener la fecha actual y formatearla
    const fechaActual = new Date();
    const dia = fechaActual.getDate().toString().padStart(2, '0');
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    const anio = fechaActual.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${anio}`;
    doc.text("Fecha de Emisión: " + fechaFormateada, 380, 95);

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

    // Añadir el dato del servicio/producto
    const yOffset = 350;
    doc.setFont("Helvetica", "normal");
    doc.text("1", 60, yOffset); // ID del servicio (puedes cambiarlo si necesitas algo específico)
    const productoDividido = doc.splitTextToSize(serviceName, 180);
    doc.text(productoDividido, 160, yOffset);
    doc.text(parseFloat(totalAmount).toFixed(2), 550, yOffset, { align: "right" });

    // Calcular y mostrar el total
   
    doc.text(parseFloat(totalAmount).toFixed(2), 550, yOffset + 20, { align: "right" });
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    doc.text("Importe Total: $" + totalAmount, 400, 727);
  const link = document.createElement('a');
    // Guardar la factura
    doc.save(`Factura_${clientName}.pdf`);
}


function formatearFecha(fechaISO) {
    const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
    };
    const fecha = new Date(fechaISO);
    return new Intl.DateTimeFormat('es-ES', options).format(fecha);
}
function filtrarTurnos() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase(); // Obtener el valor del input
    const turnosFiltrados = sesionesGlobal.filter(turno => 
        turno.nombre_completo.toLowerCase().includes(searchInput) // Filtrar por nombre completo
    );

   displaySessions(turnosFiltrados); // Mostrar los turnos filtrados
}

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
            <td>${sesion.costo > 0 ? sesion.costo : 'No definido'}</td>
            <td>${fechaFormateada}</td>
            <td>${sesion.nombre_completo}</td>
            <td>${sesion.nombre_servicio}</td>
            <td>
                <div class="button-group">
                    <button class="btn-definir-precio" onclick="abrirModalPrecio('${sesion.id}')">Definir Precio</button>
                    <button class="btn-aceptar" onclick="aceptarSolicitud('${sesion.id}')">Aceptar</button>
                    <button class="btn-rechazar" onclick="rechazarSolicitud('${sesion.id}', this)">Denegar</button>
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

//AGREGADO

 let filaIdGlobal = null;

   function abrirModalPrecio(filaId) {
    filaIdGlobal = filaId;
    document.getElementById('precio').value = ''; // Limpiar el campo de precio
    habilitarAceptar(); // Asegurarse de que el botón esté deshabilitado al abrir el modal
    document.getElementById('modalPrecio').style.display = 'block';
}


    function guardarPrecio() {
        const precio = parseFloat(document.getElementById('precio').value);

        if (precio > 0) {
            actualizarCostoSesion(filaIdGlobal, precio);
            cerrarModal('modalPrecio');
            alert("Costo definido correctamente. Ahora puedes aceptar el turno.");
        } else {
            alert("Por favor, ingrese un precio válido (mayor a cero).");
        }
    }

    function habilitarAceptar() {
        const precio = parseFloat(document.getElementById('precio').value);
        // Habilita el botón "Aceptar" solo si el precio es mayor a cero
        document.getElementById('botonAceptar').disabled = !(precio > 0);
    }

  function aceptarSolicitud(id_sesion) {
    // Busca la sesión correspondiente en el array de sesionesGlobal
    const sesion = sesionesGlobal.find(s => s.id === id_sesion);
    
    // Verifica que el costo haya sido definido
    if (!sesion || isNaN(sesion.costo) || sesion.costo <= 0) {
        alert("Por favor, define primero el costo antes de aceptar el turno.");
        return;
    }

    // Si el costo está definido, procede con la confirmación del turno
    actualizarEstadoSesion(id_sesion, "CONFIRMADO");
    obtenerTurnos(); // Actualizar la tabla o lista de turnos
}



    // Función para actualizar el costo en la base de datos
    async function actualizarCostoSesion(idSesion, nuevoCosto) {
        try {
            const response = await fetch(`https://spaadministrativo-production-4488.up.railway.app/Sesion/editarCosto/${idSesion}?nuevoCosto=${nuevoCosto}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log('Costo actualizado correctamente');
            } else {
                console.error('Error al actualizar el costo:', response.statusText);
            }
        } catch (error) {
            console.error('Error al conectarse a la API:', error);
        }
    }
    function actualizarEstadoSesion(idSesion, estado) {
    fetch(`https://spaadministrativo-production-4488.up.railway.app/Sesion/aceptar/${idSesion}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            console.log(`Turno ${estado} correctamente`);
        } else {
            console.error(`Error al ${estado} el turno`);
        }
    })
    .catch(error => console.error(`Error al ${estado} el turno:`, error));
}

//AGREGADOFIN




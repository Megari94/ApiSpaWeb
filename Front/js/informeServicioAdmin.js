async function generarInforme() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'pt', 'a4');

    // Verificar si se ha seleccionado un personal
    const personalId = document.getElementById("apellidoPersonal").value;
    if (!personalId) {
        alert("Por favor, seleccione un personal.");
        return;
    }

    // Definir las fechas de inicio y fin para la consulta
    const startDateInput = document.getElementById("startDate").value;
    const endDateInput = document.getElementById("endDate").value;
    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);

    // Validar fechas
    if (startDate > endDate) {
        alert("La fecha de inicio no puede ser posterior a la fecha de fin.");
        return;
    }

    endDate.setDate(endDate.getDate() + 1); 

    try {
        // Obtener los detalles del personal seleccionado desde la API
        const response = await fetch(`https://spaadministrativo-production-4488.up.railway.app/Personal/personalInfo/${personalId}`);
        if (!response.ok) throw new Error(`Error ${response.status}: No se pudo obtener la información del personal`);
        const personalSeleccionado = await response.json();

        // Título y encabezado del informe
        doc.setFontSize(14);
        doc.setFont("Helvetica", "bold");
        doc.text("SERVICIOS PRESTADOS", 70, 75);
        doc.setFontSize(12);
        doc.setFont("Helvetica", "normal");

        // Bordes para la estructura del informe
        doc.rect(30, 30, 550, 750);
        doc.rect(30, 30, 550, 120);
        doc.rect(30, 660, 550, 50);

        // Detalles del informe
        doc.setFontSize(16);
        doc.setFont("Helvetica", "bold");
        doc.text("Detalle del Informe", 380, 65);

        // Fecha actual
        const fechaActual = new Date();
        const dia = fechaActual.getDate().toString().padStart(2, '0');
        const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
        const anio = fechaActual.getFullYear();
        const fechaFormateada = `${dia}/${mes}/${anio}`;
        doc.setFontSize(12);
        doc.setFont("Helvetica", "normal");
        doc.text(`Fecha de Emisión: ${fechaFormateada}`, 380, 80);

        // Información general del servicio (datos del personal)
        doc.text(`Nombre del Personal: ${personalSeleccionado.nombre} ${personalSeleccionado.apellido}`, 40, 150);
        doc.text(`Nombre de Usuario: ${personalSeleccionado.nombre_usuario}`, 40, 170);
        doc.text(`Correo: ${personalSeleccionado.correo}`, 40, 190);

        // Encabezado de la tabla
        doc.setFontSize(10);
        doc.setFont("Helvetica", "bold");
        doc.text("ID", 50, 250);
        doc.text("Asistencia", 130, 250); // Reducción de espacio
        doc.text("Costo", 230, 250); // Reducción de espacio
        doc.text("Fecha", 330, 250); // Reducción de espacio
        doc.text("Nombre Completo", 430, 250); // Reducción de espacio
        doc.text("Nombre Servicio", 520, 250); // Reducción de espacio

        // Dibujar una línea para el encabezado
        doc.line(30, 255, 580, 255);

        // Obtener las sesiones del personal usando el nuevo endpoint
        const sesionesResponse = await fetch(`https://spaadministrativo-production-4488.up.railway.app/personalInfoServicios?personalId=${personalId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
        if (!sesionesResponse.ok) throw new Error(`Error ${sesionesResponse.status}: No se pudo obtener las sesiones`);
        const serviciosPrestados = await sesionesResponse.json();

        // Listar los servicios en el PDF
        let yPosition = 270; // Posición vertical inicial
        let totalCosto = 0; // Variable para calcular el total de costos
        for (const servicio of serviciosPrestados) {
            doc.setFontSize(10);
            doc.setFont("Helvetica", "normal");
            doc.text(servicio.id.toString(), 50, yPosition); // ID
            doc.text(servicio.asistencia, 130, yPosition); // Asistencia
            doc.text(servicio.costo.toFixed(2).toString(), 230, yPosition); // Costo
            doc.text(servicio.fecha ? new Date(servicio.fecha).toLocaleString() : '', 330, yPosition); // Fecha
            doc.text(servicio.nombre_completo, 430, yPosition); // Nombre completo
            doc.text(servicio.nombre_servicio, 520, yPosition); // Nombre servicio

            totalCosto += servicio.costo; // Sumar al total
            yPosition += 15; // Espaciado entre filas reducido
        }

        // Añadir la suma total de costos al final
        doc.setFontSize(12);
        doc.setFont("Helvetica", "bold");
        doc.text(`Total Costo: $${totalCosto.toFixed(2)}`, 480, yPosition + 20); // Posición para mostrar el total

        // Generar Blob
        pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        // Mostrar la vista previa del PDF en el iframe
        const pdfPreview = document.getElementById('pdfPreview');
        if (pdfPreview) {
            pdfPreview.src = pdfUrl;
        } else {
            console.error("Error: Elemento PDF Preview no encontrado");
        }

    } catch (error) {
        console.error(error);
        alert("Error al generar el informe: " + error.message);
    }
}

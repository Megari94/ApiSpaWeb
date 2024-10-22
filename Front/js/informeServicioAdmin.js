let pdfBlob; // Variable global para almacenar el Blob del PDF
        let personalSeleccionado = null; // Variable para almacenar los datos del personal seleccionado

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
                personalSeleccionado = await response.json();

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
                doc.text(`Nombre del Personal: ${personalSeleccionado.nombre} ${personalSeleccionado.apellido}`, 40, 170);
                doc.text(`Nombre de Usuario: ${personalSeleccionado.nombre_usuario}`, 40, 190);
                doc.text(`Correo: ${personalSeleccionado.correo}`, 40, 210);
        
                // Encabezado de la tabla
                doc.setFontSize(10);
                doc.setFont("Helvetica", "bold");
                doc.text("Código", 50, 300);
                doc.text("Descripción del Servicio", 160, 300);
                doc.text("Costo", 550, 300, { align: "right" });
        
                // Dibujar una línea para el encabezado
                doc.line(30, 305, 580, 305);
        
                // Obtener las sesiones del personal usando el nuevo endpoint
                const sesionesResponse = await fetch(`https://spaadministrativo-production-4488.up.railway.app/personalInfoServicios?personalId=${personalId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
                if (!sesionesResponse.ok) throw new Error(`Error ${sesionesResponse.status}: No se pudo obtener las sesiones`);
                const serviciosPrestados = await sesionesResponse.json();
        
                // Listar los servicios en el PDF
                let totalCosto = 0; // Para calcular el total de costos
                let yPosition = 320; // Posición vertical inicial
                for (const servicio of serviciosPrestados) {
                    doc.setFontSize(10);
                    doc.setFont("Helvetica", "normal");
                    doc.text(servicio.codigo, 50, yPosition);
                    doc.text(servicio.descripcion, 160, yPosition);
                    doc.text(servicio.costo.toFixed(2).toString(), 550, yPosition, { align: "right" });
                    totalCosto += servicio.costo; // Acumular el costo total
                    yPosition += 20; // Espaciado entre filas
                }

                // Total final
                doc.setFontSize(12);
                doc.setFont("Helvetica", "bold");
                doc.text("Total: " + totalCosto.toFixed(2).toString(), 450, yPosition);
        
                // Generar Blob
                pdfBlob = doc.output('blob');
                const pdfUrl = URL.createObjectURL(pdfBlob);
        
                // Mostrar la vista previa del PDF en el iframe
                document.getElementById('pdfPreview').src = pdfUrl;

            } catch (error) {
                console.error(error);
                alert("Error al generar el informe: " + error.message);
            }
        }

        function descargarInforme() {
            if (pdfBlob) {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(pdfBlob);
                link.download = 'informe_servicios.pdf';
                link.click();
            } else {
                alert("No se ha generado el informe aún.");
            }
        }

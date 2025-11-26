// src/hooks/usePdfExport.js
import { useRef } from 'react';

export const usePdfExport = () => {
  const contentRef = useRef(null);

  const exportToPdf = async (filename = 'reporte.pdf', options = {}) => {
    if (!contentRef.current) {
      console.error('No se encontró el contenido para exportar');
      return;
    }

    try {
      // Importación dinámica de las librerías
      const { jsPDF } = await import('jspdf');
      const html2canvas = await import('html2canvas');
      
      const canvas = await html2canvas.default(contentRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        ...options
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(filename);
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  };

  return { contentRef, exportToPdf };
};
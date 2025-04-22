
'use client';

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
function base64ToUint8Array(base64: string): Uint8Array {
    try {
      const base64Clean = base64.replace(/^data:image\/(png|jpeg);base64,/, '');
      const binary = atob(base64Clean);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    } catch (error) {
      console.error("Error al convertir base64 a Uint8Array:", error);
      return new Uint8Array();
    }
  }
  

export default async function generarPDFOferta(datos: any) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const verde = rgb(0, 0.6, 0.3);
  const gris = rgb(0.3, 0.3, 0.3);
  const negro = rgb(0, 0, 0);

  let y = height - 60;

  // Header banner verde
  page.drawRectangle({
    x: 0,
    y: height - 100,
    width,
    height: 100,
    color: verde
  });

  page.drawText("RuedaJusta - Evaluación Oficial", {
    x: 50,
    y: height - 50,
    size: 22,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  // Logo generado (arriba derecha)
  if (datos.logoBase64 && datos.logoBase64.startsWith('data:image')) {
    try {
      const logoBytes = base64ToUint8Array(datos.logoBase64);
      const logoImage = await pdfDoc.embedPng(logoBytes);
      const logoDims = logoImage.scale(0.2);
      page.drawImage(logoImage, {
        x: width - logoDims.width - 30,
        y: height - logoDims.height - 30,
        width: logoDims.width,
        height: logoDims.height
      });
    } catch (error) {
      console.error("Error al insertar logo:", error);
      alert("⚠ El logo no pudo insertarse correctamente. Verifica su formato.");
    }
  }

  y = height - 130;
  page.drawText("Información del Cliente", {
    x: 50,
    y,
    size: 14,
    font: fontBold,
    color: gris
  });

  y -= 20;
  const general = [
    [`Nombre`, `${datos.nombre} ${datos.apellido}`],
    [`Email`, datos.email],
    [`Celular`, datos.celular],
    [`Ciudad`, datos.ciudad]
  ];
  general.forEach(([label, val]) => {
    page.drawText(`${label}: ${val}`, {
      x: 60,
      y,
      size: 11,
      font,
      color: negro
    });
    y -= 16;
  });

  y -= 12;
  page.drawText("Detalles del Vehículo", {
    x: 50,
    y,
    size: 14,
    font: fontBold,
    color: gris
  });

  y -= 20;
  const vehiculo = [
    [`Marca`, datos.Marca],
    [`Modelo`, datos.modelo],
    [`Año`, datos.anio],
    [`Placa`, `${datos.placa_letra}-${datos.placa_numero}`],
    [`Matriculación`, datos.matriculacion],
    [`Año Matriculación`, datos.anio_matriculacion],
    [`Dueños`, datos.duenios]
  ];
  vehiculo.forEach(([label, val]) => {
    page.drawText(`${label}: ${val}`, {
      x: 60,
      y,
      size: 11,
      font,
      color: negro
    });
    y -= 16;
  });

  y -= 12;
  page.drawText("Valoración Estimada", {
    x: 50,
    y,
    size: 14,
    font: fontBold,
    color: gris
  });

  y -= 20;
  page.drawText(`Puntaje: ${datos.puntaje}/100`, {
    x: 60,
    y,
    size: 11,
    font,
    color: negro
  });
  y -= 16;
  page.drawText(`Porcentaje: ${(datos.porcentaje * 100).toFixed(2)}%`, {
    x: 60,
    y,
    size: 11,
    font,
    color: negro
  });
  y -= 16;
  page.drawText(`Valor sugerido: $${datos.valorFinal.toLocaleString()}`, {
    x: 60,
    y,
    size: 14,
    font: fontBold,
    color: verde
  });

  // Código QR (abajo derecha)
  if (datos.qrBase64 && datos.qrBase64.startsWith('data:image')) {
    try {
      const qrBytes = base64ToUint8Array(datos.qrBase64);
      const qrImage = await pdfDoc.embedPng(qrBytes);
      const qrDims = qrImage.scale(0.4);
      page.drawImage(qrImage, {
        x: width - qrDims.width - 40,
        y: 40,
        width: qrDims.width,
        height: qrDims.height
      });
    } catch (error) {
      console.error("Error al insertar QR:", error);
      alert("⚠ El código QR no pudo insertarse correctamente. Verifica su formato.");
    }
  }

  // Sello / firma visual
  page.drawRectangle({
    x: 45,
    y: 45,
    width: 270,
    height: 30,
    color: rgb(0.95, 0.95, 0.95),
    borderColor: verde,
    borderWidth: 1
  });

  page.drawText("✔ Evaluación generada por IA certificada RuedaJusta", {
    x: 50,
    y: 55,
    size: 10,
    font,
    color: verde
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, 'Reporte-Vehiculo.pdf');
}

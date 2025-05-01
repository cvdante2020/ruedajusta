import jsPDF from "jspdf";
import QRCode from "qrcode";

interface ReportData {
  nombre: string;
  apellido: string;
  Marca: string;
  modelo: string;
  anio: number;
  placa: string;
  valorFinal: number;
  qrURL: string;
  ciudad: string;
  matriculacion: string;
  anio_matriculacion: string;
  duenios: string;
  kilometraje: string;
  garantia: boolean;
  pintura: string;
  carroceria: string;
  tapiceria: string;
  faros: string;
  llantas: string;
  llanta_emergencia: string;
  encendido: string;
  aireAcondicionado: boolean;
  aire_asientos: boolean;
  asiento_conductor: string;
  asientos_pasajeros: string;
  camara_retro: boolean;
  camara_frontal: boolean;
  sensores_estacionamiento: boolean;
  sensorImpacto: boolean;
  sensorProximidad: boolean;
  tipo_motor: string;
  mantenimiento: string;
  vidriosTodos: boolean;
  vidriosConduct: boolean;
  tipo: string;
}

export const generateVehicleReport = async (data: ReportData) => {
  const doc = new jsPDF();
  const azul = { r: 58, g: 111, b: 255 };

  const logoBase64 = await getBase64FromUrl("/logo.png");
  const selloBase64 = await getBase64FromUrl("/sello.jpg");
  const qrImage = await QRCode.toDataURL(data.qrURL);

  // ENCABEZADO
  doc.setFillColor(20, 20, 20);
  doc.rect(0, 0, 210, 15, "F");
  doc.setFontSize(13);
  doc.setTextColor(azul.r, azul.g, azul.b);
  doc.setFont("helvetica", "bold");
  doc.text("Certificado de Evaluación Vehicular – RuedaJusta", 105, 10, { align: "center" });

  let y = 22;
  const salto = (n = 6) => { y += n; };
  const check = (c: boolean) => c ? "Si" : "No";

  // VALOR ESTIMADO Y ESTADO
  const puntaje = Math.round((data.valorFinal / 13500) * 100);
  let estado = "Regular";
  if (puntaje >= 90) estado = "Excelente";
  else if (puntaje >= 75) estado = "Bueno";
  else if (puntaje >= 60) estado = "Aceptable";

  doc.setDrawColor(220);
  doc.setFillColor(230, 240, 255);
  doc.setTextColor(azul.r, azul.g, azul.b);
  doc.rect(10, y, 190, 10, "F");
  doc.setFontSize(10);
  doc.text(`VALOR ESTIMADO: $${data.valorFinal.toLocaleString()}  |  Estado: ${estado} (${puntaje}/100)`, 105, y + 7, { align: "center" });
  salto(15);

  doc.setFontSize(9);
  doc.setTextColor(0);

  // SECCIÓN: PROPIETARIO Y VEHÍCULO
  doc.setDrawColor(220);
  doc.setFillColor(245, 245, 245);
  doc.rect(10, y, 190, 30, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Propietario", 12, y + 5);
  doc.text("Vehiculo", 110, y + 5);
  doc.setFont("helvetica", "normal");
  doc.text(`Nombre: ${data.nombre} ${data.apellido}`, 12, y + 12);
  doc.text(`Ciudad: ${data.ciudad}`, 12, y + 18);
  doc.text(`Marca: ${data.Marca}`, 110, y + 12);
  doc.text(`Modelo: ${data.modelo}`, 110, y + 18);
doc.text(`Tipo: ${data.tipo}`, 110, y + 24);
doc.text(`Año: ${data.anio}`, 110, y + 30);

  doc.text(`Placa: ${data.placa}`, 12, y + 24);
  salto(35);

  // HISTORIAL Y EVALUACIÓN VISUAL
  doc.setDrawColor(220);
  doc.setFillColor(245, 245, 245);
  doc.rect(10, y, 190, 48, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Historial y Evaluación Visual", 12, y + 5);
  doc.setFont("helvetica", "normal");
  doc.text(`Matriculación: ${data.matriculacion} (${data.anio_matriculacion})`, 12, y + 12);
  doc.text(`Dueños: ${data.duenios}`, 12, y + 18);
  doc.text(`Kilometraje: ${data.kilometraje} km`, 12, y + 24);
  doc.text(`Garantía: ${check(data.garantia)}`, 12, y + 30);
  doc.text(`Pintura: ${data.pintura}/5`, 110, y + 12);
  doc.text(`Carrocería: ${data.carroceria}/5`, 110, y + 18);
  doc.text(`Tapicería: ${data.tapiceria}/5`, 110, y + 24);
  doc.text(`Faros: ${data.faros}/5`, 110, y + 30);
  doc.text(`Llantas: ${data.llantas}/5`, 110, y + 36);
  doc.text(`Llanta Emergencia: ${data.llanta_emergencia}/5`, 110, y + 42);
  salto(53);

  // TECNOLOGÍA Y CONFORT
  doc.setDrawColor(220);
  doc.setFillColor(245, 245, 245);
  doc.rect(10, y, 190, 48, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Tecnología y Confort", 12, y + 5);
  doc.setFont("helvetica", "normal");
  doc.text(`Aire acondicionado: ${check(data.aireAcondicionado)}`, 12, y + 12);
  doc.text(`Aire en asientos: ${check(data.aire_asientos)}`, 110, y + 12);
  doc.text(`Vidrios conductor: ${check(data.vidriosConduct)}`, 12, y + 18);
  doc.text(`Vidrios 4 ventanas: ${check(data.vidriosTodos)}`, 110, y + 18);
  doc.text(`Sensor impacto: ${check(data.sensorImpacto)}`, 12, y + 24);
  doc.text(`Sensor proximidad: ${check(data.sensorProximidad)}`, 110, y + 24);
  doc.text(`Camara retro: ${check(data.camara_retro)}`, 12, y + 30);
  doc.text(`Camara frontal: ${check(data.camara_frontal)}`, 110, y + 30);
  doc.text(`Sensores estacionamiento: ${check(data.sensores_estacionamiento)}`, 12, y + 36);
  doc.text(`Asiento conductor: ${data.asiento_conductor}`, 110, y + 36);
  doc.text(`Asientos pasajeros: ${data.asientos_pasajeros}`, 12, y + 42);
  salto(53);

  // MOTOR
  doc.setDrawColor(220);
  doc.setFillColor(245, 245, 245);
  doc.rect(10, y, 190, 14, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Motor y Rendimiento", 12, y + 5);
  doc.setFont("helvetica", "normal");
  doc.text(`Tipo motor: ${data.tipo_motor}`, 12, y + 12);
  if (data.tipo_motor === "diesel") {
    doc.text(`Mantenimiento: cada ${data.mantenimiento} km`, 110, y + 12);
  }
  salto(20);

  // QR y SELLO
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0);
  doc.text("Escanea para verificar este certificado:", 12, y);
  if (qrImage) doc.addImage(qrImage, "PNG", 12, y + 3, 35, 35);
  if (selloBase64) doc.addImage(selloBase64, "JPEG", 160, y + 3, 35, 35);
  salto(40);

  // PIE DE PÁGINA
  const fecha = new Date();
  const fechaStr = fecha.toLocaleDateString("es-EC", { day: "2-digit", month: "long", year: "numeric" });
  const horaStr = fecha.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" });
  doc.setDrawColor(220);
  doc.line(10, y, 200, y);
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text("RuedaJusta © Todos los derechos reservados", 105, y + 6, { align: "center" });
  doc.text(`Fecha y hora de emisión: ${fechaStr}, ${horaStr}`, 105, y + 12, { align: "center" });

  doc.save(`certificado_${data.placa}.pdf`);
};

const getBase64FromUrl = async (url: string): Promise<string> => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

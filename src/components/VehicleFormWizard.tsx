'use client';

import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { generateVehicleReport } from "@/utils/generateVehicleReport";
import { buscarPrecioReferencia } from "./buscarPrecioReferencia";
import { calcularValoracion } from "@/utils/calcularValoracion";
import VisualEvaluationStep from "./VisualEvaluationStep";
import Fuse from "fuse.js";
import { responderConIA } from "@/utils/responderConIA";



export default function VehicleFormWizard() {
  const [step, setStep] = useState(1);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();
  const [marcas, setMarcas] = useState<string[]>([]);
const [modelos, setModelos] = useState<string[]>([]);
const [tiposPorModelo, setTiposPorModelo] = useState<Record<string, string>>({});
const [mensajeIA, setMensajeIA] = useState<string | null>(null);


const [formData, setFormData] = useState({
  nombre: "",
  apellido: "",
  email: "",
  celular: "",
  ciudad: "",
  Marca: "",
  modelo: "",
  anio: "",
  placa_letra: "",
  placa_numero: "",
  matriculacion: "",
  duenios: "",
  pintura: "",
  faros: "",
  tapiceria: "",
  vidrios: "",
  sensores: "",
  encendido: "",
  asientos: "",
  airbags: "",
  confort_extras: "",
  kilometraje: "",
  garantia: false,
  tipo_motor: "",
  mantenimiento: "",
  parabrisas_delantero: "",
  parabrisas_posterior: "",
  ventanas: "",
  carroceria: "",
  persiana: "",
  llantas: "",
  llanta_emergencia: "",
  piso: "",
  techo: "",
  esfera_controles: "",
  chapas: "",
  cinturones: "",
  sensoresCinturon: false,
  techoCorredizo: false,
  sensores_estacionamiento: false,
  sensores_retro: false,
  camara_retro: false,
  aparcamiento_autonomo: false,
  retrovisoresElectricos: false,
  camara_frontal: false,
  sensorProximidad: false,
  sensorImpacto: false,
  aire_asientos: false,
  aireAcondicionado: false,
  vidriosTodos: false,
  vidriosConduct: false,
  asiento_conductor: "",
  asientos_pasajeros: "",
  anio_matriculacion: "",
  direccionales_frontales: "",
  tipo:""
});


useEffect(() => {
  const cargarMarcas = async () => {
    const { data, error } = await supabase.from("marcas_modelos").select("marca").order("marca", { ascending: true });
    if (data) {
      const unicas = [...new Set(data.map((d) => d.marca.trim()))];
      setMarcas(unicas);
    } else {
      console.error("Error al cargar marcas:", error);
    }
  };
  cargarMarcas();
}, []);

useEffect(() => {
  const cargarModelos = async () => {
    if (!formData.Marca) return;

    const { data, error } = await supabase
      .from("marcas_modelos")
      .select("modelo, tipo_vehiculo")
      .eq("marca", formData.Marca);

    if (data) {
      const modelosUnicos = [...new Set(data.map((d) => d.modelo.trim()))];
      const tipoMap = Object.fromEntries(
        data.map((d) => [d.modelo.trim(), d.tipo_vehiculo.trim()])
      );
      setModelos(modelosUnicos);
      setTiposPorModelo(tipoMap);
    } else {
      console.error("Error al cargar modelos:", error);
    }
  };

  cargarModelos();
}, [formData.Marca]);




  const progreso = (step / 6) * 100;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    let newValue = value;

    if (name === "placa_letra") {
      newValue = value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 1);
    }

    if (name === "placa_numero") {
      newValue = value.replace(/\D/g, "").slice(0, 3);
    }

    if (name === "celular") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    }

    if (name === "anio" || name === "anio_matriculacion") {
      newValue = value.replace(/\D/g, "").slice(0, 4);
    }
    

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : newValue,
    }));
  };

  const verificarDuplicado = async () => {
    const { data: existentes, error } = await supabase
      .from("evaluaciones")
      .select("id")
      .eq("placa_letra", formData.placa_letra)
      .eq("placa_numero", formData.placa_numero)
      .eq("celular", formData.celular)
      .eq("email", formData.email);

    if (error) {
      console.error("❌ Error verificando duplicados:", error);
      return false;
    }

    return existentes && existentes.length > 0;
  };

  const obtenerSugerenciaFuzzy = async (campo: string, valor: string): Promise<string> => {
    const { data } = await supabase.from("vehiculos_ref").select(campo);
    const valoresUnicos = Array.from(new Set(data?.map((d: any) => d[campo])));
    const fuse = new Fuse(valoresUnicos, { includeScore: true, threshold: 0.4 });
    const resultado = fuse.search(valor.trim().toLowerCase());
    return resultado[0]?.item || valor.trim().toLowerCase();
  };

  const validarPasoActual = (): boolean => {
    switch (step) {
      case 1:
        return (
          formData.nombre.trim() !== "" &&
          formData.apellido.trim() !== "" &&
          formData.email.includes("@") &&
          formData.celular.trim().length >= 8 &&
          formData.ciudad.trim() !== ""
        );
      case 2:
        return (
          formData.Marca.trim() !== "" &&
          formData.modelo.trim() !== "" &&
         /^\d{4}$/.test(formData.anio) &&
          /^[A-Za-z]{1}$/.test(formData.placa_letra) &&
          /^\d{1}$/.test(formData.placa_numero) &&
          formData.matriculacion.trim() !== "" &&
          /^\d{4}$/.test(formData.anio_matriculacion) &&
          !isNaN(parseInt(formData.duenios)) && parseInt(formData.duenios) >= 0

        );
      case 3:
        // Se puede validar al menos que haya calificación en pintura o faros
        return formData.pintura !== "" && formData.faros !== "";
      case 4:
        return formData.encendido !== "" &&
          formData.asiento_conductor !== "" &&
          formData.asientos_pasajeros !== "" &&
          formData.airbags !== "";
      case 5:
        return (
          formData.kilometraje !== "" &&
          formData.tipo_motor !== "" &&
          (formData.tipo_motor !== "diesel" || formData.mantenimiento !== "")
        );
      default:
        return true;
    }
  };
  

  const enviarFormulario = async () => {
  if (enviando) return;

  setEnviando(true);
  setMensaje("Enviando datos, por favor espera...");

  const yaExiste = await verificarDuplicado();
  if (yaExiste) {
    alert("❌ Ya existe una evaluación registrada con esos datos. Por favor verifica la información.");
    setMensaje("❌ Ya existe una evaluación registrada con esos datos.");
    setEnviando(false);
    return;
  }

  const marcaNormalizada = await obtenerSugerenciaFuzzy("marca", formData.Marca);
  const modeloNormalizado = await obtenerSugerenciaFuzzy("modelo", formData.modelo);
  const tipoNormalizado = "auto";
  const combustibleNormalizado = await obtenerSugerenciaFuzzy("combustible", formData.tipo_motor);
  const tipoDetectado = tiposPorModelo[formData.modelo] || "";

  const precioBase = await buscarPrecioReferencia({
    marca: marcaNormalizada,
    modelo: modeloNormalizado,
    anio: parseInt(formData.anio),
    tipo_vehiculo: tipoDetectado,
    combustible: combustibleNormalizado,
  });
  

  console.log("📦 Buscando referencia con:", {
    marca: formData.Marca,
    modelo: formData.modelo,
    anio: parseInt(formData.anio),
    tipo_vehiculo: "auto",
    combustible: formData.tipo_motor,
  });
  if (!precioBase) {
    const respuestaIA = await responderConIA({
      marca: formData.Marca,
      modelo: formData.modelo,
      anio: parseInt(formData.anio),
    });
    setMensajeIA(respuestaIA);
    setMensaje(""); // limpiar mensaje anterior si lo hubiera
    setEnviando(false);
    return;
  }
  

  const valoracion = await calcularValoracion({
    ...formData,
    marca: marcaNormalizada,
    modelo: modeloNormalizado,
  });

  const payload = {
    ...formData,
    tipo: tipoDetectado,
    kilometraje: parseInt(formData.kilometraje) || null,
    anio: parseInt(formData.anio) || null,
    placa_numero: parseInt(formData.placa_numero) || null,
    duenios: parseInt(formData.duenios) || null,
    garantia: !!formData.garantia,
    sensoresCinturon: !!formData.sensoresCinturon,
    techoCorredizo: !!formData.techoCorredizo,
    sensores_estacionamiento: !!formData.sensores_estacionamiento,
    sensores_retro: !!formData.sensores_retro,
    camara_retro: !!formData.camara_retro,
    aparcamiento_autonomo: !!formData.aparcamiento_autonomo,
    retrovisoresElectricos: !!formData.retrovisoresElectricos,
    camara_frontal: !!formData.camara_frontal,
    sensorProximidad: !!formData.sensorProximidad,
    sensorImpacto: !!formData.sensorImpacto,
    aire_asientos: !!formData.aire_asientos,
    aireAcondicionado: !!formData.aireAcondicionado,
    vidriosConduct: !!formData.vidriosConduct,
    vidriosTodos: !!formData.vidriosTodos,
    ...valoracion,
  };
    if ("error" in payload) {
      delete payload.error;
    }

    const { data, error } = await supabase.from("evaluaciones").insert([payload]);

    if (error) {
      console.error("❌ Error al guardar en Supabase:", error);
      alert("Hubo un error al enviar el formulario ❌");
      setMensaje("");
      setEnviando(false);
      return;
      } 

      else {
      setMensaje("Formulario enviado correctamente ✅ Redirigiendo...");
      await fetch("/api/notificar-evaluacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          ciudad: formData.ciudad,
          Marca: formData.Marca,
          modelo: formData.modelo,
          anio: formData.anio,
        }),
      });
      
      try {
        await generateVehicleReport({
          nombre: formData.nombre,
          apellido: formData.apellido,
          Marca: formData.Marca,
          modelo: formData.modelo,
          anio: parseInt(formData.anio),
          placa: `${formData.placa_letra}${formData.placa_numero}`,
          valorFinal: valoracion.valorFinal,
          qrURL: `https://ruedajusta.ec/verificacion/${formData.placa_letra}${formData.placa_numero}`,
          ciudad: formData.ciudad,
          matriculacion: formData.matriculacion,
          anio_matriculacion: formData.anio_matriculacion,
          duenios: formData.duenios,
          kilometraje: formData.kilometraje,
          garantia: formData.garantia,
          pintura: formData.pintura,
          carroceria: formData.carroceria,
          tapiceria: formData.tapiceria,
          faros: formData.faros,
          llantas: formData.llantas,
          llanta_emergencia: formData.llanta_emergencia,
          encendido: formData.encendido,
          aireAcondicionado: formData.aireAcondicionado,
          aire_asientos: formData.aire_asientos,
          asiento_conductor: formData.asiento_conductor,
          asientos_pasajeros: formData.asientos_pasajeros,
          camara_retro: formData.camara_retro,
          camara_frontal: formData.camara_frontal,
          sensores_estacionamiento: formData.sensores_estacionamiento,
          sensorImpacto: formData.sensorImpacto,
          sensorProximidad: formData.sensorProximidad,
          tipo_motor: formData.tipo_motor,
          mantenimiento: formData.mantenimiento,
          vidriosTodos: formData.vidriosTodos,
          vidriosConduct: formData.vidriosConduct,
          tipo: tipoDetectado,
        });
      } catch (err) {
        console.error("❌ Error al generar el PDF:", err);
      }

      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  };

  
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur rounded-2xl p-10 md:p-12 shadow-xl border border-gray-200 transition-all">
        <div className="w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${progreso}%` }}
          ></div>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Evaluación Vehicular - Seamos sinceros - Paso {step} de 6
            <div className="mt-4 text-center bg-[#f8fafc] text-gray-600 text-xs border border-gray-200 rounded-xl p-3 shadow-sm max-w-md mx-auto">
  🎁 <strong className="text-[#006654]">¡Participa por una Giftcard de $100!</strong>  
  <br />
  Al completar tu evaluación estarás participando automáticamente. 
  <br />
  Sorteo válido hasta <strong>1 de Diciembre 2025</strong>.
</div>

          </h2>
        </div>
        <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-xl px-4 py-2 mb-4 text-center shadow-sm max-w-xl mx-auto">
  📄 Al finalizar esta evaluación, recibirás gratuitamente tu <strong>certificado PDF</strong> con el valor estimado y estado de tu vehículo.
</div>

        <div className="animate-fade-up transition-all duration-500 bg-white rounded-xl shadow-md hover:shadow-lg p-6 md:p-8 mb-10">
          {step === 1 && (
            <>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 border-gray-200">
                Información del Conductor
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="input"
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre"
                  maxLength={40}
                  required
                />
                <input
                  className="input"
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Apellido"
                  maxLength={40}
                  required
                />
                <input
                  className="input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
                <input
                  className="input"
                  type="tel"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  placeholder="Celular"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  required
                />
                <input
                  className="input"
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  placeholder="Ciudad de residencia"
                  maxLength={20}
                />
              </div>
            </>
          )}
        {step === 2 && (
  <div>
    <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 border-gray-200">
      Información del Vehículo
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <select
        className="input"
        name="Marca"
        value={formData.Marca}
        onChange={handleChange}
        required
      >
        <option value="">Selecciona marca</option>
        {marcas.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      {formData.Marca && (
        <select
          className="input"
          name="modelo"
          value={formData.modelo}
          onChange={(e) => {
            handleChange(e);
            const tipo = tiposPorModelo[e.target.value] || "";
            setFormData((prev) => ({ ...prev, tipo }));
          }}
          required
        >
          <option value="">Selecciona modelo</option>
          {modelos.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      )}

      {formData.modelo && tiposPorModelo[formData.modelo] && (
        <div className="input bg-gray-100 text-gray-700 cursor-not-allowed">
          Tipo: {tiposPorModelo[formData.modelo]}
        </div>
      )}

      <input
        className="input"
        type="text"
        name="anio"
        value={formData.anio || ""}
        onChange={handleChange}
        placeholder="Año de fabricación"
      />
      <input
        className="input"
        type="text"
        name="placa_letra"
        value={formData.placa_letra}
        onChange={handleChange}
        placeholder="Letra inicial de la placa"
        pattern="[A-Z]{1}"
        maxLength={1}
        title="Solo una letra mayúscula"
        required
      />
      <input
        className="input"
        type="number"
        name="placa_numero"
        value={formData.placa_numero}
        onChange={handleChange}
        placeholder="Dígito final de la placa"
        min={0}
        max={9}
        required
      />
      <input
        className="input"
        type="text"
        name="matriculacion"
        value={formData.matriculacion}
        onChange={handleChange}
        placeholder="Lugar de matriculación"
        maxLength={40}
      />
      <input
        className="input"
        type="text"
        name="anio_matriculacion"
        value={formData.anio_matriculacion || ""}
        onChange={handleChange}
        placeholder="Año de matriculación actual"
      />
      <input
        className="input"
        type="number"
        name="duenios"
        value={formData.duenios}
        onChange={handleChange}
        placeholder="Número de dueño(s)"
        min={0}
        max={10}
      />
    </div>
  </div>
)}



          {step === 3 && (
            <VisualEvaluationStep formData={formData} handleChange={handleChange} />
          )}
       {step === 4 && (
  <>
    <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 border-gray-200">
      Tecnología y Confort
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {[
        ["sensoresCinturon", "Sensor cinturón acompañante"],
        ["techoCorredizo", "Techo corredizo"],
        ["sistemaVisual", "Sistema visual para estacionamiento"],
        ["sensores_retro", "Sensores de retro"],
        ["camara_retro", "Cámara de retro"],
        ["aparcamiento_autonomo", "Aparcamiento autónomo"],
        ["retrovisoresElectricos", "Retrovisores eléctricos"],
        ["camara_frontal", "Cámara frontal"],
        ["sensorProximidad", "Sensor de proximidad"],
        ["sensorImpacto", "Alerta de impacto frontal"],
        ["aire_asientos", "Aire en los asientos"],
        ["aireAcondicionado", "Aire acondicionado"],
        ["vidriosConduct", "Vidrios eléctricos conductor"],
        ["vidriosTodos", "Vidrios eléctricos 4 ventanas"]
      ].map(([name, label]) => (
        <label key={name} className="flex items-center space-x-2">
          <input
            type="checkbox"
            name={name}
            checked={Boolean(formData[name as keyof typeof formData])}
            onChange={handleChange}
            className="accent-blue-600"
          />
          <span>{label}</span>
        </label>
      ))}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <select
        name="encendido"
        value={formData.encendido}
        onChange={handleChange}
        className="input"
        required
      >
        <option value="">Tipo de encendido</option>
        <option value="llave">Llave</option>
        <option value="boton">Botón</option>
        <option value="huella">Huella</option>
        <option value="voz">Control por voz</option>
      </select>

      <select
        name="asiento_conductor"
        value={formData.asiento_conductor}
        onChange={handleChange}
        className="input"
        required
      >
        <option value="">El asiento del conductor es</option>
        <option value="manual">Manual</option>
        <option value="electrico">Eléctrico</option>
      </select>

      <select
        name="asientos_pasajeros"
        value={formData.asientos_pasajeros}
        onChange={handleChange}
        className="input"
        required
      >
        <option value="">El asiento del pasajero es</option>
        <option value="manual">Manual</option>
        <option value="electrico">Eléctrico</option>
      </select>

      <select
        name="airbags"
        value={formData.airbags}
        onChange={handleChange}
        className="input"
        required
      >
        <option value="">¿Qué airbags tiene el vehículo?</option>
        <option value="ninguno">Ninguno</option>
        <option value="conductor">Solo conductor</option>
        <option value="conductor_acompanante">Conductor y acompañante</option>
        <option value="cortina">Sistema cortina</option>
      </select>
    </div>
  </>
)}
{step === 5 && (
  <>
    <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 border-gray-200">
      Área Mecánica
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <input
        className="input"
        type="number"
        name="kilometraje"
        value={formData.kilometraje}
        onChange={handleChange}
        placeholder="Kilómetros o millas recorridos"
        min={0}
        required
      />
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="garantia"
          checked={Boolean(formData.garantia)}
          onChange={handleChange}
          className="accent-blue-600"
        />
        <span>Posee garantía del concesionario</span>
      </label>
    </div>

    <div className="mb-6">
      <p className="font-medium mb-2">Tipo de vehículo:</p>
      <div className="flex flex-wrap gap-4">
        {["gasolina", "diesel", "hibrido", "electrico"].map((tipo) => (
          <label key={tipo} className="flex items-center space-x-2">
            <input
              type="radio"
              name="tipo_motor"
              value={tipo}
              checked={formData.tipo_motor === tipo}
              onChange={handleChange}
              className="accent-blue-600"
              required
            />
            <span className="capitalize">{tipo}</span>
          </label>
        ))}
      </div>
    </div>

    {formData.tipo_motor === "diesel" && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          name="mantenimiento"
          value={formData.mantenimiento}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="">Mantenimiento cada:</option>
          <option value="5000">5000 km</option>
          <option value="10000">10000 km</option>
        </select>
      </div>
    )}
  </>
)}
{step === 6 && (
  <div className="text-center">
    <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 border-b pb-2 border-gray-200">
      ¡Formulario completado!
    </h3>
    <p className="text-gray-700 mb-6">
      Gracias por completar la evaluación de tu vehículo. Nuestro sistema procesará la información para calcular el precio justo.
    </p>
    <a
      href="/"
      className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all"
    >
      ← Volver al inicio
    </a>
  </div>
)}

</div>

<div className="mt-10 flex flex-wrap justify-between items-center gap-4">
  {step > 1 && (
    <button
      onClick={() => setStep((prev) => Math.max(prev - 1, 1))}
      className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-200 transition-all"
    >
      ← Atrás
    </button>
  )}

{step < 6 && (
  <button
    onClick={() => {
      if (!validarPasoActual()) {
        alert("Por favor, completa correctamente todos los campos obligatorios antes de continuar.");
        return;
      }
      setStep((prev) => Math.min(prev + 1, 6));
    }}
    className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg hover:bg-blue-700 transition-all"
  >
    
      Siguiente →
    </button>
  )}

  {step === 6 && (
    <button
      onClick={enviarFormulario}
      disabled={enviando}
      className={`px-6 py-2 rounded-lg shadow-md transition-all ${
        enviando
          ? "bg-gray-400 text-white"
          : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"
      }`}
    >
      {enviando ? (
        <span className="flex items-center gap-2">
          <Loader2 className="animate-spin h-5 w-5" />
          Enviando...
        </span>
      ) : (
        "Enviar formulario"
      )}
    </button>
  )}

{mensajeIA && (
  <div className="mt-4 bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm p-4 rounded-xl shadow-sm max-w-3xl">
    {mensajeIA}
  </div>
)}

</div>
</div>
</main>
);
}

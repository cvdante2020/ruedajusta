"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface VehiculoRef {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
  tipo_vehiculo: string;
  combustible: string;
  kilometraje: number;
  precio1: number;
  precio2: number;
  precio3: number;
}

export default function ReferenciaAdmin() {
  const [vehiculos, setVehiculos] = useState<VehiculoRef[]>([]);
  const [form, setForm] = useState<Omit<VehiculoRef, "id">>({
    marca: "",
    modelo: "",
    anio: new Date().getFullYear(),
    tipo_vehiculo: "auto",
    combustible: "gasolina",
    kilometraje: 0,
    precio1: 0,
    precio2: 0,
    precio3: 0,
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verificarSesion = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        router.push("/admin/login");
      } else {
        fetchVehiculos();
      }
    };

    verificarSesion();
  }, [router]);

  const fetchVehiculos = async () => {
    const { data } = await supabase
      .from("vehiculos_ref")
      .select("*")
      .order("anio", { ascending: false });

    if (data) setVehiculos(data);
    setCargando(false);
  };

  const handleSubmit = async () => {
    if (!form.marca || !form.modelo || !form.anio) {
      alert("Por favor llena todos los campos obligatorios.");
      return;
    }

    setGuardando(true);

    if (editId) {
      await supabase.from("vehiculos_ref").update(form).eq("id", editId);
      alert("Vehículo actualizado correctamente.");
      setEditId(null);
    } else {
      const { data: existente } = await supabase
        .from("vehiculos_ref")
        .select("id")
        .eq("marca", form.marca)
        .eq("modelo", form.modelo)
        .eq("anio", form.anio)
        .eq("tipo_vehiculo", form.tipo_vehiculo)
        .eq("combustible", form.combustible)
        .eq("kilometraje", form.kilometraje);

      if (existente?.length) {
        alert("Este vehículo ya existe en la base de datos.");
        setGuardando(false);
        return;
      }

      const { error } = await supabase.from("vehiculos_ref").insert([form]);

      if (error) {
        console.error("Error al insertar:", error.message);
        alert("Hubo un error al guardar el vehículo: " + error.message);
        setGuardando(false);
        return;
      }
      
      alert("Vehículo agregado correctamente.");
      
    }

    setForm({
      marca: "",
      modelo: "",
      anio: new Date().getFullYear(),
      tipo_vehiculo: "auto",
      combustible: "gasolina",
      kilometraje: 0,
      precio1: 0,
      precio2: 0,
      precio3: 0,
    });
    fetchVehiculos();
    setGuardando(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Seguro que deseas eliminar este vehículo?")) {
      await supabase.from("vehiculos_ref").delete().eq("id", id);
      fetchVehiculos();
    }
  };

  const handleEdit = (vehiculo: VehiculoRef) => {
    const { id, ...vehiculoSinId } = vehiculo;
    setForm(vehiculoSinId);
    setEditId(id);
  };

  if (cargando) {
    return (
      <div className="p-10 text-center text-gray-600 text-lg">
        Cargando...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestión de Vehículos de Referencia</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Marca */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Marca</label>
          <input
            placeholder="Ej. TOYOTA"
            value={form.marca}
            onChange={(e) => setForm({ ...form, marca: e.target.value.toUpperCase() })}
            className="input"
          />
        </div>

        {/* Modelo */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Modelo</label>
          <input
            placeholder="Ej. COROLLA"
            value={form.modelo}
            onChange={(e) => setForm({ ...form, modelo: e.target.value.toUpperCase() })}
            className="input"
          />
        </div>

        {/* Año */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Año</label>
          <input
            type="number"
            placeholder="Ej. 2020"
            value={form.anio}
            onChange={(e) => setForm({ ...form, anio: parseInt(e.target.value) || 0 })}
            className="input"
          />
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de vehículo</label>
          <select
            value={form.tipo_vehiculo}
            onChange={(e) => setForm({ ...form, tipo_vehiculo: e.target.value })}
            className="input"
          >
            <option value="auto">Sedan</option>
            <option value="camioneta">Camioneta Doble Cabina</option>
            <option value="suv">SUV</option>
            <option value="camioneta">Todo Terreno</option>
            <option value="moto">Moto</option>
            <option value="camioneta">Camioneta Cabina Simple</option>
            <option value="camioneta">Hatchback</option>
            <option value="camioneta">Camión</option>
          </select>
        </div>

        {/* Combustible */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Combustible</label>
          <select
            value={form.combustible}
            onChange={(e) => setForm({ ...form, combustible: e.target.value })}
            className="input"
          >
            <option value="gasolina">Gasolina</option>
            <option value="diesel">Diésel</option>
            <option value="electrico">Eléctrico</option>
            <option value="hibrido">Híbrido</option>
          </select>
        </div>

        {/* Kilometraje */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Kilometraje (km)</label>
          <input
            type="number"
            placeholder="Ej. 75000"
            value={form.kilometraje}
            onChange={(e) => setForm({ ...form, kilometraje: parseInt(e.target.value) || 0 })}
            className="input"
          />
        </div>

        {/* Precio 1 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Precio 1 ($)</label>
          <input
            type="number"
            placeholder="Ej. 13500"
            value={form.precio1}
            onChange={(e) => setForm({ ...form, precio1: parseFloat(e.target.value) || 0 })}
            className="input"
          />
        </div>

        {/* Precio 2 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Precio 2 ($)</label>
          <input
            type="number"
            placeholder="Ej. 13200"
            value={form.precio2}
            onChange={(e) => setForm({ ...form, precio2: parseFloat(e.target.value) || 0 })}
            className="input"
          />
        </div>

        {/* Precio 3 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Precio 3 ($)</label>
          <input
            type="number"
            placeholder="Ej. 12900"
            value={form.precio3}
            onChange={(e) => setForm({ ...form, precio3: parseFloat(e.target.value) || 0 })}
            className="input"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={guardando}
        className={`${
          guardando ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        } text-white px-6 py-2 rounded-xl mb-6 transition-colors`}
      >
        {guardando ? "Guardando..." : editId ? "Actualizar vehículo" : "Agregar vehículo"}
      </button>

      <div className="overflow-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Marca</th>
              <th className="px-4 py-2">Modelo</th>
              <th className="px-4 py-2">Año</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Combustible</th>
              <th className="px-4 py-2">Kilometraje</th>
              <th className="px-4 py-2">Precio 1</th>
              <th className="px-4 py-2">Precio 2</th>
              <th className="px-4 py-2">Precio 3</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vehiculos.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="px-4 py-2">{v.marca}</td>
                <td className="px-4 py-2">{v.modelo}</td>
                <td className="px-4 py-2">{v.anio}</td>
                <td className="px-4 py-2">{v.tipo_vehiculo}</td>
                <td className="px-4 py-2">{v.combustible}</td>
                <td className="px-4 py-2">
  {v.kilometraje != null
    ? `${v.kilometraje.toLocaleString()} km`
    : "—"}
</td>

                <td className="px-4 py-2">
                  {typeof v.precio1 === "number"
                    ? `$${v.precio1.toLocaleString()}`
                    : "—"}
                </td>
                <td className="px-4 py-2">
                  {typeof v.precio2 === "number"
                    ? `$${v.precio2.toLocaleString()}`
                    : "—"}
                </td>
                <td className="px-4 py-2">
                  {typeof v.precio3 === "number"
                    ? `$${v.precio3.toLocaleString()}`
                    : "—"}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => handleEdit(v)} className="text-blue-600 hover:underline">Editar</button>
                  <button onClick={() => handleDelete(v.id)} className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

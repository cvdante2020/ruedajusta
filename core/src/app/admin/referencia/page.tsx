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
    precio1: 0,
    precio2: 0,
    precio3: 0,
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);
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
    if (!form.marca || !form.modelo || !form.anio) return;

    if (editId) {
      await supabase.from("vehiculos_ref").update(form).eq("id", editId);
      setEditId(null);
    } else {
      const { data } = await supabase
        .from("vehiculos_ref")
        .select("id")
        .eq("marca", form.marca)
        .eq("modelo", form.modelo)
        .eq("anio", form.anio);

      if (data?.length) return alert("Ya existe este vehículo");
      await supabase.from("vehiculos_ref").insert([form]);
    }

    setForm({
      marca: "",
      modelo: "",
      anio: new Date().getFullYear(),
      tipo_vehiculo: "auto",
      combustible: "gasolina",
      precio1: 0,
      precio2: 0,
      precio3: 0,
    });
    fetchVehiculos();
  };

  const handleDelete = async (id: number) => {
    await supabase.from("vehiculos_ref").delete().eq("id", id);
    fetchVehiculos();
  };

  const handleEdit = (vehiculo: VehiculoRef) => {
    setForm({ ...vehiculo });
    setEditId(vehiculo.id);
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
        <input placeholder="Marca" value={form.marca} onChange={e => setForm({ ...form, marca: e.target.value })} className="input" />
        <input placeholder="Modelo" value={form.modelo} onChange={e => setForm({ ...form, modelo: e.target.value })} className="input" />
        <input type="number" placeholder="Año" value={form.anio} onChange={e => setForm({ ...form, anio: parseInt(e.target.value) })} className="input" />
        <select value={form.tipo_vehiculo} onChange={e => setForm({ ...form, tipo_vehiculo: e.target.value })} className="input">
          <option value="auto">Auto</option>
          <option value="suv">SUV</option>
          <option value="camioneta">Camioneta</option>
          <option value="moto">Moto</option>
        </select>
        <select value={form.combustible} onChange={e => setForm({ ...form, combustible: e.target.value })} className="input">
          <option value="gasolina">Gasolina</option>
          <option value="diesel">Diésel</option>
          <option value="electrico">Eléctrico</option>
          <option value="hibrido">Híbrido</option>
        </select>
        <input type="number" placeholder="Precio referencia ($)" value={form.precio1} onChange={e => setForm({ ...form, precio1: parseFloat(e.target.value) })} className="input" />
      </div>
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded-xl mb-6">
        {editId ? "Actualizar" : "Agregar"} vehículo
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
              <th className="px-4 py-2">Precio1 ($)</th>
              <th className="px-4 py-2">Precio2 ($)</th>
              <th className="px-4 py-2">Precio3 ($)</th>
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
  {typeof v.precio1 === "number" ? `$${v.precio1.toLocaleString()}` : "—"}
</td>
<td className="px-4 py-2">
  {typeof v.precio1 === "number" ? `$${v.precio2.toLocaleString()}` : "—"}
</td>
<td className="px-4 py-2">
  {typeof v.precio1 === "number" ? `$${v.precio3.toLocaleString()}` : "—"}
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

import React from "react";
import type { ChangeEvent } from "react";

interface VisualEvaluationStepProps {
  formData: Record<string, any>;
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const VisualEvaluationStep: React.FC<VisualEvaluationStepProps> = ({
  formData,
  handleChange,
}) => {
  const campos = [
    { name: "pintura", label: "¿Qué tal está la pintura?" },
    { name: "faros", label: "¿Funcionan bien los faros?" },
    { name: "luces_guias", label: "¿Las luces guías están bien?" },
    { name: "direccionales_frontales", label: "¿Funcionan las direccionales frontales?" },
    { name: "direccionales_posteriores", label: "¿Funcionan las direccionales posteriores?" },
    { name: "parabrisas_delantero", label: "¿Está bien el parabrisas delantero?" },
    { name: "parabrisas_posterior", label: "¿Está bien el parabrisas posterior?" },
    { name: "ventanas", label: "¿Las ventanas funcionan bien?" },
    { name: "carroceria", label: "¿La carrocería tiene detalles visibles?" },
    { name: "persiana", label: "¿Está en buen estado la persiana?" },
    { name: "llantas", label: "¿Qué estado tienen las llantas?" },
    { name: "llanta_emergencia", label: "¿Tiene llanta de emergencia en buen estado?" },
    { name: "tapiceria", label: "¿La tapicería está bien cuidada?" },
    { name: "piso", label: "¿El piso interior está en buen estado?" },
    { name: "techo", label: "¿El techo tiene abolladuras?" },
    { name: "esfera_controles", label: "¿Los controles del tablero funcionan?" },
    { name: "chapas", label: "¿Las chapas están funcionales?" },
    { name: "cinturones", label: "¿Funcionan los cinturones de seguridad?" },
  ];

  return (
    <section className="mb-10">
      <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
        Inspección Visual – ¿Cómo se encuentra tu vehículo? 🧐
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        No te preocupes si tu vehículo tiene detalles. Sé sincer@ para que podamos darte una valoración justa.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campos.map(({ name, label }) => (
          <select
            key={name}
            name={name}
            value={formData[name] || ""}
            onChange={handleChange}
            className="input bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{label}</option>
            {[1, 2, 3, 4, 5].map((valor) => (
              <option key={valor} value={valor}>{valor}</option>
            ))}
          </select>
        ))}
      </div>
    </section>
  );
};

export default VisualEvaluationStep;

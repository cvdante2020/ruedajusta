// src/utils/responderConIA.ts
export async function responderConIA({
    marca,
    modelo,
    anio,
  }: {
    marca: string;
    modelo: string;
    anio: number;
  }): Promise<string> {
    const prompt = `
  El usuario intentó evaluar un vehículo ${marca} ${modelo} del año ${anio}, pero no se encontró en la base de datos.
  Genera una respuesta amable y profesional para mostrar en pantalla. 
  Sugiere opciones similares o que deje sus datos para recibir sugerencias personalizadas.
  `;
  
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });
  
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No se encontró el vehículo solicitado. Te sugerimos intentar con otro modelo similar.";
  }
  
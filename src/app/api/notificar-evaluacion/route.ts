import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();
  const { nombre, apellido, ciudad, Marca, modelo, anio } = body;

  // Enviar correo electrónico al administrador
  const emailResult = await resend.emails.send({
    from: "RuedaJusta <onboarding@resend.dev>",
    to: "sis.christian.villarreal@gmail.com", // <- reemplázalo con tu email personal
    subject: "🚘 Nueva evaluación recibida en RuedaJusta",
    html: `
      <p><strong>Nombre:</strong> ${nombre} ${apellido}</p>
      <p><strong>Ciudad:</strong> ${ciudad}</p>
      <p><strong>Vehículo:</strong> ${Marca} ${modelo} (${anio})</p>
    `,
  });

  // Enviar mensaje por WhatsApp usando plantilla "nueva_evaluacion"
  const whatsappPayload = {
    messaging_product: "whatsapp",
    to: "593998260550", // Reemplaza con número destino o uno de prueba
    type: "template",
    template: {
      name: "nueva_evaluacion",
      language: { code: "es_EC" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: `${nombre} ${apellido}` },
            { type: "text", text: Marca },
            { type: "text", text: modelo },
            { type: "text", text: anio.toString() },
            { type: "text", text: ciudad },
          ],
        },
      ],
    },
  };

  const whatsappRes = await fetch(
    `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(whatsappPayload),
    }
  );

  const whatsappResult = await whatsappRes.json();
  console.log("📲 Resultado del WhatsApp:", whatsappResult);

  return Response.json({ status: "ok", email: emailResult, whatsapp: whatsappResult });
}

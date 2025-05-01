export async function GET() {
    const payload = {
      messaging_product: "whatsapp",
      to: "593998260550", // número destino con código país
      type: "template",
      template: {
        name: "hello_world",
        language: { code: "en_US" },
      },
    };
  
    const respuesta = await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });
  
    const result = await respuesta.json();
    console.log("🔎 Resultado del envío:", result);
  
    return Response.json({ status: "whatsapp test sent", result });
  }
  
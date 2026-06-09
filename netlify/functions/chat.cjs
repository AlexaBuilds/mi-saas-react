exports.handler = async (event, context) => {
  // Configuración de cabeceras CORS para que tu GitHub Pages pueda consultar sin bloqueos
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Si el navegador pregunta antes de enviar (petición OPTIONS), respondemos OK
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  // Solo aceptamos peticiones POST (los mensajes del chat)
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: { message: "Método no permitido" } }),
    };
  }

  try {
    // Netlify leerá la clave desde su propio panel de control de forma segura
    const apiKey = process.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: { message: "La API Key de Groq no está configurada en Netlify." } }),
      };
    }

    const URL = "https://api.groq.com/openai/v1/chat/completions";

    // Hacemos la petición a Groq con el fetch nativo
    const respuesta = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: event.body, // Le pasamos a Groq lo que envió el usuario
    });

    const datos = await respuesta.json();

    return {
      statusCode: respuesta.status,
      headers,
      body: JSON.stringify(datos),
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: { message: error.message || "Error interno en la Netlify Function" } }),
    };
  }
};

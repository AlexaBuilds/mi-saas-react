const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors());

app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = process.env.VITE_GROQ_API_KEY; 
    
    if (!apiKey) {
      console.error("❌ ERROR EN BACKEND: La variable VITE_GROQ_API_KEY está vacía.");
      return res.status(500).json({ error: { message: "La API Key de Groq no está configurada en el servidor de AWS." } });
    }

    const URL = "https://api.groq.com/openai/v1/chat/completions";
    
    const respuesta = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(req.body)
    });

    const datos = await respuesta.json();
    
    if (!respuesta.ok) {
      console.error("❌ ERROR RECHAZADO POR GROQ:", datos);
      return res.status(respuesta.status).json(datos);
    }

    res.status(respuesta.status).json(datos);
  } catch (error) {
    console.error("❌ ERROR INTERNO EN EL PROXY:", error);
    res.status(500).json({ error: { message: error.message || "Error interno en el servidor intermediario" } });
  }
});

app.listen(5000, () => console.log("Guardaespaldas activo en el puerto 5000"));

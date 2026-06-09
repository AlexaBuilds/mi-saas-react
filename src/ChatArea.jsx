// //COMPONENTE: : ChatArea (Zona derecha principal)
// //1. Importar componentes hijos
// import Mensaje from './Mensaje';

// function ChatArea(){
//     return (
//         // La etiqueta <main> envuelve toda la parte derecha de la pantalla
//         <main className='chat-area'>
//             {/* Zona 1. : Historial de mensajes*/}
//             <section className='mensajes-container' id='caja-mensajes'>
//                 {/*Aquí llamamos a nuestro componente <Mensaje /> como
//                 si fuera una etiqueta HTML nueva*/}
//                 <Mensaje rol="ia" texto="¡Hola! Soy IA Master. ¿En que te ayudo hoy en React?" />
//                 <Mensaje rol="usuario" texto="Quiero aprender a usar componentes."/>
//                 <Mensaje rol="ia" texto="¡Excelente elección! Acabas de reutilizar código"/>
//             </section>
//                 {/*Zona 2. LA CAJA PARA ESCRIBIR (El input) */}
//                 <footer className='input-area'>
//                     <form className='chat-form'>
//                         <input
//                         type='text'
//                         id='mensaje-input'
//                         placeholder='Escribe tu pregunta aquí...'
//                         autoComplete='off'
//                         />
//                         <button type='submit'>Enviar</button>
//                     </form>
//                 </footer>
//         </main>
//     )
// }
// export default ChatArea;

// ==========================================
// COMPONENTE: ChatArea (Zona derecha principal)
// ==========================================

import { useState } from 'react';
import Mensaje from './Mensaje';

function ChatArea() {
  
  // ==========================================
  // 🧠 ZONA DE MEMORIA (ESTADOS)
  // ==========================================
  
  const [textoInput, setTextoInput] = useState("");

  const [listaMensajes, setListaMensajes] = useState([
    { rol: "ia", texto: "¡Hola! Soy IA Master. Conectado a la velocidad de Groq. ¿En qué te ayudo hoy?" }
  ]);

  // ==========================================
  // ⚙️ ZONA DE LÓGICA (ACCIONES - GROQ API)
  // ==========================================
  
  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    if (textoInput.trim() === "") return;

    // 1. Guardamos el texto del usuario
    const promptUsuario = textoInput;
    const mensajeUsuario = { rol: "usuario", texto: promptUsuario };
    
    // Mostramos el mensaje del usuario inmediatamente y el "Pensando..."
    setListaMensajes([...listaMensajes, mensajeUsuario, { rol: "ia", texto: "Procesando a la velocidad de la luz..." }]);
    setTextoInput(""); 

    try {
      // 2. CONEXIÓN AL CEREBRO DE GROQ
      // ⚠️ IMPORTANTE: Pega aquí tu API Key de Groq (suele empezar por 'gsk_')
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      
      const URL = "https://api.groq.com/openai/v1/chat/completions";

      const respuesta = await fetch(URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          // Groq exige que la clave vaya aquí, como un "Bearer token"
          "Authorization": `Bearer ${API_KEY}` 
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", // Modelo de código abierto ultra rápido
          messages: [
            // Le damos algo de contexto inicial
            { role: "system", content: "Eres un asistente experto en programación web y React. Responde en español de forma clara y concisa." },
            // Le enviamos la pregunta del usuario
            { role: "user", content: promptUsuario }
          ],
          temperature: 0.7 // Nivel de creatividad
        })
      });

      const datos = await respuesta.json();
      
      // Escudo de seguridad por si falla la clave
      if (!respuesta.ok) {
        console.error("Error de Groq:", datos);
        throw new Error(datos.error?.message || "La API de Groq rechazó la conexión");
      }

      // 3. EXTRAEMOS LA RESPUESTA DE GROQ
      // La ruta para encontrar el texto en Groq/OpenAI es esta:
      const textoIA = datos.choices[0].message.content;
      const mensajeIA = { rol: "ia", texto: textoIA };
      
      // 4. ACTUALIZAMOS LA PANTALLA
      setListaMensajes((listaActual) => {
        const listaSinPensando = listaActual.slice(0, -1);
        return [...listaSinPensando, mensajeIA];
      });

    } catch (error) {
      console.error("Error conectando con Groq:", error);
      
      setListaMensajes((listaActual) => {
        const listaSinPensando = listaActual.slice(0, -1);
        return [...listaSinPensando, { rol: "ia", texto: `❌ Error neuronal: ${error.message}` }];
      });
    }
  };

  // ==========================================
  // 🎨 ZONA VISUAL (LO QUE VE EL USUARIO)
  // ==========================================
  return (
    <main className="chat-area">
      
      <section className="mensajes-container" id="caja-mensajes">
        {listaMensajes.map((msg, indice) => (
          <Mensaje 
            key={indice} 
            rol={msg.rol} 
            texto={msg.texto} 
          />
        ))}
      </section>

      <footer className="input-area">
        <form className="chat-form" onSubmit={manejarEnvio}>
          <input
            type="text"
            id="mensaje-input"
            placeholder="Escribe tu prompt para Groq..."
            autoComplete="off"
            value={textoInput}
            onChange={(evento) => setTextoInput(evento.target.value)}
          />
          <button type="submit">Enviar</button>
        </form>
      </footer>

    </main>
  )
}

export default ChatArea;
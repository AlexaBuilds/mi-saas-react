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
    { 
      rol: "ia", 
      texto: "Hola. Soy OmniBot, tu agente de IA especializado en el ecosistema de nuestro Omnichannel Connector. Estoy conectado en tiempo real con tu Ecommerce, el ERP, tus Proveedores y tu Marketplace. ¿Qué métricas de stock, márgenes de beneficio o estado de Cron Jobs deseas auditar hoy?" 
    }
  ]);

  // ==========================================
  // ⚙️ ZONA DE LÓGICA (ACCIONES - NETLIFY FUNCTIONS)
  // ==========================================
  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    if (textoInput.trim() === "") return;

    const promptUsuario = textoInput;
    const mensajeUsuario = { rol: "usuario", texto: promptUsuario };
    
    setListaMensajes([...listaMensajes, mensajeUsuario, { rol: "ia", texto: "Procesando a la velocidad de la luz..." }]);
    setTextoInput(""); 

    try {
      const URL = "https://mi-saas-react.netlify.app/.netlify/functions/chat";

      const respuesta = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { 
              role: "system", 
              content: `Eres OmniBot, un consultor estratégico de nivel enterprise especializado en comercio electrónico global, gestión de negocios digitales y automatización omnicanal. 

              Tu misión abarca:
              1. ASESORÍA COMERCIAL Y LOGÍSTICA GLOBAL: Tienes un conocimiento profundo sobre estrategias de e-commerce, optimización de márgenes de beneficio, dinámicas de precios, gestión de catálogos y toda la cadena de suministro. Puedes resolver dudas sobre la gestión logística completa, desde el momento en que se procesa una compra hasta la entrega final del producto al cliente.
              2. CONTROL DEL OMNICHANNEL CONNECTOR: Entiendes a la perfección los flujos de sincronización en tiempo real, las automatizaciones de procesos, el estado de los Cron Jobs, el procesamiento de colas (jobs) y la integración operativa entre el ERP central, los Proveedores y los Marketplaces de destino.

              Directrices de estilo:
              - Responde siempre de forma profesional, analítica, corporativa, directa y proactiva.
              - Habla siempre en español.` 
            },
            { role: "user", content: promptUsuario }
          ],
          temperature: 0.7
        })
      }); // 🌟 ¡CORREGIDO! Paréntesis y llave de cierre del fetch colocados correctamente

      const datos = await respuesta.json();
      
      if (!respuesta.ok) {
        throw new Error(datos.error?.message || "La API rechazó la conexión");
      }

      const textoIA = datos.choices[0].message.content;
      const mensajeIA = { rol: "ia", texto: textoIA };
      
      setListaMensajes((listaActual) => {
        const listaSinPensando = listaActual.slice(0, -1);
        return [...listaSinPensando, mensajeIA];
      });

    } catch (error) {
      console.error("Error conectando:", error);
      setListaMensajes((listaActual) => {
        const listaSinPensando = listaActual.slice(0, -1);
        return [...listaSinPensando, { rol: "ia", texto: `❌ Error neuronal: ${error.message}` }];
      });
    }
  };

  // ==========================================
  // 🎨 ZONA VISUAL (CUMPLIENDO LA OPCIÓN SELECCIONADA)
  // ==========================================
  return (
    <main className="chat-area">
      
      {/* Cabecera Superior con Fondo Azul Cian */}
      <header className="chat-header">
        <div className="chat-header-title">
          <h3>OmniBot Core</h3>
        </div>
        <span className="chat-header-status">● SINCRONIZADO</span>
      </header>

      {/* Contenedor de burbujas enmarcadas en Azul Cian */}
      <section className="mensajes-container" id="caja-mensajes">
        {listaMensajes.map((msg, indice) => {
          if (msg.rol === "ia" && indice === 0) {
            return (
              <div key={indice} className="msg-ia-bienvenida">
                <span className="tag-sistema">OmniBot</span>
                <p>{msg.texto}</p>
              </div>
            );
          }

          return (
            <div key={indice} className={msg.rol === "usuario" ? "msg-usuario" : "msg-ia"}>
              {msg.rol === "ia" && <span className="tag-sistema">OmniBot</span>}
              <p>{msg.texto}</p>
            </div>
          );
        })}
      </section>

      {/* Formulario Inferior - Barra Ancha en Degradado Azul Píldora */}
      <footer className="input-area">
        <form className="chat-form" onSubmit={manejarEnvio}>
          <input
            type="text"
            id="mensaje-input"
            placeholder="Pregúntame sobre tu Ecommerce, Proveedores, Marketplace o ERP..."
            autoComplete="off"
            value={textoInput}
            onChange={(evento) => setTextoInput(evento.target.value)}
          />
          <button type="submit" disabled={textoInput.trim() === ""}>Enviar —&gt;</button>
        </form>
      </footer>

    </main>
  );
}

export default ChatArea;
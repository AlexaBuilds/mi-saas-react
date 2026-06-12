// ==========================================
// COMPONENTE: ChatArea (Zona derecha principal)
// ==========================================

import { useState } from 'react';
import Mensaje from './Mensaje';

// ✂️ BORRADO: Ya no importamos el logo aquí porque se movió al Sidebar

function ChatArea() {
  
  // ==========================================
  // 🧠 ZONA DE MEMORIA (ESTADOS)
  // ==========================================
  const [textoInput, setTextoInput] = useState("");

  const [listaMensajes, setListaMensajes] = useState([
    { 
      rol: "ia", 
      texto: "Hola. Soy OmniBot, tu agente de IA especializado en el ecosistema omnicanal de Ez-Find Goods. Estoy conectado en tiempo real con Odoo 18, BigBuy y TEMU Seller Marketplace. ¿Qué métricas de stock, márgenes de beneficio o estado de Cron Jobs deseas auditar hoy?" 
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
            { role: "system", content: "Eres OmniBot, un agente de IA ultra-especializado en la gestión de e-commerce y conectores omnicanal de Ez-Find Goods. Tu conocimiento se basa en la sincronización en tiempo real entre BigBuy (catálogo y stock), Odoo 18 (ERP centralizador) y TEMU Seller Marketplace. Ayudas al usuario a entender problemas de inventario, optimización de márgenes de beneficio, estados de los Cron Jobs y logística automatizada. Tus respuestas deben ser profesionales, analíticas, corporativas y directas. Habla siempre en español." },
            { role: "user", content: promptUsuario }
          ],
          temperature: 0.7
        })
      });

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
          
          {/* ✂️ BORRADO: Quitamos la etiqueta <img> para que el logo no aparezca en la barra azul */}
          
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
            placeholder="Pregúntame sobre BigBuy, TEMU o Odoo..."
            autoComplete="off"
            value={textoInput}
            onChange={(evento) => setTextoInput(evento.target.value)}
          />
          <button type="submit" disabled={textoInput.trim() === ""}>Enviar —&gt;</button>
        </form>
      </footer>

    </main>
  )
}

export default ChatArea;
// ==========================================
// COMPONENTE: ChatArea (Zona derecha principal)
// ==========================================

import { useState, useEffect } from 'react';
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

  // Estados para la humanización de la voz
  const [voces, setVoces] = useState([]);
  const [vozIndex, setVozIndex] = useState(0);
  const [tono, setTono] = useState(1.0); 
  const [indiceMensajeHablando, setIndiceMensajeHablando] = useState(null); 
  const [audioDesbloqueado, setAudioDesbloqueado] = useState(false); // 🔥 Control de seguridad móvil

  // ==========================================
  // 🎙️ CARGA DINÁMICA DE VOCES HUMANIZADAS
  // ==========================================
  useEffect(() => {
    const cargarVocesDisponibles = () => {
      const todasLasVoces = window.speechSynthesis.getVoices();
      const vocesEspañol = todasLasVoces.filter(voz => voz.lang.startsWith('es'));
      setVoces(vocesEspañol);
    };

    cargarVocesDisponibles();
    window.speechSynthesis.onvoiceschanged = cargarVocesDisponibles;

    return () => window.speechSynthesis.cancel();
  }, []);

  // ==========================================
  // 🔥 DISPARADOR DE DESBLOQUEO INMEDIATO (MÓVILES)
  // ==========================================
  const desbloquearAudioMovil = () => {
    if (audioDesbloqueado) return;
    
    try {
      // Emitimos un string vacío instantáneo para que el móvil valide la interacción física
      const interaccionFalsa = new SpeechSynthesisUtterance("");
      interaccionFalsa.volume = 0; // Completamente mudo
      window.speechSynthesis.speak(interaccionFalsa);
      setAudioDesbloqueado(true);
      console.log("🚀 Canal de voz desbloqueado con éxito en tu móvil");
    } catch (e) {
      console.error("Error al pre-desbloquear audio:", e);
    }
  };

  // ==========================================
  // 🔊 MOTOR DE AUDIO UNIVERSAL (PC Y MÓVILES)
  // ==========================================
  const toggleVoz = (texto, indice) => {
    // Si el móvil aún no se ha desbloqueado, aprovechamos este clic real para hacerlo
    if (!audioDesbloqueado) {
      desbloquearAudioMovil();
    }

    if (indiceMensajeHablando === indice) {
      window.speechSynthesis.cancel();
      setIndiceMensajeHablando(null);
      return;
    }

    window.speechSynthesis.cancel(); 

    // Pequeño retraso de 50ms para dar tiempo al canal de iOS/Android a limpiarse por completo
    setTimeout(() => {
      const enunciado = new SpeechSynthesisUtterance(texto);
      
      if (voces && voces[vozIndex]) {
        enunciado.voice = voces[vozIndex];
        enunciado.lang = voces[vozIndex].lang;
      } else {
        enunciado.lang = 'es-ES';
      }

      enunciado.rate = 0.95; // Bajado un 5% para que en móvil suene más natural y menos robótico
      enunciado.pitch = tono; 

      enunciado.onstart = () => setIndiceMensajeHablando(indice);
      enunciado.onend = () => setIndiceMensajeHablando(null);
      enunciado.onerror = (e) => {
        console.error("Error en SpeechSynthesis:", e);
        setIndiceMensajeHablando(null);
      };

      try {
        window.speechSynthesis.speak(enunciado);
        
        // Si el móvil lo deja en pausa forzada en segundo plano, lo despertamos
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch (error) {
        console.error("Error crítico en reproducción móvil:", error);
      }
    }, 50);
  };

  // ==========================================
  // ⚙️ ZONA DE LÓGICA (ACCIONES - NETLIFY FUNCTIONS)
  // ==========================================
  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    if (textoInput.trim() === "") return;

    window.speechSynthesis.cancel();
    setIndiceMensajeHablando(null);

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
  // 🎨 ZONA VISUAL
  // ==========================================
  return (
    <main className="chat-area" onClick={desbloquearAudioMovil}>
      
      {/* Cabecera Superior */}
      <header className="chat-header">
        <div className="chat-header-title">
          <h3>OmniBot Core</h3>
        </div>
        <span className="chat-header-status">● SINCRONIZADO</span>
      </header>

      {/* Contenedor de burbujas enmarcadas */}
      <section className="mensajes-container" id="caja-mensajes">
        {listaMensajes.map((msg, indice) => {
          
          const estaHablandoEsteMensaje = indiceMensajeHablando === indice;

          // Mensaje de bienvenida de la IA
          if (msg.rol === "ia" && indice === 0) {
            return (
              <div key={indice} className="msg-ia-bienvenida">
                <span className="tag-sistema">OmniBot</span>
                <p>{msg.texto}</p>
                
                {/* 🎛️ PANEL DE AUDIO ESTILIZADO BAJO LA BURBUJA */}
                <div className="contenedor-audio-ia">
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); toggleVoz(msg.texto, indice); }}
                    className={`btn-audio-ia ${estaHablandoEsteMensaje ? 'detener' : ''}`}
                  >
                    {estaHablandoEsteMensaje ? "🛑 Detener" : "📢 Escuchar"}
                  </button>

                  <select 
                    value={vozIndex} 
                    onChange={(e) => setVozIndex(Number(e.target.value))}
                    className="select-audio-ia"
                  >
                    {voces.map((voz, index) => (
                      <option key={index} value={index}>🗣️ {voz.name.replace('Microsoft', '').replace('Google', '')}</option>
                    ))}
                  </select>

                  <div className="wrapper-tono-ia">
                    <span>Tono</span>
                    <input 
                      type="range" 
                      min="0.6" 
                      max="1.4" 
                      step="0.1" 
                      value={tono} 
                      onChange={(e) => setTono(Number(e.target.value))}
                      className="slider-tono-ia"
                    />
                  </div>
                </div>

              </div>
            );
          }

          // Mensajes normales del flujo del chat
          return (
            <div key={indice} className={msg.rol === "usuario" ? "msg-usuario" : "msg-ia"}>
              {msg.rol === "ia" && <span className="tag-sistema">OmniBot</span>}
              <p>{msg.texto}</p>
              
              {/* 🎛️ PANEL DE AUDIO ESTILIZADO BAJO LA BURBUJA (Solo IA completa) */}
              {msg.rol === "ia" && msg.texto !== "Procesando a la velocidad de la luz..." && (
                <div className="contenedor-audio-ia">
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); toggleVoz(msg.texto, indice); }}
                    className={`btn-audio-ia ${estaHablandoEsteMensaje ? 'detener' : ''}`}
                  >
                    {estaHablandoEsteMensaje ? "🛑 Detener" : "📢 Escuchar"}
                  </button>

                  <select 
                    value={vozIndex} 
                    onChange={(e) => setVozIndex(Number(e.target.value))}
                    className="select-audio-ia"
                  >
                    {voces.map((voz, index) => (
                      <option key={index} value={index}>🗣️ {voz.name.replace('Microsoft', '').replace('Google', '')}</option>
                    ))}
                  </select>

                  <div className="wrapper-tono-ia">
                    <span>Tono</span>
                    <input 
                      type="range" 
                      min="0.6" 
                      max="1.4" 
                      step="0.1" 
                      value={tono} 
                      onChange={(e) => setTono(Number(e.target.value))}
                      className="slider-tono-ia"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Formulario Inferior */}
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
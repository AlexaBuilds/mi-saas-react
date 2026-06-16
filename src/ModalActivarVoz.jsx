import { useState, useEffect } from 'react';

function ModalActivarVoz({ onActivar, onRechazar }) {
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    // Solo mostrar en móviles y si no se ha activado antes
    const esMobil = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const yaActivado = localStorage.getItem('audioActivado');
    
    if (esMobil && !yaActivado) {
      setMostrar(true);
    }
  }, []);

  const handleActivar = () => {
    localStorage.setItem('audioActivado', 'true');
    setMostrar(false);
    onActivar();
  };

  const handleRechazar = () => {
    localStorage.setItem('audioActivado', 'false');
    setMostrar(false);
    onRechazar();
  };

  if (!mostrar) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <div className="modal-icono">🎙️</div>
        <h2>OmniBot puede hablar contigo</h2>
        <p>Activa la voz para escuchar las respuestas de forma automática</p>
        
        <div className="modal-botones">
          <button className="btn-activar" onClick={handleActivar}>
            🔊 Activar Voz
          </button>
          <button className="btn-rechazar" onClick={handleRechazar}>
            Solo Texto
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalActivarVoz;
import React from 'react';
// 🌟 PASO 1: Importamos el archivo de imagen limpio desde tus assets
import logoConector from './assets/logo-connector.png';

// =========================================================================
// COMPONENTE: Sidebar (Diseño Ajustado de Jerarquías de Color)
// =========================================================================
function Sidebar() {
    return (
        <aside className="sidebar">
            
            {/* Contenedor Superior (Logo + Menú e Historial) */}
            <div className="menu-lateral">
                
                {/* Branding Corporativo */}
                <div className="logo-area">
                    {/* 🌟 PASO 2: Alineamos el Logo y el texto usando un flexbox en línea */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <img 
                            src={logoConector} 
                            alt="Omnichannel Logo" 
                            className="sidebar-logo" 
                        />
                        <h2>OmniBot Core</h2>
                    </div>
                    <p>Ez-Find Goods</p>
                </div>
                
                {/* Panel del Historial Reciente */}
                <div className="historial">
                    {/* El título "Monitoreo reciente" ahora lleva la clase que le da el fondo naranja */}
                    <p className="historial-titulo">Monitoreo reciente</p>
                    
                    <ul>
                        {/* Removida la clase active de aquí para dejar los ítems en su estado light limpio */}
                        <li>
                            <span>🔍</span> Sincronización Stock BigBuy
                        </li>
                        <li>
                            <span>🔍</span> Errores API en TEMU Marketplace
                        </li>
                        <li>
                            <span>🔍</span> Verificación Cron Jobs Odoo 18
                        </li>
                        <li>
                            <span>🔍</span> Optimización Márgenes B2B
                        </li>
                    </ul>
                </div>

                {/* Botón Nueva Instancia - Al pasar el cursor mutará de naranja a azul cian */}
                <button type="button">+ Instancia de Chat</button>
                
            </div>

            {/* Credenciales de Usuario (Footer del Sidebar) */}
            <div className="perfil">
                <div className="perfil-avatar">EX</div>
                <div className="perfil-info">
                    <span className="username">Admin_EzFind</span>
                    <span className="role">Usuario Pro</span>
                </div>
            </div>
            
        </aside>
    );
}

export default Sidebar;
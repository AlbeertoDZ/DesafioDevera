import './Sidebar.scss';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <h2 className="sidebar-title">
          BIENVENIDO A DEVERA
        </h2>
        <p className="sidebar-description">
          Nuestro asistente inteligente te ayudará a configurar tu empresa paso a paso.
        </p>
        <div className="sidebar-features">
          <div className="feature-item">
            <span className="feature-icon">🤖</span>
            <span className="feature-text">Chat con IA</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <span className="feature-text">Análisis automático</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <span className="feature-text">Configuración rápida</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 
import './Cargando.css'

// Se muestra mientras se descarga el código de una página (React.lazy).
const Cargando = () => (
  <div className="cargando" role="status" aria-live="polite">
    <span className="cargando-rueda" aria-hidden="true" />
    <span className="cargando-texto">Cargando…</span>
  </div>
)

export default Cargando
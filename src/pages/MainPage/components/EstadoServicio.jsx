import { RefreshCw } from 'lucide-react'
import { ESTADOS_SERVICIO, variablesEstado } from '../../../data/estadoServicio'
import './css/EstadoServicio.css'

// Si recibe `onClick` (solo en la versión demo) la tarjeta se vuelve un botón que
// cambia de estado con un toque. Sin `onClick` es una tarjeta informativa común.
const EstadoServicio = ({ estado = 'normal', onClick }) => {
  const clave = ESTADOS_SERVICIO[estado] ? estado : 'normal'
  const { titulo, cuando } = ESTADOS_SERVICIO[clave]
  const interactivo = typeof onClick === 'function'
  const clases = `estado-servicio${interactivo ? ' estado-servicio--interactivo' : ''}`

  const contenido = (
    <>
      <span className="estado-punto" aria-hidden="true" />
      <div className="estado-textos">
        <strong className="estado-titulo">{titulo}</strong>
        <span className="estado-detalle">{cuando}</span>
      </div>
      {interactivo && <RefreshCw className="estado-cambiar" size={18} aria-hidden="true" />}
    </>
  )

  if (interactivo) {
    return (
      <button
        type="button"
        className={clases}
        style={variablesEstado(clave)}
        onClick={onClick}
        aria-live="polite"
        aria-label={`Estado del servicio: ${titulo}. ${cuando}. Tocar para cambiar (demo).`}
      >
        {contenido}
      </button>
    )
  }

  return (
    <section
      className={clases}
      style={variablesEstado(clave)}
      role="status"
      aria-live="polite"
      aria-label="Estado del servicio"
    >
      {contenido}
    </section>
  )
}

export default EstadoServicio

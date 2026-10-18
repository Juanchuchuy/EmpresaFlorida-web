import './EstadoServicio.css'

// Variantes del estado del servicio. Por ahora el estado se elige por prop
// ('normal' | 'reducido' | 'suspendido'); más adelante vendrá de datos reales.
const ESTADOS = {
  normal: {
    titulo: 'Servicio normal',
    detalle: 'Todas las líneas operativas',
  },
  reducido: {
    titulo: 'Servicio reducido',
    detalle: 'Frecuencia reducida',
  },
  suspendido: {
    titulo: 'Servicio suspendido',
    detalle: 'Sin servicio temporalmente',
  },
}

const EstadoServicio = ({ estado = 'normal' }) => {
  const clave = ESTADOS[estado] ? estado : 'normal'
  const { titulo, detalle } = ESTADOS[clave]

  return (
    <section
      className={`estado-servicio estado-servicio--${clave}`}
      role="status"
      aria-live="polite"
      aria-label="Estado del servicio"
    >
      <span className="estado-punto" aria-hidden="true" />
      <div className="estado-textos">
        <strong className="estado-titulo">{titulo}</strong>
        <span className="estado-detalle">{detalle}</span>
      </div>
    </section>
  )
}

export default EstadoServicio
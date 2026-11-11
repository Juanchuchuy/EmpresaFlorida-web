import { CircleCheck, OctagonAlert, TriangleAlert } from 'lucide-react'
import { useEstadoServicio } from '../hooks/useEstadoServicio'
import { ESTADOS_SERVICIO, variablesEstado } from '../data/EstadoServicio'
import './AvisoServicio.css'

const ICONOS = {
  normal: CircleCheck,
  reducido: TriangleAlert,
  muyReducido: TriangleAlert,
  sinServicio: OctagonAlert,
}

// Hero de advertencia: avisa al usuario cómo está el servicio hoy.
const AvisoServicio = () => {
  const { estado } = useEstadoServicio()
  const meta = ESTADOS_SERVICIO[estado]
  const Icono = ICONOS[estado]

  return (
    <aside
      className={`aviso-servicio aviso-servicio--${estado}`}
      style={variablesEstado(estado)}
      role="status"
      aria-live="polite"
    >
      <Icono className="aviso-servicio-icono" size={32} aria-hidden="true" />
      <div className="aviso-servicio-textos">
        <p className="aviso-servicio-cuando">{meta.cuando}</p>
        <h2 className="aviso-servicio-titulo">{meta.titulo}</h2>
        <p className="aviso-servicio-mensaje">{meta.aviso}</p>
      </div>
    </aside>
  )
}

export default AvisoServicio
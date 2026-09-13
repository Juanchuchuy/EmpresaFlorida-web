import { useRef } from 'react'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import './ParadasCarousel.css'

// `paradas` es un array de { id?, nombre, imagen? }. Cuando la línea
// tiene fotos reales cargadas (ver data/paradas.js), cada parada trae
// su propia imagen. Cuando no, Horarios.jsx arma un fallback sin fotos
// a partir del texto de "recorrido" del próximo horario.
const ParadasCarousel = ({ paradas, indiceActual = 0, titulo = 'Recorrido del próximo servicio' }) => {
  const pistaRef = useRef(null)

  const desplazar = (direccion) => {
    pistaRef.current?.scrollBy({ left: direccion * 220, behavior: 'smooth' })
  }

  if (!paradas || paradas.length === 0) return null

  const hayFotos = paradas.some((p) => p.imagen)

  return (
    <div className="paradas-carrusel">
      <div className="paradas-carrusel-header">
        <p className="paradas-carrusel-titulo">{titulo}</p>
        <div className="paradas-carrusel-controles">
          <button type="button" onClick={() => desplazar(-1)} aria-label="Ver parada anterior">
            <ChevronLeft size={18} />
          </button>
          <button type="button" onClick={() => desplazar(1)} aria-label="Ver siguiente parada">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="paradas-carrusel-pista" ref={pistaRef}>
        {paradas.map((parada, idx) => {
          const esActual = idx === indiceActual
          const esFinal = idx === paradas.length - 1
          const tieneFoto = Boolean(parada.imagen)

          return (
            <div
              key={parada.id ?? `${parada.nombre}-${idx}`}
              className={[
                'parada-card',
                tieneFoto && 'parada-card--foto',
                esActual && 'parada-card--actual',
              ]
                .filter(Boolean)
                .join(' ')}
              style={tieneFoto ? { backgroundImage: `url(${parada.imagen})` } : undefined}
            >
              {tieneFoto && <div className="parada-card-degradado" />}
              <div className="parada-card-contenido">
                {!tieneFoto && (
                  <div className="parada-card-icono">
                    <MapPin size={20} />
                  </div>
                )}
                <span className="parada-card-badge">
                  {esActual ? 'Aproximándose' : ''}
                </span>
                
                <p className="parada-card-nombre">{parada.nombre}</p>
              </div>
            </div>
          )
        })}
      </div>

      <p className="paradas-carrusel-nota">
        {hayFotos
          ? '* La parada marcada como "Aproximándose" es una referencia inicial del recorrido, todavía no refleja la ubicación del colectivo en tiempo real.'
          : '* Vista preliminar armada con el recorrido ya cargado. Cuando sumemos la ubicación de cada parada, esto va a reflejar el avance real del colectivo.'}
      </p>
    </div>
  )
}

export default ParadasCarousel
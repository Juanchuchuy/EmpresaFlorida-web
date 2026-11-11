import PriceCard from '../components/PriceCard'
import { puntosDeRecarga } from '../data/PuntosRecarga'
import './PuntosRecarga.css'

// Icons
import { Clock, ExternalLink, MapPin } from 'lucide-react'

// Link a Google Maps de cada punto. Si el punto tiene `urlMaps` (el link de
// "Compartir" del comercio en Maps) se usa ese: abre el lugar con su nombre,
// fotos y horarios. Si no, se usan las coordenadas (lat/lng), que marcan un
// pin sin nombre. En el celular abre la app de Google Maps; en la compu, la web.
const urlGoogleMaps = (punto) =>
  typeof punto.urlMaps === 'string' && punto.urlMaps.startsWith('https://')
    ? punto.urlMaps
    : `https://www.google.com/maps/search/?api=1&query=${punto.lat},${punto.lng}`

const PuntosRecarga = () => {
  return (
    <section className="puntos-recarga-page">
      <PriceCard></PriceCard>

      <div className="puntos-recarga-lista">
        {puntosDeRecarga.map((punto) => (
          <a
            key={punto.id}
            className="punto-card"
            href={urlGoogleMaps(punto)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${punto.nombre}, ${punto.direccion}, ${punto.ciudad}. Abrir en Google Maps`}
          >
            <div className="punto-card-header">
              <span className={`punto-card-badge punto-card-badge--${punto.tipo}`}>
                {punto.tipo === 'oficial' ? 'Oficial' : 'Comercio'}
              </span>
            </div>
            <p className="punto-card-nombre">{punto.nombre}</p>
            <p className="punto-card-direccion">
              <MapPin size={13} /> {punto.direccion}, {punto.ciudad}
            </p>
            {punto.horario && (
              <p className="punto-card-horario">
                <Clock size={13} /> {punto.horario}
              </p>
            )}
            <span className="punto-card-maps">
              <ExternalLink size={13} /> Abrir en Google Maps
            </span>
          </a>
        ))}
      </div>

      <div className="puntos-recarga-footer">
        <p className="puntos-recarga-nota">Tocá una card para ver la ubicación en Google Maps</p>
        <div className="puntos-recarga-leyenda">
          <span className="leyenda-item">
            <span className="leyenda-punto leyenda-punto--oficial" /> Oficial
          </span>
          <span className="leyenda-item">
            <span className="leyenda-punto leyenda-punto--comercio" /> Comercio
          </span>
        </div>
      </div>
    </section>
  )
}

export default PuntosRecarga
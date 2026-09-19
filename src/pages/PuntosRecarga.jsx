import { useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import PriceCard from '../components/PriceCard';
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { puntosDeRecarga } from '../data/PuntosRecarga'
import './PuntosRecarga.css'

// Icons
import { ChevronLeft, ChevronRight, Clock, CreditCard, MapPin } from 'lucide-react'

// Centrado a ojo entre los 7 puntos reales (de Tucumán capital hasta
// Las Cejas), con zoom bajo para que entren todos de arranque.
const CENTRO_TUCUMAN = [-26.9, -64.97]

// Un ícono por tipo de punto: el oficial se distingue del resto de
// comercios adheridos, igual que en el diseño (leyenda "Oficial" /
// "Comercio" abajo del mapa).
const crearIcono = (tipo, seleccionado) =>
  L.divIcon({
    className: `punto-recarga-icono punto-recarga-icono--${tipo} ${seleccionado ? 'punto-recarga-icono--seleccionado' : ''}`,
    html: '<span></span>',
    iconSize: [seleccionado ? 28 : 22, seleccionado ? 28 : 22],
    iconAnchor: [seleccionado ? 14 : 11, seleccionado ? 14 : 11],
    popupAnchor: [0, -14],
  })

// Componente auxiliar: react-leaflet no deja mover la cámara del mapa
// como prop normal, hay que pedirle la instancia con useMap() y
// mandarle flyTo() a mano cuando cambia el punto seleccionado.
const CentrarEnPunto = ({ punto }) => {
  const map = useMap()
  if (punto) {
    map.flyTo([punto.lat, punto.lng], 14, { duration: 0.6 })
  }
  return null
}

const PuntosRecarga = () => {
  const [seleccionadoId, setSeleccionadoId] = useState(null)
  const pistaRef = useRef(null)

  const puntoSeleccionado = puntosDeRecarga.find((p) => p.id === seleccionadoId) ?? null

  const desplazarCarrusel = (direccion) => {
    pistaRef.current?.scrollBy({ left: direccion * 240, behavior: 'smooth' })
  }

  return (
    <section className="puntos-recarga-page">
      <div className="puntos-recarga-hero">
        <span className="puntos-recarga-kicker">Conseguí tu tarjeta Independencia</span>
        <h1 className="puntos-recarga-titulo">Puntos de Venta</h1>
        <p className="puntos-recarga-subtitulo">
          Encontrá el local más cercano a vos y visitanos en el horario que mejor te quede.
        </p>
      </div>

      <PriceCard></PriceCard>

      <div className="puntos-recarga-carrusel">
        <button
          type="button"
          className="puntos-recarga-carrusel-flecha"
          onClick={() => desplazarCarrusel(-1)}
          aria-label="Ver punto anterior"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="puntos-recarga-carrusel-pista" ref={pistaRef}>
          {puntosDeRecarga.map((punto) => {
            const estaSeleccionado = punto.id === seleccionadoId
            return (
              <button
                type="button"
                key={punto.id}
                className={`punto-card ${estaSeleccionado ? 'punto-card--seleccionada' : ''}`}
                onClick={() => setSeleccionadoId(estaSeleccionado ? null : punto.id)}
              >
                <div className="punto-card-header">
                  <span className="punto-card-numero">{punto.numero}</span>
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
              </button>
            )
          })}
        </div>

        <button
          type="button"
          className="puntos-recarga-carrusel-flecha"
          onClick={() => desplazarCarrusel(1)}
          aria-label="Ver siguiente punto"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="puntos-recarga-mapa-wrap">
        <MapContainer center={CENTRO_TUCUMAN} zoom={10} scrollWheelZoom className="puntos-recarga-mapa">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <CentrarEnPunto punto={puntoSeleccionado} />
          {puntosDeRecarga.map((punto) => {
            const estaSeleccionado = punto.id === seleccionadoId
            return (
              <Marker
                key={punto.id}
                position={[punto.lat, punto.lng]}
                icon={crearIcono(punto.tipo, estaSeleccionado)}
                eventHandlers={{
                  click: () => setSeleccionadoId(estaSeleccionado ? null : punto.id),
                }}
              >
                <Popup>
                  <strong>{punto.nombre}</strong>
                  <br />
                  {punto.direccion}, {punto.ciudad}
                  {punto.horario && (
                    <>
                      <br />
                      {punto.horario}
                    </>
                  )}
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>

      <div className="puntos-recarga-footer">
        <p className="puntos-recarga-nota">Hacé clic en una card o marcador para ver detalles</p>
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
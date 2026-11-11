import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Clock,
  BadgeDollarSign,
  MapPin,
  Ticket,
  Megaphone,
  ChevronRight,
} from 'lucide-react'
import busHero from '../../assets/img/bus-hero.webp'
import rutaHero from '../../assets/img/road-hero.webp'
import EstadoServicio from './components/EstadoServicio'
import RedesModal from './components/RedesModal'
import { useAlturaHeader } from '../../hooks/useAlturaHeader'
import { useEstadoServicio } from '../../hooks/useEstadoServicio'
import { useIntroBus } from '../../hooks/useIntroBus'
import { ORDEN_ESTADOS } from '../../data/estadoServicio'
import './css/MainPage.css'

const acciones = [
  { icono: Clock, texto: 'Horarios', ruta: '/horarios', color: 'rojo' },
  { icono: BadgeDollarSign, texto: 'Tarifas', ruta: null, color: 'azul' },
  { icono: MapPin, texto: 'Punto de recarga', ruta: '/puntos-recarga', color: 'rojo' },
  { icono: Ticket, texto: 'Abonos', ruta: null, color: 'azul' },
]

const MainPage = () => {
  const navigate = useNavigate()
  const homeRef = useRef(null)

  // La home ocupa exactamente lo que queda de pantalla debajo del header.
  useAlturaHeader(homeRef)

  // Intro animada del colectivo (ver hooks/useIntroBus.js).
  const { fase, busRef, variablesCss } = useIntroBus()

  // Versión demo: cada toque en la tarjeta simula el siguiente estado (normal →
  // reducido → muy reducido → sin servicio). Cambia también los horarios, el aviso
  // y los badges de toda la app; vive en memoria y se reinicia al recargar.
  const { estado, forzarEstado } = useEstadoServicio()
  const siguienteEstado = () =>
    forzarEstado(ORDEN_ESTADOS[(ORDEN_ESTADOS.indexOf(estado) + 1) % ORDEN_ESTADOS.length])

  // Popup con las redes sociales de la empresa (botón "Novedades").
  const [redesAbiertas, setRedesAbiertas] = useState(false)

  const ir = (ruta) => {
    if (ruta) navigate(ruta)
  }

  return (
    <main
      ref={homeRef}
      className="home"
      data-fase={fase}
      style={variablesCss}
    >
      <div className="escena">
        <section className="hero">
          <img src={rutaHero} alt="" className="hero-ruta" draggable="false" />
          <div className="hero-texto">
            <span className="hero-kicker" aria-hidden="true" />
            <h2 className="hero-titulo">
              Viajar
              <br />
              nos mueve
            </h2>
            <p className="hero-sub">
              Consulta horarios, tarifas y puntos de recarga de manera rápida y sencilla.
            </p>
          </div>
          <img
            ref={busRef}
            src={busHero}
            width="1002"
            height="593"
            alt=""
            className="hero-img"
            draggable="false"
          />
        </section>

        <EstadoServicio estado={estado} onClick={siguienteEstado} />

        <nav className="acciones" aria-label="Accesos principales">
          {acciones.map(({ icono: Icono, texto, ruta, color }, i) => (
            <button
              key={texto}
              type="button"
              className={`accion accion--${color} ${!ruta ? 'accion--pronto' : ''}`}
              style={{ '--i': i }}
              aria-disabled={!ruta}
              onClick={() => ir(ruta)}
            >
              <Icono size={30} strokeWidth={2} />
              <span className="accion-texto">{texto}</span>
              {ruta ? <ChevronRight size={26} /> : <span className="chip-pronto">Pronto</span>}
            </button>
          ))}

          <button
            type="button"
            className="accion accion--claro"
            style={{ '--i': acciones.length }}
            aria-haspopup="dialog"
            onClick={() => setRedesAbiertas(true)}
          >
            <Megaphone size={26} />
            <span className="accion-texto">Novedades</span>
            <ChevronRight size={22} />
          </button>
        </nav>
      </div>

      <p className="pie">
        Empresa Florida S.R.L. · Desde 1954, junto a vos.
      </p>

      <RedesModal abierto={redesAbiertas} onCerrar={() => setRedesAbiertas(false)} />
    </main>
  )
}

export default MainPage
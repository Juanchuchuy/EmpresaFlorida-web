import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Clock,
  BadgeDollarSign,
  MapPin,
  Ticket,
  Megaphone,
  ChevronRight,
} from 'lucide-react'
import busHero from '../assets/img/bus-hero.webp'
import rutaHero from '../assets/img/road-hero.webp'
import EstadoServicio from '../components/EstadoServicio'
import { useAlturaHeader } from '../hooks/useAlturaHeader'
import { useIntroBus } from '../hooks/useIntroBus'
import './MainPage.css'

const acciones = [
  { icono: Clock, texto: 'Horarios', ruta: '/horarios', color: 'rojo' },
  { icono: BadgeDollarSign, texto: 'Tarifas', ruta: null, color: 'azul' },
  { icono: MapPin, texto: 'Punto de recarga', ruta: '/puntos-recarga', color: 'rojo' },
  { icono: Ticket, texto: 'Abonos', ruta: null, color: 'azul' },
]

// Estado del servicio de los móviles: 'normal' | 'reducido' | 'suspendido'.
// Por ahora es fijo; después se alimentará con datos reales.
const ESTADO_SERVICIO = 'normal'

const MainPage = () => {
  const navigate = useNavigate()
  const homeRef = useRef(null)

  // La home ocupa exactamente lo que queda de pantalla debajo del header.
  useAlturaHeader(homeRef)

  // Intro animada del colectivo (ver hooks/useIntroBus.js).
  const { fase, busRef, variablesCss } = useIntroBus()

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

        <EstadoServicio estado={ESTADO_SERVICIO} />

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
            aria-disabled="true"
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
    </main>
  )
}

export default MainPage
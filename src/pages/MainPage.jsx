import { useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Clock,
  BadgeDollarSign,
  MapPin,
  Ticket,
  Megaphone,
  ChevronRight,
} from 'lucide-react'
import busHero from '../assets/img/bus-hero.png'
import './MainPage.css'

// ── Intro (milisegundos) ────────────────────────────────────────────────
const ENTRADA_MS = 1000 // el colectivo aparece "desde el fondo" hasta el centro
const PAUSA_MS = 200 // se queda quieto en el centro de la pantalla
const RETROCESO_MS = 1800 // pasa al fondo (se achica y se vuelve translúcido)

// Cuánto más grande es el colectivo en la intro respecto de su tamaño final
// (>1 = "retrocede" al achicarse) y qué tan opaco queda ya de fondo.
const ZOOM_INTRO = 1
const BUS_OPACIDAD = 0.1

// Desplazamiento final hacia la derecha cuando el colectivo ya quedó de fondo.
const DESPLAZE_DERECHA = '290px'

// La intro se ve una sola vez por sesión: si el usuario vuelve a "/" desde
// Horarios o Puntos de recarga, la home aparece directo, sin repetir todo.
let introYaVista = false

const acciones = [
  { icono: Clock, texto: 'Horarios', ruta: '/horarios', color: 'rojo' },
  { icono: BadgeDollarSign, texto: 'Tarifas', ruta: null, color: 'azul' },
  { icono: MapPin, texto: 'Punto de recarga', ruta: '/puntos-recarga', color: 'rojo' },
  { icono: Ticket, texto: 'Abonos', ruta: null, color: 'azul' },
]

const prefiereSinMovimiento = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const MainPage = () => {
  const navigate = useNavigate()
  const homeRef = useRef(null)
  const busRef = useRef(null)

  // 'intro' = solo el colectivo en el centro · 'listo' = home completa (aún sin desplazar)
  // 'fondo' = el colectivo ya se corrió a la derecha
  const [fase, setFase] = useState(() =>
    introYaVista || prefiereSinMovimiento() ? 'fondo' : 'intro',
  )

  // La home ocupa exactamente lo que queda de pantalla debajo del header
  // (así el pie queda abajo del todo y la página no genera scroll).
  useLayoutEffect(() => {
    const home = homeRef.current
    if (!home) return undefined
    const medir = () => {
      const header = document.querySelector('.app-header')
      home.style.setProperty('--header-h', `${header ? header.offsetHeight : 76}px`)
    }
    medir()
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [])

  // Animación del colectivo (solo se mueve transform/opacity: es barato).
  // Corre UNA sola vez al montar. Importante: no puede depender de `fase`,
  // porque al pasar a 'listo' React limpiaría el efecto y cancelaría la
  // animación de retroceso en el acto (el colectivo "saltaba" al final).
  const hacerIntro = useRef(fase === 'intro')
  useLayoutEffect(() => {
    const bus = busRef.current
    if (!hacerIntro.current || !bus) return undefined

    let cancelado = false
    let pausa
    const animaciones = []

    const empezar = () => {
      if (cancelado) return

      // Lugar final del colectivo → cuánto moverlo/agrandarlo para dejarlo
      // en el centro de la pantalla (técnica FLIP).
      const r = bus.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      const aspecto = r.width / r.height
      const anchoCentro = Math.max(
        r.width,
        Math.min(r.width * ZOOM_INTRO, vw * 0.92, vh * 0.75 * aspecto),
      )
      const escala = anchoCentro / r.width
      const dx = vw / 2 - (r.left + r.width / 2)
      const dy = vh / 2 - (r.top + r.height / 2)
      const centro = `translate(${dx}px, ${dy}px)`

      // 1) Aparece desde el fondo: chico, borroso y transparente → centro.
      const entrada = bus.animate(
        [
          { transform: `${centro} scale(${escala * 0.4})`, opacity: 0, filter: 'blur(12px)' },
          { transform: `${centro} scale(${escala})`, opacity: 1, filter: 'blur(0px)' },
        ],
        { duration: ENTRADA_MS, easing: 'cubic-bezier(.16, .84, .3, 1)', fill: 'forwards' },
      )
      animaciones.push(entrada)

      entrada.finished
        .then(() => {
          // 2) Pausa con el colectivo en el centro.
          pausa = setTimeout(() => {
            if (cancelado) return
            setFase('listo') // entran el título y la card de botones (CSS)

            // 3) Pasa al fondo: se achica y se vuelve translúcido, todo en
            //    un solo movimiento continuo que arranca de inmediato y
            //    frena suave (sin tramo "congelado" al principio).
            const atras = bus.animate(
              [
                { transform: `${centro} scale(${escala})`, opacity: 1 },
                { transform: 'translate(0, 0) scale(1)', opacity: BUS_OPACIDAD },
              ],
              { duration: RETROCESO_MS, easing: 'cubic-bezier(.22, .61, .36, 1)', fill: 'forwards' },
            )
            animaciones.push(atras)
            atras.finished
              .then(() => {
                introYaVista = true
                animaciones.forEach((a) => a.cancel()) // queda el estilo del CSS
                setFase('fondo') // 4) dispara el desplazamiento hacia la derecha (CSS)
              })
              .catch(() => {})
          }, PAUSA_MS)
        })
        .catch(() => {})
    }

    // Esperamos a que la imagen esté decodificada para medirla bien.
    bus.decode().then(empezar, empezar)

    // Seguro: pase lo que pase, los botones aparecen.
    const seguro = setTimeout(
      () => setFase('fondo'),
      ENTRADA_MS + PAUSA_MS + RETROCESO_MS + 2500,
    )

    return () => {
      cancelado = true
      clearTimeout(pausa)
      clearTimeout(seguro)
      animaciones.forEach((a) => a.cancel())
    }
  }, [])

  const ir = (ruta) => {
    if (ruta) navigate(ruta)
  }

  return (
    <main
      ref={homeRef}
      className="home"
      data-fase={fase}
      style={{
        '--bus-opacidad': BUS_OPACIDAD,
        '--desplaze-derecha': DESPLAZE_DERECHA,
      }}
    >
      <div className="escena">
        <section className="hero">
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
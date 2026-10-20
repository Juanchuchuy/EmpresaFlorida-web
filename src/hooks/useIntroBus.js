import { useLayoutEffect, useRef, useState } from 'react'

// ── Intro (milisegundos) ────────────────────────────────────────────────
const ENTRADA_MS = 1000 // el colectivo aparece "desde el fondo" hasta el centro
const PAUSA_MS = 100 // se queda quieto en el centro de la pantalla
const RETROCESO_MS = 1200 // pasa al fondo (se achica y se vuelve translúcido)

// Cuánto más grande es el colectivo en la intro respecto de su tamaño final
// (>1 = "retrocede" al achicarse) y qué tan opaco queda ya de fondo.
const ZOOM_INTRO = 1.2
const BUS_OPACIDAD = 0.6

// Desplazamiento final hacia la derecha (solo desktop), ya con el colectivo
// de fondo. Se aplica con transition en CSS al pasar a la fase 'fondo'.
const DESPLAZE_DERECHA = '290px'

// ── Celular (< 700px): el colectivo se aleja por la izquierda y vuelve a
//    entrar por la izquierda del texto, hasta quedar sobre la ruta ─────────
const ZOOM_INTRO_MOVIL = 1.7
const ALEJAR_MS = 1000 // sale de la pantalla hacia la izquierda, achicándose
const ENTRAR_MS = 1800 // entra desde la izquierda y se desplaza hacia la derecha
const ESCALA_ALEJADO = 0.5

// Variables CSS que la hoja de estilos de la home necesita conocer.
const VARIABLES_CSS = {
  '--bus-opacidad': BUS_OPACIDAD,
  '--desplaze-derecha': DESPLAZE_DERECHA,
}

const prefiereSinMovimiento = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const esMovil = () => window.matchMedia('(max-width: 699px)').matches

/**
 * Orquesta la intro animada de la home: el colectivo aparece en el centro y
 * después "retrocede" a su lugar de fondo.
 *
 * Devuelve:
 *  - fase:        'intro' | 'listo' | 'fondo' (el CSS reacciona vía data-fase)
 *  - busRef:      ref que hay que poner en la <img> del colectivo
 *  - variablesCss: objeto para el `style` del contenedor de la home
 */
export function useIntroBus() {
  const busRef = useRef(null)

  // 'intro' = solo el colectivo en el centro
  // 'listo' = home completa (aún sin desplazar en desktop)
  // 'fondo' = el colectivo ya se corrió a la derecha (solo desktop)
  const [fase, setFase] = useState(() =>
    prefiereSinMovimiento() ? 'fondo' : 'intro',
  )

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
      const movil = esMovil()
      const opacidadFinal = movil ? 1 : BUS_OPACIDAD
      const r = bus.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      const aspecto = r.width / r.height
      const zoom = movil ? ZOOM_INTRO_MOVIL : ZOOM_INTRO
      const anchoCentro = Math.max(
        r.width,
        Math.min(r.width * zoom, vw * 0.92, vh * 0.75 * aspecto),
      )
      const escala = anchoCentro / r.width
      const dx = vw / 2 - (r.left + r.width / 2)
      const dy = vh / 2 - (r.top + r.height / 2)
      const centro = `translate(${dx}px, ${dy}px)`

      const animar = (frames, opciones) => {
        const a = bus.animate(frames, { fill: 'forwards', ...opciones })
        animaciones.push(a)
        return a
      }

      // Limpia las animaciones y deja que el CSS tome el control (fase).
      const asentar = () => {
        animaciones.forEach((x) => x.cancel())
      }

      // 1) Aparece desde el fondo: chico, borroso y transparente → centro.
      const entrada = animar(
        [
          { transform: `${centro} scale(${escala * 0.4})`, opacity: 0, filter: 'blur(12px)' },
          { transform: `${centro} scale(${escala})`, opacity: 1, filter: 'blur(0px)' },
        ],
        { duration: ENTRADA_MS, easing: 'cubic-bezier(.16, .84, .3, 1)' },
      )

      entrada.finished
        .then(() => {
          // 2) Pausa con el colectivo en el centro.
          pausa = setTimeout(() => {
            if (cancelado) return
            setFase('listo') // entran el título, la ruta y la card (CSS)

            if (!movil) {
              // 3) Desktop/tablet: retroceso (se achica y queda translúcido).
              const atras = animar(
                [
                  { transform: `${centro} scale(${escala})`, opacity: 1 },
                  { transform: 'translate(0, 0) scale(1)', opacity: opacidadFinal },
                ],
                { duration: RETROCESO_MS, easing: 'cubic-bezier(.22, .61, .36, 1)' },
              )
              atras.finished
                .then(() => {
                  asentar()
                  setFase('fondo') // 4) dispara el desplazamiento (CSS transition)
                })
                .catch(() => {})
              return
            }

            // 3) Celular: se aleja hacia la izquierda (achicándose) hasta
            //    salir de la pantalla...
            const xFinal = r.left + r.width / 2 // centro X en su lugar final
            const txAfuera = -(r.width * ESCALA_ALEJADO) / 2 - 24 - xFinal
            const txEntra = -r.width / 2 - 24 - xFinal
            const alejar = animar(
              [
                { transform: `${centro} scale(${escala})` },
                { transform: `translate(${txAfuera}px, 0px) scale(${ESCALA_ALEJADO})` },
              ],
              { duration: ALEJAR_MS, easing: 'cubic-bezier(.4, 0, .6, 1)' },
            )
            alejar.finished
              .then(() => {
                if (cancelado) return
                // 4) ...y vuelve a entrar por la izquierda del texto,
                //    desplazándose hacia la derecha hasta la ruta.
                const entrar = animar(
                  [
                    { transform: `translate(${txEntra}px, 0px) scale(1)` },
                    { transform: 'translate(0px, 0px) scale(1)' },
                  ],
                  { duration: ENTRAR_MS, easing: 'cubic-bezier(.22, .61, .36, 1)' },
                )
                entrar.finished
                  .then(() => {
                    asentar()
                    setFase('fondo') // en mobile el CSS anula el translateX
                  })
                  .catch(() => {})
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
      ENTRADA_MS + PAUSA_MS + RETROCESO_MS + ALEJAR_MS + ENTRAR_MS + 2500,
    )

    return () => {
      cancelado = true
      clearTimeout(pausa)
      clearTimeout(seguro)
      animaciones.forEach((a) => a.cancel())
    }
  }, [])

  return { fase, busRef, variablesCss: VARIABLES_CSS }
}
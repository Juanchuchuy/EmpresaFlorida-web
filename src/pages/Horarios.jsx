import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { lineas } from '../data/lineas'
import { paradasPorLinea } from '../data/paradas'
import { aOrdenDelDia, acortarRecorrido, getProximoHorario } from '../utils/horarios'
import ParadasCarousel from '../components/ParadasCarousel'
import CardSection from '../components/CardSection'

import './Horarios.css'

// Icons
import { ArrowLeft, ArrowLeftRight, SlidersHorizontal, ArrowBigDownDash } from 'lucide-react'

// Duraciones de cada tramo de la animación (en ms). La elegida ya "nace"
// arriba en su lugar final (ver CardSection.jsx), así que acá solo hay
// que esperar a que las demás terminen de desvanecerse (coincide con la
// transición de .card--saliendo en CardSection.css) antes de sacarlas
// del DOM, y una pequeña pausa extra antes de mostrar el resto del
// contenido de la línea.
const DURACION_FADE_SALIDA = 380
const DURACION_ASENTAMIENTO = 200
const DURACION_SALIDA_DETALLE = 250

const Horarios = () => {
  // Si entramos por un link directo (/horarios/:lineaId), useParams ya nos
  // da la línea: arrancamos con ella seleccionada y sin animación.
  const { lineaId: lineaIdUrl } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sentidoInicial = searchParams.get('sentido') === 'vuelta' ? 'vuelta' : 'ida'

  const [seleccionadaId, setSeleccionadaId] = useState(lineaIdUrl ?? null)
  const [sentido, setSentido] = useState(sentidoInicial)
  // colapsar=true significa "ya sacamos del DOM a las demás cards y la
  // elegida quedó sola arriba". Si venimos de un link directo arrancamos
  // ya colapsados (sin animación de por medio).
  const [colapsar, setColapsar] = useState(Boolean(lineaIdUrl))
  // Recién cuando esto es true se renderiza el resto de la página
  // (próximo servicio, recorrido, tabla). Si es un link directo, arranca
  // visible de una.
  const [mostrarDetalle, setMostrarDetalle] = useState(Boolean(lineaIdUrl))

  // Mismo patrón que en CardSection: fuerza un re-render cada 30s para que
  // "próximo servicio" y las filas ya pasadas se actualicen solas.
  const [ahora, setAhora] = useState(new Date())
  useEffect(() => {
    const intervalo = setInterval(() => setAhora(new Date()), 30000)
    return () => clearInterval(intervalo)
  }, [])

  // Se dispara al clickear "Ver horarios completos" (o la imagen) en una
  // card de la grilla. Solo toca estado local: la URL se sincroniza recién
  // al final, una vez que la vista de detalle ya está mostrada, para que
  // el cambio de parámetro nunca pueda interferir con la animación.
  const handleVerHorarios = (id, sentidoElegido) => {
    setSentido(sentidoElegido)
    setSeleccionadaId(id)
  }

  // Paso 1 -> 2: una vez que las demás cards tuvieron tiempo de
  // desvanecerse (ver .card--saliendo en CardSection.css), las sacamos
  // del DOM. Como la elegida ya estaba arriba desde el click, esto no le
  // mueve ni un pixel: no hay una segunda animación de por medio.
  useEffect(() => {
    if (!seleccionadaId || colapsar) return
    const salida = setTimeout(() => setColapsar(true), DURACION_FADE_SALIDA)
    return () => clearTimeout(salida)
  }, [seleccionadaId, colapsar])

  // Paso 2 -> 3: recién ahí aparece el resto del contenido de la línea.
  useEffect(() => {
    if (!seleccionadaId || !colapsar || mostrarDetalle) return
    const detalle = setTimeout(() => setMostrarDetalle(true), DURACION_ASENTAMIENTO)
    return () => clearTimeout(detalle)
  }, [seleccionadaId, colapsar, mostrarDetalle])

  // Mantiene la URL sincronizada (para que el link sea compartible), pero
  // recién una vez que la vista de detalle ya terminó de aparecer.
  useEffect(() => {
    if (!seleccionadaId || !mostrarDetalle) return
    navigate(`/horarios/${seleccionadaId}?sentido=${sentido}`, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seleccionadaId, sentido, mostrarDetalle])

  // Vuelve a la grilla de líneas (sin salir de /horarios).
  const volverALaGrilla = () => {
    setMostrarDetalle(false)
    setTimeout(() => {
      setColapsar(false)
      setSeleccionadaId(null)
      navigate('/horarios')
    }, DURACION_SALIDA_DETALLE)
  }

  const linea = lineas.find((l) => l.id === seleccionadaId)

  const datos = linea ? (sentido === 'ida' ? linea.ida : linea.vuelta) : null
  const proximo = linea ? getProximoHorario(datos, ahora) : null
  const listaHorarios = datos?.horarios ?? []
  const puedeCambiarSentido = Boolean(linea?.ida && linea?.vuelta)
  const ordenAhora = aOrdenDelDia(`${ahora.getHours()}:${ahora.getMinutes()}`)
  // El campo "sentido" viene como "Florida x Posse → Terminal": el destino
  // real de este viaje es lo que queda después de la flecha.
  const destino = datos?.sentido?.split('→')[1]?.trim() ?? linea?.nombre

  const paradasCuradas = linea ? paradasPorLinea[linea.id] : null
  const paradas = paradasCuradas
    ? paradasCuradas
    : proximo
      ? proximo.recorrido.split('/').map((p) => ({ nombre: p.trim() }))
      : []

  // Recorremos la lista una sola vez llevando la cuenta de cuántas filas
  // "futuras" ya vimos, para ir apagando la opacidad a medida que nos
  // alejamos del próximo servicio.
  let indiceFuturo = -1

  const huboSeleccionInvalida = Boolean(seleccionadaId) && colapsar && !linea

  return (
    <section className="horarios-page">
      <CardSection
        seleccionadaId={seleccionadaId}
        colapsar={colapsar}
        sentidoSeleccionada={sentido}
        onVerHorarios={handleVerHorarios}
      />

      {huboSeleccionInvalida && (
        <>
          <p className="horarios-sin-datos">No encontramos esa línea.</p>
          <button type="button" className="horarios-volver" onClick={volverALaGrilla}>
            <ArrowLeft size={16} /> Volver a las líneas
          </button>
        </>
      )}

      {linea && mostrarDetalle && (
        <div className={`horarios-detalle ${mostrarDetalle ? 'horarios-detalle--visible' : ''}`}>
         

          {proximo && (
            <div className="horarios-proximo-destacado-wrap">
              {!proximo.esDeManiana && (
                <button
                  type="button"
                  className="horarios-ir-al-proximo"
                  onClick={() => document.querySelector('.horarios-fila--proxima')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                >
                  <strong>Ir al proximo</strong><ArrowBigDownDash size={60} />
                </button>
              )}
            </div>
          )}

          <ParadasCarousel
            paradas={paradas}
            titulo={paradasCuradas ? 'Recorrido completo' : 'Recorrido del próximo servicio'}
          />

          <div className="horarios-tabla">
            <div className="horarios-tabla-header">
              <div>
                <p className="horarios-tabla-titulo">Próximas Salidas</p>
                <p className="horarios-tabla-subtitulo">
                  Estado según el horario cargado, no es ubicación en vivo
                </p>
              </div>
              <div className="horarios-tabla-acciones">
                <button type="button" className="horarios-pill" onClick={volverALaGrilla}>
                  <SlidersHorizontal size={14} /> Elegir otra Línea
                </button>
                <button
                  type="button"
                  className="horarios-pill"
                  disabled={!puedeCambiarSentido}
                  onClick={() => setSentido((s) => (s === 'ida' ? 'vuelta' : 'ida'))}
                >
                  <ArrowLeftRight size={14} /> Cambiar Orientación
                </button>
              </div>
            </div>

            {listaHorarios.length === 0 ? (
              <p className="horarios-sin-datos">
                Todavía no tenemos el cronograma cargado para este sentido.
              </p>
            ) : (
              <>
                <div className="horarios-columnas">
                  <span className="col-recorrido">Recorrido</span>
                  <span className="col-destino">Destino</span>
                  <span className="col-hora">Hora de Salida</span>
                  <span className="col-estado">Estado</span>
                </div>

                {listaHorarios.map((item, idx) => {
                  const yaPaso = aOrdenDelDia(item.hora) < ordenAhora
                  let opacidad = 1
                  let estado = 'programado'
                  let etiquetaEstado = 'Programado'

                  if (yaPaso) {
                    opacidad = 0.4
                    estado = 'paso'
                    etiquetaEstado = 'Ya salió'
                  } else {
                    indiceFuturo += 1
                    const esProxima = indiceFuturo === 0 && !proximo?.esDeManiana
                    if (esProxima) {
                      estado = 'proximo'
                      etiquetaEstado = 'Próximo'
                    } else if (indiceFuturo <= 1) {
                      opacidad = 1
                    } else if (indiceFuturo === 2) {
                      opacidad = 0.7
                    } else if (indiceFuturo === 3) {
                      opacidad = 0.5
                    } else {
                      opacidad = 0.35
                    }
                  }

                  return (
                    <div
                      key={`${item.hora}-${idx}`}
                      className={`horarios-fila ${estado === 'proximo' ? 'horarios-fila--proxima' : ''}`}
                      style={{ opacity: opacidad }}
                    >
                      <div className="col-recorrido" data-label="Recorrido">
                        <span className="fila-barra" />
                        <span title={item.recorrido}>{acortarRecorrido(item.recorrido)}</span>
                      </div>
                      <span className="col-destino" data-label="Destino">{destino}</span>
                      <span className="col-hora" data-label="Hora de Salida">{item.hora}</span>
                      <div className="col-estado" data-label="Estado">
                        <span className={`estado-dot estado-dot--${estado}`} />
                        {etiquetaEstado}
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </div>

          <button type="button" className="horarios-volver" onClick={() => navigate('/')}>
            <ArrowLeft size={16} /> Volver al inicio
          </button>
        </div>
      )}
    </section>
  )
}

export default Horarios
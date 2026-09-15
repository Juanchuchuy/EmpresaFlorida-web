import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { lineas } from '../data/lineas'
import { paradasPorLinea } from '../data/paradas'
import { aOrdenDelDia, acortarRecorrido, getProximoHorario } from '../utils/horarios'
import ParadasCarousel from '../components/ParadasCarousel'

import './Horarios.css'

// Icons
import { ArrowLeft, ArrowLeftRight, SlidersHorizontal, ArrowRightFromLine } from 'lucide-react'

const Horarios = () => {
  // useParams lee los "segmentos dinámicos" definidos en la Route,
  // en este caso ":lineaId" -> App.jsx define <Route path="/horarios/:lineaId" .../>
  const { lineaId } = useParams()
  const navigate = useNavigate()

  const [sentido, setSentido] = useState('ida')

  // Mismo patrón que en CardSection: fuerza un re-render cada 30s para
  // que "próximo servicio" y las filas ya pasadas se actualicen solas.
  const [ahora, setAhora] = useState(new Date())
  useEffect(() => {
    const intervalo = setInterval(() => setAhora(new Date()), 30000)
    return () => clearInterval(intervalo)
  }, [])

  const linea = lineas.find((l) => l.id === lineaId)

  if (!linea) {
    return (
      <section className="horarios-page">
        <p className="horarios-sin-datos">No encontramos esa línea.</p>
        <button type="button" className="horarios-volver" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Volver al inicio
        </button>
      </section>
    )
  }

  const datos = sentido === 'ida' ? linea.ida : linea.vuelta
  const proximo = getProximoHorario(datos, ahora)
  const listaHorarios = datos?.horarios ?? []
  const puedeCambiarSentido = Boolean(linea.ida && linea.vuelta)
  const ordenAhora = aOrdenDelDia(`${ahora.getHours()}:${ahora.getMinutes()}`)
  // El campo "sentido" viene como "Florida x Posse → Terminal": el destino
  // real de este viaje es lo que queda después de la flecha.
  const destino = datos?.sentido?.split('→')[1]?.trim() ?? linea.nombre

  const paradasCuradas = paradasPorLinea[lineaId]
  const paradas = paradasCuradas
    ? paradasCuradas
    : proximo
      ? proximo.recorrido.split('/').map((p) => ({ nombre: p.trim() }))
      : []

  // Recorremos la lista una sola vez llevando la cuenta de cuántas filas
  // "futuras" ya vimos, para poder ir apagando la opacidad a medida que
  // nos alejamos del próximo servicio (igual que en el diseño de Figma,
  // pero acá el criterio es real: cuánto falta según el reloj, no un
  // estado de GPS inventado).
  let indiceFuturo = -1

  return (
    <section className="horarios-page">
      <div className="horarios-hero">
        <h1 className="horarios-titulo">{linea.nombre}</h1>
        {datos && (
          <>
            <p className="horarios-kicker">
              {datos.sentido[0] === 'T' ? 'Desde Terminal' : 'Hacia Terminal'}
            </p>
            <p className="horarios-subtitulo">
              {datos.sentido} · Actualizado {datos.actualizado}
            </p>
          </>
        )}
      </div>

      {proximo && (
        <div className="horarios-proximo-destacado">
          <span className="proximo-destacado-label">Próximo servicio</span>
          <strong className="proximo-destacado-hora">
            {proximo.hora}
            {proximo.esDeManiana ? ' · mañana' : ''}
          </strong>
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
            <button type="button" className="horarios-pill" onClick={() => navigate('/')}>
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
    </section>
  )
}

export default Horarios
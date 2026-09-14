import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { lineas } from '../data/lineas'
import { paradasPorLinea } from '../data/paradas'
import { aOrdenDelDia, acortarRecorrido, getProximoHorario } from '../utils/horarios'
import ParadasCarousel from '../components/ParadasCarousel'
import './Horarios.css'

// Icons
import { ArrowLeft, ArrowLeftRight, Clock } from 'lucide-react'

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

  // Si ya tenemos las paradas reales de esta línea (con fotos), las
  // usamos siempre que se muestre la página, sin importar el sentido.
  // Si no, armamos una lista mínima a partir del recorrido corto del
  // próximo horario, como veníamos haciendo antes.
  const paradasCuradas = paradasPorLinea[lineaId]
  const paradas = paradasCuradas
    ? paradasCuradas
    : proximo
      ? proximo.recorrido.split('/').map((p) => ({ nombre: p.trim() }))
      : []

  // Marca como "próxima" la primera fila que todavía no pasó (y solo si
  // el próximo servicio es hoy; si ya es de mañana, ninguna fila de la
  // lista de hoy debería quedar resaltada).
  let yaMarcoProxima = false

  return (
    <section className="horarios-page">
      <div className="horarios-hero">
        <h1 className="horarios-titulo">{linea.nombre}</h1>
        <p className="horarios-kicker">{datos.sentido[0] === 'T' ? 'Desde Terminal' : 'Hacia Terminal'}</p>
        {datos && (
          <p className="horarios-subtitulo">
            {datos.sentido} · Actualizado {datos.actualizado}
          </p>
        )}
      </div>

      <div className="horarios-toggle-row">
        <button
          type="button"
          className="horarios-toggle"
          disabled={!puedeCambiarSentido}
          onClick={() => setSentido((s) => (s === 'ida' ? 'vuelta' : 'ida'))}
        >
          <ArrowLeftRight size={16} />
          {sentido === 'ida' ? 'Ver vuelta (desde Terminal)' : 'Ver ida (hacia Terminal)'}
        </button>

        {proximo && (
          <div className="horarios-proximo">
            <span className="horarios-proximo-label">Próximo servicio</span>
            <strong className="horarios-proximo-hora">
              <Clock size={16} />
              {proximo.hora} {proximo.esDeManiana ? '(mañana)' : ''}
            </strong>
          </div>
        )}
      </div>

      <ParadasCarousel
        paradas={paradas}
        titulo={paradasCuradas ? 'Recorrido completo' : 'Recorrido del próximo servicio'}
      />

      {listaHorarios.length === 0 ? (
        <p className="horarios-sin-datos">
          Todavía no tenemos el cronograma cargado para este sentido.
        </p>
      ) : (
        <div className="horarios-tabla">
          <div className="horarios-tabla-header">
            <span>Hora</span>
            <span>Recorrido</span>
          </div>
          {listaHorarios.map((item, idx) => {
            const yaPaso = aOrdenDelDia(item.hora) < ordenAhora
            const esProxima = !yaPaso && !proximo?.esDeManiana && !yaMarcoProxima
            if (esProxima) yaMarcoProxima = true

            return (
              <div
                key={`${item.hora}-${idx}`}
                className={[
                  'horarios-fila',
                  yaPaso && 'horarios-fila--pasada',
                  esProxima && 'horarios-fila--proxima',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="horarios-fila-hora">{item.hora}</span>
                <span className="horarios-fila-recorrido" title={item.recorrido}>
                  {acortarRecorrido(item.recorrido)}
                </span>
              </div>
            )
          })}
        </div>
      )}

      <button type="button" className="horarios-volver" onClick={() => navigate('/')}>
        <ArrowLeft size={16} /> Volver al inicio
      </button>
    </section>
  )
}

export default Horarios
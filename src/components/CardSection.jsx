import { useEffect, useState } from 'react'
import { lineas } from '../data/lineas'
import { getProximoHorario, getProximosHorarios, formatCountdown } from '../utils/horarios'
import { acortarRecorrido } from '../utils/texto'
import './CardSection.css'

//Icons
import { ArrowUpDown, Clock, LineDotTopVertical,LineDotBottomVertical} from 'lucide-react'



//
// - seleccionadaId: id de la línea elegida (o null si estamos en la grilla)
// - colapsar: una vez que termina la animación de salida de las demás
//   cards, el padre pide colapsar=true para sacarlas del DOM y que quede
//   sola la seleccionada.
// - sentidoSeleccionada: sentido ('ida' | 'vuelta') que gobierna la card
//   seleccionada una vez que pasa a la vista de detalle, para que quede
//   sincronizada con el pill "Cambiar Orientación" de la tabla de horarios.
const CardSection = ({
  seleccionadaId = null,
  colapsar = false,
  sentidoSeleccionada,
  onVerHorarios,
  onCambiarSentido,
}) => {
  // Guarda, por línea, qué sentido está mostrando la card mientras se
  // navega la grilla: 'ida' (hacia Tuc) o 'vuelta' (desde Tuc).
  const [sentidos, setSentidos] = useState({})

  // "ahora" solo se recalcula cuando React vuelve a renderizar el
  // componente. Sin este estado, el próximo horario quedaría "congelado"
  // en el momento en que se cargó la página. Este timer fuerza un
  // re-render cada 30 segundos para que se vaya actualizando solo.
  const [ahora, setAhora] = useState(new Date())

  useEffect(() => {
    const intervalo = setInterval(() => setAhora(new Date()), 30000)
    return () => clearInterval(intervalo)
  }, [])

  const toggleSentido = (lineaId) => {
    setSentidos((prev) => ({
      ...prev,
      [lineaId]: prev[lineaId] === 'vuelta' ? 'ida' : 'vuelta',
    }))
  }

  const handleVerHorarios = (lineaId) => {
    const sentido = sentidos[lineaId] ?? 'ida'
    onVerHorarios?.(lineaId, sentido)
  }

  // Apenas hay una línea elegida, la ponemos PRIMERA en el array: así la
  // sección (que en ese mismo instante ya pasa a layout de una columna,
  // ver "card-section--hero" más abajo) la muestra arriba de una, sin
  // tener que animarla viajando de un lugar a otro. Las demás quedan
  // apiladas debajo, desvaneciéndose (.card--saliendo); recién cuando
  // terminan de desaparecer el padre pide colapsar=true y las saca del
  // DOM, sin que la elegida se mueva.
  const seleccionada = lineas.find((l) => l.id === seleccionadaId)
  const resto = lineas.filter((l) => l.id !== seleccionadaId)
  const lineasAMostrar = !seleccionadaId
    ? lineas
    : colapsar
      ? [seleccionada]
      : [seleccionada, ...resto]

  return (
    <section
      className={`card-section ${seleccionadaId ? 'card-section--hero' : ''}`}
      id="lineas"
    >
      {lineasAMostrar.map((linea) => {
        const esSeleccionada = linea.id === seleccionadaId
        const sentido = esSeleccionada && sentidoSeleccionada
          ? sentidoSeleccionada
          : sentidos[linea.id] ?? 'ida'
        const datos = sentido === 'ida' ? linea.ida : linea.vuelta
        const proximo = getProximoHorario(datos, ahora)
        // Los dos horarios que le siguen al próximo, para el "Después:".
        const despues = getProximosHorarios(datos, ahora, 3).slice(1).map((h) => h.hora)
        const countdown = proximo ? formatCountdown(proximo.hora, ahora, proximo.esDeManiana) : null
        const esInminente = countdown === 'Saliendo' || /^en [0-5] min$/.test(countdown ?? '')

        return (
          <article
            className={`card ${esSeleccionada ? 'card--seleccionada' : ''} ${seleccionadaId && !esSeleccionada ? 'card--saliendo' : ''}`}
            key={linea.id}
          >
            <img
              src={linea.imagen}
              alt={`Cartel de la línea ${linea.nombre}`}
              className="card-image"
              onClick={!esSeleccionada ? () => handleVerHorarios(linea.id) : undefined}
            />
            

            <div className="card-info" key={sentido}>
              {proximo ? (
                <>
                  <br/>
                  <span className="card-hora">
                    {proximo.esDeManiana ? (
                      <h3 className='card-movil'>MAÑANA</h3>
                    ) : (
                      <h3 className='card-movil'>PRÓXIMO SERVICIO</h3>
                    )}
                    <div className="card-hora-fila">
                      <strong><Clock color='red' />{proximo.hora}</strong>
                      {countdown && (
                        <span className={`card-countdown${esInminente ? ' card-countdown--inminente' : ''}`}>
                          {countdown}
                        </span>
                      )}
                    </div>
                    {despues.length > 0 && (
                      <p className="card-despues">
                        Después: <strong>{despues.join(' · ')}</strong>
                      </p>
                    )}
                  </span>
                    <hr />
                  <div className="card-recorrido" title={proximo.recorrido}>
                          <span className='icons-recorrido'>
                            <LineDotTopVertical size={40} color='#930101' />
                            <LineDotBottomVertical size={50} color='blue' />
                          </span>
                          <span className='recorrido-box'>
                              {acortarRecorrido(proximo.recorrido)}
                            </span>
                      <div className="card-toggle-slot">
                      <button
                          type="button"
                          className="card-toggle"
                          onClick={() => esSeleccionada ? onCambiarSentido?.() : toggleSentido(linea.id)}
                        >
                          <ArrowUpDown size={40}/>
                        </button>
                    </div>
                  </div>
                  
                </>
              ) : (
                <p className="card-sin-datos">Horario no disponible todavía</p>
              )
              }
              
           
            </div>
              {!esSeleccionada && (
              <button
                type="button"
                className="card-button"
                onClick={() => handleVerHorarios(linea.id)}
              >
                VER HORARIOS
              </button>
            )}
          </article>
        )
      })}
    </section>
  )
}

export default CardSection
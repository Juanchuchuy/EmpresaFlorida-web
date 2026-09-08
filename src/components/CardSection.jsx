import { useEffect, useState } from 'react'
import { lineas } from '../data/lineas'
import { getProximoHorario } from '../utils/horarios'
import { acortarRecorrido } from '../utils/texto'
import './CardSection.css'

const CardSection = () => {
  // Guarda, por línea, qué sentido está mostrando la card: 'ida' (hacia Tuc)
  // o 'vuelta' (desde Tuc). Arranca en 'ida' porque es el caso más común:
  // alguien en su barrio que quiere saber cuándo sale el próximo hacia capital.
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
    // TODO: redireccionar a la vista de horarios completos de la línea
    console.log('Ver horarios completos de:', lineaId)
  }

  return (
    <section className="card-section">
      {lineas.map((linea) => {
        const sentido = sentidos[linea.id] ?? 'ida'
        const datos = sentido === 'ida' ? linea.ida : linea.vuelta
        const proximo = getProximoHorario(datos, ahora)
        const hayDatos = Boolean(linea.ida || linea.vuelta)

        return (
          <article className="card" key={linea.id}>
            <img
              src={linea.imagen}
              alt={`Cartel de la línea ${linea.nombre}`}
              className="card-image"
            />

            <div className="card-info">
              {proximo ? (
                <>
                  <p className="card-recorrido" title={proximo.recorrido}>
                    {acortarRecorrido(proximo.recorrido)}
                  </p>
                  <p className="card-hora">
                    {proximo.esDeManiana ? 'Mañana' : 'Próximo'}{' '}
                    <strong>{proximo.hora}</strong>
                  </p>
                </>
              ) : (
                <p className="card-sin-datos">Horario no disponible todavía</p>
              )}
            </div>

            <div className="card-toggle-slot">
              {hayDatos ? (
                <button
                  type="button"
                  className="card-toggle"
                  onClick={() => toggleSentido(linea.id)}
                >
                  <svg className="card-toggle-icon" viewBox="0 0 20 20" aria-hidden="true">
                    <path
                      d="M4 7h10.5M14.5 7 11 3.5M16 13H5.5M5.5 13 9 16.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Cambiar a: {sentido === 'ida' ? 'salida desde Tuc' : 'salida hacia Tuc'}
                </button>
              ) : (
                <span className="card-toggle card-toggle--disabled">
                  Sin sentido para cambiar
                </span>
              )}
            </div>

            <button
              type="button"
              className="card-button"
              onClick={() => handleVerHorarios(linea.id)}
            >
              Ver horarios completos
            </button>
          </article>
        )
      })}
    </section>
  )
}

export default CardSection
import { useEffect, useState } from 'react'
import { lineas } from '../data/lineas'
import { getProximoHorario } from '../utils/horarios'
import { acortarRecorrido } from '../utils/texto'
import './CardSection.css'


//Icons
import { ArrowLeftRight, ChevronRight,Clock } from 'lucide-react';


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
            <button
              type="button"
              className="card-button"
              onClick={() => handleVerHorarios(linea.id)}
            >
              Ver horarios completos
            </button>

            <div className="card-info">
              {proximo ? (
                <>
                  
                  <hr />
                  
                  <span className="card-hora">
                    {proximo.esDeManiana ? 'Mañana' : (
                      
                        <h3 className='card-movil'>PRÓXIMO SERVICIO</h3>
                       

                    )}
                    <strong><Clock color='red' />{proximo.hora} </strong>
                    
                  </span>
                  <p className="card-recorrido" title={proximo.recorrido}>
                    {<>
                        {acortarRecorrido(proximo.recorrido)}
                    </>}
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
                  <ArrowLeftRight></ArrowLeftRight>
                  Cambiar sentido
                </button>
              ) : (
                <span className="card-toggle card-toggle--disabled">
                  Sin sentido para cambiar
                </span>
              )}
            </div>

            
          </article>
        )
      })}
    </section>
  )
}

export default CardSection
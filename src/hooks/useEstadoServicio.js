import { useEffect, useState, useSyncExternalStore } from 'react'
import { ESTADOS_SERVICIO } from '../data/estadoServicio'
import { getEstadoDelDia } from '../utils/tipoDeDia'

// Estado del servicio compartido por toda la app. Normalmente sale solo del día
// (lunes a viernes, sábado, domingo/feriado). `forzado` lo pisa: sirve para
// declarar un paro ('sinServicio') o, en la demo, para simular cualquier estado.
// Más adelante se puede alimentar con datos reales llamando a forzarEstadoServicio.
let forzado = null
const oyentes = new Set()

const suscribir = (avisar) => {
  oyentes.add(avisar)
  return () => oyentes.delete(avisar)
}

export const forzarEstadoServicio = (nuevo) => {
  if (nuevo === forzado) return
  forzado = nuevo
  oyentes.forEach((avisar) => avisar())
}

/**
 * Devuelve:
 *  - estado:  'normal' | 'reducido' | 'muyReducido' | 'sinServicio'
 *  - tipoDia: 'habil' | 'sabado' | 'domingo' (qué cronograma mostrar) o null si hay paro
 *  - forzarEstado: para cambiar el estado a mano (null vuelve al automático)
 */
export function useEstadoServicio() {
  const manual = useSyncExternalStore(
    suscribir,
    () => forzado,
    () => forzado,
  )

  // Se revisa cada minuto para que el estado cambie solo al pasar el día de servicio.
  const [ahora, setAhora] = useState(() => new Date())
  useEffect(() => {
    const intervalo = setInterval(() => setAhora(new Date()), 60000)
    return () => clearInterval(intervalo)
  }, [])

  const estado = manual ?? getEstadoDelDia(ahora)
  return { estado, tipoDia: ESTADOS_SERVICIO[estado].tipoDia, forzarEstado: forzarEstadoServicio }
}
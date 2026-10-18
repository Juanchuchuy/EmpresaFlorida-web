// Los colectivos circulan en un "día de servicio" que no arranca a las 00:00,
// sino de madrugada (las líneas con salidas después de medianoche, como
// "0:30", aparecen al FINAL de la planilla, no al principio). Por eso el
// corte del día lo ponemos a las 3 AM: todo lo que sea antes de esa hora
// se considera parte de la noche anterior, no del día que recién empieza.
const HORA_CORTE = 3
const MINUTOS_POR_DIA = 24 * 60

// Minutos transcurridos desde el inicio del día de servicio (3:00).
// Las horas de madrugada (< 3) cuentan como el final del día anterior.
const minutosDeServicio = (horas, minutos) => {
  const total = horas * 60 + minutos
  return (horas < HORA_CORTE ? total + MINUTOS_POR_DIA : total) - HORA_CORTE * 60
}

export const aOrdenDelDia = (hora) => {
  const [h, m] = hora.split(':').map(Number)
  return minutosDeServicio(h, m)
}

// Devuelve el próximo horario (>= ahora) de la lista, o el primero del día
// siguiente si ya no quedan más servicios. Devuelve null si la línea no
// tiene datos cargados todavía.
export const getProximoHorario = (horarios, ahora = new Date()) => {
  if (!horarios || !horarios.horarios || horarios.horarios.length === 0) {
    return null
  }

  const lista = horarios.horarios
  const ordenAhora = aOrdenDelDia(
    `${ahora.getHours()}:${ahora.getMinutes()}`,
  )

  const proximo = lista.find((item) => aOrdenDelDia(item.hora) >= ordenAhora)

  if (proximo) {
    return { ...proximo, esDeManiana: false }
  }

  // No quedan más servicios: el próximo es el primero de la lista.
  // Si todavía es de madrugada (antes de las 3 AM), en realidad ES hoy
  // más tarde, no "mañana".
  return { ...lista[0], esDeManiana: ahora.getHours() >= 3 }
}

// Devuelve hasta "cantidad" horarios a partir del próximo (inclusive),
// dando la vuelta al principio de la lista si hoy ya no quedan más
// servicios (es decir, siguiendo mañana). Se usa para armar el "Después:"
// de la card, que muestra los dos horarios que le siguen al próximo.
export const getProximosHorarios = (horarios, ahora = new Date(), cantidad = 3) => {
  if (!horarios || !horarios.horarios || horarios.horarios.length === 0) return []

  const lista = horarios.horarios
  const ordenAhora = aOrdenDelDia(`${ahora.getHours()}:${ahora.getMinutes()}`)
  const indiceProximo = lista.findIndex((item) => aOrdenDelDia(item.hora) >= ordenAhora)

  if (indiceProximo === -1) return lista.slice(0, cantidad)

  const resultado = []
  for (let i = 0; resultado.length < cantidad; i += 1) {
    resultado.push(lista[(indiceProximo + i) % lista.length])
  }
  return resultado
}

// Para cada fila de la planilla: -1 si ya salió, o su posición entre las que
// todavía faltan (0 = la próxima, 1 = la siguiente...). Función pura: la usa
// la tabla de Horarios para ir apagando la opacidad sin variables mutables.
export const getPosicionesFuturas = (horarios, ahora = new Date()) => {
  const lista = horarios?.horarios ?? []
  const ordenAhora = minutosDeServicio(ahora.getHours(), ahora.getMinutes())
  let futuras = 0
  return lista.map((item) => (aOrdenDelDia(item.hora) < ordenAhora ? -1 : futuras++))
}

// "Saliendo" / "en 12 min" / "en 1 h 20 min": cuánto falta para la hora dada.
// Se calcula sobre el día de servicio (ver minutosDeServicio): así un
// "0:30" visto a las 23:40 son 50 min, y no un horario "ya pasado". Si el
// horario quedó atrás en el orden del día, es el del día siguiente (el
// "Después:" de la card y el primer servicio cuando ya no quedan más hoy).
export const formatCountdown = (hora, ahora = new Date()) => {
  const [h, m] = hora.split(':').map(Number)
  let minutos =
    minutosDeServicio(h, m) - minutosDeServicio(ahora.getHours(), ahora.getMinutes())
  if (minutos < 0) minutos += MINUTOS_POR_DIA

  if (minutos === 0) return 'Saliendo'
  if (minutos < 60) return `${minutos} min`

  const horas = Math.floor(minutos / 60)
  const resto = minutos % 60
  return resto ? `${horas} h ${resto} min` : `${horas} h`
}

// Acorta un recorrido largo a "Origen/Segunda parada/.../Destino final",
// que es la info que realmente importa para identificar el colectivo.
// Si tiene 3 paradas o menos, se muestra completo (ya es corto).
export const acortarRecorrido = (recorrido) => {
  const paradas = recorrido.split('/').map((p) => p.trim())
  if (paradas.length <= 3) return recorrido

  const [primera, segunda] = paradas
  const ultima = paradas[paradas.length - 1]
  return `${primera}/${segunda}/.../${ultima}`
}
// Los colectivos circulan en un "día de servicio" que no arranca a las 00:00,
// sino de madrugada (las líneas con salidas después de medianoche, como
// "0:30", aparecen al FINAL de la planilla, no al principio). Por eso el
// corte del día lo ponemos a las 3 AM: todo lo que sea antes de esa hora
// se considera parte de la noche anterior, no del día que recién empieza.
const INICIO_DIA_SERVICIO = 3 * 60 // 3:00 en minutos

export const aOrdenDelDia = (hora) => {
  const [h, m] = hora.split(':').map(Number)
  let minutos = h * 60 + m
  if (h < 3) minutos += 24 * 60 // "madruga" -> va al final del día anterior
  return minutos - INICIO_DIA_SERVICIO
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

// "Saliendo" / "en 12 min" / "en 1 h 20 min": compara la hora del horario
// contra el momento actual. Si es de madrugada del día siguiente
// ("esDeManiana"), suma un día antes de calcular la diferencia.
export const formatCountdown = (hora, ahora, esDeManiana = false) => {
  const [h, m] = hora.split(':').map(Number)
  const objetivo = new Date(ahora)
  objetivo.setHours(h, m, 0, 0)
  if (esDeManiana) objetivo.setDate(objetivo.getDate() + 1)

  const minutos = Math.round((objetivo.getTime() - ahora.getTime()) / 60000)
  if (minutos <= 0) return 'Saliendo'
  if (minutos < 60) return `en ${minutos} min`

  const horas = Math.floor(minutos / 60)
  const resto = minutos % 60
  return resto ? `en ${horas} h ${resto} min` : `en ${horas} h`
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
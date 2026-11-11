import { feriados } from '../data/feriados'

// Igual que en horarios.js: el "día de servicio" arranca a las 3:00. Un colectivo
// de las 0:30 del sábado pertenece al servicio del viernes, así que a esa hora
// todavía rige el horario del viernes.
const HORA_CORTE = 3

export const getDiaDeServicio = (ahora = new Date()) =>
  new Date(ahora.getTime() - HORA_CORTE * 60 * 60 * 1000)

const aFechaIso = (f) =>
  `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, '0')}-${String(f.getDate()).padStart(2, '0')}`

/** 'habil' (lunes a viernes) | 'sabado' | 'domingo' (domingos y feriados). */
export const getTipoDeDia = (ahora = new Date(), listaFeriados = feriados) => {
  const dia = getDiaDeServicio(ahora)
  if (aFechaIso(dia) in listaFeriados) return 'domingo'
  const diaSemana = dia.getDay()
  if (diaSemana === 0) return 'domingo'
  if (diaSemana === 6) return 'sabado'
  return 'habil'
}

const ESTADO_POR_TIPO_DE_DIA = { habil: 'normal', sabado: 'reducido', domingo: 'muyReducido' }

/** Estado del servicio que corresponde al día (sin contar paros). */
export const getEstadoDelDia = (ahora = new Date(), listaFeriados = feriados) =>
  ESTADO_POR_TIPO_DE_DIA[getTipoDeDia(ahora, listaFeriados)]
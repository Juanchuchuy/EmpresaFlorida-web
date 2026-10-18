import { describe, expect, it } from 'vitest'
import {
  aOrdenDelDia,
  acortarRecorrido,
  formatCountdown,
  getPosicionesFuturas,
  getProximoHorario,
  getProximosHorarios,
} from './horarios'

// Planilla de ejemplo con un servicio de madrugada ("0:30"), que en la
// práctica pertenece al FINAL del día de servicio anterior.
const planilla = {
  horarios: [
    { hora: '5:30', recorrido: 'Terminal/Fila del Medio/Bosque' },
    { hora: '12:00', recorrido: 'Terminal/Fila del Medio/Bosque' },
    { hora: '23:30', recorrido: 'Terminal/Fila del Medio/Bosque' },
    { hora: '0:30', recorrido: 'Terminal/Fila del Medio/Bosque' },
  ],
}

// Cualquier día sirve: la lógica solo mira hora y minutos.
const a = (h, m = 0, s = 0) => new Date(2026, 9, 19, h, m, s)

describe('aOrdenDelDia', () => {
  it('ordena el día de servicio desde las 3:00', () => {
    expect(aOrdenDelDia('3:00')).toBe(0)
    expect(aOrdenDelDia('5:30')).toBe(150)
  })

  it('manda la madrugada (antes de las 3) al final del día', () => {
    expect(aOrdenDelDia('0:30')).toBeGreaterThan(aOrdenDelDia('23:30'))
    expect(aOrdenDelDia('2:59')).toBeGreaterThan(aOrdenDelDia('0:30'))
  })
})

describe('getProximoHorario', () => {
  it('devuelve null si no hay datos', () => {
    expect(getProximoHorario(null, a(10))).toBeNull()
    expect(getProximoHorario({ horarios: [] }, a(10))).toBeNull()
  })

  it('devuelve el que sale justo ahora', () => {
    expect(getProximoHorario(planilla, a(12, 0)).hora).toBe('12:00')
  })

  it('devuelve el siguiente cuando el anterior ya salió', () => {
    expect(getProximoHorario(planilla, a(12, 1)).hora).toBe('23:30')
  })

  it('después de las 23:30 el próximo es el de las 0:30, del mismo día de servicio', () => {
    const p = getProximoHorario(planilla, a(23, 40))
    expect(p.hora).toBe('0:30')
    expect(p.esDeManiana).toBe(false)
  })

  it('cuando ya no quedan servicios a la noche, el próximo es el primero de "mañana"', () => {
    const sinMadrugada = { horarios: planilla.horarios.slice(0, 3) }
    const m = getProximoHorario(sinMadrugada, a(23, 40))
    expect(m.hora).toBe('5:30')
    expect(m.esDeManiana).toBe(true)
  })

  it('de madrugada, el primer servicio de la planilla es de hoy, no de mañana', () => {
    const sinMadrugada = { horarios: planilla.horarios.slice(0, 3) }
    const p = getProximoHorario(sinMadrugada, a(1, 15))
    expect(p.hora).toBe('5:30')
    expect(p.esDeManiana).toBe(false)
  })
})

describe('getProximosHorarios', () => {
  it('devuelve los siguientes en orden', () => {
    expect(getProximosHorarios(planilla, a(11), 3).map((h) => h.hora)).toEqual([
      '12:00',
      '23:30',
      '0:30',
    ])
  })

  it('da la vuelta al principio de la planilla si faltan servicios', () => {
    expect(getProximosHorarios(planilla, a(23, 40), 3).map((h) => h.hora)).toEqual([
      '0:30',
      '5:30',
      '12:00',
    ])
  })

  it('devuelve [] si no hay datos', () => {
    expect(getProximosHorarios(null, a(10))).toEqual([])
  })
})

describe('getPosicionesFuturas', () => {
  it('marca con -1 los que ya salieron y numera los que faltan', () => {
    expect(getPosicionesFuturas(planilla, a(12, 1))).toEqual([-1, -1, 0, 1])
  })

  it('el que sale justo ahora cuenta como próximo', () => {
    expect(getPosicionesFuturas(planilla, a(12, 0))).toEqual([-1, 0, 1, 2])
  })

  it('devuelve [] sin datos', () => {
    expect(getPosicionesFuturas(null, a(10))).toEqual([])
  })
})

describe('formatCountdown', () => {
  it('"Saliendo" cuando es ahora', () => {
    expect(formatCountdown('12:00', a(12, 0))).toBe('Saliendo')
    expect(formatCountdown('12:00', a(12, 0, 50))).toBe('Saliendo')
  })

  it('minutos, horas y horas con minutos', () => {
    expect(formatCountdown('12:20', a(12, 0))).toBe('20 min')
    expect(formatCountdown('14:00', a(12, 0))).toBe('2 h')
    expect(formatCountdown('13:20', a(12, 0))).toBe('1 h 20 min')
  })

  // Bug original: a las 23:40 el "0:30" aparecía como "Saliendo".
  it('un horario de madrugada visto antes de medianoche cuenta bien', () => {
    expect(formatCountdown('0:30', a(23, 40))).toBe('50 min')
    expect(formatCountdown('0:30', a(23, 59))).toBe('31 min')
  })

  it('un horario de madrugada visto después de medianoche cuenta bien', () => {
    expect(formatCountdown('0:30', a(0, 10))).toBe('20 min')
  })

  it('un horario que ya pasó hoy es el de mañana', () => {
    expect(formatCountdown('5:30', a(23, 50))).toBe('5 h 40 min')
    expect(formatCountdown('5:30', a(12, 0))).toBe('17 h 30 min')
  })
})

describe('acortarRecorrido', () => {
  it('deja igual los recorridos de 3 paradas o menos', () => {
    expect(acortarRecorrido('Terminal/Bosque/Dispensario')).toBe('Terminal/Bosque/Dispensario')
  })

  it('acorta los largos a origen / segunda / ... / destino', () => {
    expect(acortarRecorrido('A/B/C/D/E')).toBe('A/B/.../E')
  })
})
// Feriados nacionales en los que los colectivos circulan con el horario de
// domingo. Formato: 'AAAA-MM-DD': 'nombre'.
// Fuente: calendario oficial (argentina.gob.ar/feriados). Hay que cargar el
// calendario del año siguiente cuando el Gobierno lo publique.
// Nota: el 7/12/2026 es "día no laborable con fines turísticos", no feriado;
// agregalo acá solo si la empresa ese día opera con el horario de domingo.
export const feriados = {
  '2026-11-23': 'Día de la Soberanía Nacional (trasladado del 20/11)',
  '2026-12-08': 'Inmaculada Concepción de María',
  '2026-12-25': 'Navidad',
}
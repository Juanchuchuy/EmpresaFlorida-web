import floridaPosse from '../assets/img/florida_x_posse.webp'
import wPosse from '../assets/img/w_posse.webp'
import lasCejas from '../assets/img/las_cejas.webp'
import losRalos from '../assets/img/los_ralos.webp'
import floridaAlderetes from '../assets/img/florida_x_alderetes.webp'

// Cronogramas: lunes a viernes en ./horarios, sábados en ./horarios/sabado y
// domingos/feriados en ./horarios/domingo. Cada línea tiene dos archivos por día:
// "<nombre>_Tuc.json" (ida) y "<nombre>.json" (vuelta).
const archivos = import.meta.glob('./horarios/**/*.json', { eager: true, import: 'default' })
const CARPETA = { habil: '', sabado: 'sabado/', domingo: 'domingo/' }
const leer = (tipoDia, nombre) => archivos[`./horarios/${CARPETA[tipoDia]}${nombre}.json`] ?? null
const cronograma = (tipoDia, base) => ({ ida: leer(tipoDia, `${base}_Tuc`), vuelta: leer(tipoDia, base) })

// Si la línea no circula un día (ej. W Posse los sábados), ese día queda en null.
const horariosDe = (base, { sabado = true, domingo = true } = {}) => ({
  habil: cronograma('habil', base),
  sabado: sabado ? cronograma('sabado', base) : null,
  domingo: domingo ? cronograma('domingo', base) : null,
})

// "ida" = viaja HACIA Tuc (capital). "vuelta" = sale DESDE Tuc.
// Florida x Alternativa y 4 de Mayo todavía no se listan porque les falta el
// JSON de horarios (sus imágenes ya están en assets/img). Una línea con ida o
// vuelta en null se muestra como "horario no disponible".
export const lineas = [
  
  {
    id: 'florida-posse',
    nombre: 'Florida x Posse',
    imagen: floridaPosse,
    horarios: horariosDe('floridaXposse'),
  },
  {
    id: 'w-posse',
    nombre: 'W Posse',
    imagen: wPosse,
    horarios: horariosDe('wPosse', { sabado: false, domingo: false }),
  },
  {
    id: 'las-cejas',
    nombre: 'Las Cejas',
    imagen: lasCejas,
    horarios: horariosDe('lasCejas'),
  },
  
  {
    id: 'los-ralos',
    nombre: 'Los Ralos',
    imagen: losRalos,
    horarios: horariosDe('losRalos'),
  },
  {
    id: 'florida-alderetes',
    nombre: 'Florida x Alderetes',
    imagen: floridaAlderetes,
    horarios: horariosDe('floridaXalderetes'),
  },
]

/** Cronograma de una línea para un sentido ('ida' | 'vuelta') y tipo de día; null si no hay. */
export const getHorarios = (linea, sentido, tipoDia) => linea?.horarios?.[tipoDia]?.[sentido] ?? null

/** ¿La línea sale ese tipo de día? (false con paro o si ese día no circula) */
export const circulaEn = (linea, tipoDia) => Boolean(linea?.horarios?.[tipoDia])

// Solo en desarrollo: avisa en la consola del navegador qué cronogramas no se
// encontraron (carpeta o nombre de archivo mal puesto) y qué archivos sí encontró.
if (import.meta.env.DEV) {
  const faltan = []
  for (const linea of lineas) {
    for (const tipoDia of ['habil', 'sabado', 'domingo']) {
      const dia = linea.horarios[tipoDia]
      if (!dia) continue
      for (const sentido of ['ida', 'vuelta']) {
        if (!dia[sentido]) faltan.push(`${linea.nombre} · ${tipoDia} · ${sentido}`)
      }
    }
  }
  if (faltan.length) {
    console.warn(
      `[horarios] Faltan cronogramas:\n- ${faltan.join('\n- ')}\n\nArchivos de horarios encontrados:\n${Object.keys(archivos).sort().join('\n')}`,
    )
  }
}
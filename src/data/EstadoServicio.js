// Estados del servicio de colectivos. El estado sale del tipo de día (lunes a
// viernes, sábado, domingo/feriado) salvo que haya un paro: ahí es 'sinServicio'.
// Es la única fuente de textos y colores: la tarjeta de la home, el badge del
// header, el aviso y los badges de las cards leen todo de acá.
export const ESTADOS_SERVICIO = {
  normal: {
    titulo: 'Servicio normal',
    cuando: 'Lunes a viernes',
    aviso: 'Hoy rigen los horarios de lunes a viernes.',
    tipoDia: 'habil',
    color: '#12a15b',
    halo: 'rgba(18, 161, 91, 0.18)',
    fondo: 'rgba(18, 161, 91, 0.10)',
  },
  reducido: {
    titulo: 'Servicio reducido',
    cuando: 'Sábados',
    aviso: 'Hoy rigen los horarios de sábado, con menos salidas que de lunes a viernes.',
    tipoDia: 'sabado',
    color: '#f0951f',
    halo: 'rgba(240, 149, 31, 0.20)',
    fondo: 'rgba(240, 149, 31, 0.12)',
  },
  muyReducido: {
    titulo: 'Servicio muy reducido',
    cuando: 'Domingos y feriados',
    aviso: 'Hoy rigen los horarios de domingo y feriados, con muy pocas salidas.',
    tipoDia: 'domingo',
    color: '#e8590c',
    halo: 'rgba(232, 89, 12, 0.20)',
    fondo: 'rgba(232, 89, 12, 0.12)',
  },
  sinServicio: {
    titulo: 'Sin servicio',
    cuando: 'Paro de colectivos',
    aviso: 'Paro de colectivos: por el momento no hay servicio.',
    tipoDia: null,
    color: '#dc3545',
    halo: 'rgba(220, 53, 69, 0.18)',
    fondo: 'rgba(220, 53, 69, 0.10)',
  },
}

export const ORDEN_ESTADOS = ['normal', 'reducido', 'muyReducido', 'sinServicio']

// Variables CSS (--estado-color/halo/fondo) para el `style` de cada componente.
export const variablesEstado = (estado) => {
  const e = ESTADOS_SERVICIO[estado] ?? ESTADOS_SERVICIO.normal
  return { '--estado-color': e.color, '--estado-halo': e.halo, '--estado-fondo': e.fondo }
}

// Qué decir cuando una línea no tiene horarios para mostrar.
//  - tipoDia null  → hay paro
//  - !circula      → la línea no sale ese día (ej. W Posse los sábados)
//  - circula       → falta cargar el cronograma de ese sentido
export const mensajeSinHorarios = ({ tipoDia, circula }) => {
  if (tipoDia === null) return 'Sin servicio por paro de colectivos.'
  if (!circula) {
    return tipoDia === 'sabado'
      ? 'Esta línea no circula los sábados.'
      : 'Esta línea no circula domingos ni feriados.'
  }
  return 'Todavía no tenemos el cronograma cargado para este sentido.'
}
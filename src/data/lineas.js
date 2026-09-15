import floridaAlternativa from '../assets/img/florida_x_alternativa.png'
import floridaPosse from '../assets/img/florida_x_posse.png'
import wPosse from '../assets/img/w_posse.png'
import lasCejas from '../assets/img/las_cejas.png'
import cuatroDeMayo from '../assets/img/4_de_mayo.png'
import losRalos from '../assets/img/los_ralos.png'
import floridaAlderetes from '../assets/img/florida_x_alderetes.png'

import floridaPosseIda from './horarios/floridaXposse_Tuc.json'
import floridaPosseVuelta from './horarios/floridaXposse.json'
import wPosseIda from './horarios/wPosse_Tuc.json'
import wPosseVuelta from './horarios/wPosse.json'
import lasCejasIda from './horarios/lasCejas_Tuc.json'
import lasCejasVuelta from './horarios/lasCejas.json'
import losRalosIda from './horarios/losRalos_Tuc.json'
import losRalosVuelta from './horarios/losRalos.json'
import floridaAlderetesIda from './horarios/floridaXalderetes_Tuc.json'
import floridaAlderetesVuelta from './horarios/floridaXalderetes.json'

// "ida" = viaja HACIA Tuc (capital). "vuelta" = sale DESDE Tuc.
// Las líneas sin JSON todavía (Florida x Alternativa, 4 de Mayo) quedan en null
// y la card lo va a mostrar como "horario no disponible".
export const lineas = [
  
  {
    id: 'florida-posse',
    nombre: 'Florida x Posse',
    imagen: floridaPosse,
    ida: floridaPosseIda,
    vuelta: floridaPosseVuelta,
  },
  {
    id: 'w-posse',
    nombre: 'W Posse',
    imagen: wPosse,
    ida: wPosseIda,
    vuelta: wPosseVuelta,
  },
  {
    id: 'las-cejas',
    nombre: 'Las Cejas',
    imagen: lasCejas,
    ida: lasCejasIda,
    vuelta: lasCejasVuelta,
  },
  
  {
    id: 'los-ralos',
    nombre: 'Los Ralos',
    imagen: losRalos,
    ida: losRalosIda,
    vuelta: losRalosVuelta,
  },
  {
    id: 'florida-alderetes',
    nombre: 'Florida x Alderetes',
    imagen: floridaAlderetes,
    ida: floridaAlderetesIda,
    vuelta: floridaAlderetesVuelta,
  },
]

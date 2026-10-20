import floridaPosse from '../assets/img/florida_x_posse.webp'
import wPosse from '../assets/img/w_posse.webp'
import lasCejas from '../assets/img/las_cejas.webp'
import losRalos from '../assets/img/los_ralos.webp'
import floridaAlderetes from '../assets/img/florida_x_alderetes.webp'

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
// Florida x Alternativa y 4 de Mayo todavía no se listan porque les falta el
// JSON de horarios (sus imágenes ya están en assets/img). Una línea con ida o
// vuelta en null se muestra como "horario no disponible".
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
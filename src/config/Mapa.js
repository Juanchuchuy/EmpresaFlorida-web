// Proveedor de tiles del mapa. Por defecto usa OpenStreetMap, ideal para
// desarrollo; para producción conviene un proveedor con clave propia.
// Se cambia sin tocar código con variables de entorno (ver .env.example).
const OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const OSM_ATRIBUCION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

export const TILES_URL = import.meta.env.VITE_TILES_URL || OSM_URL
export const TILES_ATRIBUCION = import.meta.env.VITE_TILES_ATTRIBUTION || OSM_ATRIBUCION
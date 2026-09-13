import posseParada01 from '../assets/img/paradas/florida-posse/parada-01.webp'
import posseParada02 from '../assets/img/paradas/florida-posse/parada-02.webp'
import posseParada03 from '../assets/img/paradas/florida-posse/parada-03.webp'
import posseParada04 from '../assets/img/paradas/florida-posse/parada-04.webp'
import posseParada05 from '../assets/img/paradas/florida-posse/parada-05.webp'
import posseParada06 from '../assets/img/paradas/florida-posse/parada-06.webp'
import posseParada07 from '../assets/img/paradas/florida-posse/parada-07.webp'
import posseParada08 from '../assets/img/paradas/florida-posse/parada-08.webp'
import posseParada09 from '../assets/img/paradas/florida-posse/parada-09.webp'
import posseParada10 from '../assets/img/paradas/florida-posse/parada-10.webp'
import posseParada11 from '../assets/img/paradas/florida-posse/parada-11.webp'
import posseParada12 from '../assets/img/paradas/florida-posse/parada-12.webp'

// Paradas reales, en orden, para cada línea. A medida que se agreguen
// fotos de más líneas, se suma una entrada nueva acá con su propio
// array de paradas. Las líneas que todavía no están acá usan una lista
// derivada del texto de "recorrido" como fallback (ver Horarios.jsx).
export const paradasPorLinea = {
  'florida-posse': [
    { id: 'plaza-posse', nombre: 'Plaza Posse', imagen: posseParada01 },
    { id: 'plaza-bicentenario', nombre: 'Plaza Bicentenario', imagen: posseParada02 },
    { id: 'la-pila', nombre: 'La Pila', imagen: posseParada03 },
    { id: 'super-yang', nombre: 'Súper Yang', imagen: posseParada04 },
    { id: 'entrada-fila-del-medio', nombre: 'Entrada Fila del Medio', imagen: posseParada05 },
    { id: 'lomas-de-burro', nombre: 'Lomas de Burro', imagen: posseParada06 },
    { id: 'carcel-de-mujeres', nombre: 'Cárcel de Mujeres', imagen: posseParada07 },
    { id: 'pista-aeropuerto', nombre: 'Pista Aeropuerto', imagen: posseParada08 },
    { id: 'banco-de-la-banda', nombre: 'Banco de la Banda', imagen: posseParada09 },
    { id: 'plaza-de-la-banda', nombre: 'Plaza de la Banda', imagen: posseParada10 },
    { id: 'facultad-ed-fisica', nombre: 'Facultad de Ed. Física', imagen: posseParada11 },
    { id: 'calle-francia', nombre: 'Calle Francia', imagen: posseParada12 },
  ],
}
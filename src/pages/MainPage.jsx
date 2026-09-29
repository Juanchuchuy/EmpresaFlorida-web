import { useNavigate } from 'react-router-dom'
import { MapPin, Ticket, BadgeDollarSign,  Clock } from 'lucide-react'
import logoWatermark from '../assets/img/Logo.jpg'
import './MainPage.css'

// TODO: "Abonos" y "Tarifas" todavía no tienen página propia; cuando existan,
// se les agrega su "ruta" igual que a "Punto de recarga" y "Horarios".
const acciones = [
  { icono: MapPin, texto: 'Punto de recarga', ruta: '/puntos-recarga' },
  { icono: Ticket, texto: 'Abonos', ruta: null },
  { icono: BadgeDollarSign, texto: 'Tarifas', ruta: null },
  { icono: Clock, texto: 'Horarios', ruta: '/horarios' },
]

const MainPage = () => {
  const navigate = useNavigate()

  const handleClick = (ruta) => {
    if (!ruta) return
    if (ruta.startsWith('#')) {
      document.querySelector(ruta)?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    navigate(ruta)
  }

  return (
    <section className="main-page">
      <img
        src={logoWatermark}
        alt=""
        className="main-page-watermark"
        aria-hidden="true"
      />

      <div className="main-page-content">
        <h1 className="main-page-titulo">Empresa Florida</h1>

        <div className="main-page-acciones">
          {acciones.map(({ icono: Icono, texto, ruta }) => (
            <button
              key={texto}
              type="button"
              className="main-page-boton"
              disabled={!ruta}
              onClick={() => handleClick(ruta)}
            >
              <Icono size={20} />
              <span>{texto}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MainPage
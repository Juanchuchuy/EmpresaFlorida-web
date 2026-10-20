import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Cargando from './components/Cargando'
import MainPage from './pages/MainPage'
import './App.css'

// La home se carga de entrada; el resto de las páginas (y con ellas Leaflet y
// los JSON de horarios) se descargan recién cuando el usuario las abre.
const Horarios = lazy(() => import('./pages/Horarios'))
const PuntosRecarga = lazy(() => import('./pages/PuntosRecarga'))

function App() {
  return (
    <>
      <Header></Header>
      <Suspense fallback={<Cargando />}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/horarios/:lineaId?" element={<Horarios />} />
          <Route path="/puntos-recarga" element={<PuntosRecarga />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App  
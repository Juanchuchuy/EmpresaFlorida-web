import { Routes, Route } from 'react-router-dom'
import CardSection from './components/CardSection'
import Header from './components/Header'
import Horarios from './pages/Horarios'
import PuntosRecarga from './pages/PuntosRecarga'
import './App.css'

function App() {
  return (
    <>
      <Header></Header>
      <Routes>
        <Route path="/" element={<CardSection />} />
        <Route path="/horarios/:lineaId" element={<Horarios />} />
        <Route path="/puntos-recarga" element={<PuntosRecarga />} />
      </Routes>
    </>
  )
}

export default App
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Horarios from './pages/Horarios'
import PuntosRecarga from './pages/PuntosRecarga'
import MainPage from './pages/MainPage'
import './App.css'

function App() {
  return (
    <>
      <Header></Header>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/horarios/:lineaId?" element={<Horarios />} />
        <Route path="/puntos-recarga" element={<PuntosRecarga />} />
      </Routes>
    </>
  )
}

export default App  
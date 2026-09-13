
import { Routes, Route } from 'react-router-dom'
import CardSection from './components/CardSection'
import Header from './components/Header'
import Horarios from './pages/Horarios'
import './App.css'

function App() {
  return (
    <>
      <Header></Header>
      <Routes>
        <Route path="/" element={<CardSection />} />
        <Route path="/horarios/:lineaId" element={<Horarios />} />
      </Routes>
    </>
  )
}

export default App

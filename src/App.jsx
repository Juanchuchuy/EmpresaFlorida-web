import logo from './assets/img/Logo.jpg'
import CardSection from './components/CardSection'
import './App.css'

function App() {
  return (
    <>
      <header className="app-header">
        <img
          src={logo}
          alt="Empresa Florida S.R.L. - Desde 1954"
          className="app-logo"
        />
        <h1 className="app-title">Horarios Empresa Florida</h1>
      </header>

      <CardSection />
    </>
  )
}

export default App

import React from 'react'
import { useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Header.css'
import logo from '../assets/img/Logo.jpg'
import { ChevronRight, Menu, X } from 'lucide-react';

const Header = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [arrow, setArrow] = useState('normal')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // Guarda el id del setTimeout de cierre para poder cancelarlo si el
  // mouse vuelve a entrar antes de que se cumpla el delay. Sin esto,
  // entrar y salir rápido podía dejar varios timeouts compitiendo entre sí.
  const closeTimeoutRef = useRef(null)

  const handleMenuEnter = () => {
    clearTimeout(closeTimeoutRef.current)
    setIsMenuOpen(true)
    setArrow('down')
  }

  const handleMenuLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsMenuOpen(false)
      setArrow('normal')
    }, 250)
  }

  // En touch no hay "hover", así que el submenu de Horarios también se
  // abre/cierra con un tap directo sobre el botón.
  const toggleMenuMovil = () => {
    clearTimeout(closeTimeoutRef.current)
    setIsMenuOpen((open) => !open)
    setArrow((a) => (a === 'normal' ? 'down' : 'normal'))
  }

  // Cierra el menú hamburguesa al elegir cualquier opción, para no
  // dejarlo tapando la pantalla después de navegar.
  const cerrarMenuMovil = () => setIsMobileMenuOpen(false)





  return (
      <header className="app-header">
        <div className="logo">
              <img
                src={logo}
                alt="Empresa Florida S.R.L. - Desde 1954"
                className="logo-img"
              />
              <h1 className="logo-title">Empresa Florida SRL</h1>
        </div>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`main-nav ${isMobileMenuOpen ? 'main-nav-open' : ''}`}>
          <ul className='nav-menu'>
            <li className='menu-item' >
              <NavLink to="/" end onClick={cerrarMenuMovil} className={({ isActive }) => isActive ? 'active' : undefined}>Inicio</NavLink>
              <hr className='menu-item-border'/>
            </li>
            {/* Abonos y Tarifas todavía no tienen página/Route propia */}
            <li className='menu-item' ><a onClick={cerrarMenuMovil}>Abonos</a><hr className='menu-item-border'/></li>
            <li className='menu-item' ><a onClick={cerrarMenuMovil}>Tarifas</a><hr className='menu-item-border'/></li>
            <li className='menu-item' >
              <NavLink to="/puntos-recarga" onClick={cerrarMenuMovil} className={({ isActive }) => isActive ? 'active' : undefined}>Puntos de recarga</NavLink><hr className='menu-item-border'/></li>
            <li className='menu-item-button'
                onMouseEnter={handleMenuEnter}
                onMouseLeave={handleMenuLeave}
            >
              <button className='menu-button' onClick={toggleMenuMovil}>
                Horarios <ChevronRight className={`Arrow-button-${arrow}`} />
              </button>
              <ul className={`dropdown-menu ${isMenuOpen ? 'dropdown-menu-open' : ''}`}>
                <li><NavLink to="/horarios/florida-posse" onClick={cerrarMenuMovil}>Florida por Posse</NavLink></li>
                <li><NavLink to="/horarios/florida-alderetes" onClick={cerrarMenuMovil}>Florida por Alderetes</NavLink></li>
                <li><NavLink to="/horarios/florida-alternativa" onClick={cerrarMenuMovil}>Florida por Alternativa</NavLink></li>
                <li><NavLink to="/horarios/w-posse" onClick={cerrarMenuMovil}>W.Posse</NavLink></li>
                <li><NavLink to="/horarios/las-cejas" onClick={cerrarMenuMovil}>Las cejas</NavLink></li>
                <li><NavLink to="/horarios/los-ralos" onClick={cerrarMenuMovil}>Los Ralos</NavLink></li>
              </ul>
            </li>
          </ul>
          </nav>
      </header>
  )
}

export default Header
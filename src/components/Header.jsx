import React from 'react'
import { useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Header.css'
import logo from '../assets/img/Logo.jpg'
import { ChevronRight } from 'lucide-react';

const Header = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [arrow, setArrow] = useState('normal')
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
        <nav>
          <ul className='nav-menu'>
            <li className='menu-item' >
              <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : undefined}>Inicio</NavLink>
              <hr className='menu-item-border'/>
            </li>
            {/* Abonos, Tarifas y Puntos de recarga todavía no tienen página/Route propia */}
            <li className='menu-item' ><a>Abonos</a><hr className='menu-item-border'/></li>
            <li className='menu-item' ><a>Tarifas</a><hr className='menu-item-border'/></li>
            <li className='menu-item' >
              <a>Puntos de recarga</a><hr className='menu-item-border'/></li>
            <li className='menu-item-button'
                onMouseEnter={handleMenuEnter}
                onMouseLeave={handleMenuLeave}
            >
              <button className='menu-button'>
                Horarios <ChevronRight className={`Arrow-button-${arrow}`} />
              </button>
              <ul className={`dropdown-menu ${isMenuOpen ? 'dropdown-menu-open' : ''}`}>
                <li><NavLink to="/horarios/florida-posse">Florida por Posse</NavLink></li>
                <li><NavLink to="/horarios/florida-alderetes">Florida por Alderetes</NavLink></li>
                <li><NavLink to="/horarios/florida-alternativa">Florida por Alternativa</NavLink></li>
                <li><NavLink to="/horarios/w-posse">W.Posse</NavLink></li>
                <li><NavLink to="/horarios/las-cejas">Las cejas</NavLink></li>
                <li><NavLink to="/horarios/los-ralos">Los Ralos</NavLink></li>
              </ul>
            </li>
          </ul>
          </nav>
      </header>
  )
}

export default Header
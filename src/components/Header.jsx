import React from 'react'
import { useState } from 'react'
import './Header.css'
import logo from '../assets/img/Logo.jpg'
import { ChevronRight } from 'lucide-react';
import { use } from 'react';

const Header = () => {

  const [display,setDisplay] = useState('none');
  const [arrow,setArrow] = useState('normal')

  const showMenu = (e) => {

    display === 'none' ? setTimeout(() => {
      setDisplay('block')
      setArrow('down')
    }, 0)  : setTimeout(() => {
      setDisplay('none');
      setArrow('normal');
    }, 1500) 
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
            <li className='menu-item' ><a>Inicio</a><hr className='menu-item-border'/></li>
            <li className='menu-item' ><a>Abonos</a><hr className='menu-item-border'/></li>
            <li className='menu-item' ><a>Tarifas</a><hr className='menu-item-border'/></li>
            <li className='menu-item' >
              <a>Puntos de recarga</a><hr className='menu-item-border'/></li>
            <li className='menu-item-button'>
              <button className='menu-button'
                        onMouseEnter={e => showMenu(e)}
              >Horarios <ChevronRight className={`Arrow-button-${arrow}`} /></button>
              <ul className={display}
                  onMouseLeave={e => showMenu(e)}
              
              >
                <li>Florida por Posse</li>
                <li>Florida por Alderetes</li>
                <li>Florida por Alternativa</li>
                <li>W.Posse</li>
                <li>Las cejas</li>
                <li>Los Ralos</li>
              </ul>
            </li>
          </ul>
          </nav>
      </header>
  )
}

export default Header
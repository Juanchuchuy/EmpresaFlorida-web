import React from 'react'
import './Header.css'
import logo from '../assets/img/Logo.jpg'

const Header = () => {
  return (
      <header className="app-header">
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
              <a className="btn btn-ghost text-xl">daisyUI</a>
            </div>
            <div className="flex-none">
              <ul className="menu menu-horizontal px-1">
                <li><a>Link</a></li>
                <li>
                  <details>
                    <summary>Parent</summary>
                    <ul className="bg-base-100 rounded-t-none p-2">
                      <li><a>Link 1</a></li>
                      <li><a>Link 2</a></li>
                    </ul>
                  </details>
                </li>
              </ul>
            </div>
        </div>  

        <div className="menu-logo">
              <img
            src={logo}
            alt="Empresa Florida S.R.L. - Desde 1954"
            className="menu-logo-img"
          />
          <h1 className="menu-logo-title">Empresa Florida SRL</h1>
        </div>
        
      </header>
  )
}

export default Header
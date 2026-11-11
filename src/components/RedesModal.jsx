import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ExternalLink, X } from 'lucide-react'
import { redes } from '../data/Redes'
import './RedesModal.css'

// Íconos de las marcas (lucide-react ya no los incluye).
const ICONOS = {
  facebook: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
}

const SELECTOR_FOCO = 'a[href], button:not([disabled])'

// Popup con las redes sociales de la empresa. Se cierra con la X, tocando el
// fondo o con Esc; mientras está abierto el foco queda dentro de la card.
const RedesModal = ({ abierto, onCerrar }) => {
  const tarjetaRef = useRef(null)
  const botonCerrarRef = useRef(null)

  // Siempre la última función, sin volver a armar el efecto en cada render del padre.
  const onCerrarRef = useRef(onCerrar)
  useEffect(() => {
    onCerrarRef.current = onCerrar
  })

  useEffect(() => {
    if (!abierto) return undefined
    const previo = document.activeElement
    botonCerrarRef.current?.focus()

    const alTeclear = (e) => {
      if (e.key === 'Escape') {
        onCerrarRef.current()
        return
      }
      if (e.key !== 'Tab') return
      const enfocables = tarjetaRef.current?.querySelectorAll(SELECTOR_FOCO)
      if (!enfocables?.length) return
      const primero = enfocables[0]
      const ultimo = enfocables[enfocables.length - 1]
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primero.focus()
      }
    }
    document.addEventListener('keydown', alTeclear)
    return () => {
      document.removeEventListener('keydown', alTeclear)
      previo?.focus?.()
    }
  }, [abierto])

  if (!abierto) return null

  return createPortal(
    <div className="redes-fondo" onClick={onCerrar}>
      <section
        ref={tarjetaRef}
        className="redes-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="redes-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={botonCerrarRef}
          type="button"
          className="redes-cerrar"
          onClick={onCerrar}
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>

        <h2 id="redes-titulo" className="redes-titulo">Seguinos en redes</h2>
        <p className="redes-texto">
          Enterate de los avisos y novedades del servicio en nuestras redes oficiales.
        </p>

        <ul className="redes-lista">
          {redes.map(({ id, nombre, usuario, url }) => {
            const contenido = (
              <>
                <span className={`redes-icono redes-icono--${id}`}>{ICONOS[id]}</span>
                <span className="redes-datos">
                  <strong className="redes-nombre">{nombre}</strong>
                  <span className="redes-usuario">{url ? usuario || 'Visitar página' : 'Próximamente'}</span>
                </span>
                {url && <ExternalLink size={18} className="redes-externo" aria-hidden="true" />}
              </>
            )
            return (
              <li key={id}>
                {url ? (
                  <a
                    className="redes-enlace"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${nombre}: abrir en una pestaña nueva`}
                  >
                    {contenido}
                  </a>
                ) : (
                  <div className="redes-enlace redes-enlace--pendiente" aria-disabled="true">
                    {contenido}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </div>,
    document.body,
  )
}

export default RedesModal
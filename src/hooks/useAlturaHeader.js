import { useLayoutEffect } from 'react'

/**
 * Deja en la variable CSS --header-h la altura real del header de la app, para
 * que el contenedor ocupe exactamente lo que queda de pantalla debajo de él
 * (así el pie queda abajo del todo y la página no genera scroll).
 * Se vuelve a medir cuando cambia el tamaño de la ventana.
 */
export function useAlturaHeader(ref) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const medir = () => {
      const header = document.querySelector('.app-header')
      el.style.setProperty('--header-h', `${header ? header.offsetHeight : 76}px`)
    }
    medir()
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [ref])
}
import { useSyncExternalStore } from 'react'

const suscribir = (avisar) => {
  window.addEventListener('online', avisar)
  window.addEventListener('offline', avisar)
  return () => {
    window.removeEventListener('online', avisar)
    window.removeEventListener('offline', avisar)
  }
}

/** true si el dispositivo tiene conexión (se actualiza solo al cambiar). */
export function useConexion() {
  return useSyncExternalStore(
    suscribir,
    () => navigator.onLine,
    () => true,
  )
}
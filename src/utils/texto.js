// Todas las líneas tienen como mínimo 3 paradas en su recorrido, así que
// achicamos a "primera parada/.../última parada" para que el texto ocupe
// más o menos lo mismo sin importar si el recorrido real tiene 3 paradas
// (Bº La Cancha/Florida x Posse/Tuc) o 10 (como Florida x Alderetes).
export const acortarRecorrido = (recorrido) => {
  const partes = recorrido
    .split('/')
    .map((parte) => parte.trim())
    .filter(Boolean)

  if (partes.length <= 2) return recorrido

  return `${partes[0]}/.../${partes[partes.length - 1]}`
}

// Todas las líneas tienen como mínimo 3 paradas en su recorrido, así que
// achicamos a "primera parada/.../última parada" para que el texto ocupe
// más o menos lo mismo sin importar si el recorrido real tiene 3 paradas
// (Bº La Cancha/Florida x Posse/Tuc) o 10 (como Florida x Alderetes).
import { MoveRight,ArrowRightFromLine } from 'lucide-react';
export const acortarRecorrido = (recorrido) => {
  const partes = recorrido
    .split('/')
    .map((parte) => parte.trim())
    .filter(Boolean)
    if(partes.length == 1){
      
      return (
          <>
            <strong>{partes[0]}</strong><MoveRight color='red'/><strong>ESCOLAR</strong>
          </>

      )


    }
  
    
  return (
    <>
      <strong>Desde</strong><ArrowRightFromLine color='red'/> <strong>  {partes[0]}</strong>
    </>

  )
}

import { CategoriaPlato } from './ICategoriaPlato';
import { DetallePlato } from './IDetallePlato';

export interface Plato {
    id?: number,
    denominacion: string,
    tiempoPreparacion: number,
    imagen: string,
    precioVenta: number
    categoriaPlato: CategoriaPlato,
    detallePlato: DetallePlato[],
    receta: string,
    total?:number,
    status?: boolean
}
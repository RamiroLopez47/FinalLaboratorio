import { Articulo } from './IArticulo';

export interface DetallePlato {
    id?: number
    cantidad: number,
    articulo: Articulo,
}
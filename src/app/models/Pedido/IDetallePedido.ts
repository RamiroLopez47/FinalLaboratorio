import { Plato } from '../IPlato';
export interface DetallePedido {
    id?: number,
    subTotal: number,
    cantidad: number,
    plato : Plato
}
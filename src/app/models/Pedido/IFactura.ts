import { Pedido } from './IPedido';
export interface Factura {
    id?: number;
    total?: number;
    fecha?: Date;
    numero?: number,
    descuento?: number;
    pedido ?: Pedido;
}

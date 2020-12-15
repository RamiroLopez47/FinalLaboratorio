import { Cliente } from '../Persona/ICliente';
import { Factura } from './IFactura';
import { DetallePedido } from './IDetallePedido';
import { Domicilio } from '../Domicilio/IDomicilio';
import { Estado } from './IEstado';
import { Delivery } from '../Persona/IDelivery';
import { Cocinero } from '../Persona/ICocinero';
import { FormaPago } from './iFormaPago';

export interface Pedido {
    id?: number,
    fecha?: Date,
    numero: number,
    horaEstimadaFin?: Date,
    conDelivery?: boolean,
    cliente: Cliente,
    factura?: Factura,
    detallesPedido: DetallePedido[],
    domicilio?: Domicilio,
    estado: Estado,
    total?: number
    precioFinal?: number,
    delivery?: Delivery,
    cocinero?: Cocinero,
    formaPago?: FormaPago
}

export interface DatosCocina {
    cocinerosActivos: number,
    tiempoPedidosCocina : number
}

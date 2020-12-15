import { Persona } from './IPersona';
import { Rol } from './IRol';
import { Domicilio } from '../Domicilio/IDomicilio';
import { Pedido } from '../Pedido/IPedido';


export interface Usuario extends Persona {
    password?: string,
    imagen?: string
    rol?: Rol,
    domicilios ?: Domicilio[],
    pedidos ?: Pedido[]
}
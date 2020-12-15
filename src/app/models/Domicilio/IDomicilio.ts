import { Localidad } from './ILocalidad';
export interface Domicilio {
    id ?: number,
    barrio ?: string
    calle ?: string, 
    numero ?: number,     
    manzana ?: string, 
    piso ?: number, 
    puerta ?: string,
    localidad : Localidad,
    status ?: boolean
}
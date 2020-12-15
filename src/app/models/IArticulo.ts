import { CategoriaArticulo } from './ICategoriaArticulo';
import { MedidaArticulo } from './IMedidaArticulo';

export interface Articulo {
    id: number
    denominacion: string,
    stockMin: number,
    stockMax: number,
    esInsumo: boolean,
    precioCompra: number,
    precioVenta?: number,
    descripcion: string,
    stockActual: number,
    imagen: string,
    categoriaArticulo: CategoriaArticulo,
    medidaArticulo: MedidaArticulo,
    status?: boolean
}
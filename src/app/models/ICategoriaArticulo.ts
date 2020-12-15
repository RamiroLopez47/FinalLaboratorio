export interface CategoriaArticulo {
    id: number,
    denominacion: string,
    descripcion: string,
    categoriaArticulo: CategoriaArticulo[],
    status ?: boolean
}
export interface CategoriaPlato {
    id: number,
    denominacion: string,
    descripcion: string,
    categoriaPlato : CategoriaPlato[];
    status ?: boolean
}
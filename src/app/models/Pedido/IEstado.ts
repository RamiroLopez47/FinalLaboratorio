export interface Estado {
    id?: number,
    denominacion: string
}

export enum ESTADO {
    CARRITO,
    ESPERA_APROBACION,
    RECHAZADO,
    COCINA,
    ESPERANDO_CLIENTE,
    ESPERANDO_ASIGNACION,
    ESPERANDO_REPARTIDOR,
    EN_CAMINO,
    ENTREGADO,
    NO_RETIRADO,
    COBRADO,
    PREPARANDO
}
export interface Rol {
    denominacion: string,
    id?: number,
}

export enum ROL {
    CLIENTE,
    CAJERO,
    COCINERO,
    GERENTE,
    DELIVERY
}
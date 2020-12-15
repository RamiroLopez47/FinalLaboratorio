import { Departamento } from './IDepartamento';
export interface Localidad {
    id: number,
    denominacion: string
    departamento: Departamento;
  }
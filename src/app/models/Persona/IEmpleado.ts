import { Usuario } from './IUsuario';
export interface Empleado extends Usuario{
    dni : number,
    fechaIngresoEmpleado : Date,
    estaActivo : boolean
}
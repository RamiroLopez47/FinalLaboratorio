import { Usuario } from './IUsuario';

export interface Cliente extends Usuario{
    // esta interface estara compuesta por direcciones
    platosDTO?:{
        denominacion:string;
        total:number;
    }; 
}
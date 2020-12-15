import { Injectable } from '@angular/core';
import { BaseServiceService } from '../generales/base.service';
import { Cliente } from '../../models/Persona/ICliente';
import { HttpClient } from '@angular/common/http';
import { auth } from 'firebase';
import { Observable } from 'rxjs';
import { RolService } from './rol.service';


@Injectable({
  providedIn: 'root'
})
export class ClienteService extends BaseServiceService<Cliente> {

  constructor(http: HttpClient, private conexion: HttpClient, private rolService: RolService) {
    super(http);
    this.miUrl = "http://localhost:9001/api/v1/cliente"
  }

  /**
   * Almacena en la base de datos local los datos de un nuevo cliente registrado por google
   * (Son nuevos clientes todos los nuevos registros realizados por la pantalla de register)
   * @param respuesta credenciales otorgadas por firebase
   */
  public postearUsuarioGoogle(respuesta: auth.UserCredential) {
    let nuevoCliente: Cliente = null;
    nuevoCliente = {
      apellido: respuesta.additionalUserInfo.profile['family_name'],
      nombre: respuesta.additionalUserInfo.profile['given_name'],
      email: respuesta.user.email,
      telefono: parseInt(respuesta.user.phoneNumber),
      rol: null
    }
    this.guardarNuevoCliente(nuevoCliente).subscribe(data => {
      if (data) {
        console.log("Almacenado en la base de datos local")
      }
    })
  }
  /**
   * Almacena en la base de datos local un nuevo cliente registrado por la modalidad de 
   * Formulario, los datos deben derivarse a este metodo para almacenarlo correctamente. 
   * @param cliente Parametros obtenidos por el formulario de Register
   */
  public guardarNuevoCliente(cliente: Cliente): Observable<Cliente> {
    return new Observable<Cliente>(sub => {
      this.rolService.getByTermino('cliente')
        .then(data => {
          cliente.rol = data;
          cliente.password = null;
          // Si hay algun error en el guardado descomentar la siguiente linea 
          // console.log("objeto a guardar",cliente)
          this.post(cliente).subscribe(data => {
            sub.next(data)
          })
        })
        .catch(err => console.error("Ha ocurrido un error buscando el rol ", err))
    })
  }  

  public getCantidadPedidosAgrupados(fechaInicio: string,fechaFin: string): Observable<Cliente[]> {
    return this.conexion.get<Cliente[]>(this.miUrl + `/pedidos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  } 

}

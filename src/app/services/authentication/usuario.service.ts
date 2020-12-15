import { Injectable } from '@angular/core';
import { BaseServiceService } from '../generales/base.service';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/Persona/IUsuario';
import { Observable } from 'rxjs';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends BaseServiceService<Usuario>{

  constructor(http: HttpClient, private conexion: HttpClient, private authService: AuthServiceService) {
    super(http);
    this.miUrl = "http://localhost:9001/api/v1/usuario";
  }

  /**
   * Obtiene toda la información desde la base de datos propia
   * sobre el usuario logueado actualmente
   * 
   */
  public getCurrentUserData(): Observable<Usuario> {
    return new Observable<Usuario>(sub => {
      this.authService.getCurrentUser().then(
        data => {
          if (data) {
            // consulta a la base de datos local sobre los datos segun el email
            // TODO: Cambiar identificacion por uuid o token
            this.conexion.get<Usuario>(this.miUrl + `/byEmail?email=${data.email}`).subscribe(
              infoUsuario => {

                if (infoUsuario) {
                  //seteo la imagen por la url correspondiente de su cuenta google
                  infoUsuario.imagen = data.photoURL;
                  sub.next(infoUsuario)
                }

              }
            )
          }
        }, err => console.log("Ha ocurrido un error en la busqueda local", err)
      )
        .catch(err => console.log("ha ocurrido un error en la busqueda de current user de firebase", err))
    });

  }
  /**
   * Devuelve un Observable de tipo String correspondiente al rol del usuario logueado
   */
  public loadCurrentRol(): Observable<string> {
    return new Observable<string>(subs => {
      this.getCurrentUserData().subscribe(data => {
        if (data) {
          subs.next(data.rol.denominacion.toLowerCase().trim());
        }
      });
    });
  }
  
  public clientesPeriodo(fechaInicio: string,fechaFin: string): Observable<Usuario[]> {
    return this.conexion.get<Usuario[]>(this.miUrl + `/clientesPeriodo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }    
}

import { Injectable } from '@angular/core';
import { BaseServiceService } from '../generales/base.service';
import { Rol, ROL } from '../../models/Persona/IRol';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RolService extends BaseServiceService<Rol> {

  constructor(http: HttpClient) {
    super(http);
    this.miUrl = "http://localhost:9001/api/v1/rol"
  }

  /**
   * Devuelve un objeto Rol para diversos usos, a partir de un termino buscado,
   * si el termino no es encontrado devolvera null
   * @param termino string : rol que se este buscando puede ser 'cliente' 'cajero' 'cocinero' 'delivery' 'gerente'
   */
  public getByTermino(termino: string): Promise<Rol> {
    let rol: Rol[];
    return new Promise((resolve, rejects) => {

      this.getAll(0, 100).subscribe(data => {
        rol = data.filter(rol => { return rol.denominacion.toLowerCase() == termino.toLowerCase() })
      }, err => rejects(null)
        , () => {
          resolve(rol[0])
        })

    })
  }
  /**
   * Llena la base de datos con 
   */
  public popularBdLocal(): void {
    for (let item in ROL) {
      if (isNaN(Number(item))) {
        this.post({ denominacion: item }).subscribe(data => {
          console.log("Se almaceno", data)
        })
      }
    }
  }

}

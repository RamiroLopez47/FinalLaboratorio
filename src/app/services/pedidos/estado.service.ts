import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseServiceService } from '../generales/base.service';
import { Estado, ESTADO } from 'src/app/models/Pedido/IEstado';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadoService extends BaseServiceService<Estado>{

  constructor(http: HttpClient) {
    super(http);
    this.miUrl = "http://localhost:9001/api/v1/estado"

  }

  /**
   * Llena la base de datos local con los estados que puede tener un pedido
   */

  public popularBd(): void {
    for (let item in ESTADO) {
      if (isNaN(Number(item))) {
        this.post({ denominacion: item }).subscribe(data => {
          console.log("Se almaceno", data)
        })
      }
    }
  }
  /**
   * Este metodo te devuelve el objeto estado segun el termino buscado
   * @param estado estado que se desea obtener
   */
  public getByTermino(estado: ESTADO): Observable<Estado> {
    return new Observable(ob => {
      this.getAll(0, 100).subscribe(data => {
        if (data) {
          ob.next(data.find(e => e.denominacion == ESTADO[estado]))
        }
      })
    });
  }

  
}

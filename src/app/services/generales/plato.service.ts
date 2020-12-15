import { Injectable } from '@angular/core';
import { BaseServiceService } from './base.service';
import { Plato } from "../../models/IPlato";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlatoService extends BaseServiceService<Plato> {

  constructor(http: HttpClient, public conexion: HttpClient) {
    super(http);
    this.miUrl = "http://localhost:9001/api/v1/plato"
  }

  public getPlatosByCategoria(termino: string, page: number, size: number): Observable<Plato[]> {
    return this.conexion.get<Plato[]>(this.miUrl + `/byCategoria?categoria=${termino}&page=${page}&size=${size}`);
  }                                      
  public findBetweenDates(fechaInicio: String, fechaFin: String): Observable<Plato[]> {
    return this.conexion.get<Plato[]>(this.miUrl + `/entre/cantidad?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }
}

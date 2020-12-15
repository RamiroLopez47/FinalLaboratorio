import { Injectable } from '@angular/core';
import { BaseServiceService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Articulo } from '../../models/IArticulo';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ArticuloService extends BaseServiceService<Articulo>{

  constructor(http: HttpClient, private conexion: HttpClient,) {
    super(http);
    this.miUrl = "http://localhost:9001/api/v1/articulo"
  }

  public stockBajo(): Observable<Articulo[]> {
    return this.conexion.get<Articulo[]>(this.miUrl + '/stockBajo');
  }

  public getArticuloReventa(): Observable<Articulo[]> {
    return this.conexion.get<Articulo[]>(this.miUrl + '/reventa');
  }

  public getArticuloInsumos(): Observable<Articulo[]> {
    return this.conexion.get<Articulo[]>(this.miUrl + '/insumos');
  }
}

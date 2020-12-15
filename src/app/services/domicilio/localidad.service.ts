import { Injectable } from '@angular/core';
import { BaseServiceService } from '../generales/base.service';

import { HttpClient } from '@angular/common/http';
import { Localidad } from '../../models/Domicilio/ILocalidad';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LocalidadService extends BaseServiceService<Localidad>{

  constructor(http: HttpClient, private conexion : HttpClient) {
    super(http);
    this.miUrl = "http://localhost:9001/api/v1/localidad"
  }

  public getLocalidadByDepartamentoId(id : number) : Observable<Localidad[]>{
    return this.conexion.get<Localidad[]>(this.miUrl+`/by?departamentoId=${id}&page=0&size=200`);
  }

}

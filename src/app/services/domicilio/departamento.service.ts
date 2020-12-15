import { Injectable } from '@angular/core';
import { BaseServiceService } from '../generales/base.service';
import { HttpClient } from '@angular/common/http';
import { Departamento } from '../../models/Domicilio/IDepartamento';


@Injectable({
  providedIn: 'root'
})
export class DepartamentoService extends BaseServiceService<Departamento>{

  constructor(http: HttpClient) {
    super(http);
    this.miUrl = "http://localhost:9001/api/v1/departamento"
  }
}

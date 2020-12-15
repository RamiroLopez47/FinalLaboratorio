import { Injectable } from '@angular/core';
import { BaseServiceService } from '../generales/base.service';
import { HttpClient } from '@angular/common/http';
import { Cajero } from 'src/app/models/Persona/ICajero';

@Injectable({
  providedIn: 'root'
})
export class CajeroService extends BaseServiceService<Cajero>{

  constructor(http: HttpClient) {
    super(http);
    this.miUrl = "http://localhost:9001/api/v1/cajero"
  }
}

import { Injectable } from '@angular/core';
import { BaseServiceService } from '../generales/base.service';
import { Tarjeta } from '../../models/Pedido/ITarjeta';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TarjetaService extends BaseServiceService<Tarjeta>{

  constructor(http: HttpClient) {
    super(http);
    this.miUrl = "http://localhost:9001/api/v1/tarjeta"
  }
}

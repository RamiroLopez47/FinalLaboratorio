import { Injectable } from '@angular/core';
import { BaseServiceService } from '../generales/base.service';
import { Efectivo } from '../../models/Pedido/IEfectivo';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EfectivoService extends BaseServiceService<Efectivo>{

  constructor(http: HttpClient) {
    super(http);
    this.miUrl = "http://localhost:9001/api/v1/efectivo"
  }
}

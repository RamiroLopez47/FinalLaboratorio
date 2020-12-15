import { Injectable } from '@angular/core';
import { BaseServiceService } from './base.service';
import { MedidaArticulo } from '../../models/IMedidaArticulo';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MedidaArticuloService extends BaseServiceService<MedidaArticulo>{

  constructor(http : HttpClient) {
    super(http);
    this.miUrl = "http://localhost:9001/api/v1/medidaArticulo"
   }
}

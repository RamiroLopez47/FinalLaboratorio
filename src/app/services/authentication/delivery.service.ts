import { Injectable } from '@angular/core';
import { BaseServiceService } from '../generales/base.service';
import { HttpClient } from '@angular/common/http';
import { Delivery } from 'src/app/models/Persona/IDelivery';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService extends BaseServiceService<Delivery>{

  constructor(http: HttpClient) {
    super(http);
    this.miUrl = "http://localhost:9001/api/v1/delivery"
  }
}

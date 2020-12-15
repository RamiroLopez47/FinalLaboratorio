import { Injectable } from '@angular/core';
import { BaseServiceService } from '../generales/base.service';
import { Domicilio } from '../../models/Domicilio/IDomicilio';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DomicilioService extends BaseServiceService<Domicilio>{

  constructor(http : HttpClient) {
    super(http);
    this.miUrl = "http://localhost:9001/api/v1/domicilio"
   }
}

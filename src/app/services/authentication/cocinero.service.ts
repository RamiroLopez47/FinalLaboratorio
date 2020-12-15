import { Injectable } from '@angular/core';
import { BaseServiceService } from '../generales/base.service';
import { HttpClient } from '@angular/common/http';
import { Cocinero } from 'src/app/models/Persona/ICocinero';

@Injectable({
  providedIn: 'root'
})
export class CocineroService extends BaseServiceService<Cocinero>{

  constructor(http: HttpClient) {
    super(http);
    this.miUrl = "http://localhost:9001/api/v1/cocinero"
  }
}

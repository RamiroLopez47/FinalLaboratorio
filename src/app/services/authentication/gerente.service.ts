import { Injectable } from '@angular/core';
import { BaseServiceService } from '../generales/base.service';
import { HttpClient } from '@angular/common/http';
import { Gerente } from 'src/app/models/Persona/IGerente';

@Injectable({
  providedIn: 'root'
})
export class GerenteService extends BaseServiceService<Gerente>{

  constructor(http: HttpClient) {
    super(http);
    this.miUrl = "http://localhost:9001/api/v1/gerente"
  }
}

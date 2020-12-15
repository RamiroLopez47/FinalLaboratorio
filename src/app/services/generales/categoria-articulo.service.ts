import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseServiceService } from './base.service';
import { CategoriaArticulo } from 'src/app/models/ICategoriaArticulo';


@Injectable({
  providedIn: 'root'
})
export class CategoriaArticuloService extends BaseServiceService<CategoriaArticulo>{

  constructor(http: HttpClient) { 
    super(http);
    this.miUrl = "http://localhost:9001/api/v1/categoriaArticulo"
  }
}

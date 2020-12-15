import { Injectable } from '@angular/core';
import { BaseServiceService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { CategoriaPlato } from '../../models/ICategoriaPlato';

@Injectable({
  providedIn: 'root'
})
export class CategoriaPlatoService extends BaseServiceService<CategoriaPlato>{

  constructor(http: HttpClient) {
    super(http);
    this.miUrl = "http://localhost:9001/api/v1/categoriaPlato"
    // this.miUrl = "/api/v1/categoriaPlato"
  }
}
